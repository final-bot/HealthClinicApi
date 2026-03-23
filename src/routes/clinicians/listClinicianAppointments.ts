import { Router } from "express";
import { listClinicianAppointments } from "../../services/clinician/listClinicianAppointments";
const router = Router();

/**
 * @openapi
 * /clinicians/{id}/appointments:
 *   get:
 *     summary: Get clinician appointments
 *     tags:
 *       - Clinicians
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: List of clinician appointments
 */
router.get("/:id/appointments", async (req, res) => {
  const { id } = req.params;
  const { from, to } = req.query;

  const appointments = await listClinicianAppointments(
    id,
    from ? new Date(from as string) : undefined,
    to ? new Date(to as string) : undefined
  );

  res.json(appointments);
});

export default router;