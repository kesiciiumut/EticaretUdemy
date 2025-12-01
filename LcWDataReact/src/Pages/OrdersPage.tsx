import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Stack,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://localhost:44322/api/sale";

const PageWrap = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 1200,
  margin: "0 auto",
  padding: theme.spacing(4, 2),
}));

type SaleStatus =
  | "Sipariş Alındı"
  | "Hazırlanıyor"
  | "Kargoda"
  | "Kargoya Verildi"
  | "Teslim Edildi"
  | "İade"
  | "İptal"
  | string;

type Sale = {
  id: number;
  saleNo?: string;
  status?: SaleStatus;
  saleDate: string; // "2024-06-13" gibi DateOnly string
  totalPrice: number;
};

/** Statü metnini normalize edip bilinen başlıklara indirger. */
const normalizeStatus = (raw?: string): SaleStatus | undefined => {
  if (!raw) return raw;
  const s = raw.trim().toLocaleLowerCase("tr-TR");

  if (s.includes("iptal")) return "İptal";
  if (s.includes("iade")) return "İade";
  if (s.includes("teslim")) return "Teslim Edildi";
  if (s.includes("kargo")) return s.includes("ver") ? "Kargoya Verildi" : "Kargoda";
  if (s.includes("hazır")) return "Hazırlanıyor";
  if (s.includes("sipariş")) return "Sipariş Alındı";

  return raw as SaleStatus; // eşleşmediyse orijinali döndür
};

/** Her durum için renk paleti (bg + text) */
const getStatusColors = (status?: SaleStatus) => {
  const s = normalizeStatus(status);

  switch (s) {
    case "Sipariş Alındı":
      return { bg: "#bbdefb", color: "#0d47a1", border: "#90caf9" }; // mavi
    case "Hazırlanıyor":
      return { bg: "#ffecb3", color: "#e65100", border: "#ffe082" }; // turuncu
    case "Kargoda":
    case "Kargoya Verildi":
      return { bg: "#d1c4e9", color: "#4527a0", border: "#b39ddb" }; // mor ton
    case "Teslim Edildi":
      return { bg: "#c8e6c9", color: "#1b5e20", border: "#a5d6a7" }; // yeşil
    case "İade":
    case "İptal":
      return { bg: "#ffcdd2", color: "#b71c1c", border: "#ef9a9a" }; // kırmızı
    default:
      return { bg: "#eeeeee", color: "#424242", border: "#e0e0e0" }; // gri
  }
};

export default function SalesPage() {
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | SaleStatus>("");

  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Kullanıcı ID'sini localStorage'dan al
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (userId) fetchSales(userId);
    else setLoading(false);
    // eslint-disable-next-line
  }, [userId]);

  const fetchSales = async (customerId: string) => {
    try {
      setLoading(true);
      const { data } = await axios.get<Sale[]>(
        `${API_BASE}/myorders/${encodeURIComponent(customerId)}`
      );
      setSales(data);
    } catch (e) {
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = sales;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((s) =>
        (s.saleNo ?? `SAL-${s.id}`).toLowerCase().includes(q)
      );
    }

    if (status) {
      // Filtrelerken normalize ederek karşılaştır
      const normFilter = normalizeStatus(status);
      list = list.filter((s) => normalizeStatus(s.status) === normFilter);
    }

    return list;
  }, [sales, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // DateOnly string'i Türkçe tarih olarak göster
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toLocaleDateString("tr-TR");
    return dateStr;
  };

  // saleNo fallback
  const getSaleNo = (s: Sale) => (s.saleNo?.trim() ? s.saleNo : `SAL-${s.id}`);

  return (
    <PageWrap>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Siparişlerim
      </Typography>

      <Card variant="outlined">
        <CardContent>
          {/* Filtre Bar */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
            <TextField
              label="Satış No ile Ara"
              placeholder="SAL-1002..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              fullWidth
            />

            <TextField
              select
              label="Durum"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as any);
                setPage(1);
              }}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="Sipariş Alındı">Sipariş Alındı</MenuItem>
              <MenuItem value="Hazırlanıyor">Hazırlanıyor</MenuItem>
              <MenuItem value="Kargoda">Kargoda</MenuItem>
              <MenuItem value="Kargoya Verildi">Kargoya Verildi</MenuItem>
              <MenuItem value="Teslim Edildi">Teslim Edildi</MenuItem>
              <MenuItem value="İade">İade</MenuItem>
              <MenuItem value="İptal">İptal</MenuItem>
            </TextField>
          </Stack>

          {/* Liste */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filtered.length === 0 ? (
            <Typography color="text.secondary">
              Kriterlere uygun satış bulunamadı.
            </Typography>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Satış No</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Tarih</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Durum</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Toplam (₺)</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>İşlem</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paged.map((s) => {
                    const colors = getStatusColors(s.status);
                    return (
                      <TableRow key={s.id} hover>
                        <TableCell>{getSaleNo(s)}</TableCell>
                        <TableCell>{formatDate(s.saleDate)}</TableCell>
                        <TableCell>
                          <Chip
                            label={normalizeStatus(s.status) ?? "-"}
                            size="small"
                            sx={{
                              backgroundColor: colors.bg,
                              color: colors.color,
                              border: `1px solid ${colors.border}`,
                              fontWeight: 700,
                              letterSpacing: 0.2,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {s.totalPrice.toLocaleString("tr-TR", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/sales/${s.id}`)}
                          >
                            Detay
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Sayfalama */}
              <Stack alignItems="center" mt={2}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, v) => setPage(v)}
                  shape="rounded"
                />
              </Stack>
            </>
          )}
        </CardContent>
      </Card>
    </PageWrap>
  );
}
