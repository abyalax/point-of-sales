import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Input } from '@mantine/core';
import { useMemo } from 'react';

import type { Inventories, InventoriesKeys } from '~/modules/inventories/inventory/inventories.schema';
import { useUpdateInventories } from './use-update-inventories';
import { notifications } from '@mantine/notifications';

const columnHelper = createColumnHelper<Inventories>();
export type InventoryColumnKeys = InventoriesKeys | 'select';

type Params = {
  defaultVisible: InventoryColumnKeys[];
};

type FieldType = 'stock' | 'min_stock' | 'max_stock';

export const useColumn = ({ defaultVisible }: Params) => {
  const { mutate } = useUpdateInventories();

  const columns = useMemo(() => {
    const handleUpdeteStock = (field: FieldType, value: number, originalValue: number, id: number) => {
      if (value !== originalValue) {
        mutate({ id, [field]: value });
      } else {
        notifications.show({
          color: 'blue',
          message: `No changes detected, update prevented.`,
        });
        return;
      }
    };
    return [
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
            onClick={(e) => e.stopPropagation()}
            onChange={row.getToggleSelectedHandler()}
            checked={row.getIsSelected()}
          />
        ),
      }),
      columnHelper.accessor('product_name', {
        id: 'product_name',
        header: 'Product Name',
        cell: (e) => e.getValue(),
      }),
      columnHelper.accessor('stock', {
        id: 'stock',
        header: 'Current Stock',
        cell: ({ row }) => (
          <Input
            type="number"
            defaultValue={row.getValue('stock') as number}
            variant="unstyled"
            onBlur={(e) => handleUpdeteStock('stock', Number(e.target.value), row.getValue('stock'), row.original.id)}
          />
        ),
      }),
      columnHelper.accessor('min_stock', {
        id: 'min_stock',
        header: 'Min Stock',
        cell: ({ row }) => (
          <Input
            type="number"
            defaultValue={row.getValue('min_stock') as number}
            variant="unstyled"
            onBlur={(e) => handleUpdeteStock('min_stock', Number(e.target.value), row.getValue('min_stock'), row.original.id)}
          />
        ),
      }),
      columnHelper.accessor('max_stock', {
        id: 'max_stock',
        header: 'Max Stock',
        cell: ({ row }) => (
          <Input
            type="number"
            defaultValue={row.getValue('max_stock') as number}
            variant="unstyled"
            onBlur={(e) => handleUpdeteStock('max_stock', Number(e.target.value), row.getValue('max_stock'), row.original.id)}
          />
        ),
      }),
      columnHelper.accessor('supplier_name', {
        id: 'supplier_name',
        header: 'Supplier',
        cell: (e) => e.getValue(),
      }),
    ];
  }, [mutate]);

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const initialColumnVisibility = useMemo(() => {
    return columnIds.reduce(
      (acc, val) => {
        acc[val as InventoryColumnKeys] = defaultVisible.includes(val as InventoryColumnKeys);
        return acc;
      },
      {} as Record<InventoryColumnKeys, boolean>,
    );
  }, [columnIds, defaultVisible]);

  return { columns, initialColumnVisibility, columnIds };
};
