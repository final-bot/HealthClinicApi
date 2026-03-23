import { Router } from "express";
import { requireRole } from "../../middleware/role";
import { deleteAppointment } from "../../services/appointment/deleteAppointment";

const router = Router();

router.delete("/:id", requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  const { deletedBy, deletionReason } = req.body;

  const result = await deleteAppointment(id, deletedBy, deletionReason);

  switch (result.type) {
    case "missing_metadata":
      return res.status(400).json({
        message: "deletedBy and deletionReason are required",
      });

    case "not_found":
      return res.status(404).json({ message: "Appointment not found" });

    case "already_started":
      return res.status(409).json({
        message: "Cannot delete past or ongoing appointments",
      });

    case "too_late":
      return res.status(409).json({
        message: `Cannot delete within ${60} minutes of appointment`,
      });

    case "success":
      return res.status(204).send();
  }
});

export default router;