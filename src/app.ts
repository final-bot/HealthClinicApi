import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import appointmentRoutes from "./routes/appointments";
import clinicianRoutes from "./routes/clinicians";

export const app = express();

app.use(express.json());

// Routes
app.use("/appointments", appointmentRoutes);
app.use("/clinicians", clinicianRoutes);

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;