import { Skeleton, Loader } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

import { queryInventorySchema } from '~/modules/inventories/inventory/inventories.schema';
import { useColumn, type InventoryColumnKeys } from './_hooks/use-column';
import { useGetInventories } from './_hooks/use-get-inventories';
import { Table } from '~/components/fragments/table';

export const Route = createFileRoute('/(protected)/inventories/inventory/')({
  component: RouteComponent,
  validateSearch: queryInventorySchema,
});

function RouteComponent() {
  const search = Route.useSearch();
  const { data, isLoading } = useGetInventories(search);
  const defaultVisible: InventoryColumnKeys[] = ['product_name', 'stock', 'min_stock', 'max_stock', 'select'];
  const { columns, columnIds, initialColumnVisibility } = useColumn({ defaultVisible });

  return (
    <Skeleton visible={isLoading}>
      {isLoading && <Loader />}
      <Table
        data={data}
        columns={columns}
        columnIds={columnIds}
        route={Route}
        path={{}}
        enableFeature={{
          engineSide: 'server_side',
          pagination: true,
          search: { fieldSearchable: 'product_name' },
          columnVisibilitySelector: { initialColumnVisibility },
          virtualizer: { virtualizeAt: 1000 },
        }}
      />
    </Skeleton>
  );
}
