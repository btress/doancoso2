import React, { createContext, useContext, useEffect, useState } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

export type CartProduct = {
  _id: string;
  name: string;
  price: number;
  image: string;
  storage?: string;
  color?: string;
  discount?: number;
  discountPrice?: number;
};

export type CartItem = {
  _id?: string;
  product: CartProduct;
  quantity: number;
  color?: string;
  storage?: string;
};

type CartContextValue = {
  items: CartItem[];
  loading: boolean;
  addOrUpdate: (payload: { productId: string; quantity: number; color?: string; storage?: string }) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setItems([]);
      return;
    }

    setLoading(true);
    cartApi.get(token)
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [token]);

  const addOrUpdate = async (payload: { productId: string; quantity: number; color?: string; storage?: string }) => {
    if (!token) return;
    const res = await cartApi.upsert(token, payload);
    setItems(res.data);
  };

  const remove = async (itemId: string) => {
    if (!token) return;
    const res = await cartApi.remove(token, itemId);
    setItems(res.data);
  };

  const clear = async () => {
    if (!token) {
      setItems([]);
      return;
    }
    try {
      await cartApi.clear(token);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, loading, addOrUpdate, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
};


