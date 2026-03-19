import { Router } from "express";
import { appointmentSchema } from "../utils/validation";
import {
  createAppointment,
  getAllAppointments,
} from "../services/appointmentService";
import { requireRole } from "../middleware/role";

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
      .json({ message: err.message || "Invalid request. Please check your input." });
  }
});

// Admin endpoint
function isValidDate(date: Date) {
  return !isNaN(date.getTime());
}

/**
 * @openapi
 * /appointments:
 *   get:
 *     summary: Get all upcoming appointments (admin only)
 *     tags:
 *       - Appointments
 *     parameters:
 *       - in: header
 *         name: X-Role
 *         schema:
 *           type: string
 *           example: admin
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of appointments
 *       403:
 *         description: Forbidden
 */
router.get("/", requireRole("admin"), async (req, res) => {
  const { from, to, limit } = req.query;

  const fromDate = from ? new Date(from as string) : new Date(); // default = now
  const toDate = to ? new Date(to as string) : undefined;
  const limitNumber = limit ? Number(limit) : undefined;

  // Validate dates
  if (from && !isValidDate(fromDate)) {
    return res.status(400).json({ message: "Invalid 'from' date" });
  }

  if (to && toDate && !isValidDate(toDate)) {
    return res.status(400).json({ message: "Invalid 'to' date" });
  }

  // Validate limit
  if (limit && (isNaN(limitNumber!) || limitNumber! <= 0)) {
    return res.status(400).json({ message: "Invalid 'limit' value" });
  }

  const appointments = await getAllAppointments(
    fromDate,
    toDate,
    limitNumber
  );

  res.status(200).json(appointments);
});

export default router;

