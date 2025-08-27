import { Button, CloseButton, Fieldset, Flex, MenuDropdown, MenuTarget, Skeleton, Text, Tooltip } from '@mantine/core';
import { Loader, Menu, NumberInput } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { FaFilter, FaSearchMinus, FaSearchPlus } from 'react-icons/fa';

import { Table } from '~/components/fragments/table';
import { DEFAULT } from '~/common/const/default';

import { useColumn } from './_hooks/use-column';
import { useDebouncedCallback } from '~/components/hooks/use-debounce-callback';
import { useFilterTransactions } from './_hooks/use-filter-transactions';
import { queryTransactionsSchema, type Transaction } from '~/modules/transaction/transaction.schema';

export const Route = createFileRoute('/(protected)/transactions/')({
  component: RouteComponent,
  validateSearch: queryTransactionsSchema,
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { columns, columnIds } = useColumn();
  const { data: dataTransactions, isLoading: isLoadingProducts } = useFilterTransactions({
    ...search,
    sort_by: search.sort_by as keyof Partial<Transaction>,
  });

  const handleMinPrice = useDebouncedCallback((value: number | undefined) => {
    navigate({ search: (prev) => ({ ...prev, min_total_price: value }), replace: true, viewTransition: true });
  }, DEFAULT.DEBOUNCE_INPUT);

  const handleMaxPrice = useDebouncedCallback((value: number | undefined) => {
    navigate({ search: (prev) => ({ ...prev, max_total_price: value }), replace: true, viewTransition: true });
  }, DEFAULT.DEBOUNCE_INPUT);

  const handleMinProfit = useDebouncedCallback((value: number | undefined) => {
    navigate({ search: (prev) => ({ ...prev, min_total_profit: value }), replace: true, viewTransition: true });
  }, DEFAULT.DEBOUNCE_INPUT);

  const handleMaxProfit = useDebouncedCallback((value: number | undefined) => {
    navigate({ search: (prev) => ({ ...prev, max_total_profit: value }), replace: true, viewTransition: true });
  }, DEFAULT.DEBOUNCE_INPUT);

  const handleMinDiscount = useDebouncedCallback((value: number | undefined) => {
    navigate({ search: (prev) => ({ ...prev, min_total_discount: value }), replace: true, viewTransition: true });
  }, DEFAULT.DEBOUNCE_INPUT);

  const handleMaxDiscount = useDebouncedCallback((value: number | undefined) => {
    navigate({ search: (prev) => ({ ...prev, max_total_discount: value }), replace: true, viewTransition: true });
  }, DEFAULT.DEBOUNCE_INPUT);

  const handleMinTax = useDebouncedCallback((value: number | undefined) => {
    navigate({ search: (prev) => ({ ...prev, min_total_tax: value }), replace: true, viewTransition: true });
  }, DEFAULT.DEBOUNCE_INPUT);

  const handleMaxTax = useDebouncedCallback((value: number | undefined) => {
    navigate({ search: (prev) => ({ ...prev, max_total_tax: value }), replace: true, viewTransition: true });
  }, DEFAULT.DEBOUNCE_INPUT);

  return (
    <Skeleton visible={isLoadingProducts}>
      {isLoadingProducts && <Loader />}
      <Table
        data={dataTransactions}
        columns={columns}
        columnIds={columnIds}
        route={Route}
        path={{
          detail: '/transactions/$id',
          update: '/transactions/$id',
        }}
        enableFeature={{
          engineSide: 'server_side',
          pagination: true,
          virtualizer: { virtualizeAt: 1000 },
          menufilter: (
            <Menu position="bottom-start">
              <MenuTarget>
                <Tooltip label="Filter">
                  <Button variant="outline">
                    <FaFilter size={16} />
                  </Button>
                </Tooltip>
              </MenuTarget>
              <MenuDropdown>
                <Fieldset legend="Filter By " style={{ padding: '10px', display: 'flex', gap: '10px' }}>
                  <Flex gap={'xs'} direction={'column'}>
                    <Flex gap={'xs'}>
                      <Text style={{ minWidth: 100 }}>Total Price</Text>
                      <Flex gap={'xs'}>
                        <NumberInput
                          style={{ maxWidth: 150 }}
                          value={search.min_total_price}
                          thousandSeparator=","
                          prefix="Rp. "
                          hideControls
                          placeholder="Min Price"
                          leftSection={<FaSearchMinus size={16} />}
                          onChange={(e) => handleMinPrice(Number(e))}
                          rightSection={
                            <CloseButton
                              style={{ cursor: 'pointer', display: search.min_total_price ? 'block' : 'none' }}
                              onClick={() => handleMinPrice(undefined)}
                            />
                          }
                        />
                        <NumberInput
                          style={{ maxWidth: 150 }}
                          value={search.max_total_price}
                          thousandSeparator=","
                          prefix="Rp. "
                          hideControls
                          leftSection={<FaSearchPlus size={16} />}
                          placeholder="Max Price"
                          onChange={(e) => handleMaxPrice(Number(e))}
                          rightSection={
                            <CloseButton
                              style={{ cursor: 'pointer', display: search.max_total_price ? 'block' : 'none' }}
                              onClick={() => handleMaxPrice(undefined)}
                            />
                          }
                        />
                      </Flex>
                    </Flex>
                    <Flex gap={'xs'}>
                      <Text style={{ minWidth: 100 }}>Total Profit</Text>
                      <Flex gap={'xs'}>
                        <NumberInput
                          style={{ maxWidth: 150 }}
                          value={search.min_total_profit}
                          thousandSeparator=","
                          prefix="Rp. "
                          hideControls
                          placeholder="Min Price"
                          leftSection={<FaSearchMinus size={16} />}
                          onChange={(e) => handleMinProfit(Number(e))}
                          rightSection={
                            <CloseButton
                              style={{ cursor: 'pointer', display: search.min_total_profit ? 'block' : 'none' }}
                              onClick={() => handleMinProfit(undefined)}
                            />
                          }
                        />
                        <NumberInput
                          style={{ maxWidth: 150 }}
                          value={search.max_total_profit}
                          thousandSeparator=","
                          prefix="Rp. "
                          hideControls
                          leftSection={<FaSearchPlus size={16} />}
                          placeholder="Max Price"
                          onChange={(e) => handleMaxProfit(Number(e))}
                          rightSection={
                            <CloseButton
                              style={{ cursor: 'pointer', display: search.max_total_profit ? 'block' : 'none' }}
                              onClick={() => handleMaxProfit(undefined)}
                            />
                          }
                        />
                      </Flex>
                    </Flex>
                    <Flex gap={'xs'}>
                      <Text style={{ minWidth: 100 }}>Total Discount</Text>
                      <Flex gap={'xs'}>
                        <NumberInput
                          style={{ maxWidth: 150 }}
                          value={search.min_total_discount}
                          thousandSeparator=","
                          prefix="Rp. "
                          hideControls
                          placeholder="Min Discount"
                          leftSection={<FaSearchMinus size={16} />}
                          onChange={(e) => handleMinDiscount(Number(e))}
                          rightSection={
                            <CloseButton
                              style={{ cursor: 'pointer', display: search.min_total_discount ? 'block' : 'none' }}
                              onClick={() => handleMinDiscount(undefined)}
                            />
                          }
                        />
                        <NumberInput
                          style={{ maxWidth: 150 }}
                          value={search.max_total_discount}
                          thousandSeparator=","
                          prefix="Rp. "
                          hideControls
                          leftSection={<FaSearchPlus size={16} />}
                          placeholder="Max Discount"
                          onChange={(e) => handleMaxDiscount(Number(e))}
                          rightSection={
                            <CloseButton
                              style={{ cursor: 'pointer', display: search.max_total_discount ? 'block' : 'none' }}
                              onClick={() => handleMaxDiscount(undefined)}
                            />
                          }
                        />
                      </Flex>
                    </Flex>
                    <Flex gap={'xs'}>
                      <Text style={{ minWidth: 100 }}>Total Tax</Text>
                      <Flex gap={'xs'}>
                        <NumberInput
                          style={{ maxWidth: 150 }}
                          value={search.min_total_tax}
                          thousandSeparator=","
                          prefix="Rp. "
                          hideControls
                          placeholder="Min Tax"
                          leftSection={<FaSearchMinus size={16} />}
                          onChange={(e) => handleMinTax(Number(e))}
                          rightSection={
                            <CloseButton
                              style={{ cursor: 'pointer', display: search.min_total_tax ? 'block' : 'none' }}
                              onClick={() => handleMinTax(undefined)}
                            />
                          }
                        />
                        <NumberInput
                          style={{ maxWidth: 150 }}
                          value={search.max_total_tax}
                          thousandSeparator=","
                          prefix="Rp. "
                          hideControls
                          leftSection={<FaSearchPlus size={16} />}
                          placeholder="Max Tax"
                          onChange={(e) => handleMaxTax(Number(e))}
                          rightSection={
                            <CloseButton
                              style={{ cursor: 'pointer', display: search.max_total_tax ? 'block' : 'none' }}
                              onClick={() => handleMaxTax(undefined)}
                            />
                          }
                        />
                      </Flex>
                    </Flex>
                  </Flex>
                </Fieldset>
              </MenuDropdown>
            </Menu>
          ),
        }}
      />
    </Skeleton>
  );
}
