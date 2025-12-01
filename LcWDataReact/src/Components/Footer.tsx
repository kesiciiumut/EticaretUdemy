// Footer.jsx
import { Typography, Link, IconButton, Divider, Box } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        boxSizing: "border-box",
        py: 4,
        px: 4,
        backgroundColor: "#f9f9f9", // İsteğe bağlı
      }}
    >
      {/* Linkler ve Sosyal Medya */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          maxWidth: "100%",
        }}
      >
        {/* Menü Linkleri */}
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <Link href="/about" underline="hover" color="rgba(73, 73, 73, 0.75)">
            Hakkımızda
          </Link>
          <Link href="/privacy" underline="hover" color="rgba(73, 73, 73, 0.75)">
            Gizlilik Politikası
          </Link>
          <Link href="/contact" underline="hover" color="rgba(73, 73, 73, 0.75)">
            İletişim
          </Link>
        </Box>

        {/* Sosyal Medya Butonları */}
        <Box sx={{ display: "flex", gap: 2, mt: { xs: 2, sm: 0 } }}>
          <IconButton href="#" color="inherit">
            <FacebookIcon />
          </IconButton>
          <IconButton href="#" color="inherit">
            <TwitterIcon />
          </IconButton>
          <IconButton href="#" color="inherit">
            <InstagramIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Alt Çizgi */}
      <Divider sx={{ my: 2 }} />

      {/* Telif Hakkı */}
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} VERA EVİM. Tüm hakları saklıdır.
      </Typography>
    </Box>
  );
}
