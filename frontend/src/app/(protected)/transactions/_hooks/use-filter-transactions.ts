import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { filterTransactions } from '~/modules/transaction/transaction.api';
import type { QueryTransaction, TransactionPaginated } from '~/modules/transaction/transaction.schema';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import type { TAxiosResponse, TResponse } from '~/common/types/response';

type Result = UseQueryOptions<TAxiosResponse<TransactionPaginated>, TResponse, TransactionPaginated | undefined, QueryKey<QueryTransaction>[]>;

export const queryFilterTransactions = (query: QueryTransaction = { engine: 'server_side' }): Result => ({
  queryKey: [QUERY_KEY.TRANSACTION.GET_ALL, query],
  queryFn: () => filterTransactions(query),
  select: (res) => res.data.data,
  staleTime: 5 * 60 * 1000,
});

export const useFilterTransactions = (query: QueryTransaction = {}) => {
  return useQuery(queryFilterTransactions(query));
};
