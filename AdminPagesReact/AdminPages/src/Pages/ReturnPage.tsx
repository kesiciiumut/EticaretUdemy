import {
  Box,
  Button,
  Chip,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Pagination,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

// Backend DTO ile birebir uyumlu tip
interface ReturnAdminDto {
  id: number;
  productName: string;
  customerName: string;
  saleNo: string;
  returnDate: string; // ISO string olarak gelecek
  returnReason: string;
  returnStatus: "Pending" | "Approved" | "Rejected" | "Talep Alındı" | "Onaylandı" | "Reddedildi";
}

// Statüye göre Chip gösterimi
const getStatusChip = (status: string) => {
  switch (status) {
    case "Pending":
    case "Talep Alındı":
      return <Chip label="Talep Alındı" color="warning" variant="outlined" />;
    case "Approved":
    case "Onaylandı":
      return <Chip label="Onaylandı" color="success" variant="outlined" />;
    case "Rejected":
    case "Reddedildi":
      return <Chip label="Reddedildi" color="error" variant="outlined" />;
    default:
      return <Chip label={status} />;
  }
};

const PAGE_SIZE = 9;

export default function ReturnPage() {
  const [returnList, setReturnList] = useState<ReturnAdminDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // API'den iade listesini çek
  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await axios.get<ReturnAdminDto[]>(
        "https://localhost:44322/api/return"
      );
      setReturnList(res.data);
    } catch (err) {
      // Hata yönetimi eklenebilir
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  // Onayla veya reddet
  const updateStatus = async (id: number, newStatus: "Approved" | "Rejected") => {
    try {
      if (newStatus === "Approved") {
        await axios.post(`https://localhost:44322/api/return/${id}/approve`);
      } else if (newStatus === "Rejected") {
        await axios.post(`https://localhost:44322/api/return/${id}/reject`);
      }
      fetchReturns();
    } catch (err) {
      // Hata yönetimi eklenebilir
    }
  };

  // Buton aktiflik kontrolü hem İngilizce hem Türkçe statüye göre
  const isPending = (status: string) =>
    status === "Pending" || status === "Talep Alındı";

  // Pagination hesaplama
  const pageCount = Math.max(1, Math.ceil(returnList.length / PAGE_SIZE));
  const pagedReturns = returnList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Sayfa değişince
  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  // Liste değişirse sayfayı başa al
  useEffect(() => {
    setPage(1);
  }, [returnList.length]);

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        İadeler
      </Typography>

      <Paper sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Satış No</TableCell>
              <TableCell>Ürün</TableCell>
              <TableCell>Müşteri</TableCell>
              <TableCell>İade Sebebi</TableCell>
              <TableCell>İade Tarihi</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : pagedReturns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No returns found.
                </TableCell>
              </TableRow>
            ) : (
              pagedReturns.map((ret) => (
                <TableRow key={ret.id}>
                  <TableCell>{ret.saleNo}</TableCell>
                  <TableCell>{ret.productName}</TableCell>
                  <TableCell>{ret.customerName}</TableCell>
                  <TableCell>{ret.returnReason}</TableCell>
                  <TableCell>
                    {ret.returnDate
                      ? new Date(ret.returnDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{getStatusChip(ret.returnStatus)}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        disabled={!isPending(ret.returnStatus)}
                        onClick={() => updateStatus(ret.id, "Approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={!isPending(ret.returnStatus)}
                        onClick={() => updateStatus(ret.id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
      {/* Pagination */}
      <Stack alignItems="center" sx={{ mt: 2, mb: 2 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          size="medium"
          siblingCount={1}
          boundaryCount={1}
        />
      </Stack>
    </Container>
  );
}
