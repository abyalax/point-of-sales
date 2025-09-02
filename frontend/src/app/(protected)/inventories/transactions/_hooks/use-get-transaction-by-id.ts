import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import { getTransactionByID } from '~/modules/transaction/transaction.api';
import type { Transaction } from '~/modules/transaction/transaction.schema';

type Result = UseQueryOptions<TAxiosResponse<Transaction>, TResponse, Transaction | undefined, QueryKey<{ id: string }>[]>;

export const queryGetTransaction = (query: { id: string }): Result => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_ALL, query],
  queryFn: () => getTransactionByID(query),
  select: (s) => s.data.data,
});

export const useGetTransaction = (query: { id: string }) => {
  return useQuery(queryGetTransaction(query));
};
