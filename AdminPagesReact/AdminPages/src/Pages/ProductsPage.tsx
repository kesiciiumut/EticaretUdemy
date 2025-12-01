import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

interface Stock {
  id: number;
  productId: number;
  storeId: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  isActive: boolean;
  isFavorite?: boolean;
  description?: string;
  price?: string;
  imageUrl?: string;
  stocks?: Stock[];
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Edit popup state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    axios
      .get("https://localhost:44322/api/Product")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("API hatası:", error));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Silme işlemleri
  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedProductId === null) return;
    axios
      .delete(`https://localhost:44322/api/Product/${selectedProductId}`)
      .then(() => {
        setProducts(products.filter((p) => p.id !== selectedProductId));
        setDeleteDialogOpen(false);
        setSelectedProductId(null);
      })
      .catch((error) => {
        console.error("Silme hatası:", error);
        setDeleteDialogOpen(false);
        setSelectedProductId(null);
      });
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedProductId(null);
  };

  // Edit işlemleri
  const handleEditClick = async (product: Product) => {
    try {
      // Ürünün detayını ve stoklarını backend'den çek
      const response = await axios.get(`https://localhost:44322/api/Product/${product.id}`);
      // Eğer response.data bir dizi ise, ilk elemanı alın
      const productDetail = Array.isArray(response.data) ? response.data[0] : response.data;
      setEditProduct(productDetail);
      setEditDialogOpen(true);
    } catch (err) {
      alert("Ürün detayları alınamadı.");
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editProduct) return;
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  const handleEditSave = async () => {
    if (!editProduct) return;
    try {
      await axios.put(
        `https://localhost:44322/api/Product/${editProduct.id}`,
        editProduct
      );
      setProducts((prev) =>
        prev.map((p) => (p.id === editProduct.id ? editProduct : p))
      );
      setEditDialogOpen(false);
      setEditProduct(null);
    } catch (error) {
      alert("Güncelleme başarısız!");
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditProduct(null);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Ürünler</Typography>
      </Box>

      <TextField
        label="Ürün Ara"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kategori</TableCell>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Ürün Açıklaması</TableCell>
              <TableCell align="center">Aksiyonlar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price} ₺</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEditClick(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Ürün bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Silme Onay Diyaloğu */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Ürünü Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu ürünü silmek istediğinize emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Hayır
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Evet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Popup */}
      <Dialog open={editDialogOpen} onClose={handleEditCancel}>
        <DialogTitle>Ürünü Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Ürün Adı"
            name="name"
            fullWidth
            value={editProduct?.name || ""}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Kategori"
            name="category"
            fullWidth
            value={editProduct?.category || ""}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Fiyat"
            name="price"
            fullWidth
            value={editProduct?.price || ""}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Açıklama"
            name="description"
            fullWidth
            value={editProduct?.description || ""}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>İptal</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Güncelle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage;
