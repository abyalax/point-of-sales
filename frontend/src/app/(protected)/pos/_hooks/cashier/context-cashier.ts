import { createContext } from 'react';
import type { CashierStore } from '~/stores/cashier-store';

export const CartContext = createContext<CashierStore | null>(null);
