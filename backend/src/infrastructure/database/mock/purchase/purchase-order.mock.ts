import Big from 'big.js';
import { Product } from '~/modules/product/entity/product.entity';
import { PurchaseOrderItem } from '~/modules/purchase/entities/purchase-order-item.entity';
import { PurchaseOrder } from '~/modules/purchase/entities/purchase-order.entity';
import { EPurchaseStatus } from '~/modules/purchase/purchase.schema';
import { Supplier } from '~/modules/supplier/entities/supplier.entity';
import { generatePurchaseOrderItem } from './purchase-order-item.mock';

export type OmitPurchaseOrderItem = Omit<PurchaseOrderItem, 'purchaseOrder' | 'product' | 'id' | 'purchase_order_id'>;
export type OmitPurchaseOrder = Omit<PurchaseOrder, 'supplier' | 'items' | 'id'> & { items: OmitPurchaseOrderItem[] };

export function generateMockPurchaseOrder(suppliers: Supplier[], products: Product[], dates: Date[]): OmitPurchaseOrder[] {
  const groupedProducts = new Map<number, Product[]>();
  for (const product of products) {
    if (!groupedProducts.has(product.category_id)) {
      groupedProducts.set(product.category_id, []);
    }
    groupedProducts.get(product.category_id)!.push(product);
  }

  return dates.flatMap((date, index) => {
    const supplier = suppliers[index % suppliers.length];
    const availableProducts = groupedProducts.get(supplier.id) ?? [];

    if (availableProducts.length === 0) {
      // Supplier tidak punya produk kategori → skip order
      return [];
    }

    const items = generatePurchaseOrderItem(availableProducts, 5);
    if (items.length === 0) {
      // Kalau generatePurchaseOrderItem() somehow gagal → skip
      return [];
    }

    const total_amount = items.reduce((acc, item) => acc.plus(item.sub_total), new Big(0)).toString();

    const maxOffset = 60; // ±2 bulan
    const offset = Math.floor(Math.random() * maxOffset);

    const expectedDate = new Date(date);
    expectedDate.setDate(date.getDate() + offset);

    const timestamp = date.toISOString();

    return [
      {
        supplier_id: supplier.id,
        status: EPurchaseStatus.PENDING,
        total_amount,
        order_date: timestamp,
        expected_date: expectedDate.toISOString(),
        created_at: timestamp,
        updated_at: timestamp,
        items,
      },
    ];
  });
}
