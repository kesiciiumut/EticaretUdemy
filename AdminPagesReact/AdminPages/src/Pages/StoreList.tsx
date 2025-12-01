import {
  Box,
  Button,
  Chip,
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

// Backend'deki Store modeline uygun interface
interface Store {
  id: number;
  storeName: string;
  isActive: boolean;
  email?: string;
  phoneNumber?: string;
  city?: string;
  district?: string;
  address?: string;
}

const API_BASE = "https://localhost:44322/api/store";

const statusLabel = (isActive: boolean) => (isActive ? "Aktif" : "Pasif");

export default function StoreList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filter, setFilter] = useState<string>("Tümü");
  const [loading, setLoading] = useState<boolean>(true);

  // Yeni mağaza modalı
  const [openAdd, setOpenAdd] = useState(false);
  const [newStore, setNewStore] = useState<Omit<Store, "id">>({
    storeName: "",
    isActive: true,
    email: "",
    phoneNumber: "",
    city: "",
    district: "",
    address: "",
  });

  // Düzenleme modalı
  const [openEdit, setOpenEdit] = useState(false);
  const [editStore, setEditStore] = useState<Store | null>(null);

  // Mağazaları API'den çek
  const fetchStores = async () => {
    setLoading(true);
    const res = await fetch(API_BASE);
    const data = await res.json();
    setStores(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Mağaza ekle
  const handleAddStore = async () => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStore),
    });
    if (res.ok) {
      await fetchStores();
      setOpenAdd(false);
      setNewStore({
        storeName: "",
        isActive: true,
        email: "",
        phoneNumber: "",
        city: "",
        district: "",
        address: "",
      });
    }
  };

  // Mağaza düzenle
  const handleEdit = (store: Store) => {
    setEditStore(store);
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    if (!editStore) return;
    const res = await fetch(`${API_BASE}/${editStore.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editStore),
    });
    if (res.ok) {
      await fetchStores();
      setOpenEdit(false);
      setEditStore(null);
    }
  };

  // Mağaza sil
  const handleDelete = async (id: number) => {
    const store = stores.find((s) => s.id === id);
    if (
      store &&
      window.confirm(`${store.storeName} mağazasını silmek istediğinize emin misiniz?`)
    ) {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchStores();
      }
    }
  };

  // Filtreleme
  const filteredStores =
    filter === "Tümü"
      ? stores
      : stores.filter((s) => (filter === "Aktif" ? s.isActive : !s.isActive));

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Mağazalar
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenAdd(true)}>
          + Yeni Mağaza
        </Button>
      </Box>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="Tümü">Tümü</MenuItem>
          <MenuItem value="Aktif">Aktif</MenuItem>
          <MenuItem value="Pasif">Pasif</MenuItem>
        </Select>
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
                <TableCell>Mağaza Adı</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Şehir</TableCell>
                <TableCell>İlçe</TableCell>
                <TableCell>Adres</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>{store.storeName}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabel(store.isActive)}
                      color={store.isActive ? "success" : "error"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{store.email}</TableCell>
                  <TableCell>{store.phoneNumber}</TableCell>
                  <TableCell>{store.city}</TableCell>
                  <TableCell>{store.district}</TableCell>
                  <TableCell>{store.address}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEdit(store)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(store.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Yeni Mağaza Ekle Modalı */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Yeni Mağaza Ekle</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Mağaza Adı"
              value={newStore.storeName}
              onChange={(e) => setNewStore({ ...newStore, storeName: e.target.value })}
              fullWidth
            />
            <Select
              value={newStore.isActive ? "Aktif" : "Pasif"}
              onChange={(e) =>
                setNewStore({ ...newStore, isActive: e.target.value === "Aktif" })
              }
              fullWidth
            >
              <MenuItem value="Aktif">Aktif</MenuItem>
              <MenuItem value="Pasif">Pasif</MenuItem>
            </Select>
            <TextField
              label="Email"
              value={newStore.email}
              onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Telefon"
              value={newStore.phoneNumber}
              onChange={(e) => setNewStore({ ...newStore, phoneNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="Şehir"
              value={newStore.city}
              onChange={(e) => setNewStore({ ...newStore, city: e.target.value })}
              fullWidth
            />
            <TextField
              label="İlçe"
              value={newStore.district}
              onChange={(e) => setNewStore({ ...newStore, district: e.target.value })}
              fullWidth
            />
            <TextField
              label="Adres"
              value={newStore.address}
              onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>İptal</Button>
          <Button onClick={handleAddStore} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Düzenleme Modalı */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Mağazayı Düzenle</DialogTitle>
        <DialogContent>
          {editStore && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                label="Mağaza Adı"
                value={editStore.storeName}
                onChange={(e) =>
                  setEditStore({ ...editStore, storeName: e.target.value })
                }
                fullWidth
              />
              <Select
                value={editStore.isActive ? "Aktif" : "Pasif"}
                onChange={(e) =>
                  setEditStore({
                    ...editStore,
                    isActive: e.target.value === "Aktif",
                  })
                }
                fullWidth
              >
                <MenuItem value="Aktif">Aktif</MenuItem>
                <MenuItem value="Pasif">Pasif</MenuItem>
              </Select>
              <TextField
                label="Email"
                value={editStore.email}
                onChange={(e) =>
                  setEditStore({ ...editStore, email: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Telefon"
                value={editStore.phoneNumber}
                onChange={(e) =>
                  setEditStore({ ...editStore, phoneNumber: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Şehir"
                value={editStore.city}
                onChange={(e) =>
                  setEditStore({ ...editStore, city: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="İlçe"
                value={editStore.district}
                onChange={(e) =>
                  setEditStore({ ...editStore, district: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Adres"
                value={editStore.address}
                onChange={(e) =>
                  setEditStore({ ...editStore, address: e.target.value })
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
