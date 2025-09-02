import Big from 'big.js';

import { Product } from '~/modules/product/entity/product.entity';
import { OmitPurchaseOrderItem } from './purchase-order.mock';

export const generatePurchaseOrderItem = (products: Product[], maxPerOrder = 5): OmitPurchaseOrderItem[] => {
  if (products.length === 0) return [];

  const orderItems: OmitPurchaseOrderItem[] = [];
  const maxItems = Math.min(products.length, Math.max(1, Math.floor(Math.random() * maxPerOrder) + 1));
  const selectedProducts = products
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, maxItems);

  for (const product of selectedProducts) {
    const quantity = Math.floor(Math.random() * 50) + 1;
    const product_price = new Big(product.price);
    const sub_total = product_price.times(quantity).toString();
    orderItems.push({
      product_id: product.id,
      quantity,
      price: product.price,
      sub_total,
    });
  }
  return orderItems;
};
