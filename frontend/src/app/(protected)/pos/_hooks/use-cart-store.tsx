import { useContext, useSyncExternalStore } from 'react';
import { CartContext } from '~/components/context/cart';
import type { CartStore } from '~/stores/cashier-store';

export const useCartStore = <T,>(selector: (state: CartStore) => T) => {
  const store = useContext(CartContext);
  if (!store) throw new Error('useCart must be used within CartProvider');
  return useSyncExternalStore(store.subscribe.bind(store), () => selector(store));
};
