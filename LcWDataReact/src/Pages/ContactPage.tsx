import { Box, Button, Container, TextField, Typography } from "@mui/material";

export default function Contact() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        İletişim
      </Typography>

      <Typography variant="body1" align="center" color="text.secondary" mb={4}>
        Herhangi bir sorunuz ya da geri bildiriminiz için bizimle iletişime geçin.
      </Typography>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <TextField
          label="Adınız"
          name="name"
          required
          fullWidth
        />
        <TextField
          label="E-posta"
          name="email"
          type="email"
          required
          fullWidth
        />
        <TextField
          label="Mesajınız"
          name="message"
          required
          fullWidth
          multiline
          rows={5}
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
        >
          Gönder
        </Button>
      </Box>
    </Container>
  );
}
