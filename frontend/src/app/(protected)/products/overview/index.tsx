import { Flex, Text, Select, Group } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { DatePickerInput } from '@mantine/dates';
import { FaCalendarWeek } from 'react-icons/fa';
import { useState } from 'react';

import { useGetProductDiscountImpact } from './_hooks/use-get-product-discount-impact';
import { type ProductTrendPeriode } from '~/modules/product/product.schema';
import { ProductHeatmapTrend } from './_components/heatmap-trend-products';
import { ProductClusteredBarCharts } from './_components/clustered-bar-chart';
import { useGetProductTrend } from './_hooks/use-get-product-trend';
import { ProductBarCharts } from './_components/bar-chart-products';
import { useGetProductSold } from './_hooks/use-get-product-sold';
import { Container } from '~/components/ui/container/container';
import type { FilterPeriode } from '~/common/types/filter';
import type { SortOrder } from '~/common/types/meta';
import { generateYearRange } from '~/utils';

export const Route = createFileRoute('/(protected)/products/overview/')({
  component: RouteComponent,
});

function RouteComponent() {
  const years = generateYearRange(5);
  const typeProductsSell = [
    { label: 'Top Product Selling', value: 'DESC' },
    { label: 'Lowest Product Selling', value: 'ASC' },
  ];
  const [dateRangeProductSold, setDateRangeProductSold] = useState<[string | null, string | null] | undefined>();
  const [dateRangeProductDiscount, setDateRangeProductDiscount] = useState<[string | null, string | null] | undefined>();
  const [typePeriode, setTypePeriode] = useState<ProductTrendPeriode>('month');
  const [sortOrder, setSortOrder] = useState<SortOrder>('DESC');
  const [periodeProductDiscount, setPeriodeProductDiscount] = useState<FilterPeriode>({ year: 2024 });
  const [periodeProductSold, setPeriodeProductSold] = useState<FilterPeriode>({ year: 2024 });

  const { data: dataProductTrending, isLoading: loadingProductTrending } = useGetProductTrend({ type_periode: typePeriode });
  const { data: dataProductDiscountImpact, isLoading: loadingProductDiscountImpact } = useGetProductDiscountImpact(periodeProductDiscount);
  const { data: dataProductSold, isLoading: loadingProductSold } = useGetProductSold(periodeProductSold);

  return (
    <Flex direction={'column'} gap={'md'} pb={600}>
      <Container unstyled style={{ minHeight: '60vh' }}>
        <Text size={'lg'} mb={'sm'}>
          Product Move Performance
        </Text>
        <Group justify="space-between">
          <Group>
            <Select value={sortOrder} onChange={(e) => setSortOrder(e as SortOrder)} placeholder="Select type of product" data={typeProductsSell} />
            <DatePickerInput
              leftSection={<FaCalendarWeek />}
              placeholder="Pick Date Range"
              clearButtonProps={{ onClick: () => setDateRangeProductSold(undefined) }}
              clearable
              type="range"
              value={dateRangeProductSold}
              onChange={setDateRangeProductSold}
            />
          </Group>
          <Group>
            <Select
              w={150}
              allowDeselect={true}
              defaultValue={undefined}
              placeholder="Select week"
              value={periodeProductSold.week?.toString()}
              onChange={(e) => {
                setDateRangeProductSold(undefined);
                setPeriodeProductSold((prev) => ({ ...prev, week: e === null ? undefined : Number(e) }));
              }}
              data={Array.from({ length: 5 }, (_, i) => (i + 1).toString())}
            />
            <Select
              w={150}
              allowDeselect={true}
              defaultValue={undefined}
              placeholder="Select month"
              value={periodeProductSold.month?.toString()}
              onChange={(e) => {
                setDateRangeProductSold(undefined);
                setPeriodeProductSold((prev) => ({ ...prev, month: e === null ? undefined : Number(e) }));
              }}
              data={Array.from({ length: 12 }, (_, i) => (i + 1).toString())}
            />
            <Select
              w={150}
              allowDeselect={true}
              defaultValue={undefined}
              placeholder="Select year"
              value={periodeProductSold.year?.toString()}
              onChange={(e) => {
                setDateRangeProductSold(undefined);
                setPeriodeProductSold((prev) => ({ ...prev, year: e === null ? undefined : Number(e) }));
              }}
              data={years}
            />
          </Group>
        </Group>
        <ProductBarCharts data={dataProductSold} loading={loadingProductSold} />
      </Container>
      <Container unstyled m={'sm'}>
        <Flex justify={'space-between'} align={'center'}>
          <Text size={'xl'} m={'md'}>
            Product Trending Seasonal
          </Text>
          <Select
            w={150}
            placeholder="Select month"
            value={typePeriode}
            onChange={(e) => setTypePeriode(e as ProductTrendPeriode)}
            data={[
              { label: 'Last 12 Week', value: 'week' },
              { label: 'Last 6 Month', value: 'month' },
            ]}
          />
        </Flex>
        <ProductHeatmapTrend isLoading={loadingProductTrending} data={dataProductTrending} />
      </Container>
      <Container unstyled m={'sm'}>
        <Text size={'xl'} m={'md'}>
          Product Discount Sensitivity
        </Text>
        <Group justify="space-between">
          <Group>
            <Select value={sortOrder} onChange={(e) => setSortOrder(e as SortOrder)} placeholder="Select type of product" data={typeProductsSell} />
            <DatePickerInput
              leftSection={<FaCalendarWeek />}
              placeholder="Pick Date Range"
              clearButtonProps={{ onClick: () => setDateRangeProductDiscount(undefined) }}
              clearable
              type="range"
              value={dateRangeProductDiscount}
              onChange={setDateRangeProductDiscount}
            />
          </Group>
          <Group>
            <Select
              w={150}
              allowDeselect={true}
              defaultValue={undefined}
              placeholder="Select week"
              value={periodeProductSold.week?.toString()}
              onChange={(e) => {
                setDateRangeProductDiscount(undefined);
                setPeriodeProductDiscount((prev) => ({ ...prev, week: e === null ? undefined : Number(e) }));
              }}
              data={Array.from({ length: 5 }, (_, i) => (i + 1).toString())}
            />
            <Select
              w={150}
              allowDeselect={true}
              defaultValue={undefined}
              placeholder="Select month"
              value={periodeProductSold.month?.toString()}
              onChange={(e) => {
                setDateRangeProductDiscount(undefined);
                setPeriodeProductDiscount((prev) => ({ ...prev, month: e === null ? undefined : Number(e) }));
              }}
              data={Array.from({ length: 12 }, (_, i) => (i + 1).toString())}
            />
            <Select
              w={150}
              allowDeselect={true}
              defaultValue={undefined}
              placeholder="Select year"
              value={periodeProductSold.year?.toString()}
              onChange={(e) => {
                setDateRangeProductDiscount(undefined);
                setPeriodeProductDiscount((prev) => ({ ...prev, year: e === null ? undefined : Number(e) }));
              }}
              data={years}
            />
          </Group>
        </Group>
        <ProductClusteredBarCharts loading={loadingProductDiscountImpact} data={dataProductDiscountImpact} />
      </Container>
    </Flex>
  );
}
