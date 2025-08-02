import { useRef } from 'react';
import { CartStore } from '~/stores/cart-store';
import { CartContext } from '../context/cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cartStore = new CartStore();
  const storeRef = useRef<CartStore>(cartStore);
  return <CartContext.Provider value={storeRef.current}>{children}</CartContext.Provider>;
};
