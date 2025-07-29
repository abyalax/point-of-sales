import type { MetaRequest } from '~/common/types/meta';

export enum EProductStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum ESortBy {
  NAME = 'name',
  PRICE = 'price',
  STATUS = 'status',
  CATEGORY = 'category',
  STOCK = 'stock',
}

interface IFilter {
  price?: number;
  status?: EProductStatus;
  category?: string;
  stock?: number;
}

export interface IProduct {
  id: string;
  name: string;
  price: string;
  status: EProductStatus;
  category: ICategory;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  id: string;
  name: string;
  products?: IProduct[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQueryProducts extends MetaRequest<IProduct>, IFilter {}
