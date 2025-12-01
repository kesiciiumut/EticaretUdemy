import "../App.css";
import Footer from "./Footer";
import Header from "./Header";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { Outlet } from "react-router";
import { CartProvider } from "./CartContext";


function App() {
  return (
    <>
    <CartProvider>

      <CssBaseline />

      {/* Tüm sayfayı kapsayan esnek konteyner */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Üst kısım */}
        <Header />
        {/* Header sabitse içerik üstüne binmesin diye spacer */}
        <Toolbar />

        {/* Ana içerik */}
        <Box
          component="main"
          sx={{
            flex: 1,                // Kalan alanı kaplar
            maxWidth: 1200,
            mx: "auto",
            px: 2,
            py: 4,
            textAlign: "center",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </Box>

        {/* Footer hep en altta */}
        <Footer />
      </Box>
      </CartProvider>
    </>
  );
}

export default App;
