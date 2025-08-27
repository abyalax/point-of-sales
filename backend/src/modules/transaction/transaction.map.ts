/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from '../transaction/entities/transaction.entity';

export function mapTransactionRows(rows: any[]): Transaction[] {
  const txMap = new Map<number, Transaction>();

  for (const row of rows) {
    if (!txMap.has(row.t_id as number)) {
      txMap.set(row.t_id as number, {
        id: row.t_id,
        cashier: row.u_name,
        status: row.t_status,
        sub_total: row.t_sub_total,
        total_discount: row.t_total_discount,
        total_price: row.t_total_price,
        total_profit: row.t_total_profit,
        total_tax: row.t_total_tax,
        last_price: row.t_last_price,
        payment_method: row.t_payment_method,
        pay_received: row.t_pay_received,
        pay_return: row.t_pay_return,
        notes: row.t_notes,
        created_at: row.t_created_at,
        updated_at: row.t_updated_at,
        user: {
          id: row.u_id,
          name: row.u_name,
          email: row.u_email,
        },
        items: [],
      });
    }
    if (row.ti_id) {
      txMap.get(row.t_id as number)!.items.push({
        id: row.ti_id,
        barcode: row.ti_barcode,
        name: row.ti_name,
        category: row.ti_category,
        quantity: row.ti_quantity,
        price: row.ti_price,
        cost_price: row.ti_cost_price,
        sell_price: row.ti_sell_price,
        final_price: row.ti_final_price,
        discount: row.ti_discount,
        tax_rate: row.ti_tax_rate,
        created_at: row.ti_created_at,
        updated_at: row.ti_updated_at,
      });
    }
  }

  return Array.from(txMap.values());
}
