import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Chip, Skeleton
} from "@mui/material";

const API_URL = "http://localhost:3000";

function getStatus(start: string) {
  const now = new Date();
  const date = new Date(start);
  if (date < now) return "Past";
  return "Upcoming";
}

export default function AppointmentTable({ appointments, loading, refresh, setToast }: any) {
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-role": "admin",
        },
        body: JSON.stringify({ deletedBy: "admin-ui", deletionReason: "UI delete" }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.message || "Delete failed");

      setToast({ open: true, message: "Deleted successfully", severity: "success" });
      refresh();
    } catch (err: any) {
      setToast({ open: true, message: err.message, severity: "error" });
    }
  };

  if (loading)
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height={50} sx={{ mb: 1 }} />
        ))}
      </>
    );

  if (appointments.length === 0) return <Typography>No appointments</Typography>;

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Clinician</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appt: any) => (
            <TableRow key={appt.id}>
              <TableCell>{appt.clinicianId}</TableCell>
              <TableCell>{appt.patientId}</TableCell>
              <TableCell>{new Date(appt.start).toLocaleString()}</TableCell>
              <TableCell>
                <Chip
                  label={getStatus(appt.start)}
                  color={getStatus(appt.start) === "Upcoming" ? "success" : "default"}
                />
              </TableCell>
              <TableCell>
                <Button type="submit" variant="contained" color="error" onClick={() => handleDelete(appt.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
