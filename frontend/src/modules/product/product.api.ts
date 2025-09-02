import { api } from '~/lib/axios/api';

import type {
  QueryProducts,
  Product,
  ICategory,
  TPayloadProduct,
  ProductPaginated,
  ProductFrequencySold,
  ProductTrending,
  ProductTrendPeriode,
  ProductDiscountImpact,
} from './product.schema';
import type { TAxiosResponse } from '~/common/types/response';
import type { FilterPeriode } from '~/common/types/filter';

export const getProducts = async (): Promise<TAxiosResponse<Product[]>> => {
  return api.get('/products');
};

export const searchProducts = async (params: { search: string }): Promise<TAxiosResponse<Product[]>> => {
  return await api.get('/products/search/name', { params });
};

export const filterProducts = async (params: QueryProducts): Promise<TAxiosResponse<ProductPaginated>> => {
  return await api.get('/products', { params });
};

export const getProductCategories = async (): Promise<TAxiosResponse<ICategory[]>> => {
  return await api.get('/products/categories');
};

export const getProductByID = async (params: { id: string }): Promise<TAxiosResponse<Product>> => {
  return await api.get(`/products/${params.id}`);
};

export const getProductSold = async (params: FilterPeriode): Promise<TAxiosResponse<ProductFrequencySold[]>> => {
  return await api.get('/products/sold', { params });
};

export const getProductDiscountImpact = async (params: FilterPeriode): Promise<TAxiosResponse<ProductDiscountImpact[]>> => {
  return await api.get('/products/discount/impact', { params });
};

export const getProductTrendings = async (params: { type_periode: ProductTrendPeriode }): Promise<TAxiosResponse<ProductTrending[]>> => {
  return await api.get('/products/trending', { params });
};

export const updateProduct = async (payload: TPayloadProduct): Promise<TAxiosResponse<Product>> => {
  return await api.patch(`/products/${payload.id}`, payload);
};

export const deleteProduct = async (params: { id: string }): Promise<TAxiosResponse<boolean>> => {
  return await api.delete(`/products/${params.id}`);
};

export const createProduct = async (payload: TPayloadProduct): Promise<TAxiosResponse<Product>> => {
  return await api.post('/products', payload);
};

export const createCategory = async (payload: { name: string }): Promise<TAxiosResponse<{ category: ICategory }>> => {
  return await api.post('/products/categories', payload);
};
