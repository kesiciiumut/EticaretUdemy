// DashboardPage.jsx or DashboardPage.tsx
import { useEffect, useState } from "react";
import { Box, Grid, Container, useMediaQuery, useTheme } from "@mui/material";
import StatCard from "../Components/StatCards";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DiamondIcon from "@mui/icons-material/Diamond";
import NotificationsPanel from "../Components/NotificationsPanel";
import GrafikSlider from "../Components/GrafikSlider";

export default function DashboardPage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [weeklySales, setWeeklySales] = useState<null | number>(null);
  const [percentChange, setPercentChange] = useState<null | number>(null);
  const [productCount, setProductCount] = useState<null | number>(null);
  const [storeCount, setStoreCount] = useState<null | number>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const day = now.getDay() === 0 ? 7 : now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - day + 1);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const startDate = monday.toISOString();
    const endDate = sunday.toISOString();

    fetch(
      `https://localhost:44322/api/report/weekly-sales-amount?startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        setWeeklySales(data.weeklySalesAmount);
        setPercentChange(data.percentChange);
      })
      .catch(() => {
        setWeeklySales(null);
        setPercentChange(null);
      });

    fetch("https://localhost:44322/api/report/product-count")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => setProductCount(data))
      .catch(() => setProductCount(null));

    fetch("https://localhost:44322/api/report/store-count")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => setStoreCount(data))
      .catch(() => setStoreCount(null));

    fetch("https://localhost:44322/api/report/recent-sale-notifications?count=5")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => setNotifications(data))
      .catch(() => setNotifications([]));

    setChartLoading(true);
    fetch(
      `https://localhost:44322/api/report/weekly-sales-returns-chart?weekStart=${monday.toISOString()}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        setChartData(data);
        setChartLoading(false);
      })
      .catch(() => {
        setChartData([]);
        setChartLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
      <Box sx={{ px: { xs: 1, sm: 2, md: 2 }, py: 1 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Haftalık Satış Tutarı"
              value={
                weeklySales !== null
                  ? weeklySales.toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                      maximumFractionDigits: 0,
                    })
                  : "Yükleniyor..."
              }
              description={
                percentChange !== null
                  ? `Geçen Haftaya Göre %${Math.abs(percentChange).toFixed(0)} ${
                      percentChange > 0
                        ? "Arttı"
                        : percentChange < 0
                        ? "Azaldı"
                        : "Aynı"
                    }`
                  : ""
              }
              icon={<TrendingUpIcon />}
              background="linear-gradient(135deg, #f8c17dff, #ec6facff)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Ürün Sayısı"
              value={
                productCount !== null
                  ? productCount.toString()
                  : "Yükleniyor..."
              }
              icon={<BookmarkBorderIcon />}
              background="linear-gradient(135deg, #80bbe5ff, #4398ddff)"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <StatCard
              title="Mağaza Sayısı"
              value={
                storeCount !== null
                  ? storeCount.toString()
                  : "Yükleniyor..."
              }
              icon={<DiamondIcon />}
              background="linear-gradient(135deg, #9cd1b1ff, #38a169)"
            />
          </Grid>
        </Grid>

        <Grid container spacing={4} mt={4} alignItems="stretch">
          <Grid item xs={12} lg={6} display="flex">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <NotificationsPanel notifications={notifications} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={6} display="flex">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <GrafikSlider chartData={chartData} loading={chartLoading} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
