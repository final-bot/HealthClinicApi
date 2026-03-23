import { Router } from "express";
import { listAllAppointments } from "../../services/appointment/getAppointments";
import { requireRole } from "../../middleware/role";

const router = Router();

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

  const appointments = await listAllAppointments(fromDate, toDate, limitNumber);

  res.status(200).json(appointments);
});

export default router;