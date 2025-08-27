import { useCallback, useContext, useRef } from 'react';
import { useSyncExternalStore } from 'react';
import { shallow } from 'zustand/shallow';
import { CartContext } from '~/components/context/cart';
import type { CartState } from '../_types';

export const useCartState = <T>(selector: (state: CartState) => T): T => {
  const store = useContext(CartContext);
  if (!store) throw new Error('useCartState must be used within CartProvider');

  const lastValue = useRef<T>(selector(store._stateCart));

  const getSnapshot = useCallback(() => {
    const nextValue = selector(store._stateCart);
    if (shallow(lastValue.current, nextValue)) return lastValue.current;
    lastValue.current = nextValue;
    return nextValue;
  }, [store, selector]);

  return useSyncExternalStore(store.subscribe.bind(store), getSnapshot, getSnapshot);
};
