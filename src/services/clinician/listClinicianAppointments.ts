import { prisma } from "../../lib/prisma";

export async function listClinicianAppointments(
  clinicianId: string,
  from?: Date,
  to?: Date
) {
  const now = new Date();

  return prisma.appointment.findMany({
    where: {
      deletedAt: null,
      clinicianId,
      start: {
        gte: from ?? now,
        ...(to && { lte: to })
      }
    }
  });
}