// src/components/LogoutButton.tsx
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // burada token veya auth temizlenir
    localStorage.removeItem("token"); // örnek
    navigate("/login");
  };

  return (
    <>
      <Button color="error" onClick={() => setOpen(true)}>Çıkış Yap</Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Çıkış Yap</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Gerçekten çıkmak istiyor musunuz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">Hayır</Button>
          <Button onClick={handleLogout} color="error">Evet</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
