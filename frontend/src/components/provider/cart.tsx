import { useRef } from 'react';
import { CartStore } from '~/stores/cashier-store';
import { CartContext } from '../context/cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeRef = useRef(new CartStore());

  return <CartContext.Provider value={storeRef.current}>{children}</CartContext.Provider>;
};
