import { useState } from "react";
import { Grid, Snackbar, Alert, TextField, MenuItem, Stack } from "@mui/material";
import AppointmentForm from "../components/AppointmentForm";
import AppointmentTable from "../components/AppointmentTable";
import { useAppointments } from "../hooks/useAppointments";

export default function Home() {
  const [limit, setLimit] = useState(10);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [toast, setToast] = useState({ open: false, message: "", severity: "success" as any });

  const { data = [], isLoading, refetch, error }: any = useAppointments({ limit, from, to });

  return (
    <>
      <Grid container spacing={4} sx={{margin: "40px"}}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <AppointmentForm onSuccess={refetch} setToast={setToast} />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
            <TextField type="datetime-local" onChange={(e) => setFrom(e.target.value)} fullWidth />
            <TextField type="datetime-local" onChange={(e) => setTo(e.target.value)} fullWidth />

            <TextField select label="Limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))} sx={{ minWidth: 120 }}>
              {[5, 10, 20, 50].map((n) => (
                <MenuItem key={n} value={n}>{n}</MenuItem>
              ))}
            </TextField>
          </Stack>

          <AppointmentTable
            appointments={data}
            loading={isLoading}
            refresh={refetch}
            setToast={setToast}
          />
        </Grid>
      </Grid>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>

      {error && (
        <Snackbar open>
          <Alert severity="error">{error.message}</Alert>
        </Snackbar>
      )}
    </>
  );
}