import { Container, Typography } from "@mui/material";

export default function Contact() {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4">Contact</Typography>
      <Typography sx={{ mt: 2 }}>support@clinicapp.com</Typography>
    </Container>
  );
}