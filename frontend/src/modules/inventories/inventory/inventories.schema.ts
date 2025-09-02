import z from 'zod';
import { basePaginationSchema } from '~/common/schema';

export enum EInventoryStockType {
  ORDER = 'Order',
  PRE_ORDER = 'Pre Order',
  SALES = 'Sales',
  CANCEL = 'Cancel',
}

export enum EStatusDelivery {
  PENDING = 'Pending',
  DELIVERED = 'Delivered',
  DROPPED = 'Dropped',
  COMPLETED = 'Completed',
  CANCEL = 'Cancel',
}

export enum EStatusPayment {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
}

export enum EInventoryLogType {
  ORDER = 'Order', // purchase from supplier
  PRE_ORDER = 'Pre Order',
  SALES = 'Sales', // POS sale
  CANCEL = 'Cancel', // sale or PO cancelled
  ADJUSTMENT = 'Adjustment', // manual admin correction
}

export interface PayloadInventory {
  id: number;
  product_id?: number;
  stock?: number;
  min_stock?: number;
  max_stock?: number;
  supplier_id?: number;
}

export const InventorySchema = z.object({
  id: z.number(),
  stock: z.number(),
  min_stock: z.number(),
  max_stock: z.number(),
  supplier_name: z.string(),
  product_id: z.number(),
  product_name: z.string(),
  product_barcode: z.string(),
  product_status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Inventories = z.infer<typeof InventorySchema>;
export type InventoriesKeys = keyof Partial<Inventories>;

const inventoriesKeys = [
  'product_id',
  'product_name',
  'product_barcode',
  'product_status',
  'supplier_name',
  'max_stock',
  'min_stock',
  'stock',
  'created_at',
] as const satisfies InventoriesKeys[];

export const queryInventorySchema = z.intersection(
  basePaginationSchema(inventoriesKeys),
  z
    .object({
      stock: z.number().optional(),
      min_stock: z.number().optional(),
      max_stock: z.number().optional(),
      supplier_name: z.string().optional(),
      product_name: z.string().optional(),
      product_barcode: z.string().optional(),
      product_status: z.string().optional(),
      created_at: z.string().optional(),
      updated_at: z.string().optional(),
    })
    .catchall(z.any()),
);

export type QueryInventory = z.infer<typeof queryInventorySchema>;
