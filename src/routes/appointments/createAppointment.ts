import { Router } from "express";
import { createAppointment } from "../../services/appointment/createAppointment";
import { appointmentSchema } from "../../utils/validation";

const router = Router();

/**
 * @openapi
 * /appointments:
 *   post:
 *     summary: Create an appointment
 *     tags:
 *       - Appointments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - start
 *               - end
 *               - clinicianId
 *               - patientId
 *             properties:
 *               start:
 *                 type: string
 *                 format: date-time
 *               end:
 *                 type: string
 *                 format: date-time
 *               clinicianId:
 *                 type: string
 *               patientId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Overlapping appointment
 */
router.post("/", async (req, res) => {
  try {
    const parsed = appointmentSchema.parse(req.body);

    const appointment = await createAppointment({
      ...parsed,
      start: new Date(parsed.start),
      end: new Date(parsed.end),
    });

    res.status(201).json(appointment);
  } catch (err: any) {
    res
      .status(err.status || 400)
      .json({
        message: err.message || "Invalid request. Please check your input.",
      });
  }
});

export default router;