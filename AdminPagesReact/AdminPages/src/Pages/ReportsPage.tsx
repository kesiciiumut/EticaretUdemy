import {
  Box,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

// Backend'den gelen DTO ile birebir uyumlu
interface TopProduct {
  product: string;
  sold: number;
  revenue: number;
}

interface CriticalStockItem {
  product: string;
  stock: number;
}

export default function ReportsPage() {
  const [todayOrders, setTodayOrders] = useState<number | null>(null);
  const [todayOrdersLoading, setTodayOrdersLoading] = useState(true);
  const [todayOrdersError, setTodayOrdersError] = useState<string | null>(null);

  const [todayRevenue, setTodayRevenue] = useState<number | null>(null);
  const [todayRevenueLoading, setTodayRevenueLoading] = useState(true);
  const [todayRevenueError, setTodayRevenueError] = useState<string | null>(null);

  const [todayApprovedReturns, setTodayApprovedReturns] = useState<number | null>(null);
  const [todayApprovedReturnsLoading, setTodayApprovedReturnsLoading] = useState(true);
  const [todayApprovedReturnsError, setTodayApprovedReturnsError] = useState<string | null>(null);

  const [returnRate, setReturnRate] = useState<number | null>(null);
  const [returnRateLoading, setReturnRateLoading] = useState(true);
  const [returnRateError, setReturnRateError] = useState<string | null>(null);

  const [criticalStock, setCriticalStock] = useState<CriticalStockItem[]>([]);
  const [criticalStockLoading, setCriticalStockLoading] = useState(true);
  const [criticalStockError, setCriticalStockError] = useState<string | null>(null);

  const [topSellingProducts, setTopSellingProducts] = useState<TopProduct[]>([]);
  const [topSellingProductsLoading, setTopSellingProductsLoading] = useState(true);
  const [topSellingProductsError, setTopSellingProductsError] = useState<string | null>(null);

  useEffect(() => {
    setTodayOrdersLoading(true);
    axios
      .get<number>("https://localhost:44322/api/report/today-orders")
      .then((res) => setTodayOrders(res.data))
      .catch(() => setTodayOrdersError("Veri alınamadı"))
      .finally(() => setTodayOrdersLoading(false));

    setTodayRevenueLoading(true);
    axios
      .get<number>("https://localhost:44322/api/report/today-revenue")
      .then((res) => setTodayRevenue(res.data))
      .catch(() => setTodayRevenueError("Veri alınamadı"))
      .finally(() => setTodayRevenueLoading(false));

    setTodayApprovedReturnsLoading(true);
    axios
      .get<number>("https://localhost:44322/api/report/today-approved-returns")
      .then((res) => setTodayApprovedReturns(res.data))
      .catch(() => setTodayApprovedReturnsError("Veri alınamadı"))
      .finally(() => setTodayApprovedReturnsLoading(false));

    setReturnRateLoading(true);
    axios
      .get<{ rate: number }>("https://localhost:44322/api/return/return-rate")
      .then((res) => setReturnRate(res.data.rate))
      .catch(() => setReturnRateError("Veri alınamadı"))
      .finally(() => setReturnRateLoading(false));

    setCriticalStockLoading(true);
    axios
      .get<CriticalStockItem[]>("https://localhost:44322/api/report/critical-stock")
      .then((res) => setCriticalStock(res.data))
      .catch(() => setCriticalStockError("Veri alınamadı"))
      .finally(() => setCriticalStockLoading(false));

    setTopSellingProductsLoading(true);
    axios
      .get<TopProduct[]>("https://localhost:44322/api/report/top-selling-products?days=7")
      .then((res) => setTopSellingProducts(res.data))
      .catch(() => setTopSellingProductsError("Veri alınamadı"))
      .finally(() => setTopSellingProductsLoading(false));
  }, []);

  // Kritik stok etiketi
  const getStockChip = (stock: number) => {
    if (stock === 0) return <Chip label="Tükendi" color="error" />;
    if (stock <= 2) return <Chip label="Çok Az" color="error" />;
    if (stock <= 5) return <Chip label="Az Kaldı" color="warning" />;
    if (stock < 10) return <Chip label="Yeterli (Kritik)" color="info" />;
    return <Chip label="Yeterli" color="success" />;
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        İşlem Raporları
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, backgroundColor: "#d0f0fd" }}>
            <Typography variant="subtitle1">Bugünkü Sipariş</Typography>
            <Typography variant="h5">
              {todayOrdersLoading ? (
                <CircularProgress size={24} />
              ) : todayOrdersError ? (
                todayOrdersError
              ) : (
                `${todayOrders ?? 0} Adet`
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, backgroundColor: "#c3f7ca" }}>
            <Typography variant="subtitle1">Bugünkü Gelir</Typography>
            <Typography variant="h5">
              {todayRevenueLoading ? (
                <CircularProgress size={24} />
              ) : todayRevenueError ? (
                todayRevenueError
              ) : (
                `₺${todayRevenue?.toLocaleString("tr-TR") ?? "0"}`
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, backgroundColor: "#ffe0e0" }}>
            <Typography variant="subtitle1">İade Oranı</Typography>
            <Typography variant="h5">
              {returnRateLoading ? (
                <CircularProgress size={24} />
              ) : returnRateError ? (
                returnRateError
              ) : (
                `%${returnRate !== null ? Math.round(returnRate * 100) : 0}`
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, backgroundColor: "#f5e0ff" }}>
            <Typography variant="subtitle1">Bugünkü Onaylanan İade</Typography>
            <Typography variant="h5">
              {todayApprovedReturnsLoading ? (
                <CircularProgress size={24} />
              ) : todayApprovedReturnsError ? (
                todayApprovedReturnsError
              ) : (
                `${todayApprovedReturns ?? 0} Adet`
              )}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" mt={4} mb={1}>
        Kritik Stoktaki Ürünler
      </Typography>
      {criticalStockError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {criticalStockError}
        </Alert>
      )}
      <Paper sx={{ mb: 4 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Ürün</TableCell>
                <TableCell>Stok Durumu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {criticalStockLoading ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : criticalStock.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Veri yok
                  </TableCell>
                </TableRow>
              ) : (
                criticalStock.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{getStockChip(item.stock)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography variant="h6" mt={4} mb={1}>
        Son 7 Günün En Çok Satan Ürünleri
      </Typography>
      {topSellingProductsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {topSellingProductsError}
        </Alert>
      )}
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Ürün</TableCell>
                <TableCell>Satış (adet)</TableCell>
                <TableCell>Gelir</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topSellingProductsLoading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : topSellingProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Veri yok
                  </TableCell>
                </TableRow>
              ) : (
                topSellingProducts.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.sold}</TableCell>
                    <TableCell>₺{item?.revenue?.toLocaleString("tr-TR")}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
