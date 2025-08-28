import z from 'zod';
import { basePaginationSchema } from '~/common/schema';
import type { MetaRequest, MetaResponse } from '~/common/types/meta';

export enum EProductStatus {
  AVAILABLE = 'Available',
  UNAVAILABLE = 'UnAvailable',
}

export type TPayloadProduct = Omit<Product, 'id' | 'category'> & { category: string; id?: number };

export interface Product {
  id: number;
  name: string;
  barcode: string;
  price: string;
  cost_price: string;
  tax_rate: string;
  discount: string;
  status: EProductStatus;
  category: ICategory;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface QueryProducts extends MetaRequest<Product> {
  min_price?: number;
  max_price?: number;
  status?: EProductStatus;
  category?: number;
}

export interface ICategory {
  id: number;
  name: string;
  products?: Product[];
  created_at?: string;
  updated_at?: string;
}

const productKeys = ['name', 'price', 'status', 'category', 'stock'] as const satisfies readonly [string, ...(keyof Partial<Product>)[]];

export const queryProductsSchema = z.intersection(
  basePaginationSchema(productKeys),
  z
    .object({
      min_price: z.number().min(0).optional(),
      max_price: z.number().optional(),
      status: z.enum([EProductStatus.AVAILABLE, EProductStatus.UNAVAILABLE]).optional(),
      category: z.number().optional(),
    })
    .catchall(z.any()),
);

export type QueryProductsSchema = z.infer<typeof queryProductsSchema>;

export type ProductPaginated = {
  data: Product[];
  meta: MetaResponse;
};

const filterPeriodeSchema = z
  .object({
    start: z.string().optional(),
    end: z.string().optional(),
    year: z.number().optional(),
    month: z.number().optional(),
    week: z.number().optional(),
  })
  .catchall(z.any());

export const queryReportProductsSchema = z.intersection(
  filterPeriodeSchema,
  z
    .object({
      status: z.enum([EProductStatus.AVAILABLE, EProductStatus.UNAVAILABLE]).optional(),
    })
    .catchall(z.any()),
);

export interface ProductFrequencySold {
  name: string;
  category: string;
  total_product: number;
}

export type ProductTrendPeriode = 'week' | 'month';

export const queryProductFrequencySold = z.intersection(
  filterPeriodeSchema,
  z.object({
    sort_order: z.enum(['ASC', 'DESC']).optional().default('DESC'),
  }),
);

export interface ProductTrending {
  name: string;
  periode: number;
  id: number;
  total_qty: number;
}

export interface ProductDiscountImpact {
  name: string;
  with_discount: string;
  without_discount: string;
}

export interface ProductProfitable {
  category: string;
  name: string;
  quantity: number;
  margin_percentage: string;
  revenue: string;
}
