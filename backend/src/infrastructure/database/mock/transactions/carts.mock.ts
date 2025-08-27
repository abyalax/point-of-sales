import { CartDto, CartItem, OmitProduct } from '~/modules/transaction/transaction.schema';
import Big from 'big.js';

export function generateMockCart(products: OmitProduct[], minItems = 1, maxItems = 10): CartDto {
  const min = Math.max(1, minItems);
  const max = Math.min(maxItems, products.length);

  const weighted = products.flatMap((p) => {
    const weight = parseFloat(p.discount) > 0 ? 3 : 1; // products dengan diskon muncul 3x lebih banyak
    return Array(weight).fill(p);
  });
  const shuffled = weighted.sort(() => Math.random() - 0.5);
  const pickCount = Math.floor(Math.random() * (max - min + 1)) + min;
  const selected = shuffled.slice(0, pickCount);

  const items: CartItem[] = selected.map((p) => {
    const quantity = Math.floor(Math.random() * 3) + 1;
    return {
      barcode: p.barcode,
      name: p.name,
      category: p.category,
      price: p.price,
      cost_price: p.cost_price,
      tax_rate: p.tax_rate,
      discount: p.discount,
      quantity,
    };
  });

  let sub_total = new Big(0);
  let total_discount = new Big(0);
  let tax = new Big(0);
  let total_quantity = 0;

  for (const item of items) {
    const price = new Big(item.price);
    const quantity = new Big(item.quantity);
    const discount = new Big(item.discount);
    const tax_rate = new Big(item.tax_rate);

    const item_total = price.times(quantity);
    const total_item_discount = price.times(discount).times(quantity);
    const item_tax = tax_rate.times(price).times(quantity);

    sub_total = sub_total.plus(item_total);
    total_discount = total_discount.plus(total_item_discount);
    tax = tax.plus(item_tax);
    total_quantity += quantity.toNumber();
  }

  const total = sub_total.minus(total_discount).plus(tax);
  const pay_received = total.plus(new Big(10000));
  const pay_return = pay_received.minus(total);

  return {
    items,
    sub_total: sub_total.toFixed(2),
    total: total.toFixed(2),
    total_item: total_quantity,
    total_discount: total_discount.toFixed(2),
    payment_method: 'Cash',
    pay_received: pay_received.toFixed(2),
    pay_return: pay_return.toFixed(2),
    tax: tax.toFixed(2),
    notes: '',
  };
}
