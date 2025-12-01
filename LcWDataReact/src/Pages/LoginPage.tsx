// src/Pages/LoginPage.tsx
import { useState, useEffect } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  Checkbox,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type Role = "customer" | "admin";

const API_BASE = "https://localhost:44322/api/Customer";

// ---- JWT decode yardımcıları
function base64UrlToJson(b64url: string) {
  try {
    const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    try {
      // bazı ortamlarda escape gerekmez
      const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(b64));
    } catch {
      return null;
    }
  }
}

function parseJwt(token?: string | null) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  return base64UrlToJson(parts[1]);
}

/** JWT payload içinden olası claim anahtarlarına bakarak userId’yi bulur */
function extractUserIdFromPayload(payload: Record<string, any> | null): string | null {
  if (!payload) return null;

  const candidates = [
    "userId", "UserId",
    "id", "Id",
    "userid",
    "nameid", "nameId", // JwtRegisteredClaimNames.NameId kısaltmaları
    "sub", "Subject",
    // .NET claim type'ları:
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ];

  for (const key of candidates) {
    const val = payload[key];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      return String(val);
    }
  }
  return null;
}

export default function LoginPage() {
  const [role, setRole] = useState<Role>("customer");
  const [showRegister, setShowRegister] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [aydinlatma, setAydinlatma] = useState(false);
  const [kvkk, setKvkk] = useState(false);
  const [iletisim, setIletisim] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register state
  const [registerName, setRegisterName] = useState("");
  const [registerSurname, setRegisterSurname] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordRepeat, setRegisterPasswordRepeat] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterPasswordRepeat, setShowRegisterPasswordRepeat] = useState(false);

  // Feedback
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleRoleChange = (_event: ReactMouseEvent<HTMLElement>, newRole: Role | null) => {
    if (newRole !== null) {
      setRole(newRole);
      setShowRegister(newRole === "admin");
      setForgotPassword(false);
    }
  };

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  // Ortak hata metni çıkarıcı
  const getErrorText = (err: unknown) => {
    const e = err as AxiosError<any>;
    const data = e.response?.data;
    if (!data) return e.message;
    if (typeof data === "string") return data;
    return data.message ?? JSON.stringify(data);
  };

  // Login
  const handleLogin = async () => {
    setMessage("");
    try {
      const { data } = await axios.post(`${API_BASE}/login`, {
        email: loginEmail.trim(),
        password: loginPassword,
      });

      // Sunucu farklı büyük/küçük harflerle dönebilir; esnek oku
      const token =
        data?.token ?? data?.Token ?? data?.accessToken ?? data?.jwt ?? null;
      const userName =
        data?.userName ??
        data?.UserName ??
        data?.firstName ??
        data?.name ??
        (loginEmail.includes("@") ? loginEmail.split("@")[0] : loginEmail);

      if (token) {
        localStorage.setItem("token", String(token));
        // JWT'den userId çıkar
        const payload = parseJwt(String(token));
        const userIdFromJwt = extractUserIdFromPayload(payload);
        if (userIdFromJwt) {
          localStorage.setItem("userId", userIdFromJwt);
        } else {
          // id claim'i yoksa, en azından temizle (eski hatalı değer kalmasın)
          localStorage.removeItem("userId");
        }
      }

      if (userName) localStorage.setItem("userName", String(userName));

      setMessageType("success");
      setMessage("Giriş başarılı! Yönlendiriliyorsunuz...");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setMessageType("error");
      setMessage("Giriş başarısız: " + getErrorText(err));
    }
  };

  // Register
  const handleRegister = async () => {
    setMessage("");
    if (!aydinlatma || !kvkk) {
      setMessageType("error");
      setMessage("Aydınlatma ve KVKK metinlerini onaylamalısınız.");
      return;
    }
    if (!validatePassword(registerPassword)) {
      setMessageType("error");
      setMessage(
        "Şifre en az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir."
      );
      return;
    }
    if (registerPassword !== registerPasswordRepeat) {
      setMessageType("error");
      setMessage("Şifreler eşleşmiyor.");
      return;
    }

    try {
      await axios.post(`${API_BASE}/register`, {
        name: registerName.trim(),
        surname: registerSurname.trim(),
        email: registerEmail.trim(),
        phoneNo: registerPhone.trim(),
        password: registerPassword,
        allowContact: iletisim,
      });
      setMessageType("success");
      setMessage("Kayıt başarılı! Giriş yapabilirsiniz.");
      setRegisterName("");
      setRegisterSurname("");
      setRegisterEmail("");
      setRegisterPhone("");
      setRegisterPassword("");
      setRegisterPasswordRepeat("");
      setAydinlatma(false);
      setKvkk(false);
      setIletisim(false);
      setShowRegister(false);
      setRole("customer");
    } catch (err) {
      setMessageType("error");
      setMessage("Kayıt başarısız: " + getErrorText(err));
    }
  };

  // Enter'a basınca login
  const onLoginKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "-20px",
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {forgotPassword ? "Şifremi Unuttum" : showRegister ? "Kayıt Ol" : "Giriş Yap"}
        </Typography>

        {message && (
          <Typography
            align="center"
            color={messageType === "error" ? "error" : "success.main"}
            sx={{ mb: 2 }}
          >
            {message}
          </Typography>
        )}

        {forgotPassword ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <TextField fullWidth label="E-posta" margin="normal" />
            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
              Şifre Sıfırlama Linki Gönder
            </Button>
            <Typography align="center" sx={{ mt: 2 }}>
              Giriş ekranına dönmek için{" "}
              <Link component="button" onClick={() => setForgotPassword(false)}>
                tıklayın
              </Link>
            </Typography>
          </motion.div>
        ) : !showRegister ? (
          <>
            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={handleRoleChange}
              fullWidth
              sx={{ mb: 2 }}
            >
              <ToggleButton value="customer">Giriş Yap</ToggleButton>
              <ToggleButton value="admin">Kayıt Ol</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              fullWidth
              label="E-posta"
              margin="normal"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              onKeyDown={onLoginKeyDown}
            />
            <TextField
              fullWidth
              label="Şifre"
              type={showLoginPassword ? "text" : "password"}
              margin="normal"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyDown={onLoginKeyDown}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowLoginPassword(!showLoginPassword)}>
                      {showLoginPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
              Giriş Yap
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              Hesabın yok mu?{" "}
              <Link component="button" onClick={() => setShowRegister(true)}>
                Kayıt Ol
              </Link>
            </Typography>

            <Typography align="center" sx={{ mt: 2 }}>
              <Link component="button" onClick={() => setForgotPassword(true)}>
                Şifremi Unuttum
              </Link>
            </Typography>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <TextField
              fullWidth
              label="İsim"
              margin="normal"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Soyisim"
              margin="normal"
              value={registerSurname}
              onChange={(e) => setRegisterSurname(e.target.value)}
            />
            <TextField
              fullWidth
              label="E-posta"
              margin="normal"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Telefon numarası"
              margin="normal"
              value={registerPhone}
              onChange={(e) => setRegisterPhone(e.target.value)}
            />
            <TextField
              fullWidth
              label="Şifre"
              type={showRegisterPassword ? "text" : "password"}
              margin="normal"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowRegisterPassword(!showRegisterPassword)}>
                      {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Şifre Tekrar"
              type={showRegisterPasswordRepeat ? "text" : "password"}
              margin="normal"
              value={registerPasswordRepeat}
              onChange={(e) => setRegisterPasswordRepeat(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowRegisterPasswordRepeat(!showRegisterPasswordRepeat)}>
                      {showRegisterPasswordRepeat ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>
              Kayıt Ol
            </Button>

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={<Checkbox checked={aydinlatma} onChange={(e) => setAydinlatma(e.target.checked)} />}
                label={
                  <Typography variant="body2">
                    <Link href="https://www.orneksite.com/aydinlatma-metni" target="_blank" rel="noopener noreferrer">
                      Aydınlatma Metni
                    </Link>
                    'ni okudum ve onaylıyorum
                  </Typography>
                }
              />
              <FormControlLabel
                control={<Checkbox checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} />}
                label={
                  <Typography variant="body2">
                    <Link href="https://www.orneksite.com/kvkk-metni" target="_blank" rel="noopener noreferrer">
                      KVKK Metni
                    </Link>
                    'ni okudum ve onaylıyorum
                  </Typography>
                }
              />
              <FormControlLabel
                control={<Checkbox checked={iletisim} onChange={(e) => setIletisim(e.target.checked)} />}
                label="İletişim tercihime onay veriyorum"
              />
            </Box>

            <Typography align="center" sx={{ mt: 2 }}>
              Zaten hesabın var mı?{" "}
              <Link
                component="button"
                onClick={() => {
                  setShowRegister(false);
                  setRole("customer");
                }}
              >
                Giriş Yap
              </Link>
            </Typography>
          </motion.div>
        )}
      </Paper>
    </div>
  );
}
