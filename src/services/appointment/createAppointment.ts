import { prisma } from "../../lib/prisma";
import { checkOverlap } from "../utils/overlapCheck";

export async function createAppointment(data: {
  start: Date;
  end: Date;
  clinicianId: string;
  patientId: string;
}) {
  if (data.start >= data.end) {
    throw { status: 400, message: "Invalid time range" };
  }

  if (data.start < new Date()) {
    throw { status: 400, message: "Cannot book appointments in the past" };
  }

  return await prisma.$transaction(async (tx) => {
    // Ensure clinician + patient exist
    await tx.clinician.upsert({
      where: { id: data.clinicianId },
      update: {},
      create: { id: data.clinicianId }
    });

    await tx.patient.upsert({
      where: { id: data.patientId },
      update: {},
      create: { id: data.patientId }
    });

    const overlap = await checkOverlap(tx, data);

    if (overlap) {
      throw { status: 409, message: "Appointment overlaps existing booking. Please check and try again." };
    }

    return tx.appointment.create({
      data
    });
  });
}