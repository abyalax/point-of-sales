import z from 'zod';
import type { MetaRequest } from '~/common/types/meta';

export enum EProductStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export type TPayloadProduct = Omit<IProduct, 'id' | 'category'> & { category: string; id?: string };

export interface IProduct {
  id: string;
  name: string;
  price: string;
  status: EProductStatus;
  category: ICategory;
  stock: number;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface QueryProducts extends MetaRequest<IProduct> {
  min_price?: number;
  max_price?: number;
  status?: EProductStatus;
  category?: number;
}

export interface ICategory {
  id: string;
  name: string;
  products?: IProduct[];
  created_at?: Date;
  updated_at?: Date;
}

const productKeys = ['name', 'price', 'status', 'category', 'stock'] as const satisfies readonly (keyof IProduct)[];

export const queryProductsSchema = z
  .object({
    /**Pagination */
    page: z.coerce.number().min(1).optional().default(1),
    per_page: z.coerce.number().min(1).max(100).optional().default(10),
    /**Sorting */
    sort_by: z.enum(productKeys).optional(),
    order_by: z.enum(['ASC', 'DESC']).optional(),
    /**Global Filter */
    search: z.string().optional(),
    /**Config */
    engine: z.enum(['server_side', 'client_side']).default('server_side').optional(),
    /**Entity Base */
    min_price: z.number().min(0).optional(),
    max_price: z.number().optional(),
    status: z.enum([EProductStatus.AVAILABLE, EProductStatus.UNAVAILABLE]).optional(),
    category: z.number().optional(),
  })
  .catchall(z.any());

export type QueryProductSchema = z.infer<typeof queryProductsSchema>;
