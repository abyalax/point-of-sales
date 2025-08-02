import { createContext } from 'react';
import type { CartStore } from '~/stores/cart-store';

export const CartContext = createContext<CartStore | null>(null);
