import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import { getReportSalesByCategory } from '~/modules/transaction/transaction.api';
import type { SalesByCategory } from '~/modules/transaction/transaction.schema';

type Result = UseQueryOptions<TAxiosResponse<SalesByCategory[]>, TResponse, SalesByCategory[] | undefined, QueryKey<string>[]>;

export const queryGetSalesByCategory = (year: string): Result => ({
  queryKey: [QUERY_KEY.SALES.BY_CATEGORY, year],
  queryFn: () => getReportSalesByCategory(year),
  select: (s) => s.data.data,
});

export const useGetSalesByCategory = (year: string) => {
  return useQuery(queryGetSalesByCategory(year));
};
