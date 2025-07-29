import { api } from '~/lib/axios/api';

import type { QueryProducts, IProduct, ICategory, TPayloadProduct } from './type';
import type { TAxiosResponse } from '~/common/types/response';
import type { MetaResponse } from '~/common/types/meta';

export const getProducts = async (params: QueryProducts): Promise<TAxiosResponse<{ data: IProduct[]; meta: MetaResponse }>> => {
  console.log(params);
  return api.get('/products', { params });
};

export const getProductCategories = async (): Promise<TAxiosResponse<ICategory[]>> => {
  return api.get('/products/categories');
};

export const getProductByID = (params: { id: string }): Promise<TAxiosResponse<IProduct>> => {
  return api.get(`/products/${params.id}`);
};

export const updateProduct = (params: TPayloadProduct): Promise<TAxiosResponse<IProduct>> => {
  return api.patch(`/products/${params.id}`, params);
};

export const deleteProduct = (params: { id: string }): Promise<TAxiosResponse<boolean>> => {
  return api.delete(`/products/${params.id}`);
};

export const createProduct = (params: TPayloadProduct): Promise<TAxiosResponse<IProduct>> => {
  return api.post('/products', params);
};

export const createCategory = (params: { name: string }): Promise<TAxiosResponse<{ category: ICategory }>> => {
  return api.post('/products/categories', params);
};
