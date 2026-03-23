import { AppBar, Toolbar, Typography, Box, Button, MenuItem, Select } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function DashboardLayout({ children }: any) {
  const [role, setRole] = useState("admin");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      <AppBar position="static" sx={{ bgcolor: "#1e293b" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Clinic Dashboard</Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/contact">Contact</Button>

            <Select
              size="small"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ bgcolor: "white", borderRadius: 1 }}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="clinician">Clinician</MenuItem>
              <MenuItem value="patient">Patient</MenuItem>
            </Select>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: "1400px", mx: "auto", px: 4, py: 6 }}>
        {children}
      </Box>
    </Box>
  );
}