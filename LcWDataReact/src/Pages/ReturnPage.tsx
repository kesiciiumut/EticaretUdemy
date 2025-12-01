import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RETURNS_API = "https://localhost:44322/api/return/myreturns";

export default function ReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (userId) {
      axios.get(`${RETURNS_API}/${userId}`)
        .then(res => setReturns(res.data))
        .catch(() => setError("İade geçmişi alınamadı."))
        .finally(() => setLoading(false));
    } else {
      setError("Kullanıcı girişi bulunamadı.");
      setLoading(false);
    }
  }, [userId]);

  // Tarih formatlama fonksiyonu
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("tr-TR");
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight={700}>
              Geçmiş İade Taleplerim
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => navigate("/returns/new")}
            >
              Yeni İade Talebi Oluştur
            </Button>
          </Stack>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Talep No</TableCell>
                    <TableCell>Ürün</TableCell>
                    <TableCell>Durum</TableCell>
                    <TableCell>Tarih</TableCell>
                    <TableCell>İade Nedeni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {returns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Hiç iade talebiniz yok.
                      </TableCell>
                    </TableRow>
                  ) : (
                    returns.map(ret => (
                      <TableRow key={ret.id}>
                        <TableCell>{ret.id}</TableCell>
                        <TableCell>{ret.product?.name || "-"}</TableCell>
                        <TableCell>{ret.returnStatus || "-"}</TableCell>
                        <TableCell>{formatDate(ret.returnDate)}</TableCell>
                        <TableCell>{ret.returnReason || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
