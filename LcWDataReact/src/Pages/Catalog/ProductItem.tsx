import { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import type { Product } from "../../Model/IProduct";
import { useCart } from "../../Components/CartContext";

interface Props {
  product: Product;
}

export default function ProductItem({ product }: Props) {
  const { fetchCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);

  useEffect(() => {
    const checkFavorite = async () => {
      const customerId = localStorage.getItem("userId");
      if (!customerId) return;
      const res = await fetch(
        `https://localhost:44322/api/Favorite/list?customerId=${customerId}`
      );
      const data = await res.json();
      const fav = data.find((f: any) => f.productId === product.id);
      if (fav) {
        setIsFavorite(true);
        setFavoriteId(fav.id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    };
    checkFavorite();
  }, [product.id]);

  const handleFavoriteToggle = async () => {
    const customerId = localStorage.getItem("userId");
    if (!customerId) {
      alert("Lütfen giriş yapınız.");
      return;
    }
    if (isFavorite && favoriteId) {
      await fetch(
        `https://localhost:44322/api/Favorite/remove?favoriteId=${favoriteId}`,
        { method: "DELETE" }
      );
      setIsFavorite(false);
      setFavoriteId(null);
    } else {
      await fetch(
        `https://localhost:44322/api/Favorite/add?customerId=${customerId}&productId=${product.id}`,
        { method: "POST" }
      );
      // FavoriId'yi tekrar almak için tekrar kontrol et
      const res = await fetch(
        `https://localhost:44322/api/Favorite/list?customerId=${customerId}`
      );
      const data = await res.json();
      const fav = data.find((f: any) => f.productId === product.id);
      if (fav) {
        setIsFavorite(true);
        setFavoriteId(fav.id);
      }
    }
  };

  const handleAddToCart = async () => {
    const customerId = localStorage.getItem("userId");
    if (!customerId) {
      alert("Lütfen giriş yapınız.");
      return;
    }
    const productId = product.id;
    const quantity = 1;
    const unitPrice = parseFloat(product.price ?? "0");

    await fetch("https://localhost:44322/api/Cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customerId: Number(customerId),
        productId,
        quantity,
        unitPrice
      })
    });
    await fetchCart(customerId);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 3,
        boxShadow: 3,
        position: "relative",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "white",
          zIndex: 2,
        }}
        onClick={handleFavoriteToggle}
      >
        {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </IconButton>

      <CardMedia
        component="img"
        image={
          product.imageUrl
            ? product.imageUrl.startsWith("http")
              ? product.imageUrl
              : `https://localhost:44322${product.imageUrl}`
            : "/images/default.jpg"
        }
        alt={product.name}
        sx={{
          height: 180,
          objectFit: "contain",
          p: 2,
          width: "100%",
        }}
      />

      <CardContent>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            mb: 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.category}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{
            mt: 1,
            fontWeight: 600,
          }}
        >
          {product.price}
        </Typography>
      </CardContent>

      <IconButton
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          backgroundColor: "#333",
          color: "white",
          zIndex: 2,
          "&:hover": {
            backgroundColor: "#555",
          },
        }}
        onClick={handleAddToCart}
      >
        <AddShoppingCartIcon />
      </IconButton>
    </Card>
  );
}
