import { useQuery } from '@tanstack/react-query';
import { filterProducts } from '~/api/product/api';
import type { QueryProducts } from '~/api/product/type';
import { QUERY_KEY } from '~/common/const/querykey';

export const queryFilterProducts = (query: QueryProducts = { engine: 'server_side' }) => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_ALL, query],
  queryFn: () => filterProducts(query),
});

export const useFilterProducts = (query: QueryProducts = {}) => {
  return useQuery(queryFilterProducts(query));
};
