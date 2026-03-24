import { Dialog, DialogContent } from "@mui/material";
import { motion } from "framer-motion";
import AppointmentForm from "./AppointmentForm";

export default function CreateAppointmentDialog({
  open,
  onClose,
  onSuccess,
  prefill,
}: any) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
      >
        <DialogContent>
          <AppointmentForm
            key={prefill ? prefill.start : "empty"}
            onSuccess={onSuccess}
            prefill={prefill}
          />
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
