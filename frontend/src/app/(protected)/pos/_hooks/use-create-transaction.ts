import { useMutation } from '@tanstack/react-query';

import type { UseMutationResult } from '@tanstack/react-query';

import { MUTATION_KEY } from '~/common/const/mutationkey';
import { QUERY_KEY } from '~/common/const/querykey';

import { createTransaction } from '~/api/transaction/api';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import type { ITransactionState } from '~/api/transaction/type';
import type { ICartState } from '../_types';

type Result = UseMutationResult<TAxiosResponse<ITransactionState>, TResponse, ICartState, unknown>;

export const useCreateTransaction = ({ onError, onSuccess }: { onSuccess: VoidFunction; onError: (err: never) => void }): Result => {
  return useMutation({
    mutationKey: [MUTATION_KEY.TRANSACTION.CREATE],
    mutationFn: async (payload) => await createTransaction(payload),
    meta: { invalidateQueries: [QUERY_KEY.TRANSACTION.GET_ALL] },
    onSuccess,
    onError,
  });
};
