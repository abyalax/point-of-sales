import { useState, useMemo, useEffect, useCallback } from 'react';
import { useInfiniteProducts } from './use-infinite-products';
import type { Product } from '~/modules/product/product.schema';

export const useProductCache = () => {
  const [cacheSize, setCacheSize] = useState(100);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts({
    sort_by: 'updated_at',
    sort_order: 'DESC',
    per_page: 50,
  });

  const cachedProducts: Product[] = useMemo(() => {
    return (data?.pages?.flatMap((page) => page?.data?.filter((e) => e !== undefined)) as Product[]) ?? [];
  }, [data?.pages]);

  useEffect(() => {
    const loadMoreInBackground = () => {
      if (hasNextPage && !isFetchingNextPage && cachedProducts.length < cacheSize) fetchNextPage();
    };

    const timer = setTimeout(loadMoreInBackground, 1000);
    return () => clearTimeout(timer);
  }, [hasNextPage, isFetchingNextPage, cachedProducts.length, cacheSize, fetchNextPage]);

  const expandCache = useCallback(() => {
    setCacheSize((prev) => Math.min(prev + 100, 500));
  }, []);

  return {
    cachedProducts,
    cacheSize: cachedProducts.length,
    maxCacheSize: cacheSize,
    expandCache,
    isBuilding: isFetchingNextPage || (cachedProducts.length < cacheSize && hasNextPage),
  };
};
