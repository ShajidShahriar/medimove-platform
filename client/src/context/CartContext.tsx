import  { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
// 1. Define the "Shape" of a Cart Item
export interface CartItem {
  id: string; 
  name: string;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void; 
  toggleCart: () => void;
  isCartOpen: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: CartItem) => {
    setItems((prev) => {
      if (prev.find(item => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
    setIsCartOpen(true);
  };

  // Updated to filter by string ID
  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));


  };

  const clearCart = () => {
    setItems([]); 
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    // 3. PASS IT HERE
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, toggleCart, isCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}
  

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}