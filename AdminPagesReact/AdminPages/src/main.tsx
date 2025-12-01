// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";


const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* MUI default sıfırlama ve fontu uygular */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
