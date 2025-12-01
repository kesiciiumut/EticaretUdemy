import { Box, Button, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const mockUsers = [
  { username: "umut", password: "123456", role: "admin" },
  { username: "mehmet", password: "123456", role: "worker" },
];

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Eğer giriş yapılmışsa otomatik yönlendir
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      navigate("/sales");
    }
  }, [navigate]);

  const handleLogin = () => {
    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("role", user.role);
      navigate("/sales");
    } else {
      setError("Kullanıcı adı veya şifre hatalı");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={2}
    >
      <Typography variant="h4" gutterBottom>
        Giriş Yap
      </Typography>

      <TextField
        label="Kullanıcı Adı"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        sx={{ maxWidth: 300 }}
      />

      <TextField
        label="Şifre"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        sx={{ maxWidth: 300 }}
      />

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Button variant="contained" onClick={handleLogin}>
        Giriş
      </Button>
    </Box>
  );
}
