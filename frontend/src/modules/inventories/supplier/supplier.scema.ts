import type { ICategory } from '~/modules/product/product.schema';
import type { Inventory } from '../inventory/inventories.schema';

export interface Supplier {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  category_id: number;
  category: ICategory;
  inventories: Inventory[];
  created_at?: string;
  updated_at?: string;
}

export interface PayloadSupplier {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  category_id: number;
}
