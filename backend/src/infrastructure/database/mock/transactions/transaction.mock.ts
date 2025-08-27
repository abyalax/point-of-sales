import { CartDto, EStatusTransactions, OmitTransactionState, TransactionStateItem } from '~/modules/transaction/transaction.schema';
import { calculateTransaction } from '~/modules/transaction/transaction.calculate';

export function generateMockTransaction(param: CartDto, date: Date): OmitTransactionState {
  const mockItem: TransactionStateItem[] = [];
  const calculate = calculateTransaction(param);
  const timestamp = date.toISOString();

  for (const item of calculate.items) {
    const newItem: TransactionStateItem = {
      name: item.name,
      price: item.price,
      cost_price: item.cost_price,
      category: item.category,
      discount: item.discount,
      quantity: item.quantity,
      tax_rate: item.tax_rate,
      barcode: item.barcode,
      sell_price: item.sell_price,
      final_price: item.final_price,
      created_at: timestamp,
      updated_at: timestamp,
    };
    mockItem.push(newItem);
  }
  const transaction: OmitTransactionState = {
    status: EStatusTransactions.Completed,
    items: mockItem,
    sub_total: calculate.sub_total,
    total_discount: calculate.total_discount,
    total_price: calculate.total_price,
    total_profit: calculate.total_profit,
    total_tax: calculate.total_tax,
    pay_return: calculate.pay_return,
    pay_received: calculate.pay_received,
    payment_method: calculate.payment_method,
    last_price: calculate.last_price,
    notes: calculate.notes,
    user_id: 2,
    cashier: 'Abya Kasir',
    created_at: timestamp,
    updated_at: timestamp,
  };
  return transaction;
}
