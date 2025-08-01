import { createContext } from 'react';
import type { CartStore } from '~/stores/cashier-store';

export const CartContext = createContext<CartStore | null>(null);
