import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

import { MUTATION_KEY } from '~/common/const/mutationkey';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { createCategory } from '~/api/product/api';
import { QUERY_KEY } from '~/common/const/querykey';
import type { ICategory } from '~/api/product/type';

export const useCreateCategory = (): UseMutationResult<TAxiosResponse<{ category: ICategory }>, TResponse, { name: string }, unknown> => {
  return useMutation({
    mutationKey: [MUTATION_KEY.PRODUCT.CREATE_CATEGORY],
    mutationFn: async (payload) => await createCategory(payload),
    meta: { invalidateQueries: [QUERY_KEY.PRODUCT.GET_CATEGORIES] },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Successfully create new categories',
      });
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Failed to create category',
        message: error.message,
      });
    },
  });
};
