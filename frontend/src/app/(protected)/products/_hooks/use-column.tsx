import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Flex } from '@mantine/core';
import { Link } from '@tanstack/react-router';

import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { useMemo } from 'react';

import { formatCurrency } from '~/utils/format';
import { EProductStatus } from '~/api/product/type';
import { colors } from '~/components/themes';

import type { IProduct } from '~/api/product/type';
import { useDeleteProduct } from './use-delete-products';

const columnHelper = createColumnHelper<IProduct>();
export type TProductColumn = keyof IProduct | 'select';

type Params = {
  defaultVisible: TProductColumn[];
};

export const useColumn = ({ defaultVisible }: Params) => {
  const { mutate: mutateDeleteProduct } = useDeleteProduct();

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
            onClick={(e) => e.stopPropagation()}
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
        cell: (e) => e.getValue().name,
      }),
      columnHelper.accessor('price', {
        id: 'price',
        header: 'Price',
        sortingFn: 'alphanumeric',
        cell: (e) => formatCurrency(e.getValue()),
      }),
      columnHelper.accessor('stock', {
        id: 'stock',
        header: 'Stock',
        cell: (e) => e.getValue(),
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: 'Status',
        sortingFn: 'basic',
        cell: (info) => (info.getValue() === EProductStatus.AVAILABLE ? 'Available' : 'Unavailable'),
      }),
      columnHelper.accessor('status', {
        id: 'action',
        header: 'Action',
        cell: (info) => {
          return (
            <Flex gap="xs" w={'fit-content'}>
              <Link to="/products/$id/update" params={{ id: info.row.original.id }} onClick={(e) => e.stopPropagation()}>
                <FaPencilAlt color={colors.black} />
              </Link>
              <FaTrash
                color={'red'}
                onClick={(e) => {
                  e.stopPropagation();
                  mutateDeleteProduct({ id: info.row.original.id });
                }}
              />
            </Flex>
          );
        },
      }),
    ],
    [mutateDeleteProduct]
  );

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const initialColumnVisibility = useMemo(() => {
    return columnIds.reduce(
      (acc, val) => {
        acc[val as TProductColumn] = defaultVisible.includes(val as TProductColumn);
        return acc;
      },
      {} as Record<TProductColumn, boolean>
    );
  }, [columnIds, defaultVisible]);

  return { columns, initialColumnVisibility, columnIds };
};
