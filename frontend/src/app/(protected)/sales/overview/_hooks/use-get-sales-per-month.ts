import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import { getReportSalesPerMonth } from '~/modules/transaction/transaction.api';
import type { ReportSales } from '~/modules/transaction/transaction.schema';

type Result = UseQueryOptions<TAxiosResponse<ReportSales[]>, TResponse, ReportSales[] | undefined, QueryKey<string>[]>;

export const queryGetSalesPerMonth = (year: string): Result => ({
  queryKey: [QUERY_KEY.SALES.PER_MONTH, year],
  queryFn: () => getReportSalesPerMonth(year),
  select: (s) => s.data.data,
});

export const useGetSalesPerMonth = (year: string) => {
  return useQuery(queryGetSalesPerMonth(year));
};
