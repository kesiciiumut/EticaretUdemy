import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Typography,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import InventoryIcon from "@mui/icons-material/Inventory";
import {
  SpaceDashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  BarChart as BarChartIcon,
  Store as StoreIcon,
  SyncAlt as SyncAltIcon,
  Inventory2 as Inventory2Icon,
  Undo as UndoIcon,
  AddBox as AddBoxIcon,
  Calculate as CalculateIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Lock as LockIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { purple, grey } from "@mui/material/colors";

const drawerWidth = 240;
const collapsedWidth = 0;

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/", roles: ["admin"] },
  { label: "Satışlar", icon: <ShoppingCartIcon />, path: "/sales", roles: ["admin", "worker"] },
  { label: "Mağazalar", icon: <StoreIcon />, path: "/magazalar", roles: ["admin"] },
  { label: "Raporlar", icon: <BarChartIcon />, path: "/raporlar", roles: ["admin"] },
  { label: "Stok Transfer", icon: <SyncAltIcon />, path: "/stoktransfer", roles: ["admin"] },
  { label: "Stok Takip", icon: <Inventory2Icon />, path: "/stocktracking", roles: ["admin", "worker"] },
  { label: "İade", icon: <UndoIcon />, path: "/return", roles: ["admin", "worker"] },
  { label: "Ürün Ekle", icon: <AddBoxIcon />, path: "/addproduct", roles: ["admin", "worker"] },
  { label: "Fiyat Hesapla", icon: <CalculateIcon />, path: "/pricecalculator", roles: ["admin"] },
  { label: "Ürünler", icon: <InventoryIcon />, path: "/products", roles: ["admin"] },
];

const bottomMenuItems = [
  { label: "Çalışanlar", icon: <AccountCircleIcon />, path: "/workers", roles: ["admin"] },
  { label: "Çıkış Yap", icon: <LogoutIcon />, path: "/login", roles: ["admin", "worker"] },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const role = localStorage.getItem("role") || "worker";

  const handleAccessControl = (item: any) => {
    if (item.label === "Çıkış Yap") {
      localStorage.removeItem("role");
      navigate("/login");
      return;
    }
    const hasAccess = item.roles.includes(role);
    if (!hasAccess) {
      setAlertOpen(true);
      return;
    }
    navigate(item.path);
    if (isMobile) setMobileOpen(false);
  };

  // LOGOYA TIKLANINCA role'a göre yönlendirme
  const handleLogoClick = () => {
    if (role === "admin") {
      navigate("/");
    } else {
      navigate("/sales");
    }
  };

  return (
    <>
      <Drawer
        variant="permanent"
        open={isSidebarOpen}
        sx={{
          width: isSidebarOpen ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isSidebarOpen ? drawerWidth : collapsedWidth,
            display: isSidebarOpen ? "block" : "none",
            boxSizing: "border-box",
            backgroundColor: "#f8f9fa",
            borderRight: `1px solid ${grey[300]}`,
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Üst Logo ve Menü */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, px: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Poppins",
                color: purple[700],
                fontWeight: 600,
                cursor: "pointer",
                userSelect: "none"
              }}
              onClick={handleLogoClick}
            >
              VERA EVİM
            </Typography>
            <IconButton onClick={() => setIsSidebarOpen(false)}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Divider />

          {/* ORTA MENÜLER */}
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <List sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
              {menuItems.map((item) => {
                const isAllowed = item.roles.includes(role);
                return (
                  <Tooltip title={item.label} key={item.label} placement="right">
                    <ListItem
                      button
                      onClick={() => handleAccessControl(item)}
                      selected={location.pathname === item.path}
                      sx={{
                        justifyContent: "space-between",
                        pl: 2,
                        pr: 2,
                        height: "48px",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f0e9fc",
                          cursor: "pointer",
                        },
                        "&.Mui-selected": {
                          backgroundColor: purple[50],
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "#8A6FC4",
                        }}
                      />
                      <Box display="flex" alignItems="center" gap={1} sx={{ cursor: "pointer" }}>
                        {!isAllowed && <LockIcon color="error" fontSize="small" />}
                        <ListItemIcon sx={{ minWidth: "auto" }}>{item.icon}</ListItemIcon>
                      </Box>
                    </ListItem>
                  </Tooltip>
                );
              })}
            </List>
          </Box>

          {/* ALT MENÜLER */}
          <Divider />
          <List>
            {bottomMenuItems.map((item) => (
              <ListItem
                button
                onClick={() => handleAccessControl(item)}
                selected={location.pathname === item.path}
                sx={{ justifyContent: "space-between", pl: 2, pr: 2, cursor: "pointer" }}
                key={item.label}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontFamily: "Poppins",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#8A6FC4",
                  }}
                />
                <Box display="flex" alignItems="center" gap={1} sx={{ cursor: "pointer" }}>
                  {!item.roles.includes(role) && <LockIcon color="error" fontSize="small" />}
                  <ListItemIcon sx={{ minWidth: "auto" }}>{item.icon}</ListItemIcon>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Sidebar açma butonu */}
      {!isSidebarOpen && (
        <IconButton
          onClick={() => setIsSidebarOpen(true)}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
            backgroundColor: "#fff",
            border: `1px solid ${grey[300]}`,
            boxShadow: 1,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Yetkisiz erişim snackbar bildirimi */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="warning" sx={{ width: "100%" }}>
          Bu sayfaya erişiminiz yok!
        </Alert>
      </Snackbar>
    </>
  );
}
