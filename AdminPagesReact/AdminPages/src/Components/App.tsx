import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./SideBar";
import DashboardPage from "../Pages/DashboardPage";
import SalesPage from "../Pages/SalesPage";
import StoreList from "../Pages/StoreList";
import ReportsPage from "../Pages/ReportsPage";
import StockTransferPage from "../Pages/StockTransferPage";
import StockTrackingPage from "../Pages/StockTracking";
import ReturnPage from "../Pages/ReturnPage";
import AddProduct from "../Pages/AddProduct";
import PriceCalculator from "../Pages/PriceCalculator";
import WorkersPage from "../Pages/WorkersPage";
import LoginPage from "../Pages/LoginPage";
import ProductsPage from "../Pages/ProductsPage";
import type { ReactNode } from "react";

const drawerWidth = 240;

// Role bazlı koruma yapan özel route
function PrivateRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: string[];
}) {
  const role = localStorage.getItem("role");
  if (!role) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/sales" />;
  return <>{children}</>;
}

// Layout bileşeni: login sayfasındayken sidebar gizlenir
function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <Box sx={{ display: "flex" }}>
      {!isLoginPage && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: !isLoginPage ? { sm: `calc(100% - ${drawerWidth}px)` } : "100%",
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute allowedRoles={["admin", "worker"]}>
                <SalesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/magazalar"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <StoreList />
              </PrivateRoute>
            }
          />
          <Route
            path="/raporlar"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ReportsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/stoktransfer"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <StockTransferPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/stocktracking"
            element={
              <PrivateRoute allowedRoles={["admin", "worker"]}>
                <StockTrackingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/return"
            element={
              <PrivateRoute allowedRoles={["admin", "worker"]}>
                <ReturnPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/addproduct"
            element={
              <PrivateRoute allowedRoles={["admin", "worker"]}>
                <AddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/pricecalculator"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <PriceCalculator />
              </PrivateRoute>
            }
          />
          <Route
            path="/workers"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <WorkersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ProductsPage />
              </PrivateRoute>
            }
          />
          {/* Bilinmeyen route'larda login ekranına yönlendir */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
