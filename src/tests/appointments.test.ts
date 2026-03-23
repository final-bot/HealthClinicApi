import request from "supertest";
import app from "../app";

import { prisma } from "../lib/prisma";

beforeEach(async () => {
  // Clean up database before each test
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.clinician.deleteMany();

  // Insert data in database for testing purposes
  await prisma.clinician.createMany({ data: [{ id: "c1" }, { id: "c2" }, { id: "c3" }] });
  await prisma.patient.createMany({ data: [{ id: "p1" }, { id: "p2" }, { id: "p3" }] });

  await prisma.appointment.createMany({
    data: [
      {
        clinicianId: "c1",
        patientId: "p1",
        start: new Date("2030-01-01T10:00:00Z"),
        end: new Date("2030-01-01T11:00:00Z"),
      },
      {
        clinicianId: "c2",
        patientId: "p2",
        start: new Date("2030-01-02T10:00:00Z"),
        end: new Date("2030-01-02T11:00:00Z"),
      },
      {
        clinicianId: "c3",
        patientId: "p3",
        start: new Date("2030-01-03T10:00:00Z"),
        end: new Date("2030-01-03T11:00:00Z"),
      },
    ],
  });
});

// Disconnect Prisma after all tests are done
afterAll(async () => {
  await prisma.$disconnect();
});

describe("Appointments API", () => {
  it("creates appointment", async () => {
    const res = await request(app).post("/appointments").send({
      start: "2030-01-04T10:00:00.000Z",
      end: "2030-01-04T11:00:00.000Z",
      clinicianId: "c2",
      patientId: "p2"
    });

    expect(res.status).toBe(201);
  });

  it("filters appointments using both 'from' and 'to'", async () => {
    const res = await request(app).get(
      "/clinicians/c1/appointments?from=2030-01-01T00:00:00Z&to=2030-01-02T00:00:00Z"
    );

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(new Date(res.body[0].start).toISOString()).toBe(
      "2030-01-01T10:00:00.000Z"
    );
  });

  it("rejects overlapping appointment", async () => {
    await request(app).post("/appointments").send({
      start: "2030-01-01T10:00:00.000Z",
      end: "2030-01-01T11:00:00.000Z",
      clinicianId: "c2",
      patientId: "p1"
    });

    const res = await request(app).post("/appointments").send({
      start: "2030-01-01T10:30:00.000Z",
      end: "2030-01-01T11:30:00.000Z",
      clinicianId: "c2",
      patientId: "p2"
    });

    expect(res.status).toBe(409);
  });

  it("lists clinician appointments", async () => {
    const res = await request(app).get("/clinicians/c1/appointments");

    expect(res.status).toBe(200);
  });

  it("should delete a future appointment", async () => {
  const appt = await prisma.appointment.create({
    data: {
      clinicianId: "c1",
      patientId: "p1",
      start: new Date(Date.now() + 2 * 60 * 60 * 1000),
      end: new Date(Date.now() + 3 * 60 * 60 * 1000),
    },
  });

  const res = await request(app)
    .delete(`/appointments/${appt.id}`)
    .set("X-Role", "admin");

  expect(res.status).toBe(204);
});

it("should reject deleting past appointment", async () => {
  const appt = await prisma.appointment.create({
    data: {
      clinicianId: "c1",
      patientId: "p1",
      start: new Date(Date.now() - 60 * 60 * 1000),
      end: new Date(Date.now() - 30 * 60 * 1000),
    },
  });

  const res = await request(app)
    .delete(`/appointments/${appt.id}`)
    .set("X-Role", "admin");

  expect(res.status).toBe(409);
});

it("should reject deleting within cancellation window", async () => {
  const appt = await prisma.appointment.create({
    data: {
      clinicianId: "c1",
      patientId: "p1",
      start: new Date(Date.now() + 30 * 60 * 1000), // 30 mins away
      end: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const res = await request(app)
    .delete(`/appointments/${appt.id}`)
    .set("X-Role", "admin");

  expect(res.status).toBe(409);
});

it("should forbid non-admin delete", async () => {
  const appt = await prisma.appointment.create({
    data: {
      clinicianId: "c1",
      patientId: "p1",
      start: new Date(Date.now() + 2 * 60 * 60 * 1000),
      end: new Date(Date.now() + 3 * 60 * 60 * 1000),
    },
  });

  const res = await request(app)
    .delete(`/appointments/${appt.id}`)
    .set("X-Role", "patient");

  expect(res.status).toBe(403);
});
});