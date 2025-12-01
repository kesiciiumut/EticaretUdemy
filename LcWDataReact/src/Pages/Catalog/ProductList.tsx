import {
  Box,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
  Collapse,
  FormGroup,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProductItem from "./ProductItem";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  code: string;
  description: string;
  category: string;
  imageUrl: string;
  isActive: boolean;
  isFavorite: boolean;
  price: string;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [catsOpen, setCatsOpen] = useState(true);
  const [view, setView] = useState<"grid" | "dense">("grid");

  const { category } = useParams();

  // Ürünleri backend'den al (DEĞİŞMEDİ)
  useEffect(() => {
    axios
      .get("https://localhost:44322/api/product")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Kategoriler
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  // Kategori seç/çıkar
  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Filtrelenmiş ürünler
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) &&
          (selectedCategories.length === 0 ||
            selectedCategories.includes(p.category)) &&
          (category ? p.category?.toLowerCase() === category.toLowerCase() : true)
      ),
    [products, search, selectedCategories, category]
  );

  const productCount = filteredProducts.length;

  return (
    <Box sx={{ px: { xs: 1, md: 2 }, py: 2 }}>
      <Grid container columnSpacing={3} rowSpacing={3}>
        {/* SOL FİLTRE */}
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #eee" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Kelime Ara
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="medium"
                placeholder="Ara"
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
              <Button
                variant="contained"
                sx={{ bgcolor: "#4d4c4cff", color: "#fff", px: 2, height: 56 }}
              >
                Filtrele
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* İlgili Kategoriler (açılır/kapanır) */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                İlgili Kategoriler
              </Typography>
              <IconButton size="small" onClick={() => setCatsOpen((p) => !p)}>
                {catsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={catsOpen} unmountOnExit>
              <FormGroup sx={{ mt: 1 }}>
                {categories.map((cat) => (
                  <FormControlLabel
                    key={cat}
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                      />
                    }
                    label={cat}
                    sx={{ ".MuiFormControlLabel-label": { fontSize: 14 } }}
                  />
                ))}
              </FormGroup>
            </Collapse>
          </Paper>
        </Grid>

        {/* SAĞ — ÜRÜN LİSTESİ */}
        <Grid item xs={12} md={9}>
          {/* üst bar: yalnızca sayaç + görünüm seçici */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {productCount} ürün bulundu
            </Typography>

            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, v) => v && setView(v)}
              size="small"
            >
              <ToggleButton value="grid">
                <GridViewIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="dense">
                <ViewModuleIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Grid
            container
            spacing={view === "grid" ? 2 : 1}
            columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
          >
            {filteredProducts.map((p) => (
              <Grid
                key={p.id}
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                sx={{ px: view === "dense" ? 0.5 : 1 }}
              >
                <ProductItem product={p} />
              </Grid>
            ))}

            {filteredProducts.length === 0 && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    py: 8,
                    textAlign: "center",
                    border: "1px dashed #ddd",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Sonuç bulunamadı
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Farklı bir anahtar kelime deneyebilir veya filtreleri sıfırlayabilirsiniz.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
