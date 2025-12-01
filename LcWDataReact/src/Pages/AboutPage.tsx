import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
} from "@mui/material";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import FlagIcon from "@mui/icons-material/Flag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import StyleIcon from "@mui/icons-material/Style";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export default function AboutPage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        py: 10,
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: "1400px", mx: "auto", width: "100%" }}>
        <Typography
          variant="h2"
          fontWeight={800}
          textAlign="center"
          gutterBottom
        >
          Biz Kimiz?
        </Typography>

        <Typography
          variant="h5"
          textAlign="center"
          color="text.secondary"
          mb={4}
        >
          Şıklığı ve düzeni mutfak ve banyonuzla buluşturuyoruz.
        </Typography>

        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          mb={6}
          sx={{ maxWidth: 900, mx: "auto" }}
        >
          2023 yılından bu yana, mutfak ve banyo alanlarınıza estetik katan
          <strong> sabunluklar</strong>, <strong>yağdanlıklar</strong> ve
          <strong> düzenleyici şişeler</strong> tasarlıyoruz. Amacımız sadece
          işlevsel ürünler sunmak değil, yaşam alanlarınıza değer katan,
          uzun ömürlü ve dekoratif çözümler üretmek.
        </Typography>

        {/* Vizyon & Misyon */}
        <Grid container spacing={4} justifyContent="center" mb={4}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                p: 3,
                textAlign: "center",
               
              }}
            >
              <Avatar sx={{ bgcolor: "orange", mx: "auto", mb: 2 }}>
                <EmojiObjectsIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Vizyonumuz
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mutfak ve banyolarda şıklığı, düzeni ve işlevselliği bir araya
                  getiren modern tasarımlarla yaşam alanlarını dönüştürmek.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                p: 3,
                textAlign: "center",
               
              }}
            >
              <Avatar sx={{ bgcolor: "dodgerblue", mx: "auto", mb: 2 }}>
                <FlagIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Misyonumuz
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yüksek kaliteli malzemelerle üretilmiş, dayanıklı ve estetik
                  ürünleri hızlı kargo ve müşteri memnuniyeti odaklı hizmet ile
                  sunmak.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Değerler */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, p: 3, textAlign: "center", boxShadow: 3 }}>
              <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 2 }}>
                <VerifiedIcon />
              </Avatar>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Kaliteli Malzeme
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dayanıklı cam, paslanmaz çelik ve premium plastikten üretilmiş
                ürünler.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, p: 3, textAlign: "center", boxShadow: 3 }}>
              <Avatar sx={{ bgcolor: "success.main", mx: "auto", mb: 2 }}>
                <StyleIcon />
              </Avatar>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Modern Tasarım
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Her dekorasyona uyum sağlayan, zarif ve minimalist şişe tasarımları.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, p: 3, textAlign: "center", boxShadow: 3 }}>
              <Avatar sx={{ bgcolor: "warning.main", mx: "auto", mb: 2 }}>
                <LocalShippingIcon />
              </Avatar>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Hızlı Kargo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Siparişleriniz en kısa sürede özenle paketlenip adresinize ulaştırılır.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, p: 3, textAlign: "center", boxShadow: 3 }}>
              <Avatar sx={{ bgcolor: "info.main", mx: "auto", mb: 2 }}>
                <SupportAgentIcon />
              </Avatar>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Müşteri Desteği
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Satış öncesi ve sonrası 7/24 destek ile yanınızdayız.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
