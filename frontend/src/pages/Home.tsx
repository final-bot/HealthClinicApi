import { useState } from "react";
import {
  Snackbar,
  Alert,
  TextField,
  MenuItem,
  Stack,
  Paper,
  Typography,
  Fab,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import AppointmentTable from "../components/AppointmentTable";
import CalendarView from "../components/CalendarView";
import CreateAppointmentDialog from "../components/CreateAppointmentDialog";
import { useAppointments } from "../hooks/useAppointments";

export default function Home() {
  const [limit, setLimit] = useState(10);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [view, setView] = useState<"table" | "calendar">("calendar");
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<any>(null);

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
      <Box sx={{ position: "relative", px: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Appointments
        </Typography>

        <Paper sx={{ borderRadius: 3, mb: 3, p: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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

          <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, val) => val && setView(val)}
            >
              <ToggleButton value="calendar">Calendar</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Paper>

        <Paper sx={{ borderRadius: 3, p: 2 }}>
          {view === "calendar" ? (
            <CalendarView
              appointments={data}
              onSelectSlot={(slot: any) => {
                setPrefill({
                  start: slot.start,
                  end: slot.end,
                });
                setOpen(true);
              }}
            />
          ) : (
            <AppointmentTable
              appointments={data}
              loading={isLoading}
              refresh={refetch}
              setToast={setToast}
            />
          )}
        </Paper>

        <Tooltip title="Create Appointment">
          <Fab
            color="primary"
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
            }}
            onClick={() => setOpen(true)}
          >
            <AddIcon />
          </Fab>
        </Tooltip>

        <CreateAppointmentDialog
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            refetch();
            setToast({
              open: true,
              message: "Appointment created",
              severity: "success",
            });
          }}
          prefill={prefill}
        />
      </Box>

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
