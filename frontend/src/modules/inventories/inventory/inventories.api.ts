import { api } from '~/lib/axios/api';
import type { Inventory, PayloadInventory } from './inventories.schema';
import type { TAxiosResponse } from '~/common/types/response';

export const getInventories = async (): Promise<TAxiosResponse<Inventory[]>> => {
  return api.get('/inventories');
};

export const updateInventory = (payload: PayloadInventory): Promise<TAxiosResponse<Inventory>> => {
  return api.patch(`/inventories/${payload.id}`, payload);
};

export const deleteInventory = (params: { id: string }): Promise<TAxiosResponse<boolean>> => {
  return api.delete(`/inventories/${params.id}`);
};

export const createInventory = (payload: PayloadInventory): Promise<TAxiosResponse<Inventory>> => {
  return api.post('/inventories', payload);
};
