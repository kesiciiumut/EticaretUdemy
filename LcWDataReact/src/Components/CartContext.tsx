import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: any; // Ürün detayları için
}

interface CartContextType {
  items: CartItem[];
  fetchCart: (customerId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const fetchCart = async (customerId: string) => {
    const res = await fetch(`https://localhost:44322/api/Cart/${customerId}`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.items || []);
    }
  };

  // Otomatik olarak giriş yapan kullanıcı için sepeti yükle
  useEffect(() => {
    const customerId = localStorage.getItem("userId");
    if (customerId) fetchCart(customerId);
  }, []);

  return (
    <CartContext.Provider value={{ items, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}
