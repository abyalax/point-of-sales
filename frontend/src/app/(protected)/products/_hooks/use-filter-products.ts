import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { filterProducts } from '~/modules/product/product.api';
import type { ProductPaginated, QueryProducts } from '~/modules/product/product.schema';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import type { TAxiosResponse, TResponse } from '~/common/types/response';

type Result = UseQueryOptions<TAxiosResponse<ProductPaginated>, TResponse, ProductPaginated | undefined, QueryKey<QueryProducts>[]>;

export const queryFilterProducts = (query: QueryProducts = { engine: 'server_side' }): Result => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_ALL, query],
  queryFn: () => filterProducts(query),
  select: (res) => res.data.data,
});

export const useFilterProducts = (query: QueryProducts = {}) => {
  return useQuery(queryFilterProducts(query));
};
