import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Button, Stack, MenuItem, Select, TextField, FormControl, InputLabel, CircularProgress, Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SALES_API = "https://localhost:44322/api/sale/myorders";
const SALE_ITEMS_API = "https://localhost:44322/api/sale";
const RETURN_API = "https://localhost:44322/api/return";

const RETURN_REASONS = [
  "Kırık geldi",
  "Eksik ürün",
  "Yanlış ürün",
  "Diğer",
];

export default function CreateReturnPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [selectedSaleId, setSelectedSaleId] = useState<number | "">("");
  const [saleProducts, setSaleProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (userId) {
      axios.get(`${SALES_API}/${userId}`).then(res => setSales(res.data)).finally(() => setLoading(false));
    } else {
      setError("Kullanıcı girişi bulunamadı.");
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (selectedSaleId) {
      axios.get(`${SALE_ITEMS_API}/${selectedSaleId}/items`)
        .then(res => setSaleProducts(res.data))
        .catch(() => setSaleProducts([]));
    } else {
      setSaleProducts([]);
    }
  }, [selectedSaleId]);

  const handleSubmit = async () => {
    if (!selectedSaleId || !selectedProductId || !reason || (reason === "Diğer" && !otherReason.trim())) return;
    setSubmitting(true);
    setError(null);
    try {
      await axios.post(`${RETURN_API}`, {
        saleId: selectedSaleId,
        customerId: Number(userId),
        productId: selectedProductId,
        returnReason: reason === "Diğer" ? otherReason : reason,
      });
      navigate("/returns");
    } catch (err: any) {
      // Backend'den dönen hata mesajını göster
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("İade talebi oluşturulamadı.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={2}>Yeni İade Talebi Oluştur</Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <FormControl fullWidth>
                <InputLabel>Sipariş Seçin</InputLabel>
                <Select
                  value={selectedSaleId}
                  label="Sipariş Seçin"
                  onChange={e => {
                    setSelectedSaleId(Number(e.target.value));
                    setSelectedProductId("");
                  }}
                >
                  {sales.map(sale => (
                    <MenuItem key={sale.id} value={sale.id}>
                      {sale.saleNo ?? `Sipariş #${sale.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth disabled={!selectedSaleId}>
                <InputLabel>Ürün Seçin</InputLabel>
                <Select
                  value={selectedProductId}
                  label="Ürün Seçin"
                  onChange={e => setSelectedProductId(Number(e.target.value))}
                >
                  {saleProducts.map(product => (
                    <MenuItem key={product.productId} value={product.productId}>
                      {product.product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>İade Nedeni</InputLabel>
                <Select
                  value={reason}
                  label="İade Nedeni"
                  onChange={e => setReason(e.target.value)}
                >
                  {RETURN_REASONS.map(r => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {reason === "Diğer" && (
                <TextField
                  label="Diğer İade Nedeni"
                  value={otherReason}
                  onChange={e => setOtherReason(e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                />
              )}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={() => navigate("/returns")} disabled={submitting}>Vazgeç</Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  disabled={
                    submitting ||
                    !selectedSaleId ||
                    !selectedProductId ||
                    !reason ||
                    (reason === "Diğer" && !otherReason.trim())
                  }
                >
                  Talebi Gönder
                </Button>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
