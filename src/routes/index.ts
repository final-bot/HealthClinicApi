import { Router } from "express";

import createAppointment from "./appointments/createAppointment";
import deleteAppointment from "./appointments/deleteAppointment";
import listAllAppointments from "./appointments/listAllAppointments";
import listClinicianAppointments from "../routes/clinicians/listClinicianAppointments";

const router = Router();

router.use("/", createAppointment);
router.use("/", deleteAppointment);
router.use("/", listAllAppointments);
router.use("/clinicians", listClinicianAppointments);

export default router;