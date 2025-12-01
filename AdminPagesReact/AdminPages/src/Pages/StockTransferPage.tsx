import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Chip,
  Pagination,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

// API endpointleri
const API_BASE = "https://localhost:44322/api/report";

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

interface StockTransfer {
  id: number;
  productId: number;
  fromStoreId: number;
  toStoreId: number;
  quantity: number;
  transferDate: string;
}

interface StockTransferRequest {
  productId: number;
  fromStoreId: number;
  toStoreId: number;
  quantity: number;
}

const criticalThreshold = 10;
const PAGE_SIZE = 4;

export default function StockTransferPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [transferList, setTransferList] = useState<StockTransfer[]>([]);
  const [form, setForm] = useState({
    productId: "",
    fromStoreId: "",
    toStoreId: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get(`${API_BASE}/products`).then((res) => {
      setProducts(Array.isArray(res.data) ? res.data : []);
    });
    axios.get(`${API_BASE}/stores`).then((res) => {
      setStores(Array.isArray(res.data) ? res.data : []);
    });
    fetchStocks();
    fetchTransfers();
  }, []);

  const fetchStocks = () => {
    axios.get(`${API_BASE}/stocks`).then((res) => setStocks(Array.isArray(res.data) ? res.data : []));
  };

  const fetchTransfers = () => {
    axios.get(`${API_BASE}/transfer-history`).then((res) => setTransferList(Array.isArray(res.data) ? res.data : []));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateTransfer = async () => {
    if (form.fromStoreId === form.toStoreId) {
      alert("Kaynak ve hedef mağaza aynı olamaz.");
      return;
    }
    if (!form.productId || !form.fromStoreId || !form.toStoreId || !form.quantity) {
      alert("Tüm alanları doldurun.");
      return;
    }
    setLoading(true);
    const req: StockTransferRequest = {
      productId: Number(form.productId),
      fromStoreId: Number(form.fromStoreId),
      toStoreId: Number(form.toStoreId),
      quantity: Number(form.quantity),
    };
    try {
      await axios.post(`${API_BASE}/transfer-stock`, req);
      fetchStocks();
      fetchTransfers();
      setForm({ productId: "", fromStoreId: "", toStoreId: "", quantity: "" });
    } catch (err: any) {
      alert(err.response?.data?.error || "Transfer işlemi başarısız.");
    }
    setLoading(false);
  };

  // Kritik stoklar ve öneriler
  const criticalStocks = stocks.filter((s) => s.quantity <= criticalThreshold);

  // Ürün ve mağaza adını güvenli şekilde bul
  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : <span style={{ color: "red" }}>Ürün yok</span>;
  };
  const getStoreName = (storeId: number) => {
    const store = stores.find((s) => s.id === storeId);
    return store ? store.storeName : <span style={{ color: "red" }}>Mağaza yok</span>;
  };

  // Her kritik stok için öneri bul
  const getSuggestion = (stock: Stock) => {
    const candidates = stocks.filter(
      (s) =>
        s.productId === stock.productId &&
        s.storeId !== stock.storeId &&
        s.quantity > 30
    );
    if (candidates.length === 0) return null;
    const best = candidates.reduce((a, b) => (a.quantity > b.quantity ? a : b));
    return best;
  };

  const handleApplySuggestion = async (stock: Stock) => {
    const suggestion = getSuggestion(stock);
    if (!suggestion) return;
    const quantity = Math.min(20, suggestion.quantity);
    const req: StockTransferRequest = {
      productId: stock.productId,
      fromStoreId: suggestion.storeId,
      toStoreId: stock.storeId,
      quantity,
    };
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/transfer-stock`, req);
      fetchStocks();
      fetchTransfers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Transfer işlemi başarısız.");
    }
    setLoading(false);
  };

  // Pagination işlemleri
  const pageCount = Math.ceil(transferList.length / PAGE_SIZE);
  const pagedTransfers = transferList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Stok Transfer
      </Typography>

      {/* FORM */}
      <Paper elevation={3} sx={{ p: 3, mb: 6 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateTransfer();
          }}
        >
          <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
            {/* Ürün seçimi */}
            <Grid item xs={12} sm={2.5} md={2.5}>
              <TextField
                select
                size="small"
                fullWidth
                label="Ürün"
                name="productId"
                value={form.productId}
                onChange={handleChange}
                placeholder="Ürün"
              >
                {products.length === 0 ? (
                  <MenuItem disabled>Ürün bulunamadı</MenuItem>
                ) : (
                  products.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            {/* Kaynak Mağaza */}
            <Grid item xs={12} sm={2.5} md={2.5}>
              <TextField
                select
                size="small"
                fullWidth
                label="Kaynak"
                name="fromStoreId"
                value={form.fromStoreId}
                onChange={handleChange}
                placeholder="Kaynak"
              >
                {stores.length === 0 ? (
                  <MenuItem disabled>Mağaza bulunamadı</MenuItem>
                ) : (
                  stores.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.storeName}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            {/* Hedef Mağaza */}
            <Grid item xs={12} sm={2.5} md={2.5}>
              <TextField
                select
                size="small"
                fullWidth
                label="Hedef"
                name="toStoreId"
                value={form.toStoreId}
                onChange={handleChange}
                placeholder="Hedef"
              >
                {stores.length === 0 ? (
                  <MenuItem disabled>Mağaza bulunamadı</MenuItem>
                ) : (
                  stores.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.storeName}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            {/* Adet */}
            <Grid item xs={12} sm={2.5} md={2.5}>
              <TextField
                size="small"
                fullWidth
                label="Adet"
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Adet"
                inputProps={{ min: 1 }}
              />
            </Grid>
            {/* Gönder Butonu */}
            <Grid item xs={12} sm={2} md={2} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ minWidth: 120, height: 48, fontWeight: "bold", fontSize: 16 }}
                disabled={loading}
              >
                GÖNDER
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* TRANSFER TABLOSU */}
      <Typography variant="h6" fontWeight="medium" mb={2}>
        Transfer Geçmişi
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ürün</TableCell>
              <TableCell>Kaynak</TableCell>
              <TableCell>Hedef</TableCell>
              <TableCell>Adet</TableCell>
              <TableCell>Tarih</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedTransfers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Transfer kaydı yok.
                </TableCell>
              </TableRow>
            ) : (
              pagedTransfers.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{getProductName(row.productId)}</TableCell>
                  <TableCell>{getStoreName(row.fromStoreId)}</TableCell>
                  <TableCell>{getStoreName(row.toStoreId)}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>
                    {new Date(row.transferDate).toLocaleDateString("tr-TR")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      {pageCount > 1 && (
        <Stack alignItems="center" sx={{ mb: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="medium"
          />
        </Stack>
      )}

      {/* KRİTİK STOK & ÖNERİ */}
      <Typography variant="h6" fontWeight="medium" mb={2}>
        Kritik Stoklar ve Transfer Önerileri
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ürün</TableCell>
              <TableCell>Mağaza</TableCell>
              <TableCell>Stok</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Öneri</TableCell>
              <TableCell>Aksiyon</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {criticalStocks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Kritik stok uyarısı yok.
                </TableCell>
              </TableRow>
            )}
            {criticalStocks.map((stock) => {
              const suggestion = getSuggestion(stock);
              return (
                <TableRow key={stock.id}>
                  <TableCell>
                    {getProductName(stock.productId)}
                  </TableCell>
                  <TableCell>
                    {getStoreName(stock.storeId)}
                  </TableCell>
                  <TableCell>{stock.quantity}</TableCell>
                  <TableCell>
                    <Chip label="Kritik" color="error" size="small" />
                  </TableCell>
                  <TableCell>
                    {suggestion
                      ? `${getStoreName(suggestion.storeId)} → ${getStoreName(stock.storeId)} (${suggestion.quantity} stok)`
                      : "Uygun mağaza yok"}
                  </TableCell>
                  <TableCell>
                    {suggestion ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleApplySuggestion(stock)}
                        disabled={loading}
                      >
                        Uygula
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
