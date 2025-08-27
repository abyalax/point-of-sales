import { useCallback, useContext, useSyncExternalStore } from 'react';
import { CartContext } from '~/components/context/cart';
import type { CartStore } from '~/stores/cart-store';

export const useCartStore = <T>(selector: (state: CartStore) => T) => {
  const store = useContext(CartContext);
  if (!store) throw new Error('useCart must be used within CartProvider');
  const memoizedSelector = useCallback(selector, [selector]);
  const subscribe = useCallback((callback: () => void) => store.subscribe(callback), [store]);
  const getSnapshot = useCallback(() => memoizedSelector(store), [memoizedSelector, store]);
  return useSyncExternalStore(subscribe, getSnapshot);
};
