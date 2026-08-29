import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [sessionId, setSessionId] = useState(localStorage.getItem('krishna_session_id') || '');
  const [loading, setLoading] = useState(true);

  const fetchCart = async (sid) => {
    if (!sid) return;
    try {
      const res = await fetch('/api/cart', {
        headers: { 'x-session-id': sid }
      });
      const data = await res.json();
      if (data.success && data.cart) {
        setCartItems(data.cart.items || []);
        setSubtotal(data.cart.subtotal || 0);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    const initSession = async () => {
      let sid = localStorage.getItem('krishna_session_id');
      if (!sid) {
        try {
          const res = await fetch('/api/cart/session');
          const data = await res.json();
          if (data.success) {
            sid = data.sessionId;
            localStorage.setItem('krishna_session_id', sid);
            setSessionId(sid);
          }
        } catch (err) {
          console.error('Error creating session:', err);
        }
      }
      await fetchCart(sid);
      setLoading(false);
    };

    initSession();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    if (!sessionId) return { success: false, message: 'Session not initialized' };
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({ productId, quantity })
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.cart.items);
        setSubtotal(data.cart.subtotal);
      }
      return data;
    } catch (err) {
      console.error('Error adding to cart:', err);
      return { success: false, message: 'Server error' };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!sessionId) return;
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    try {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({ productId, quantity })
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.cart.items);
        setSubtotal(data.cart.subtotal);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'x-session-id': sessionId
        }
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.cart.items);
        setSubtotal(data.cart.subtotal);
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const clearCartState = () => {
    setCartItems([]);
    setSubtotal(0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      subtotal,
      sessionId,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCartState
    }}>
      {children}
    </CartContext.Provider>
  );
};
