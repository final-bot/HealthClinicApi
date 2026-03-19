import { prisma } from "../lib/prisma";

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

    // Overlap check for transaction
    const overlap = await tx.appointment.findFirst({
      where: {
        clinicianId: data.clinicianId,
        start: { lt: data.end },
        end: { gt: data.start }
      }
    });

    if (overlap) {
      throw { status: 409, message: "Appointment overlaps existing booking. Please check and try again." };
    }

    return tx.appointment.create({
      data
    });
  });
}

export async function getClinicianAppointments(
  clinicianId: string,
  from?: Date,
  to?: Date
) {
  const now = new Date();

  return prisma.appointment.findMany({
    where: {
      clinicianId,
      start: {
        gte: from ?? now,
        ...(to && { lte: to })
      }
    }
  });
}

export async function getAllAppointments(
  from?: Date,
  to?: Date,
  limit?: number
) {
  return prisma.appointment.findMany({
    where: {
      start: {
        gte: from,
        ...(to && { lte: to })
      },
    },
    orderBy: {
      start: "asc",
    },
    take: limit,
  });
}