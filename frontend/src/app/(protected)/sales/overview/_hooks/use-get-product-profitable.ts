import { getReportProductProfitable } from '~/modules/transaction/transaction.api';
import type { ProductProfitable } from '~/modules/product/product.schema';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import type { FilterPeriode } from '~/common/types/filter';

type Result = UseQueryOptions<TAxiosResponse<ProductProfitable[]>, TResponse, ProductProfitable[] | undefined, QueryKey<FilterPeriode>[]>;

export const queryGetProductProfitable = (query: FilterPeriode): Result => ({
  queryKey: [QUERY_KEY.SALES.PER_MONTH, query],
  queryFn: () => getReportProductProfitable(query),
  select: (s) => s.data.data,
});

export const useGetProductProfitable = (query: FilterPeriode) => {
  return useQuery(queryGetProductProfitable(query));
};
