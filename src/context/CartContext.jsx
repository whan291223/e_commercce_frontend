//manages the items in the cart, calculates totals, and handles adding/removing items.
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Automatically open sidebar when item is added
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const clearCart = () => {
    setCartItems([]);
    setIsCartOpen(false);
  };

  useEffect(() => {
  const token = sessionStorage.getItem("jwt_token");
  if (!token) {
    setCartItems([]); // Wipe cart if token disappears
  }
}, []);
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, isCartOpen, toggleCart, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);