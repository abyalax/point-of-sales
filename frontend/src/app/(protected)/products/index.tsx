import { Button, Fieldset, Flex, Skeleton, Tooltip } from '@mantine/core';
import { Loader, Menu, NumberInput, SegmentedControl, Select } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { FaFilter } from 'react-icons/fa';

import { EProductStatus, queryProductsSchema } from '~/api/product/type';
import { Table } from '~/components/fragments/table/index';
import { DEFAULT } from '~/common/const/default';
import { useDebouncedCallback } from '@mantine/hooks';

import { useGetProductCategories } from './_hooks/use-get-categories';
import { useFilterProducts } from './_hooks/use-filter-products';
import { useColumn, type TProductColumn } from './_hooks/use-column';

export const Route = createFileRoute('/(protected)/products/')({
  component: RouteComponent,
  validateSearch: queryProductsSchema,
});

function RouteComponent() {
  const defaultVisible: TProductColumn[] = ['name', 'price', 'status', 'category', 'select', 'stock'];
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: dataProducts, isLoading: isLoadingProducts } = useFilterProducts(search);
  const { data: dataCategories, isLoading } = useGetProductCategories();
  const { columns, columnIds, initialColumnVisibility } = useColumn({ defaultVisible });

  const categories = dataCategories?.data?.data?.map((e) => {
    return {
      label: e.name,
      value: e.id.toString(),
    };
  });

  const onMinPriceChange = useDebouncedCallback((value: number) => {
    navigate({ search: (prev) => ({ ...prev, min_price: value }), replace: true, viewTransition: true });
  }, DEFAULT.DEBOUNCE_INPUT);

  const onMaxPriceChange = useDebouncedCallback((value: number) => {
    navigate({ search: (prev) => ({ ...prev, max_price: value }), replace: true, viewTransition: true });
  }, DEFAULT.DEBOUNCE_INPUT);

  const onStatusChange = (e: string) => {
    navigate({
      search: (prev) => ({ ...prev, status: e === '' ? undefined : e }),
      replace: true,
      viewTransition: true,
    });
  };

  const onCategoryChange = (e: string | null) => {
    const value = e === '' ? undefined : Number(e);
    navigate({
      search: (prev) => ({ ...prev, category: value }),
      replace: true,
      viewTransition: true,
    });
  };

  return (
    <Skeleton visible={isLoadingProducts}>
      {isLoadingProducts && <Loader />}
      <Table
        data={dataProducts}
        columns={columns}
        columnIds={columnIds}
        initialColumnVisibility={initialColumnVisibility}
        route={Route}
        path={{
          detail: '/products/$id',
          create: '/products/create',
          update: '/products/$id',
        }}
        menufilter={
          <Menu position="bottom-start">
            <Menu.Target>
              <Tooltip label="Filter Data">
                <Button variant="light">
                  <FaFilter />
                </Button>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <Fieldset legend="Filter Data">
                <Flex gap={'md'} direction={'column'}>
                  {isLoading ? null : (
                    <Select
                      onChange={onCategoryChange}
                      clearable
                      onClear={() => onCategoryChange('')}
                      checkIconPosition="left"
                      value={search.category?.toString()}
                      allowDeselect
                      searchable
                      data={categories}
                      label="Category"
                      placeholder="Select Category"
                    />
                  )}
                  <Flex gap={'md'}>
                    <NumberInput value={search.min_price} placeholder="Min Price" label="Min Price" onChange={(e) => onMinPriceChange(Number(e))} />
                    <NumberInput value={search.max_price} placeholder="Max Price" label="Max Price" onChange={(e) => onMaxPriceChange(Number(e))} />
                  </Flex>
                  <SegmentedControl
                    value={search.status}
                    onChange={onStatusChange}
                    data={[
                      { label: 'Available', value: EProductStatus.AVAILABLE },
                      { label: 'UnAvailable', value: EProductStatus.UNAVAILABLE },
                      { label: 'All', value: '' },
                    ]}
                  />
                </Flex>
              </Fieldset>
            </Menu.Dropdown>
          </Menu>
        }
      />
    </Skeleton>
  );
}
