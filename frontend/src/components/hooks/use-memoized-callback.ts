import { useCallback, type DependencyList } from 'react';
import { useDebouncedCallback } from './use-debounce-callback';

export function useMemoizedCallback(callback: (value: string) => void, deps: DependencyList, delay: number) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, deps);
  return useDebouncedCallback(memoizedCallback, delay);
}
