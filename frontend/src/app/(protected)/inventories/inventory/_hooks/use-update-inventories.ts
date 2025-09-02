import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

import type { Inventories, PayloadInventory } from '~/modules/inventories/inventory/inventories.schema';
import { updateInventory } from '~/modules/inventories/inventory/inventories.api';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { MUTATION_KEY } from '~/common/const/mutationkey';
import { QUERY_KEY } from '~/common/const/querykey';

export const useUpdateInventories = (): UseMutationResult<TAxiosResponse<Inventories>, TResponse, PayloadInventory, unknown> => {
  return useMutation({
    mutationKey: [MUTATION_KEY.INVENTORIES.INVENTORY.UPDATE],
    mutationFn: async (payload) => await updateInventory(payload),
    meta: { invalidateQueries: [QUERY_KEY.INVENTORIES.GET_ALL] },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Successfully update Inventories',
      });
    },
    onError: (error) => {
      console.log('useUpdateINventories error : ', error);
      notifications.show({
        color: 'red',
        title: 'Failed to update inventories',
        message: error.message,
      });
    },
  });
};
