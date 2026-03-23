import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from "cors";

import appointmentRoutes from "./routes";
import clinicianRoutes from "./routes/clinicians/listClinicianAppointments";

export const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/appointments", appointmentRoutes);
app.use("/clinicians", clinicianRoutes);

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;