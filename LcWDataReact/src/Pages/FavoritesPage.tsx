// FavoritesPage.tsx
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ProductItem from "../Pages/Catalog/ProductItem";
import type { Product } from "../../Model/IProduct";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);

  const fetchFavorites = async () => {
    const customerId = localStorage.getItem("userId");
    if (!customerId) return;
    const res = await fetch(`https://localhost:44322/api/Favorite/list?customerId=${customerId}`);
    const data = await res.json();
    setFavorites(data);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (favoriteId: number) => {
    await fetch(`https://localhost:44322/api/Favorite/remove?favoriteId=${favoriteId}`, {
      method: "DELETE",
    });
    fetchFavorites();
  };

  return (
    <Grid container spacing={2}>
      {favorites.map((fav) => (
        <Grid item xs={12} sm={6} md={4} key={fav.id}>
          <ProductItem
            product={fav.product}
            isFavorite={true}
            onFavoriteToggle={() => handleRemoveFavorite(fav.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
