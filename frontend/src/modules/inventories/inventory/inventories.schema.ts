import type { Product } from '../../product/product.schema';

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

export interface Inventory {
  id: number;
  product_id: number;
  stock: number;
  min_stock: number;
  max_stock: number;
  product: Product;
  supplier_id?: number;
  supplier: unknown;
  logs: unknown[];
  created_at?: string;
  updated_at?: string;
}

export interface PayloadInventory {
  id: number;
  product_id: number;
  stock: number;
  min_stock: number;
  max_stock: number;
  supplier_id?: number;
}
