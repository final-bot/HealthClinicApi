import { useState } from "react";
import { TextField, Button, Paper, Typography, Stack } from "@mui/material";

const API_URL = "http://localhost:3000";

export default function AppointmentForm({ onSuccess, setToast }: any) {
  const initialForm = {
    clinicianId: "",
    patientId: "",
    start: "",
    end: "",
  };

  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      ...form,
      start: new Date(form.start).toISOString(),
      end: new Date(form.end).toISOString(),
    };

    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      setToast({
        open: true,
        message: "Appointment created",
        severity: "success",
      });

      onSuccess();
      setForm(initialForm);
    } catch (err: any) {
      setToast({
        open: true,
        message: err.message || "Failed to create appointment",
        severity: "error",
      });
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create Appointment
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Clinician ID"
            fullWidth
            onChange={(e) => setForm({ ...form, clinicianId: e.target.value })}
          />
          <TextField
            label="Patient ID"
            fullWidth
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          />
          <TextField
            type="datetime-local"
            fullWidth
            onChange={(e) => setForm({ ...form, start: e.target.value })}
          />
          <TextField
            type="datetime-local"
            fullWidth
            onChange={(e) => setForm({ ...form, end: e.target.value })}
          />
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
