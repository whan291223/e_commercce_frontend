import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart_items");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const token = sessionStorage.getItem("jwt_token");
    if (!token) {
      setCartItems([]);
      localStorage.removeItem("cart_items");
    }
  }, []);

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.variantId === product.variantId);
      if (exists) {
        return prev.map((item) =>
          item.variantId === product.variantId
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    // Use setTimeout to decouple cart open from state update
    setTimeout(() => setIsCartOpen(true), 0);
  }, []);

  const removeFromCart = useCallback((variantId) => {
    setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
  }, []);

  const decreaseQuantity = useCallback((variantId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const increaseQuantity = useCallback((variantId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setIsCartOpen(false);
  }, []);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      decreaseQuantity,
      increaseQuantity,
      isCartOpen,
      toggleCart,
      cartTotal,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);