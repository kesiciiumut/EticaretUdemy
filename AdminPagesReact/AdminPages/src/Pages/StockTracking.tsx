import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Stack,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

interface Product {
  id: number;
  name: string;
}

interface Store {
  id: number;
  storeName: string;
}

interface Stock {
  id: number;
  productId: number;
  storeId: number;
  quantity: number;
}

const API_BASE = "https://localhost:44322/api/stock";
const PRODUCT_API = "https://localhost:44322/api/product";
const STORE_API = "https://localhost:44322/api/store";
const KRITIK_SEVIYE = 20;

export default function StockTrackingPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [selectedStoreId, setSelectedStoreId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number>(0);

  const [decreaseOpen, setDecreaseOpen] = useState(false);
  const [decreaseStockId, setDecreaseStockId] = useState<number | null>(null);
  const [decreaseMax, setDecreaseMax] = useState<number>(0);
  const [decreaseAmount, setDecreaseAmount] = useState<number>(1);
  const [decreaseTargetProduct, setDecreaseTargetProduct] = useState<Product | null>(null);
  const [selectedDecreaseStoreId, setSelectedDecreaseStoreId] = useState<number | "">("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(API_BASE).then(res => res.json()),
      fetch(PRODUCT_API).then(res => res.json()),
      fetch(STORE_API).then(res => res.json()),
    ]).then(([stockData, productData, storeData]) => {
      setStocks(stockData);
      setProducts(productData);
      setStores(storeData);
      setLoading(false);
    });
  }, []);

  const stockMatrix = useMemo(() => {
    const matrix: Record<number, Record<number, { qty: number; stockId?: number }>> = {};
    products.forEach((p) => {
      matrix[p.id] = {};
      stores.forEach((s) => {
        const stok = stocks.find(
          (st) => st.productId === p.id && st.storeId === s.id
        );
        matrix[p.id][s.id] = {
          qty: stok ? stok.quantity : 0,
          stockId: stok ? stok.id : undefined,
        };
      });
    });
    return matrix;
  }, [products, stores, stocks]);

  // Modal açıldığında eski değerleri sıfırla
  const openAddStockModal = (productId: number) => {
    setSelectedProductId(productId);
    setSelectedStoreId("");
    setQuantity(0);
    setOpen(true);
  };

  const handleAddStock = async () => {
    if (!selectedProductId || !selectedStoreId || quantity <= 0) return;
    // Sadece gerekli alanları gönderiyoruz, id yok!
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: selectedProductId,
        storeId: selectedStoreId,
        quantity,
      }),
    });
    const stockData = await fetch(API_BASE).then(res => res.json());
    setStocks(stockData);
    setOpen(false);
    setSelectedProductId("");
    setSelectedStoreId("");
    setQuantity(0);
  };

  const handleDecreaseStock = async () => {
    if (!decreaseStockId || decreaseAmount <= 0) return;
    await fetch(`${API_BASE}/${decreaseStockId}/decrease`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(decreaseAmount),
    });
    const stockData = await fetch(API_BASE).then(res => res.json());
    setStocks(stockData);
    setDecreaseOpen(false);
    setDecreaseStockId(null);
    setDecreaseAmount(1);
    setDecreaseMax(0);
    setSelectedDecreaseStoreId("");
    setDecreaseTargetProduct(null);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Stok Takip
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ürün</TableCell>
              {stores.map((store) => (
                <TableCell key={store.id}>{store.storeName}</TableCell>
              ))}
              <TableCell>Toplam</TableCell>
              <TableCell>Kritik</TableCell>
              <TableCell>Aksiyon</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const rowStocks = stores.map(
                (store) => stockMatrix[product.id][store.id].qty || 0
              );
              const total = rowStocks.reduce((a, b) => a + b, 0);
              const isKritik = rowStocks.some((qty) => qty < KRITIK_SEVIYE);

              return (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  {stores.map((store) => {
                    const { qty } = stockMatrix[product.id][store.id];
                    const isCritical = qty < KRITIK_SEVIYE;
                    return (
                      <TableCell
                        key={store.id}
                        sx={{
                          color: isCritical ? "error.main" : "inherit",
                          fontWeight: isCritical ? "bold" : "normal",
                        }}
                      >
                        {qty}
                        {isCritical && (
                          <Typography variant="caption" color="error" sx={{ display: "block" }}>
                            Kritik
                          </Typography>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell>{total}</TableCell>
                  <TableCell>
                    <Chip
                      label={isKritik ? "Kritik" : "Yeterli"}
                      color={isKritik ? "error" : "success"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => openAddStockModal(product.id)}
                      >
                        Stok Ekle
                      </Button>
                      <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        startIcon={<RemoveCircleOutlineIcon />}
                        onClick={() => {
                          setDecreaseTargetProduct(product);
                          setSelectedDecreaseStoreId("");
                          setDecreaseOpen(true);
                        }}
                      >
                        Stok Azalt
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      {/* Stok Ekle Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Stok Ekle</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Ürün"
            value={products.find((p) => p.id === selectedProductId)?.name || ""}
            fullWidth
            disabled
          />
          <TextField
            select
            label="Mağaza Seç"
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(Number(e.target.value))}
            fullWidth
          >
            {stores.map((store) => {
              const existingStock = stocks.find(
                (s) => s.productId === selectedProductId && s.storeId === store.id
              );
              return (
                <MenuItem key={store.id} value={store.id}>
                  {store.storeName}
                  {selectedProductId && (
                    <> ({existingStock?.quantity ?? 0} adet)</>
                  )}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            type="number"
            label="Eklenecek Miktar"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            İptal
          </Button>
          <Button
            onClick={handleAddStock}
            variant="contained"
            color="success"
            disabled={!selectedProductId || !selectedStoreId || quantity <= 0}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stok Azalt Modal */}
      <Dialog open={decreaseOpen} onClose={() => setDecreaseOpen(false)} fullWidth>
        <DialogTitle>Stok Azalt</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Mağaza Seç"
            select
            value={selectedDecreaseStoreId}
            onChange={(e) => {
              const storeId = Number(e.target.value);
              const stock = stocks.find(
                (s) => s.productId === decreaseTargetProduct?.id && s.storeId === storeId
              );
              setSelectedDecreaseStoreId(storeId);
              setDecreaseStockId(stock?.id ?? null);
              setDecreaseMax(stock?.quantity ?? 0);
              setDecreaseAmount(1);
            }}
            fullWidth
          >
            {stores.map((store) => {
              const stok = stocks.find(
                (s) => s.productId === decreaseTargetProduct?.id && s.storeId === store.id
              );
              return (
                <MenuItem key={store.id} value={store.id} disabled={!stok}>
                  {store.storeName} ({stok?.quantity ?? 0} adet)
                </MenuItem>
              );
            })}
          </TextField>

          <TextField
            type="number"
            label="Azaltılacak Miktar"
            value={decreaseAmount}
            onChange={(e) => {
              let val = parseInt(e.target.value);
              if (isNaN(val) || val < 1) val = 1;
              if (val > decreaseMax) val = decreaseMax;
              setDecreaseAmount(val);
            }}
            inputProps={{ min: 1, max: decreaseMax }}
            fullWidth
            disabled={!selectedDecreaseStoreId}
          />
          <Typography variant="body2" color="text.secondary">
            Maksimum azaltılabilir miktar: {decreaseMax}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDecreaseOpen(false)} color="inherit">
            İptal
          </Button>
          <Button
            onClick={handleDecreaseStock}
            variant="contained"
            color="warning"
            disabled={decreaseAmount < 1 || decreaseAmount > decreaseMax || !decreaseStockId}
          >
            Azalt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
