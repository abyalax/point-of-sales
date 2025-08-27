import type { UseQueryOptions } from '@tanstack/react-query';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import type { Product } from '~/modules/product/product.schema';

import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import { searchProducts } from '~/modules/product/product.api';
import { useQuery } from '@tanstack/react-query';

type QuerySearchProducts = { search: string };
type Result = UseQueryOptions<TAxiosResponse<Product[]>, TResponse, Product[] | undefined, QueryKey<QuerySearchProducts>[]>;

export const querySearchProducts = (query: QuerySearchProducts): Result => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_SEARCH, query],
  queryFn: () => searchProducts(query),
  select: (res) => res.data.data,
  staleTime: 5 * 1000,
});

export const useSearchProducts = (query: QuerySearchProducts) => {
  return useQuery(querySearchProducts(query));
};
