import { useState } from "react";
import {
  Grid,
  Snackbar,
  Alert,
  TextField,
  MenuItem,
  Stack,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import AppointmentForm from "../components/AppointmentForm";
import AppointmentTable from "../components/AppointmentTable";
import { useAppointments } from "../hooks/useAppointments";
import CalendarView from "../components/CalendarView";

export default function Home() {
  const [limit, setLimit] = useState(10);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [view, setView] = useState<"table" | "calendar">("calendar");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as any,
  });

  const {
    data = [],
    isLoading,
    refetch,
    error,
  }: any = useAppointments({ limit, from, to });

  return (
    <>
      <Grid container spacing={4} sx={{ margin: "40px" }}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <AppointmentForm onSuccess={refetch} setToast={setToast} />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ borderRadius: 3 }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              View Appointments
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ p: 2 }}
            >
              <TextField
                type="datetime-local"
                onChange={(e) => setFrom(e.target.value)}
                fullWidth
              />
              <TextField
                type="datetime-local"
                onChange={(e) => setTo(e.target.value)}
                fullWidth
              />

              <TextField
                select
                label="Limit"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                sx={{ minWidth: 120 }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 1, p: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                onClick={() => setView("calendar")}
              >
                Calendar View
              </Button>
              <Button
                type="submit"
                variant="contained"
                onClick={() => setView("table")}
              >
                Table View
              </Button>
            </Stack>

            {view === "calendar" ? (
              <CalendarView appointments={data} />
            ) : (
              <AppointmentTable
                appointments={data}
                loading={isLoading}
                refresh={refetch}
                setToast={setToast}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
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
