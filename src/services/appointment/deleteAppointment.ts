import { prisma } from "../../lib/prisma";
import { CANCELLATION_WINDOW_MINUTES } from "../../config/constants";

export async function deleteAppointment(id: string, data: {
  start: Date;
  end: Date;
  clinicianId: string;
  patientId: string;
  deletedBy?: string;
  deletionReason: string;
}) {
  const existing = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!existing || existing.deletedAt) {
    return { type: "not_found" as const };
  }

  const now = new Date();

  // Appointment already started or past
  if (existing.start <= now) {
    return { type: "already_started" as const };
  }

  // Appointment within cancellation window
  const diffMs = existing.start.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  if (diffMinutes < CANCELLATION_WINDOW_MINUTES) {
    return { type: "too_late" as const };
  }

  await prisma.appointment.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      deletedBy: data.deletedBy, // TODO: pass user ID here
      deletionReason: data.deletionReason
    },
  });

  return { type: "success" as const };
}