import { useEffect, useState } from "react";
import { TextField, Button, Typography, Stack } from "@mui/material";

const API_URL = "http://localhost:3000";

export default function AppointmentForm({ onSuccess, setToast, prefill }: any) {
  const initialForm = {
    clinicianId: "",
    patientId: "",
    start: "",
    end: "",
  };

  const [form, setForm] = useState(initialForm);

  const formatLocalDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset)
      .toISOString()
      .slice(0, 16);

    return localISOTime;
  };

  useEffect(() => {
    if (prefill) {
      setForm((prev: any) => ({
        ...prev,
        start: prefill.start ? formatLocalDateTime(prefill.start) : "",
        end: prefill.end ? formatLocalDateTime(prefill.end) : "",
      }));
    }
  }, [prefill]);

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
    <>
      <Typography variant="h6" gutterBottom>
        Create Appointment
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Clinician ID"
            fullWidth
            value={form.clinicianId}
            onChange={(e) => setForm({ ...form, clinicianId: e.target.value })}
          />
          <TextField
            label="Patient ID"
            fullWidth
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          />
          <TextField
            type="datetime-local"
            fullWidth
            value={form.start}
            onChange={(e) => setForm({ ...form, start: e.target.value })}
          />
          <TextField
            type="datetime-local"
            fullWidth
            value={form.end}
            onChange={(e) => setForm({ ...form, end: e.target.value })}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={
              !form.start || !form.end || !form.patientId || !form.clinicianId
            }
          >
            Create
          </Button>
        </Stack>
      </form>
    </>
  );
}
