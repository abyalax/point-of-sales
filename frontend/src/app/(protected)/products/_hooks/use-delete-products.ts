import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

import type { UseMutationResult } from '@tanstack/react-query';

import { MUTATION_KEY } from '~/common/const/mutationkey';
import { deleteProduct } from '~/api/product/api';
import { QUERY_KEY } from '~/common/const/querykey';

import type { TAxiosResponse } from '~/common/types/response';

export const useDeleteProduct = (): UseMutationResult<TAxiosResponse<boolean>, unknown, { id: string }, unknown> => {
  return useMutation({
    mutationKey: [MUTATION_KEY.PRODUCT.DELETE],
    mutationFn: async (payload) => await deleteProduct(payload),
    meta: { invalidateQueries: [QUERY_KEY.PRODUCT.GET_ALL] },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Successfully deleted product',
      });
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Failed to delete product',
        message: (error as Error).message,
      });
    },
  });
};
