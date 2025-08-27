import { useQuery, type UndefinedInitialDataOptions } from '@tanstack/react-query';
import { getProductByID } from '~/modules/product/product.api';
import type { Product } from '~/modules/product/product.schema';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import type { TAxiosResponse } from '~/common/types/response';

type Options = UndefinedInitialDataOptions<TAxiosResponse<Product>, Error, Product | undefined, QueryKey<{ id: string }>[]>;

export const queryProductByID = (query: { id: string }): Options => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_ALL, query],
  queryFn: () => getProductByID(query),
  select: (s) => s.data.data,
});

export const useGetProduct = (query: { id: string }) => {
  return useQuery(queryProductByID(query));
};
