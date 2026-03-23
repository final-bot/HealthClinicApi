import { Router } from "express";
import { deleteAppointment } from "../../services/appointment/deleteAppointment";
import { requireRole } from "../../middleware/role";

const router = Router();

router.delete("/:id", requireRole("admin"), async (req, res) => {
  const result = await deleteAppointment(req.params.id, {
    start: new Date(req.body.start),
    end: new Date(req.body.end),
    clinicianId: req.body.clinicianId,
    patientId: req.body.patientId,
    deletionReason: req.body.deletionReason,
    deletedBy: req.body.deletedBy, // TODO: get user ID from auth context instead of request body
  });

  switch (result.type) {
    case "not_found":
      return res.status(404).json({ message: "Appointment not found" });

    case "already_started":
      return res.status(409).json({
        message: "Cannot delete past or ongoing appointments",
      });

    case "too_late":
      return res.status(409).json({
        error: {
          code: "CANCELLATION_WINDOW_EXCEEDED",
          message: "Cannot cancel within 60 minutes",
        },
      });

    case "success":
      return res.status(204).send();
  }
});

export default router;