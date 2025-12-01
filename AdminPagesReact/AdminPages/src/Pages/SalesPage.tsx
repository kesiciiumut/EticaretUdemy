import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Button,
  Modal,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Pagination,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import axios from "axios";

interface Sale {
  id: number;
  saleNo: string;
  date: string;
  customer: string;
  totalPrice: number;
  status: "Sipariş Alındı" | "Hazırlanıyor" | "Kargoda" | "Teslim Edildi" | "İade";
  cargoCompany?: string;
  trackingNumber?: string;
}

const PAGE_SIZE = 8;

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [page, setPage] = useState(1);

  // Tüm siparişleri API'den çek (admin için)
  useEffect(() => {
    axios
      .get("https://localhost:44322/api/sale/all")
      .then((res) => {
        // API'den gelen veriyi uygun formata dönüştür
        const apiSales = res.data.map((s: any) => ({
          id: s.id,
          saleNo: s.saleNo,
          date: s.saleDate,
          customer: s.customerName ?? "",
          totalPrice: s.totalPrice,
          status: s.status,
        }));

        setSales(apiSales);
      })
      .catch(() => setSales([]));
  }, []);

  const handleOpen = (sale: Sale) => {
    setSelectedSale(sale);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSale(null);
  };

  // Sipariş durumunu güncelle
  const handleSave = async () => {
    if (!selectedSale) return;
    try {
      await axios.post(
        `https://localhost:44322/api/sale/update-status?saleId=${selectedSale.id}&status=${encodeURIComponent(selectedSale.status)}`
      );
      setSales((prev) =>
        prev.map((s) =>
          s.id === selectedSale.id ? { ...s, status: selectedSale.status } : s
        )
      );
      handleClose();
    } catch (err) {
      alert("Durum güncellenemedi.");
    }
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      (sale.customer || "").toLowerCase().includes(search.toLowerCase()) ||
      (sale.saleNo || sale.id.toString()).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? sale.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const pageCount = Math.ceil(filteredSales.length / PAGE_SIZE);
  const pagedSales = filteredSales.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  // Sayfa veya filtre değişince sayfayı başa al
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>
        Tüm Satışlar (Admin)
      </Typography>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Müşteri Adı / Sipariş No"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Sipariş Durumu"
          select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Tümü</MenuItem>
          <MenuItem value="Sipariş Alındı">Sipariş Alındı</MenuItem>
          <MenuItem value="Hazırlanıyor">Hazırlanıyor</MenuItem>
          <MenuItem value="Kargoda">Kargoda</MenuItem>
          <MenuItem value="Teslim Edildi">Teslim Edildi</MenuItem>
          <MenuItem value="İade">İade</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sipariş No</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Müşteri</TableCell>
              <TableCell>Toplam (₺)</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Düzenle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.saleNo || sale.id}</TableCell>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>{sale.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={sale.status}
                    color={
                      sale.status === "Sipariş Alındı"
                        ? "error"
                        : sale.status === "Hazırlanıyor"
                        ? "warning"
                        : sale.status === "Kargoda"
                        ? "info"
                        : sale.status === "Teslim Edildi"
                        ? "success"
                        : "default"
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleOpen(sale)}>
                    Düzenle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {pagedSales.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pageCount > 1 && (
        <Stack alignItems="center" sx={{ mt: 2, mb: 2 }}>
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

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 4,
            bgcolor: "#fff",
            borderRadius: 2,
            width: 400,
            mx: "auto",
            mt: "10%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6">Sipariş Düzenle</Typography>

          <FormControl fullWidth>
            <InputLabel>Durum</InputLabel>
            <Select
              value={selectedSale?.status || ""}
              onChange={(e) =>
                setSelectedSale((prev) =>
                  prev ? { ...prev, status: e.target.value as Sale["status"] } : prev
                )
              }
              label="Durum"
            >
              <MenuItem value="Sipariş Alındı">Sipariş Alındı</MenuItem>
              <MenuItem value="Hazırlanıyor">Hazırlanıyor</MenuItem>
              <MenuItem value="Kargoda">Kargoda</MenuItem>
              <MenuItem value="Teslim Edildi">Teslim Edildi</MenuItem>
              <MenuItem value="İade">İade</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Kargo Firması"
            value={selectedSale?.cargoCompany || ""}
            onChange={(e) =>
              setSelectedSale((prev) =>
                prev ? { ...prev, cargoCompany: e.target.value } : prev
              )
            }
            fullWidth
          />
          <TextField
            label="Takip Numarası"
            value={selectedSale?.trackingNumber || ""}
            onChange={(e) =>
              setSelectedSale((prev) =>
                prev ? { ...prev, trackingNumber: e.target.value } : prev
              )
            }
            fullWidth
          />

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleClose}>İptal</Button>
            <Button variant="contained" onClick={handleSave}>
              Kaydet
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
