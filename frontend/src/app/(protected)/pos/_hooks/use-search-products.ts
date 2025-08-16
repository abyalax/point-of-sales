import type { UseQueryOptions, QueryKey } from '@tanstack/react-query';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import type { IProduct } from '~/api/product/type';

import { QUERY_KEY } from '~/common/const/querykey';
import { searchProducts } from '~/api/product/api';
import { useQuery } from '@tanstack/react-query';

export const querySearchProducts = (query: {
  search: string;
}): UseQueryOptions<TAxiosResponse<IProduct[]>, TResponse, IProduct[] | undefined, QueryKey> => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_SEARCH, query.search],
  queryFn: () => searchProducts(query),
  select: (res) => res.data.data,
  staleTime: 5 * 1000,
});

export const useSearchProducts = (query: { search: string }) => {
  return useQuery(querySearchProducts(query));
};
