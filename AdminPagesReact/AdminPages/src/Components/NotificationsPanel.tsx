import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface Notification {
  title: string;
  description: string;
  saleDate?: string; // opsiyonel, tarih göstermek isterseniz
}

interface NotificationsPanelProps {
  notifications?: Notification[];
}

export default function NotificationsPanel({ notifications = [] }: NotificationsPanelProps) {
  return (
    <Box>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Bildirimler
        </Typography>
        <Table size="small" sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Başlık</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Açıklama</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  Bildirim yok
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((n, i) => (
                <TableRow key={i}>
                  <TableCell>{n.title}</TableCell>
                  <TableCell sx={{ color: n.title.includes("Kritik") ? "error.main" : "text.primary" }}>
                    {n.description}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
