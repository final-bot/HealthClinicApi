import { useState } from "react";
import { TextField, Button, Paper, Typography, Stack } from "@mui/material";

const API_URL = "http://localhost:3000";

export default function AppointmentForm({ onSuccess, setToast }: any) {
  const [form, setForm] = useState({ clinicianId: "", patientId: "", start: "", end: "" });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setToast({ open: true, message: "Appointment created", severity: "success" });
      onSuccess();
    } catch {
      setToast({ open: true, message: "Failed to create appointment", severity: "error" });
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>Create Appointment</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Clinician ID" fullWidth onChange={(e) => setForm({ ...form, clinicianId: e.target.value })} />
          <TextField label="Patient ID" fullWidth onChange={(e) => setForm({ ...form, patientId: e.target.value })} />
          <TextField type="datetime-local" fullWidth onChange={(e) => setForm({ ...form, start: e.target.value })} />
          <TextField type="datetime-local" fullWidth onChange={(e) => setForm({ ...form, end: e.target.value })} />
          <Button type="submit" variant="contained">Create</Button>
        </Stack>
      </form>
    </Paper>
  );
}