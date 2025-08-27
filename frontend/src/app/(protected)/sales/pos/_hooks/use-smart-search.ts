import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Product } from '~/modules/product/product.schema';
import { querySearchProducts } from './use-search-products';
import Fuse from 'fuse.js';

export const useSmartSearch = (query: { search: string }, cachedProducts: Product[] = []) => {
  // 1. Fuzzy search di cached data (instant)
  const fuzzyResults = useMemo(() => {
    if (!query.search || query.search.length < 2) return [];

    const fuse = new Fuse(cachedProducts, {
      keys: ['name', 'barcode', 'category', 'description'],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    });

    return fuse
      .search(query.search)
      .slice(0, 8)
      .map((result) => ({
        ...result.item,
        _isFromCache: true,
        _score: result.score,
      }));
  }, [query.search, cachedProducts]);

  // 2. Server search (fallback/complement)
  const serverSearchQuery = useQuery({
    ...querySearchProducts(query),
    enabled: !!query.search && query.search.length >= 2 && fuzzyResults.length < 3,
  });

  // 3. Combine results
  const combinedResults = useMemo(() => {
    const serverResults = serverSearchQuery.data || [];

    if (fuzzyResults.length >= 5) return fuzzyResults;

    const combined = [...fuzzyResults, ...serverResults];
    const deduped = combined.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

    return deduped.slice(0, 10);
  }, [fuzzyResults, serverSearchQuery.data]);

  return {
    data: combinedResults,
    isLoading: serverSearchQuery.isLoading && fuzzyResults.length === 0,
    isFetching: serverSearchQuery.isFetching,
    error: serverSearchQuery.error,
    fuzzyCount: fuzzyResults.length,
    serverCount: serverSearchQuery.data?.length || 0,
    source: fuzzyResults.length > 0 ? 'hybrid' : 'server',
  };
};
