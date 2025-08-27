import { createColumnHelper } from '@tanstack/react-table';
import { Button } from '@mantine/core';
import { FaPlus } from 'react-icons/fa';
import { useMemo } from 'react';

import { useCartStore } from './use-cart-store';
import type { Product } from '~/modules/product/product.schema';

const columnHelper = createColumnHelper<Product>();

export const useColumn = () => {
  const addItem = useCartStore((s) => s.addItem);

  return useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Product Name',
      }),
      columnHelper.accessor('barcode', {
        id: 'barcode',
        header: 'Barcode',
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <Button
              size="xs"
              onClick={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  barcode: product.barcode,
                  category: product.category.name,
                  cost_price: product.cost_price,
                  tax_rate: product.tax_rate,
                  discount: product.discount,
                })
              }
            >
              <FaPlus size={15} />
            </Button>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};
