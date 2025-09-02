import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import type { Inventories, QueryInventory } from '~/modules/inventories/inventory/inventories.schema';
import { getInventories } from '~/modules/inventories/inventory/inventories.api';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import type { Paginated } from '~/common/types/meta';

type Result = UseQueryOptions<TAxiosResponse<Paginated<Inventories>>, TResponse, Paginated<Inventories> | undefined, QueryKey<QueryInventory>[]>;

export const queryGetInventories = (query: QueryInventory): Result => ({
  queryKey: [QUERY_KEY.INVENTORIES.GET_ALL, query],
  queryFn: () => getInventories(query),
  select: (res) => res.data.data,
});

export const useGetInventories = (query: QueryInventory) => {
  return useQuery(queryGetInventories(query));
};
