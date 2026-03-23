// import { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Container,
//   TextField,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import Grid from "@mui/material/Grid";

// const API_URL = "http://localhost:3000";

// function Navbar() {
//   return (
//     <AppBar position="static">
//       <Toolbar className="flex justify-between">
//         <Typography variant="h6">Clinic System</Typography>
//         <div>
//           <Button color="inherit" component={Link} to="/">
//             Home
//           </Button>
//           <Button color="inherit" component={Link} to="/contact">
//             Contact
//           </Button>
//         </div>
//       </Toolbar>
//     </AppBar>
//   );
// }

// function Home() {
//   const [appointments, setAppointments] = useState([]);
//   const [form, setForm] = useState({
//     clinicianId: "",
//     patientId: "",
//     start: "",
//     end: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const fetchAppointments = async () => {
//     setLoading(true);
//     const res = await fetch(`${API_URL}/appointments`, {
//       headers: { "X-Role": "admin" },
//     });
//     const data = await res.json();
//     setAppointments(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     await fetch(`${API_URL}/appointments`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     fetchAppointments();
//   };

//   return (
//     <Container className="py-10">
//       <Typography variant="h4" className="mb-6">
//         Create Appointment
//       </Typography>

//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2} className="mb-8">
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Clinician ID"
//               onChange={(e) =>
//                 setForm({ ...form, clinicianId: e.target.value })
//               }
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Patient ID"
//               onChange={(e) => setForm({ ...form, patientId: e.target.value })}
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               type="datetime-local"
//               onChange={(e) => setForm({ ...form, start: e.target.value })}
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               type="datetime-local"
//               onChange={(e) => setForm({ ...form, end: e.target.value })}
//             />
//           </Grid>
//           <Grid size={{ xs: 12 }}>
//             <Button variant="contained" fullWidth type="submit">
//               Create Appointment
//             </Button>
//           </Grid>
//         </Grid>
//       </form>

//       <Typography variant="h4" className="mb-4">
//         Appointments
//       </Typography>

//       {appointments.length === 0 && (
//         <Typography>No appointments yet</Typography>
//       )}

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Clinician</TableCell>
//                 <TableCell>Patient</TableCell>
//                 <TableCell>Start</TableCell>
//                 <TableCell>End</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {appointments.map((appt: any) => (
//                 <TableRow key={appt.id}>
//                   <TableCell>{appt.clinicianId}</TableCell>
//                   <TableCell>{appt.patientId}</TableCell>
//                   <TableCell>{new Date(appt.start).toLocaleString()}</TableCell>
//                   <TableCell>{new Date(appt.end).toLocaleString()}</TableCell>
//                   <TableCell>
//                     <Button
//                       color="error"
//                       onClick={async () => {
//                         await fetch(`${API_URL}/appointments/${appt.id}`, {
//                           method: "DELETE",
//                           headers: {
//                             "Content-Type": "application/json",
//                             "X-Role": "admin",
//                           },
//                           body: JSON.stringify({
//                             deletedBy: "admin-ui",
//                             deletionReason: "Deleted from table",
//                           }),
//                         });
//                         fetchAppointments();
//                       }}
//                     >
//                       Delete
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Container>
//   );
// }

// function Contact() {
//   return (
//     <Container className="py-10">
//       <Typography variant="h4">Contact</Typography>
//       <Typography className="mt-4">
//         For enquiries, please contact support@clinicapp.com
//       </Typography>
//     </Container>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/contact" element={<Contact />} />
//       </Routes>
//     </Router>
//   );
// }

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}