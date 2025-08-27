import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import { getReportSalesByYear } from '~/modules/transaction/transaction.api';
import type { QueryReportSales, ReportSales } from '~/modules/transaction/transaction.schema';

type Result = UseQueryOptions<TAxiosResponse<ReportSales>, TResponse, ReportSales | undefined, QueryKey<QueryReportSales>[]>;

export const queryGetSalesByYear = (query: QueryReportSales): Result => ({
  queryKey: [QUERY_KEY.SALES.BY_YEAR, query],
  queryFn: () => getReportSalesByYear(query),
  select: (s) => s.data.data,
});

export const useGetSalesSummary = (query: QueryReportSales) => {
  console.log('queryGetSalesByYear: ', query);
  return useQuery(queryGetSalesByYear(query));
};
