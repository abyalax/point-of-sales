import type { ProductFrequencySold } from '~/modules/product/product.schema';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import { getProductSold } from '~/modules/product/product.api';
import type { FilterPeriode } from '~/common/types/filter';

type Result = UseQueryOptions<TAxiosResponse<ProductFrequencySold[]>, TResponse, ProductFrequencySold[] | undefined, QueryKey<FilterPeriode>[]>;

export const queryGetProductSold = (params: FilterPeriode): Result => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_SOLD, params],
  queryFn: () => getProductSold(params),
  select: (s) => s.data.data,
});

export const useGetProductSold = (params: FilterPeriode) => {
  return useQuery(queryGetProductSold(params));
};
