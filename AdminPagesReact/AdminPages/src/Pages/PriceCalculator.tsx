import { Box, TextField, Typography, Grid, Paper, Switch, FormControlLabel } from "@mui/material";
import { useState } from "react";

export default function PriceCalculator() {
  const [cost, setCost] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(20);
  const [profitMargin, setProfitMargin] = useState<number>(30);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [showDiscount, setShowDiscount] = useState<boolean>(false);

  // Hesaplamalar
  const basePrice = cost + shipping;
  const taxAmount = (basePrice * taxRate) / 100;
  const profitAmount = (basePrice * profitMargin) / 100;
  const finalPrice = basePrice + taxAmount + profitAmount;

  const discountedPrice = finalPrice - (finalPrice * discountRate) / 100;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4} fontWeight="bold">Fiyat Hesapla</Typography>

      <Grid container spacing={4}>
        {/* Girdiler */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Maliyet Bilgileri</Typography>
            <TextField
              fullWidth label="Ürün Maliyeti (₺)" type="number" margin="normal"
              onChange={(e) => setCost(parseFloat(e.target.value))}
            />
            <TextField
              fullWidth label="Kargo Maliyeti (₺)" type="number" margin="normal"
              onChange={(e) => setShipping(parseFloat(e.target.value))}
            />
            <TextField
              fullWidth label="Vergi Oranı (%)" type="number" margin="normal"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value))}
            />
            <TextField
              fullWidth label="Kâr Marjı (%)" type="number" margin="normal"
              value={profitMargin}
              onChange={(e) => setProfitMargin(parseFloat(e.target.value))}
            />
            <FormControlLabel
              control={<Switch checked={showDiscount} onChange={(e) => setShowDiscount(e.target.checked)} />}
              label="İndirim Uygula"
            />
            {showDiscount && (
              <TextField
                fullWidth label="İndirim Oranı (%)" type="number" margin="normal"
                onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
              />
            )}
          </Paper>
        </Grid>

        {/* Sonuçlar */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Hesaplanan Değerler</Typography>
            <Typography>Toplam Maliyet (Kargo dahil): <strong>₺{basePrice.toFixed(2)}</strong></Typography>
            <Typography>Vergi Tutarı (%{taxRate}): <strong>₺{taxAmount.toFixed(2)}</strong></Typography>
            <Typography>Kâr Tutarı (%{profitMargin}): <strong>₺{profitAmount.toFixed(2)}</strong></Typography>
            <Typography>Satış Fiyatı: <strong>₺{finalPrice.toFixed(2)}</strong></Typography>
            {showDiscount && (
              <Typography>İndirimli Fiyat (%{discountRate}): <strong>₺{discountedPrice.toFixed(2)}</strong></Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
