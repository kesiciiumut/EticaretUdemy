import { Box, Paper, Typography, IconButton } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState } from "react";

// Chart verisinin tipi
type ChartItem = {
  day: string;
  salesAmount: number;
  returnAmount: number;
};

type GrafikSliderProps = {
  chartData: ChartItem[];
  loading: boolean;
};

export default function GrafikSlider({ chartData, loading }: GrafikSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const charts = [
    {
      title: "Satış Grafiği",
      dataKey: "salesAmount", // küçük harfli!
      color: "#8884d8",
      name: "Satış",
    },
    {
      title: "İade Grafiği",
      dataKey: "returnAmount", // küçük harfli!
      color: "#ff4d4f",
      name: "İade",
    },
  ];

  const currentChart = charts[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? charts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === charts.length - 1 ? 0 : prev + 1));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, position: "relative", height: "100%", maxWidth: 700 }}>
      <Typography variant="h6" mb={2} textAlign="center">
        {currentChart.title}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="center">
        <IconButton onClick={handlePrev}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Box flex={1} minWidth={420}>
          <ResponsiveContainer width="100%" height={250}>
            {loading ? (
              <Typography align="center" sx={{ mt: 10 }}>
                Yükleniyor...
              </Typography>
            ) : chartData.length === 0 ? (
              <Typography align="center" sx={{ mt: 10 }}>
                Veri yok
              </Typography>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={currentChart.dataKey}
                  name={currentChart.name}
                  stroke={currentChart.color}
                  strokeWidth={2}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </Box>
        <IconButton onClick={handleNext}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
