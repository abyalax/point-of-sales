import React, { useRef } from 'react';
import { CashierStore } from '~/stores/cashier-store';
import { CartContext } from './context-cashier';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeRef = useRef(new CashierStore());
  return <CartContext.Provider value={storeRef.current}>{children}</CartContext.Provider>;
};
