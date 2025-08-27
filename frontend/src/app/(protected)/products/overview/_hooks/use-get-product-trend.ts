import type { TAxiosResponse, TResponse } from '~/common/types/response';
import type { ProductTrending, ProductTrendPeriode } from '~/modules/product/product.schema';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getProductTrendings } from '~/modules/product/product.api';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';

type Result = UseQueryOptions<
  TAxiosResponse<ProductTrending[]>,
  TResponse,
  ProductTrending[] | undefined,
  QueryKey<{ type_periode: ProductTrendPeriode }>[]
>;

export const queryGetProductTrend = (params: { type_periode: ProductTrendPeriode }): Result => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_TRENDING, params],
  queryFn: () => getProductTrendings(params),
  select: (s) => s.data.data,
});

export const useGetProductTrend = (params: { type_periode: ProductTrendPeriode }) => {
  return useQuery(queryGetProductTrend(params));
};
