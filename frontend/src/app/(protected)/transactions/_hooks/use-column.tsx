import { createColumnHelper } from '@tanstack/react-table';
import type { Transaction } from '~/modules/transaction/transaction.schema';
import { formatCurrency } from '~/utils/format';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const columnHelper = createColumnHelper<Transaction>();
export type TTransactionColumn = keyof Transaction | 'select';

dayjs.extend(relativeTime);

export const useColumn = () => {
  const columns = useMemo(
    () => [
      columnHelper.accessor('cashier', {
        id: 'cashier',
        header: 'Cashier',
      }),
      columnHelper.accessor('payment_method', {
        id: 'payment_method',
        header: 'Payment Method',
      }),
      columnHelper.accessor('total_price', {
        id: 'total_price',
        header: 'Total Price',
        sortingFn: 'alphanumeric',
        cell: (e) => formatCurrency(e.getValue()),
      }),
      columnHelper.accessor('total_discount', {
        id: 'total_discount',
        header: 'Total Discount',
        sortingFn: 'alphanumeric',
        cell: (e) => formatCurrency(e.getValue()),
      }),
      columnHelper.accessor('total_profit', {
        id: 'total_profit',
        header: 'Total Profit',
        cell: (e) => formatCurrency(e.getValue()),
      }),
      columnHelper.accessor('total_tax', {
        id: 'total_tax',
        header: 'Total Tax',
        cell: (e) => formatCurrency(e.getValue()),
      }),
      columnHelper.accessor('created_at', {
        id: 'created_at',
        header: 'Created At',
        sortingFn: 'datetime',
        cell: (e) => dayjs(e.getValue()).fromNow(),
      }),
    ],
    [],
  );

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  return { columns, columnIds };
};
