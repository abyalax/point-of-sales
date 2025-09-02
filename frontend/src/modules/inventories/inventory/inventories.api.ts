import { api } from '~/lib/axios/api';
import type { Inventories, PayloadInventory, QueryInventory } from './inventories.schema';
import type { TAxiosResponse } from '~/common/types/response';
import type { Paginated } from '~/common/types/meta';

export const getInventories = async (params: QueryInventory): Promise<TAxiosResponse<Paginated<Inventories>>> => {
  return api.get('/inventories', { params });
};

export const updateInventory = async (payload: PayloadInventory): Promise<TAxiosResponse<Inventories>> => {
  return await api.patch(`/inventories/${payload.id}`, payload);
};

export const deleteInventory = async (params: { id: string }): Promise<TAxiosResponse<boolean>> => {
  return await api.delete(`/inventories/${params.id}`);
};

export const createInventory = (payload: PayloadInventory): Promise<TAxiosResponse<Inventories>> => {
  return api.post('/inventories', payload);
};
