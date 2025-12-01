// StatCard.tsx
import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  background: string;
}

export default function StatCard({ title, value, description, icon, background }: StatCardProps) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        p: 4,
        color: "#fff",
        background,
        height: 200,
        width: "100%",
        minWidth: 350,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontSize={18}>
          {title}
        </Typography>
        <Box fontSize={28}>{icon}</Box>
      </Box>

      <Box>
        <Typography variant="h4" fontWeight={600}>
          {value}
        </Typography>
        <Typography variant="body1" fontWeight={300}>
          {description}
        </Typography>
      </Box>

      {/* Dekoratif daireler */}
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          right: -30,
          width: 120,
          height: 120,
          bgcolor: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          bgcolor: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
        }}
      />
    </Box>
  );
}
