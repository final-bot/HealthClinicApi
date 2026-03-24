import { Container, Typography, TextField, Button, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSending(true);

    // fake API delay
    setTimeout(() => {
      setSending(false);
      setSent(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <Container maxWidth="sm" className="py-10" sx={{ marginTop: "40px" }}>
      <Paper className="p-6" sx={{ padding: "24px" }}>
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            fullWidth
            label="Phone (optional)"
            margin="normal"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            margin="normal"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: sent ? 1.1 : 1 }}
          >
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={sending || sent}
            >
              {sending ? "Sending..." : sent ? "Sent ✓" : "Send Message"}
            </Button>
          </motion.div>
        </form>
      </Paper>
    </Container>
  );
}
