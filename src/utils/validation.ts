import { z } from "zod";

export const appointmentSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
  clinicianId: z.string(),
  patientId: z.string()
});