import { useState, useEffect } from 'react';

export function useCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch (e) {
        setCart([]);
      }
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addToCart = (produk, jumlah = 1) => {
    const existing = cart.find(item => item.produk.id_produk === produk.id_produk);
    let newCart;
    if (existing) {
      newCart = cart.map(item =>
        item.produk.id_produk === produk.id_produk
          ? { ...item, jumlah: Math.min(item.jumlah + jumlah, produk.stok) }
          : item
      );
    } else {
      newCart = [...cart, { produk, jumlah: Math.min(jumlah, produk.stok) }];
    }
    saveCart(newCart);
  };

  const removeFromCart = (id_produk) => {
    const newCart = cart.filter(item => item.produk.id_produk !== id_produk);
    saveCart(newCart);
  };

  const updateQty = (id_produk, jumlah) => {
    const item = cart.find(i => i.produk.id_produk === id_produk);
    if (!item) return;
    const newQty = Math.max(1, Math.min(jumlah, item.produk.stok));
    const newCart = cart.map(i =>
      i.produk.id_produk === id_produk ? { ...i, jumlah: newQty } : i
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.produk.harga * item.jumlah, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.jumlah, 0);

  return { cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount };
}
