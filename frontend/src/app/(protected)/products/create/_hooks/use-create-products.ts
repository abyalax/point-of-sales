import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

import { MUTATION_KEY } from '~/common/const/mutationkey';
import type { TAxiosResponse } from '~/common/types/response';
import type { IProduct, TProductCreate } from '~/api/product/type';
import { createProduct } from '~/api/product/api';
import { QUERY_KEY } from '~/common/const/querykey';

export const useCreateProduct = (): UseMutationResult<TAxiosResponse<IProduct>, unknown, TProductCreate, unknown> => {
  return useMutation({
    mutationKey: [MUTATION_KEY.PRODUCT.CREATE],
    mutationFn: async payload => await createProduct(payload),
    meta: { invalidateQueries: [QUERY_KEY.PRODUCT.GET_ALL] },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Successfully created product',
      });
    },
    onError: error => {
      notifications.show({
        color: 'red',
        title: 'Failed to create product',
        message: (error as Error).message,
      });
    },
  });
};
