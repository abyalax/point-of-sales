import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

import { MUTATION_KEY } from '~/common/const/mutationkey';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import type { Product, TPayloadProduct } from '~/modules/product/product.schema';
import { updateProduct } from '~/modules/product/product.api';
import { QUERY_KEY } from '~/common/const/querykey';

export const useUpdateProduct = (): UseMutationResult<TAxiosResponse<Product>, TResponse, TPayloadProduct, unknown> => {
  return useMutation({
    mutationKey: [MUTATION_KEY.PRODUCT.UPDATE],
    mutationFn: async (payload) => await updateProduct(payload),
    meta: { invalidateQueries: [QUERY_KEY.PRODUCT.GET_ALL] },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Successfully created product',
      });
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Failed to create product',
        message: error.message,
      });
    },
  });
};
