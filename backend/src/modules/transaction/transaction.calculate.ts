import { TransactionItem } from './entities/transaction-item.entity';
import { Transaction } from './entities/transaction.entity';
import type { ICartState, ItemSummary, ITransactionState } from './transaction.interface';
import { EStatusTransactions } from './transaction.interface';
import Big from 'big.js';

export function calculateTransaction(cartState: ICartState): ITransactionState & Partial<Transaction> {
  const items = cartState.items;

  let sub_total_transaction = new Big('0');
  let total_discount_transaction = new Big('0');
  let total_price_transaction = new Big('0');
  let total_profit_transaction = new Big('0');
  let total_tax_transaction = new Big('0');
  let last_price_transaction = new Big('0');

  const item_summaries: ItemSummary[] = [];

  for (const unit of items) {
    const price = new Big(unit.price);
    const discount = new Big(unit.discount);
    const quantity = new Big(unit.quantity);
    const tax_rate = new Big(unit.tax_rate);
    const cost_price = new Big(unit.cost_price);

    const sub_total = price.times(quantity);
    const total_discount = price.times(discount).times(quantity);
    const total_price = sub_total.minus(total_discount);

    const discount_per_unit = price.times(discount);
    const unit_profit = price.minus(cost_price).minus(discount_per_unit);
    const total_profit = unit_profit.times(quantity);

    const total_tax = price.times(tax_rate).times(quantity);
    const last_price = total_price.plus(total_tax);

    sub_total_transaction = sub_total_transaction.plus(sub_total);
    total_discount_transaction = total_discount_transaction.plus(total_discount);
    total_price_transaction = total_price_transaction.plus(total_price);
    total_profit_transaction = total_profit_transaction.plus(total_profit);
    total_tax_transaction = total_tax_transaction.plus(total_tax);
    last_price_transaction = last_price_transaction.plus(last_price);

    item_summaries.push({
      name: unit.name,
      sub_total: sub_total.toString(),
      total_discount: total_discount.toString(),
      total_price: total_price.toString(),
      unit_profit: unit_profit.toString(),
      total_profit: total_profit.toString(),
      total_tax: total_tax.toString(),
      last_price: last_price.toString(),
    });
  }

  const item_transaction: TransactionItem[] = items.map((item, i) => {
    const price = new Big(item.price);
    const discount = new Big(item.discount);
    const tax_rate = new Big(item.tax_rate);

    const sell_price = price.minus(price.times(discount)); // harga jual (net)
    const final_price = sell_price.plus(sell_price.times(tax_rate)); // harga akhir + pajak

    return {
      id: item.id,
      name: item.name,
      category: item.category,
      barcode: item.barcode,
      quantity: item.quantity,
      price: item.price,
      cost_price: item.cost_price,
      discount: item.discount,
      tax_rate: item.tax_rate,
      sell_price: sell_price.toString(),
      final_price: final_price.toString(),
      summary: item_summaries[i],
    };
  });

  return {
    status: EStatusTransactions.Pending,
    items: item_transaction,
    sub_total: sub_total_transaction.toString(),
    total_discount: total_discount_transaction.toString(),
    total_price: total_price_transaction.toString(),
    total_profit: total_profit_transaction.toString(),
    total_tax: total_tax_transaction.toString(),
    pay_return: cartState.pay_return,
    pay_received: cartState.pay_received,
    payment_method: cartState.payment_method,
    last_price: last_price_transaction.toString(),
    notes: cartState.notes,
  };
}
