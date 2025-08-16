import type { ICartState } from '~/app/(protected)/pos/_types';
import type { TAxiosResponse } from '~/common/types/response';
import type { ITransactionState } from './type';

import { api } from '~/lib/axios/api';

export const createTransaction = (params: ICartState): Promise<TAxiosResponse<ITransactionState>> => {
  return api.post('/transaction', params);
};
