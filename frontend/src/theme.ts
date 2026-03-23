import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: "AlteHaasGroteskBold, sans-serif", // default body
    h1: { fontFamily: "Fjalla One, serif" },
    h2: { fontFamily: "Playfair Display, serif" },
    h3: { fontFamily: "Playfair Display, serif" },
    h6: { fontFamily: "Fjalla One, sans-serif" },
  },
});