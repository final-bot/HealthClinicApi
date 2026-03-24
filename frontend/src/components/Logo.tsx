import EventIcon from "@mui/icons-material/Event";
import { Typography, Box } from "@mui/material";

export default function Logo() {
  return (
    <Box className="flex items-center gap-2">
      <EventIcon sx={{ fontSize: 28 }} />
      <Typography variant="h6">ClinicOS</Typography>
    </Box>
  );
}