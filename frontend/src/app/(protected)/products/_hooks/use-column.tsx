import { Checkbox } from '@mantine/core';
import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { EProductStatus, type IProduct } from '~/api/product/type';
import { formatCurrency } from '~/utils/format';
const columnHelper = createColumnHelper<IProduct>();

export type TProductColumn = keyof IProduct | 'select';

export const useColumn = () => {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            style={{ cursor: 'pointer' }}
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            style={{ cursor: 'pointer' }}
            onClick={e => e.stopPropagation()}
            onChange={row.getToggleSelectedHandler()}
            checked={row.getIsSelected()}
          />
        ),
      }),
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Product Name',
      }),
      columnHelper.accessor('category', {
        id: 'category',
        header: 'Category',
        sortingFn: 'text',
        cell: e => e.getValue().name,
      }),
      columnHelper.accessor('price', {
        id: 'price',
        header: 'Price',
        sortingFn: 'alphanumeric',
        cell: e => formatCurrency(e.getValue()),
      }),
      columnHelper.accessor('stock', {
        id: 'stock',
        header: 'Stock',
        cell: e => e.getValue(),
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: 'Status',
        sortingFn: 'basic',
        cell: info => (info.getValue() === EProductStatus.AVAILABLE ? 'Available' : 'Unavailable'),
      }),
    ],
    []
  );

  const columnIds = useMemo(() => columns.map(col => col.id), [columns]);

  const initialColumnVisibility = useMemo(() => {
    const defaultVisible = ['name', 'price', 'status', 'category', 'select', 'stock'];
    return columnIds.reduce(
      (acc, val) => {
        acc[val as TProductColumn] = defaultVisible.includes(val as TProductColumn);
        return acc;
      },
      {} as Record<TProductColumn, boolean>
    );
  }, [columnIds]);

  return { columns, initialColumnVisibility, columnIds };
};
