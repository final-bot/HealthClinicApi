import { prisma } from "../../lib/prisma";

export async function listAllAppointments(
  from?: Date,
  to?: Date,
  limit?: number
) {
  return prisma.appointment.findMany({
    where: {
      deletedAt: null,
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