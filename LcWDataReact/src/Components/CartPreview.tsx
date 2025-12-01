import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { IconButton, Badge, Popper, Paper, Typography, Box, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

interface Store {
  id: number;
  storeName: string;
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  stockId: number;
  storeId?: number;
  product: { name: string };
}

interface Props {
  itemCount: number;
}

export default function CartPreview({ itemCount }: Props) {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const customerId = localStorage.getItem("userId");
    if (!customerId) return;
    fetch(`https://localhost:44322/api/Cart/${customerId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.items) setCartItems(data.items);
      });
  }, [itemCount]);

  // Mağaza listesini çek
  useEffect(() => {
    fetch("https://localhost:44322/api/Store")
      .then(res => res.ok ? res.json() : [])
      .then(data => setStores(data));
  }, []);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Mağaza seçimi pop-up'ını aç
  const handleCheckout = () => {
    setStoreDialogOpen(true);
  };

  // Mağaza seçildikten sonra alışverişi tamamla
  const handleStoreSelect = async (storeId: number) => {
    setSelectedStoreId(storeId);
    setStoreDialogOpen(false);

    const customerId = localStorage.getItem("userId");
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
      totalPrice: cartTotal,
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
    <Box
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      sx={{ display: "inline-block", position: "relative" }}
    >
      <IconButton
        color="inherit"
        ref={anchorRef}
        aria-describedby={open ? "cart-popper" : undefined}
      >
        <Badge badgeContent={itemCount} color="primary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <Popper
        id="cart-popper"
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        disablePortal
        sx={{ zIndex: 1300 }}
      >
        <Paper sx={{ p: 2, minWidth: 250, boxShadow: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Sepetiniz
          </Typography>
          <Divider sx={{ mb: 1 }} />
          {cartItems.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Sepetiniz boş.
            </Typography>
          ) : (
            cartItems.slice(0, 3).map((item) => (
              <Box key={item.id} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  {item.product?.name} x {item.quantity} = {(item.unitPrice * item.quantity).toFixed(2)} TL
                </Typography>
              </Box>
            ))
          )}
          {cartItems.length > 3 && (
            <Typography variant="body2" color="text.secondary">
              +{cartItems.length - 3} ürün daha...
            </Typography>
          )}
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Sepet Toplamı: {cartTotal.toFixed(2)} TL
          </Typography>
          <Button
            component={Link}
            to="/cart"
            variant="outlined"
            color="primary"
            size="small"
            sx={{ mb: 1 }}
            fullWidth
          >
            Sepete Git
          </Button>
          <Button
            variant="contained"
            color="success"
            size="small"
            fullWidth
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Alışverişi Tamamla
          </Button>
        </Paper>
      </Popper>

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
