import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  price: string;
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  stockId: number;
  storeId?: number;
  product?: Product | null;
}

interface Store {
  id: number;
  storeName: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const customerId = localStorage.getItem("userId");

  useEffect(() => {
    if (!customerId) return;
    fetch(`https://localhost:44322/api/Cart/${customerId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.items) setCartItems(data.items);
      });
  }, [customerId]);

  // Mağaza listesini çek
  useEffect(() => {
    fetch("https://localhost:44322/api/Store")
      .then(res => res.ok ? res.json() : [])
      .then(data => setStores(data));
  }, []);

  const handleRemove = async (itemId: number) => {
    await fetch(
      `https://localhost:44322/api/Cart/remove?customerId=${customerId}&productId=${itemId}`,
      { method: "POST" }
    );
    setCartItems((prev) => prev.filter((item) => item.productId !== itemId));
  };

  const handleQuantity = async (item: CartItem, delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    await fetch(
      `https://localhost:44322/api/Cart/add?customerId=${customerId}&productId=${item.productId}&quantity=${delta}&unitPrice=${item.unitPrice}`,
      { method: "POST" }
    );
    setCartItems((prev) =>
      prev.map((ci) =>
        ci.productId === item.productId ? { ...ci, quantity: newQuantity } : ci
      )
    );
  };

  const handleClearCart = async () => {
    await fetch(
      `https://localhost:44322/api/Cart/clear?customerId=${customerId}`,
      { method: "POST" }
    );
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  // Mağaza seçimi pop-up'ını aç
  const handleCheckout = () => {
    setStoreDialogOpen(true);
  };

  // Mağaza seçildikten sonra alışverişi tamamla
  const handleStoreSelect = async (storeId: number) => {
    setSelectedStoreId(storeId);
    setStoreDialogOpen(false);

    if (!customerId) return;

    // Sepetteki ürünlerin id'lerini al
    const productIds = cartItems.map(item => item.productId);

    // Seçilen mağazadaki stokları çek
    const stockRes = await fetch("https://localhost:44322/api/Stock/GetStocksForStore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId, productIds })
    });

    if (!stockRes.ok) {
      alert("Stok bilgisi alınamadı!");
      return;
    }

    const stocks = await stockRes.json(); // [{productId, stockId, quantity}]

    // Sepet ürünlerine stokId ve stok miktarını ekle
    const saleItems = cartItems.map(item => {
      const stock = stocks.find((s: any) => s.productId === item.productId);
      return {
        productId: item.productId,
        storeId: storeId,
        stockId: stock ? stock.stockId : null,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      };
    });

    // Stok yetersizse uyarı ver
    const insufficientStock = cartItems.some(item => {
      const stock = stocks.find((s: any) => s.productId === item.productId);
      return !stock || stock.quantity < item.quantity;
    });
    if (insufficientStock) {
      alert("Seçilen mağazada bazı ürünler için yeterli stok yok!");
      return;
    }

    const sale = {
      customerId: Number(customerId),
      totalPrice: subtotal,
      saleDate: new Date().toISOString().split("T")[0],
      status: "Completed",
      items: saleItems
    };

    const res = await fetch("https://localhost:44322/api/Sale/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sale)
    });

    if (res.ok) {
      alert("Satın alma işlemi başarılı!");
      setCartItems([]);
    } else {
      alert("Satın alma işlemi başarısız!");
    }
  };

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Grid container spacing={3} alignItems="flex-start">
        {/* Sepet Ürünleri */}
        <Grid item xs={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">
                Sepetim ({cartItems.length} Ürün)
              </Typography>
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={handleClearCart}
                sx={{ textTransform: "none" }}
              >
                Sepeti Temizle
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            {cartItems.length === 0 ? (
              <Typography color="text.secondary">Sepetiniz boş.</Typography>
            ) : (
              <Box display="flex" flexDirection="row" gap={3}>
                {cartItems.map((item) => (
                  <Paper key={item.id} sx={{ p: 2, minWidth: 260, maxWidth: 300 }}>
                    <img
                      src={item.product?.imageUrl || "/images/default.jpg"}
                      alt={item.product?.name || "Ürün"}
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                        marginBottom: 8,
                      }}
                    />
                    <Typography fontWeight={600}>
                      {item.product?.name || "Ürün adı yok"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {item.product?.description || ""}
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                      <IconButton onClick={() => handleRemove(item.productId)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleQuantity(item, -1)}>
                        <RemoveIcon />
                      </IconButton>
                      <Typography mx={1}>{item.quantity}</Typography>
                      <IconButton onClick={() => handleQuantity(item, 1)}>
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Typography fontWeight={600} fontSize={18} textAlign="center" mt={1}>
                      {(item.unitPrice * item.quantity).toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        {/* Sipariş Özeti */}
        <Grid item xs={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Sipariş Özeti
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Ara Toplam</Typography>
              <Typography>
                {subtotal.toLocaleString("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                })}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography fontWeight={600}>Toplam</Typography>
              <Typography fontWeight={600}>
                {subtotal.toLocaleString("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                })}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="inherit"
              fullWidth
              sx={{
                fontWeight: 600,
                fontSize: 20,
                py: 1.5,
                bgcolor: "#111",
                color: "#fff",
                "&:hover": { bgcolor: "#222" },
              }}
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Ödeme Adımına Geç
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Mağaza seçimi pop-up */}
      <Dialog open={storeDialogOpen} onClose={() => setStoreDialogOpen(false)}>
        <DialogTitle>Mağaza Seçimi</DialogTitle>
        <DialogContent>
          <List>
            {stores.map(store => (
              <ListItem key={store.id} disablePadding>
                <ListItemButton onClick={() => handleStoreSelect(store.id)}>
                  <ListItemText primary={store.storeName} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStoreDialogOpen(false)}>İptal</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
