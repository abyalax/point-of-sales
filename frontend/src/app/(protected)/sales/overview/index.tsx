import { Flex, Grid, GridCol, Group, Select, Skeleton, Text } from '@mantine/core';
import { createFileRoute, Link } from '@tanstack/react-router';
import { DatePickerInput } from '@mantine/dates';
import { useEffect, useState } from 'react';

import { useGetSalesByCategory } from './_hooks/use-get-sales-by-category';
import { useGetSalesPerMonth } from './_hooks/use-get-sales-per-month';
import { useGetSalesSummary } from './_hooks/use-get-sales-by-year';
import { queryReportSalesSchema } from '~/modules/transaction/transaction.schema';
import { SalesLineChart } from './_components/line-chart-sales';
import { Container } from '~/components/ui/container/container';
import { SalesPieChart } from './_components/pie-chart-sales';
import { FaCalendarWeek } from 'react-icons/fa';
import { formatCurrency } from '~/utils/format';
import { CURRENT } from '~/common/const/date';
import { generateYearRange } from '~/utils';

export const Route = createFileRoute('/(protected)/sales/overview/')({
  component: RouteComponent,
  validateSearch: queryReportSalesSchema,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const years = generateYearRange(5);
  const search = Route.useSearch();

  const [dateRange, setDateRange] = useState<[string | null, string | null] | undefined>();
  const [yearLineCharts, setYearLineCharts] = useState<string>(CURRENT.year.toString());
  const [yearPieCharts, setYearPieCharts] = useState<string>(CURRENT.year.toString());

  const { data: salesByCategory, isLoading: isLoadingSalesByCategory } = useGetSalesByCategory(yearPieCharts);
  const { data: salesPerMonth, isLoading: isLoadingSalesPerMonth } = useGetSalesPerMonth(yearLineCharts);
  const { data: salesByYear, isLoading: isLoadingSalesSummary } = useGetSalesSummary(search);

  useEffect(() => {
    if (dateRange === undefined) return;
    if (dateRange[0] === null || dateRange[1] === null) return;
    navigate({
      search: {
        start: dateRange[0],
        end: dateRange[1],
        week: undefined,
        month: undefined,
        year: undefined,
      },
      replace: true,
      viewTransition: true,
    });
  }, [dateRange, navigate, search.end, search.start]);

  useEffect(() => {
    if (search.start !== undefined && search.end !== undefined) {
      setDateRange([search.start, search.end]);
    }
  }, [search.end, search.start]);

  return (
    <Flex direction={'column'} gap={'md'}>
      <Grid>
        <GridCol span={{ lg: 12, sm: 12 }}>
          <Flex justify={'space-between'}>
            <Text size={'lg'} fw={500}>
              Business Overview
            </Text>
            <Group mb={'lg'}>
              <DatePickerInput
                leftSection={<FaCalendarWeek />}
                placeholder="Pick Date Range"
                clearButtonProps={{
                  onClick: () => {
                    setDateRange(undefined);
                    navigate({ search: { ...search, start: undefined, end: undefined }, replace: true, viewTransition: true });
                  },
                }}
                clearable={search.start !== undefined || search.end !== undefined}
                type="range"
                value={dateRange}
                onChange={setDateRange}
              />
              <Select
                w={150}
                allowDeselect={true}
                defaultValue={undefined}
                placeholder="Select week"
                value={search.week ? String(search.week) : null}
                onChange={(e) => {
                  setDateRange(undefined);
                  const validated = e === null ? undefined : e;
                  navigate({ search: { ...search, start: undefined, end: undefined, week: validated }, replace: true, viewTransition: true });
                }}
                data={Array.from({ length: 5 }, (_, i) => (i + 1).toString())}
              />
              <Select
                w={150}
                allowDeselect={true}
                defaultValue={undefined}
                placeholder="Select month"
                value={search.month ? String(search.month) : null}
                onChange={(e) => {
                  setDateRange(undefined);
                  const validated = e === null ? undefined : e;
                  navigate({ search: { ...search, start: undefined, end: undefined, month: validated }, replace: true, viewTransition: true });
                }}
                data={Array.from({ length: 12 }, (_, i) => (i + 1).toString())}
              />
              <Select
                w={150}
                allowDeselect={true}
                defaultValue={undefined}
                placeholder="Select year"
                value={search.year ? String(search.year) : null}
                onChange={(e) => {
                  setDateRange(undefined);
                  const validated = e === null ? undefined : e;
                  navigate({ search: { ...search, start: undefined, end: undefined, year: validated }, replace: true, viewTransition: true });
                }}
                data={years}
              />
            </Group>
          </Flex>
          <Grid w={'100%'}>
            <GridCol span={{ lg: 3, sm: 12 }}>
              <Container unstyled style={{ display: 'flex', flexDirection: 'column' }}>
                <Text size={'lg'}>Total Revenue</Text>
                <Skeleton visible={isLoadingSalesSummary} radius={'xl'}>
                  <Text fz={'h1'} fw={550} c={'blue'}>
                    {formatCurrency(salesByYear?.total_revenue ?? '0')}
                  </Text>
                </Skeleton>
                <Link to="/transactions" style={{ color: 'blue' }}>
                  view all
                </Link>
              </Container>
            </GridCol>
            <GridCol span={{ lg: 3, sm: 12 }}>
              <Container unstyled style={{ display: 'flex', flexDirection: 'column' }}>
                <Text size={'lg'}>Total Sales</Text>

                <Skeleton visible={isLoadingSalesSummary} radius={'xl'}>
                  <Text fz={'h1'} fw={550} c={'#1e8fb7'}>
                    {formatCurrency(salesByYear?.total_sales ?? '0')}
                  </Text>
                </Skeleton>
                <Link to="/transactions" style={{ color: 'blue' }}>
                  view all
                </Link>
              </Container>
            </GridCol>
            <GridCol span={{ lg: 3, sm: 12 }}>
              <Container unstyled style={{ display: 'flex', flexDirection: 'column' }}>
                <Text size={'lg'}>Total Profit</Text>
                <Skeleton visible={isLoadingSalesSummary} radius={'xl'}>
                  <Text fz={'h1'} fw={550} c={'green'}>
                    {formatCurrency(salesByYear?.total_profit ?? '0')}
                  </Text>
                </Skeleton>
                <Link to="/transactions" style={{ color: 'blue' }}>
                  view all
                </Link>
              </Container>
            </GridCol>
            <GridCol span={{ lg: 3, sm: 12 }}>
              <Container unstyled style={{ display: 'flex', flexDirection: 'column' }}>
                <Text size={'lg'}>Total Tax</Text>
                <Skeleton visible={isLoadingSalesSummary} radius={'xl'}>
                  <Text fz={'h1'} fw={550} c={'yellow'}>
                    {formatCurrency(salesByYear?.total_tax ?? '0')}
                  </Text>
                </Skeleton>
                <Link to="/transactions" style={{ color: 'blue' }}>
                  view all
                </Link>
              </Container>
            </GridCol>
          </Grid>
        </GridCol>
      </Grid>

      <Grid w={'100%'}>
        <GridCol span={{ lg: 9, sm: 12 }}>
          <Container unstyled>
            <Flex justify={'space-between'} align={'center'}>
              <Text size={'xl'} m={'md'}>
                Sales Overview
              </Text>
              <Select placeholder="Select year" value={yearLineCharts} onChange={(e) => setYearLineCharts(e!)} data={years} />
            </Flex>
            <SalesLineChart data={salesPerMonth} loading={isLoadingSalesPerMonth} />
          </Container>
        </GridCol>
        <GridCol span={{ lg: 3, sm: 12 }}>
          <Container unstyled>
            <Flex justify={'space-between'} align={'center'}>
              <Text size={'xl'} m={'md'}>
                Sales By Category
              </Text>
              <Select w={140} placeholder="Select year" value={yearPieCharts} onChange={(e) => setYearPieCharts(e!)} data={years} />
            </Flex>
            <SalesPieChart data={salesByCategory} loading={isLoadingSalesByCategory} />
          </Container>
        </GridCol>
      </Grid>
    </Flex>
  );
}
