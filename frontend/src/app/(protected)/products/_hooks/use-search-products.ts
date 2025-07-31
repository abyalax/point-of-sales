import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '~/api/product/api';
import type { QueryProducts } from '~/api/product/type';
import { QUERY_KEY } from '~/common/const/querykey';

export const querySearchProducts = (query: QueryProducts = { engine: 'server_side' }) => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_ALL, query],
  queryFn: () => searchProducts(query),
});

export const useSearchProducts = (query: QueryProducts = {}) => {
  return useQuery(querySearchProducts(query));
};
