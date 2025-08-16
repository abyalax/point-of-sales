import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query';
import { filterProducts } from '~/api/product/api';
import type { ProductPaginated, QueryProducts } from '~/api/product/type';
import { QUERY_KEY } from '~/common/const/querykey';
import type { TAxiosResponse, TResponse } from '~/common/types/response';

type Result = UseQueryOptions<TAxiosResponse<ProductPaginated>, TResponse, ProductPaginated | undefined, QueryKey>;

export const queryFilterProducts = (query: QueryProducts = { engine: 'server_side' }): Result => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_ALL, query],
  queryFn: () => filterProducts(query),
  select: (res) => res.data.data,
  staleTime: 5 * 60 * 1000,
});

export const useFilterProducts = (query: QueryProducts = {}) => {
  return useQuery(queryFilterProducts(query));
};
