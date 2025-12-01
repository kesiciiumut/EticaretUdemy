import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";



// Backend'deki Worker modeline uygun interface
interface Worker {
  id: number;
  storeId: number;
  storeName?: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  position: string;
  status: string;
}

const API_BASE = "https://localhost:44322/api/worker";

export default function WorkerList() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Yeni çalışan modalı
  const [openAdd, setOpenAdd] = useState(false);
  const [newWorker, setNewWorker] = useState<Omit<Worker, "id">>({
    storeId: 0,
    name: "",
    surname: "",
    email: "",
    role: "",
    position: "",
    status: "Aktif",
  });

  // Düzenleme modalı
  const [openEdit, setOpenEdit] = useState(false);
  const [editWorker, setEditWorker] = useState<Worker | null>(null);

  // Çalışanları API'den çek
  const fetchWorkers = async () => {
    setLoading(true);
    const res = await fetch(API_BASE);
    const data = await res.json();
    setWorkers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  // Çalışan ekle
  const handleAddWorker = async () => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWorker),
    });
    if (res.ok) {
      await fetchWorkers();
      setOpenAdd(false);
      setNewWorker({
        storeId: 0,
        name: "",
        surname: "",
        email: "",
        role: "",
        position: "",
        status: "Aktif",
      });
    }
  };

  // Çalışan düzenle
  const handleEdit = (worker: Worker) => {
    setEditWorker(worker);
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    if (!editWorker) return;
    const res = await fetch(`${API_BASE}/${editWorker.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editWorker),
    });
    if (res.ok) {
      await fetchWorkers();
      setOpenEdit(false);
      setEditWorker(null);
    }
  };

  // Çalışan sil
  const handleDelete = async (id: number) => {
    if (window.confirm("Çalışanı silmek istediğinize emin misiniz?")) {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchWorkers();
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Çalışanlar
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenAdd(true)}>
          + Yeni Çalışan
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ad</TableCell>
                <TableCell>Soyad</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Pozisyon</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Mağaza Adı</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>{worker.name}</TableCell>
                  <TableCell>{worker.surname}</TableCell>
                  <TableCell>{worker.email}</TableCell>
                  <TableCell>{worker.role}</TableCell>
                  <TableCell>{worker.position}</TableCell>
                  <TableCell>{worker.status}</TableCell>
                  <TableCell>{worker.storeName}</TableCell>
                   <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEdit(worker)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(worker.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Yeni Çalışan Ekle Modalı */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Yeni Çalışan Ekle</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Ad"
              value={newWorker.name}
              onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Soyad"
              value={newWorker.surname}
              onChange={(e) => setNewWorker({ ...newWorker, surname: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              value={newWorker.email}
              onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Rol"
              value={newWorker.role}
              onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
              fullWidth
            />
            <TextField
              label="Pozisyon"
              value={newWorker.position}
              onChange={(e) => setNewWorker({ ...newWorker, position: e.target.value })}
              fullWidth
            />
            <Select
              value={newWorker.status}
              onChange={(e) => setNewWorker({ ...newWorker, status: e.target.value })}
              fullWidth
            >
              <MenuItem value="Aktif">Aktif</MenuItem>
              <MenuItem value="Pasif">Pasif</MenuItem>
            </Select>
            <TextField
              label="Mağaza ID"
              type="number"
              value={newWorker.storeId}
              onChange={(e) => setNewWorker({ ...newWorker, storeId: Number(e.target.value) })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>İptal</Button>
          <Button onClick={handleAddWorker} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Düzenleme Modalı */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Çalışanı Düzenle</DialogTitle>
        <DialogContent>
          {editWorker && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                label="Ad"
                value={editWorker.name}
                onChange={(e) =>
                  setEditWorker({ ...editWorker, name: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Soyad"
                value={editWorker.surname}
                onChange={(e) =>
                  setEditWorker({ ...editWorker, surname: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Email"
                value={editWorker.email}
                onChange={(e) =>
                  setEditWorker({ ...editWorker, email: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Rol"
                value={editWorker.role}
                onChange={(e) =>
                  setEditWorker({ ...editWorker, role: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Pozisyon"
                value={editWorker.position}
                onChange={(e) =>
                  setEditWorker({ ...editWorker, position: e.target.value })
                }
                fullWidth
              />
              <Select
                value={editWorker.status}
                onChange={(e) =>
                  setEditWorker({ ...editWorker, status: e.target.value })
                }
                fullWidth
              >
                <MenuItem value="Aktif">Aktif</MenuItem>
                <MenuItem value="Pasif">Pasif</MenuItem>
              </Select>
              <TextField
                label="Mağaza ID"
                type="number"
                value={editWorker.storeId}
                onChange={(e) =>
                  setEditWorker({ ...editWorker, storeId: Number(e.target.value) })
                }
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>İptal</Button>
          <Button onClick={handleEditSave} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
