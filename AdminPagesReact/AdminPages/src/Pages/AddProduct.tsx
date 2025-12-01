import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
  Select,
  Paper,
  Stack,
} from "@mui/material";

const categories = ["Banyo", "Mutfak", "Dekorasyon"];
const STORE_API = "https://localhost:44322/api/store";

interface Store {
  id: number;
  storeName: string;
}

export default function ProductAddForm() {
  const [stores, setStores] = useState<Store[]>([]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: {} as Record<number, number>,
    images: [] as File[],
  });

  useEffect(() => {
    fetch(STORE_API)
      .then((res) => res.json())
      .then((data) => setStores(data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (storeId: number, value: number) => {
    setProduct((prev) => ({
      ...prev,
      stock: {
        ...prev.stock,
        [storeId]: Number(value),
      },
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setProduct((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("price", product.price.toString());
    formData.append("stockJson", JSON.stringify(product.stock));
    product.images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const response = await fetch("https://localhost:44322/api/Product", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Bir hata oluştu.");
      alert("Ürün başarıyla kaydedildi!");
    } catch (err) {
      console.error(err);
      alert("Ürün eklenemedi.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Ürün Ekle
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Ürün Adı"
              name="name"
              fullWidth
              value={product.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>Kategori</InputLabel>
            <Select
              name="category"
              fullWidth
              value={product.category}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Açıklama"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={product.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Satış Fiyatı"
              name="price"
              type="number"
              fullWidth
              value={product.price}
              onChange={handleChange}
            />
          </Grid>

          {/* Görsel Yükleme */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Ürün Görselleri</Typography>
            <Button variant="outlined" component="label">
              Görsel Yükle
              <input
                hidden
                multiple
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
            </Button>
            <Box mt={2}>
              <Stack spacing={1}>
                {product.images.map((img, i) => (
                  <Typography key={i}>{img.name}</Typography>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Mağaza Bazlı Stok */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Mağaza Bazlı Stok</Typography>
            <Grid container spacing={2}>
              {stores.map((store) => (
                <Grid item xs={12} sm={4} key={store.id}>
                  <TextField
                    label={store.storeName}
                    type="number"
                    fullWidth
                    value={product.stock[store.id] || ""}
                    onChange={(e) =>
                      handleStockChange(store.id, Number(e.target.value))
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>
              Ürünü Kaydet
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
