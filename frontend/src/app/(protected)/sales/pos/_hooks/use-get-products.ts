import type { UseQueryOptions } from '@tanstack/react-query';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import type { Product } from '~/modules/product/product.schema';

import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '~/modules/product/product.api';

export const queryProducts = (): UseQueryOptions<TAxiosResponse<Product[]>, TResponse, Product[] | undefined, QueryKey[]> => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_ALL],
  queryFn: () => getProducts(),
  select: (res) => res.data.data,
  staleTime: 5 * 60 * 1000,
});

export const useGetProducts = () => {
  return useQuery(queryProducts());
};
