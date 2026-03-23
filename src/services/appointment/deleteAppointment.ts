import { prisma } from "../../lib/prisma";

const CANCELLATION_WINDOW_MINUTES = 60;

interface DeleteAppointmentResult {
  type:
    | "success"
    | "not_found"
    | "already_started"
    | "too_late"
    | "missing_metadata";
}

export async function deleteAppointment(
  id: string,
  deletedBy?: string,
  deletionReason?: string
): Promise<DeleteAppointmentResult> {
  // Ensure metadata is provided
  if (!deletedBy || !deletionReason) {
    return { type: "missing_metadata" };
  }

  const existing = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!existing || existing.deletedAt) {
    return { type: "not_found" };
  }

  const now = new Date();

  if (existing.start <= now) {
    return { type: "already_started" };
  }

  const diffMs = existing.start.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  if (diffMinutes < CANCELLATION_WINDOW_MINUTES) {
    return { type: "too_late" };
  }

  await prisma.appointment.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      deletedBy,
      deletionReason,
    },
  });

  return { type: "success" };
}