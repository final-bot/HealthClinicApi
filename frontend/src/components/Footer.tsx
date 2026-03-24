import { Box, Typography, Stack, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        mt: "auto",
        py: 2,
        px: 4,
        borderTop: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)"
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} ClinicOS. All rights reserved.
        </Typography>

        <Stack direction="row" spacing={2}>
          <Link href="#" underline="hover" color="inherit">
            Privacy
          </Link>
          <Link href="#" underline="hover" color="inherit">
            Terms
          </Link>
          <Link href="/contact" underline="hover" color="inherit">
            Contact
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}