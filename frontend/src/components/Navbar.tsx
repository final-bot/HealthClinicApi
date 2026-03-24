import { AppBar, Toolbar, Button, IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar({ darkMode, toggleDarkMode }: any) {
  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>

          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
