import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clinic Appointment API",
      version: "1.0.0",
      description: "Simple API for managing clinic appointments",
    },
    components: {
      schemas: {
        Appointment: {
          type: "object",
          properties: {
            id: { type: "string" },
            start: { type: "string", format: "date-time" },
            end: { type: "string", format: "date-time" },
            clinicianId: { type: "string" },
            patientId: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
});