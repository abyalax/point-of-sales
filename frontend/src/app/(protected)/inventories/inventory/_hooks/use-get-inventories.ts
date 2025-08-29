import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import type { Inventory } from '~/modules/inventories/inventory/inventories.schema';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { getInventories } from '~/modules/inventories/inventory/inventories.api';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';

type Result = UseQueryOptions<TAxiosResponse<Inventory[]>, TResponse, Inventory[] | undefined, QueryKey[]>;

export const queryGetInventories = (): Result => ({
  queryKey: [QUERY_KEY.INVENTORIES.GET_ALL],
  queryFn: () => getInventories(),
  select: (res) => res.data.data,
});

export const useGetInventories = () => {
  return useQuery(queryGetInventories());
};
