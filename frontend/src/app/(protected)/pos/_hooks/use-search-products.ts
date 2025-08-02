import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '~/api/product/api';
import { QUERY_KEY } from '~/common/const/querykey';

export const querySearchProducts = (query: { search: string }) => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_SEARCH, query],
  queryFn: () => searchProducts(query),
  staleTime: 30 * 1000,
  cacheTime: 5 * 60 * 1000,
});

export const useSearchProducts = (query: { search: string }) => {
  return useQuery(querySearchProducts(query));
};
