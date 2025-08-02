import { useEffect } from 'react';
import { useProductCache } from './use-product-cache';
import { useSmartSearch } from './use-smart-search';

export const usePOSSearch = (searchQuery: string) => {
  const { cachedProducts, expandCache } = useProductCache();
  const searchResults = useSmartSearch({ search: searchQuery }, cachedProducts);

  useEffect(() => {
    if (searchResults.fuzzyCount < 2 && searchQuery.length >= 2) expandCache();
  }, [searchResults.fuzzyCount, searchQuery, expandCache]);

  return {
    ...searchResults,
    cacheStatus: {
      size: cachedProducts.length,
      isBuilding: cachedProducts.length < 100,
    },
  };
};
