import { createTheme } from "@mui/material/styles";

const baseTypography = {
  fontFamily: '"Fjalla One", sans-serif', // default for app
  h1: { fontFamily: '"Fjalla One", sans-serif' },
  h2: { fontFamily: '"Fjalla One", sans-serif' },
  h3: { fontFamily: '"Fjalla One", sans-serif' },
  h4: { fontFamily: '"Fjalla One", sans-serif' },
  h5: { fontFamily: '"Fjalla One", sans-serif' },
  h6: { fontFamily: '"Bricolage Grotesque", sans-serif' },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0B3C5D",
    },
    background: {
      default: "#f5f7fa",
    },
  },
  typography: baseTypography,
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1E88E5",
    },
    background: {
      default: "#0A1929",
      paper: "#132F4C",
    },
  },
  typography: baseTypography,
});