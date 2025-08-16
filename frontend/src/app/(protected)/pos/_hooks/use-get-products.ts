import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import type { IProduct } from '~/api/product/type';

import { QUERY_KEY } from '~/common/const/querykey';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '~/api/product/api';

export const queryProducts = (): UseQueryOptions<TAxiosResponse<IProduct[]>, TResponse, IProduct[] | undefined, QueryKey> => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_ALL],
  queryFn: () => getProducts(),
  select: (res) => res.data.data,
  staleTime: 5 * 60 * 1000,
});

export const useGetProducts = () => {
  return useQuery(queryProducts());
};
