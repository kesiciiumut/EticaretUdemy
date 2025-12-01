import { AppBar, Toolbar, Box, InputBase, Link as MuiLink } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import CartPreview from "./CartPreview"; // Sepet ve ürün sayısı
import AccountMenu from "./AccountMenu";
import { useEffect, useState } from "react";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "40ch",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.2, 1.2, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

export default function Header() {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const customerId = localStorage.getItem("userId");
    if (!customerId) return;
    fetch(`https://localhost:44322/api/Cart/${customerId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.items) {
          setCartItemCount(data.items.reduce((sum: number, item: any) => sum + item.quantity, 0));
        }
      });
  }, []);

  return (
    <>
      {/* HEADER */}
      <AppBar position="fixed" color="inherit" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link to="/Products" style={{ display: "inline-flex", alignItems: "center" }}>
              <img
                src="/İmages/verahomelogo.jpeg"
                alt="Logo"
                style={{ height: 90, objectFit: "fill", cursor: "pointer" }}
              />
            </Link>
          </Box>

          {/* Arama Kutusu */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Marka, ürün, kategori ara" inputProps={{ "aria-label": "search" }} />
          </Search>

          {/* Sağ Butonlar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <MuiLink
              component={Link}
              to="/favorites"
              underline="none"
              color="black"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <FavoriteBorderIcon />
              Favorilerim
            </MuiLink>
            <MuiLink
              component={Link}
              to="/login"
              underline="none"
              color="black"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <AccountCircleIcon />
              <AccountMenu />
            </MuiLink>

            {/* Sepet simgesi */}
            <CartPreview itemCount={cartItemCount} />
          </Box>
        </Toolbar>

        {/* ALT KATEGORİ BAR */}
        <Toolbar
          variant="dense"
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            borderTop: "1px solid #eee",
            borderBottom: "1px solid #eee",
            minHeight: 45,
            px: 4,
          }}
        >
          {[
            { name: "Ürünler", path: "/Products" },
            { name: "Banyo", path: "/category/banyo" },
            { name: "Mutfak", path: "/category/mutfak" },
            { name: "Düzenleyiciler", path: "/category/düzenleyici" },
            { name: "Takı", path: "/category/takı" },
            { name: "Pazaryerlerimiz", path: "/marketplaces" },
          ].map((item, i) => (
            <MuiLink
              key={i}
              component={Link}
              to={item.path}
              underline="none"
              color="rgba(15, 15, 15, 0.75)"
              sx={{ fontWeight: 500, "&:hover": { color: "#9A5D82" } }}
            >
              {item.name}
            </MuiLink>
          ))}
        </Toolbar>
      </AppBar>

      {/* HEADER BOŞLUĞU */}
      <Toolbar />
      <Toolbar variant="dense" />
    </>
  );
}
