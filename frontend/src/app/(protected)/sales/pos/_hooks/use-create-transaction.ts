import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import type { TransactionState } from '~/modules/transaction/transaction.schema';
import { createTransaction } from '~/modules/transaction/transaction.api';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { MUTATION_KEY } from '~/common/const/mutationkey';
import { QUERY_KEY } from '~/common/const/querykey';
import type { CartState } from '../_types';

type Result = UseMutationResult<TAxiosResponse<TransactionState>, TResponse, CartState, unknown>;

export const useCreateTransaction = ({
  onError,
  onSuccess,
}: {
  onSuccess: (data: TAxiosResponse<TransactionState>) => void;
  onError: (err: never) => void;
}): Result => {
  return useMutation({
    mutationKey: [MUTATION_KEY.TRANSACTION.CREATE],
    mutationFn: async (payload) => await createTransaction(payload),
    meta: { invalidateQueries: [QUERY_KEY.TRANSACTION.GET_ALL] },
    onSuccess,
    onError,
  });
};
