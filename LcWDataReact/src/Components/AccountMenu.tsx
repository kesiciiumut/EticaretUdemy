// src/components/AccountMenu.tsx
import { useState, useEffect } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setUserName(localStorage.getItem("userName"));
    setUserId(localStorage.getItem("userId"));
  }, []);

  const handleMouseEnter = (e: ReactMouseEvent<HTMLElement>) => {
    if (!userName) return; // giriş yoksa menü açma
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setUserName(null);
    setUserId(null);
    handleClose();
    navigate("/login");
  };

  // login değilse sadece giriş butonu göster
  if (!userName) {
    return (
      <Button
        component={RouterLink}
        to="/login"
        sx={{ color: "black", fontWeight: "normal" }}
      >
        Hesabım
      </Button>
    );
  }

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleClose}
      sx={{ display: "inline-block" }}
    >
      <Button
        sx={{ color: "black", fontWeight: "normal" }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {userName}
      </Button>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <MenuItem component={RouterLink} to="/orders">Siparişlerim</MenuItem>
        <MenuItem component={RouterLink} to="/returns">İadeler</MenuItem>
        <MenuItem component={RouterLink} to={`/profileSettings/${localStorage.getItem("userId")}`}>
          Hesap Ayarları
        </MenuItem>


        <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
      </Menu>
    </Box>
  );
}
