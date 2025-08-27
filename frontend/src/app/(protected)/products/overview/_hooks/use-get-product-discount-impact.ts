import type { ProductDiscountImpact } from '~/modules/product/product.schema';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import { getProductDiscountImpact } from '~/modules/product/product.api';
import type { FilterPeriode } from '~/common/types/filter';

type Result = UseQueryOptions<TAxiosResponse<ProductDiscountImpact[]>, TResponse, ProductDiscountImpact[] | undefined, QueryKey<FilterPeriode>[]>;

export const queryGetProductDiscountImpact = (params: FilterPeriode): Result => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_DISCOUNT_IMPACT, params],
  queryFn: () => getProductDiscountImpact(params),
  select: (s) => s.data.data,
});

export const useGetProductDiscountImpact = (params: FilterPeriode) => {
  return useQuery(queryGetProductDiscountImpact(params));
};
