/* eslint-disable @typescript-eslint/no-explicit-any */
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Transition, Text, Select, UnstyledButton, Tooltip, SegmentedControl, HoverCard, Container } from '@mantine/core';
import { Autocomplete, Button, Flex, Group, Pagination, Pill, Table as TableMantine } from '@mantine/core';
import { useVirtualizer } from '@tanstack/react-virtual';

import type { ColumnDef, PaginationState, Row, SortingState, Updater } from '@tanstack/react-table';
import type { AnyRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FaArrowDown, FaArrowUp, FaPlus, FaSearch } from 'react-icons/fa';

import { ColumnVisibilitySelector } from '~/components/fragments/table/_ui/column-visibility';
import { useDebouncedCallback } from '~/components/hooks/use-debounce-callback';
import { createFuzzyFilter } from '~/utils/table';

import type { MetaResponse } from '~/common/types/meta';
import type { FileRouteTypes } from '~/routeTree.gen';

import '@mantine/core/styles/Pagination.css';
import '@mantine/core/styles/Table.css';
import { getColors } from '~/components/themes';

export type EngineSide = 'client_side' | 'server_side';

type EnableFeature<T> = {
  search?: { fieldSearchable: keyof T; debounceSearch?: number };
  virtualizer?: { virtualizeAt: number };
  columnVisibilitySelector?: { initialColumnVisibility: Record<string, boolean> };
  engineSide?: EngineSide;
  pagination?: boolean;
  menufilter?: ReactNode;
};

export type TableProps<T> = {
  route: AnyRoute;
  enableFeature: EnableFeature<T>;
  columns: ColumnDef<T, any>[];
  columnIds: (string | undefined)[];
  data?: { data: T[]; meta: MetaResponse };
  path: {
    detail?: FileRouteTypes['to'];
    create?: FileRouteTypes['to'];
    update?: FileRouteTypes['to'];
  };
};

const defaultFeature: EnableFeature<any> = {
  virtualizer: { virtualizeAt: 1000 },
  engineSide: 'client_side',
  pagination: true,
};

export const Table = <T,>({ enableFeature = defaultFeature, ...props }: TableProps<T>) => {
  const [engine, setEngine] = useState<EngineSide>(enableFeature.engineSide ?? 'client_side');
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState<string | undefined>(undefined);
  const [sorting, setSorting] = useState<SortingState>([]);

  const fuzzyFilter = createFuzzyFilter<T>();
  const parentRef = useRef<HTMLDivElement>(null);
  const search = props.route.useSearch();
  const navigate = props.route.useNavigate();

  const isClientControl = engine === 'client_side';
  const isServerControl = engine === 'server_side';

  const searchData = useMemo(() => {
    const options: T[] | unknown[] = props.data?.data || [];
    const unique = new Set<string>();
    return options
      .map((e: any) => e[enableFeature.search?.fieldSearchable as keyof T])
      .filter((str) => {
        if (!str) return false;
        if (unique.has(str)) return false;
        unique.add(str);
        return true;
      });
  }, [props.data?.data, enableFeature.search?.fieldSearchable]);

  const pageIndex = isServerControl ? (search.page ?? 1) - 1 : pagination.pageIndex;
  const pageSize = isServerControl ? (search.per_page ?? 10) : pagination.pageSize;
  const debounceSearch = enableFeature.search?.debounceSearch ?? 800;
  const filterFns = { fuzzy: fuzzyFilter };

  const navigateCreatePath = () => {
    if (props.path.create === undefined) return;
    navigate({ to: props.path.create });
  };

  const navigateUpdatePath = (id: number) => {
    if (props.path.update === undefined) return;
    navigate({ to: props.path.update, params: { id } });
  };

  const navigateDetailPath = (id: number) => {
    if (props.path.detail === undefined) return;
    navigate({ to: props.path.detail, params: { id } });
  };

  const serverSearch = useDebouncedCallback((value: string) => {
    navigate({
      replace: true,
      search: {
        ...search,
        search: value,
        page: 1,
      },
      viewTransition: true,
    });
  }, debounceSearch);

  const clientSearch = useDebouncedCallback((value: string) => {
    setGlobalFilter(value);
  }, debounceSearch);

  const onPaginationChange = (updater: Updater<PaginationState>) => {
    const next = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
    navigate({
      replace: true,
      search: {
        ...search,
        page: next.pageIndex + 1,
        per_page: next.pageSize,
      },
    });
  };

  const onEngineChange = (updater: Updater<EngineSide>) => {
    const next = typeof updater === 'function' ? updater('server_side') : updater;
    setEngine(updater);
    navigate({
      search: {
        ...search,
        engine: next,
      },
      replace: true,
      viewTransition: true,
    });
  };

  const onSortingChange = (updater: Updater<SortingState>) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(updater);
    navigate({
      search: {
        ...search,
        sort_by: next[0]?.id,
        sort_order: next[0]?.desc ? 'DESC' : 'ASC',
      },
      replace: true,
      viewTransition: true,
    });
  };

  const table = useReactTable<T>({
    /**Common */
    data: props.data?.data || [],
    columns: props.columns,
    debugTable: true,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableMultiSort: true,
    getCoreRowModel: getCoreRowModel(),

    /**Client Side */
    getSortedRowModel: isClientControl ? getSortedRowModel() : undefined,
    getFilteredRowModel: isClientControl ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enableFeature.pagination ? (isClientControl ? getPaginationRowModel() : undefined) : undefined,

    filterFns: isClientControl ? filterFns : undefined,
    globalFilterFn: isClientControl ? fuzzyFilter : undefined,

    /**Server Side or Client Side */
    onGlobalFilterChange: isServerControl ? serverSearch : clientSearch,
    onSortingChange: isServerControl ? onSortingChange : setSorting,

    /**Server Side */
    manualPagination: isServerControl,
    manualSorting: isServerControl,
    manualFiltering: isServerControl,
    pageCount: isServerControl ? props.data?.meta.total_pages : undefined,
    onPaginationChange: enableFeature.pagination ? (isServerControl ? onPaginationChange : setPagination) : undefined,

    /**State */
    initialState: {
      columnVisibility: enableFeature.columnVisibilitySelector?.initialColumnVisibility,
      columnOrder: props.columnIds as string[],
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    state: {
      sorting,
      pagination: enableFeature.pagination
        ? {
            pageIndex,
            pageSize,
          }
        : undefined,
      globalFilter: isClientControl ? globalFilter : search.search,
    },
  });

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
  const virtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 34,
    overscan: 20,
  });

  useEffect(() => {
    table.setGlobalFilter(globalFilter);
  }, [globalFilter, engine, table]);

  useEffect(() => {
    if (search.search !== undefined && isClientControl) setGlobalFilter(search.search);
  }, [search.search, isClientControl, setGlobalFilter]);

  useEffect(() => {
    if (!search.engine) {
      navigate({
        search: {
          ...search,
          engine: 'server_side',
        },
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container unstyled style={{ padding: '10px', borderRadius: '10px' }}>
      <Flex justify="space-between" align="center" mb={6}>
        <Group mb={14}>
          {enableFeature.menufilter}
          {enableFeature.search && (
            <Flex gap={'md'} align={'center'} justify={'center'}>
              <Autocomplete
                leftSection={<FaSearch />}
                rightSectionWidth={200}
                placeholder="Search..."
                data={searchData}
                value={globalFilter}
                onChange={setGlobalFilter}
                rightSection={
                  <HoverCard width={280} shadow="md">
                    <HoverCard.Target>
                      <SegmentedControl
                        mr={0}
                        size="xs"
                        value={engine}
                        onChange={() => onEngineChange(engine === 'client_side' ? 'server_side' : 'client_side')}
                        data={[
                          { label: 'Local Search', value: 'client_side' },
                          { label: 'Global Search', value: 'server_side' },
                        ]}
                      />
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Text size="sm" style={{ textAlign: 'center' }}>
                        {engine === 'client_side'
                          ? 'Local Search Increase Speed Control But Leaks Memory For Cache Data'
                          : 'Global Search Increase Memory Control But Decrease Speed'}
                      </Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                }
              />
            </Flex>
          )}
          <Transition transition="fade-down" mounted={selectedRows.length > 0}>
            {() => (
              <>
                <Pill fz={'lg'} fw={'normal'} withRemoveButton onRemove={() => table.resetRowSelection()}>
                  {selectedRows.length}
                </Pill>
              </>
            )}
          </Transition>
        </Group>
        <Group>
          {enableFeature.columnVisibilitySelector?.initialColumnVisibility && <ColumnVisibilitySelector table={table} columnIds={props.columnIds} />}
          {props.path.create && (
            <Tooltip label="Add New Item">
              <Button onClick={navigateCreatePath} variant="light">
                <FaPlus />
              </Button>
            </Tooltip>
          )}
        </Group>
      </Flex>
      <Container
        unstyled
        p={10}
        bdrs={10}
        ref={table.getRowModel().rows.length > (enableFeature.virtualizer?.virtualizeAt as number) ? parentRef : undefined}
        style={{ height: '60vh', backgroundColor: getColors('primary') }}
      >
        <TableMantine.ScrollContainer minWidth={'100%'} maxHeight={'57vh'}>
          <TableMantine highlightOnHover stickyHeader stickyHeaderOffset={-10} striped>
            <TableMantine.Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableMantine.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableMantine.Th key={header.id} colSpan={header.colSpan}>
                      <Tooltip
                        label={
                          header.column.getCanSort()
                            ? engine === 'client_side'
                              ? header.column.getNextSortingOrder() === 'asc'
                                ? 'Sort Ascending'
                                : header.column.getNextSortingOrder() === 'desc'
                                  ? 'Sort Descending'
                                  : 'Clear sort'
                              : 'Change to Local Search for Enable Sorting'
                            : engine === 'server_side'
                              ? 'Please Change to Local Search'
                              : ''
                        }
                      >
                        <UnstyledButton onClick={header.column.getToggleSortingHandler()}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <FaArrowUp style={{ margin: '0 5px' }} />,
                            desc: <FaArrowDown style={{ margin: '0 5px' }} />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </UnstyledButton>
                      </Tooltip>
                    </TableMantine.Th>
                  ))}
                </TableMantine.Tr>
              ))}
            </TableMantine.Thead>
            <TableMantine.Tbody>
              {table.getRowModel().rows.length > (enableFeature.virtualizer?.virtualizeAt as number)
                ? virtualizer.getVirtualItems().map((virtualRow, index) => {
                    const rows = table.getRowModel().rows;
                    const row = rows[virtualRow.index];
                    return (
                      <TableMantine.Tr
                        onClick={() => navigateDetailPath((row as any).original.id)}
                        key={row.id}
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableMantine.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableMantine.Td>
                        ))}
                      </TableMantine.Tr>
                    );
                  })
                : table.getRowModel().rows.map((row: Row<any>) => (
                    <TableMantine.Tr
                      bg={row.getIsSelected() ? getColors('secondary') : undefined}
                      onClick={() => navigateUpdatePath((row as any).original.id)}
                      style={{ cursor: 'pointer' }}
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableMantine.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableMantine.Td>
                      ))}
                    </TableMantine.Tr>
                  ))}
            </TableMantine.Tbody>
            <TableMantine.Tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <TableMantine.Tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableMantine.Th key={header.id}>{flexRender(header.column.columnDef.footer, header.getContext())}</TableMantine.Th>
                  ))}
                </TableMantine.Tr>
              ))}
            </TableMantine.Tfoot>
            <TableMantine.Caption>{table.getRowModel().rows.length} Rows Found</TableMantine.Caption>
          </TableMantine>
        </TableMantine.ScrollContainer>
      </Container>
      {enableFeature.pagination && (
        <>
          <Group justify="space-between" mt="md" align="center">
            <Flex gap="xs" justify="start" align="start" direction={'column'}>
              <Group>
                <Text size="sm" w={100}>
                  Total Page
                </Text>
                <Text size="sm">: {table.getPageCount()}</Text>
              </Group>
              <Group>
                <Text size="sm" w={100}>
                  Current Page
                </Text>
                <Text size="sm">: {table.getState().pagination.pageIndex + 1}</Text>
              </Group>
              <Group>
                <Text size="sm" w={100}>
                  Page Size
                </Text>
                <Select
                  size="xs"
                  style={{ width: '70px' }}
                  value={table.getState().pagination.pageSize.toString()}
                  onChange={(value) => table.setPageSize(Number(value))}
                  data={['10', '20', '30', '50', '100']}
                />
              </Group>
            </Flex>
          </Group>
          <Flex justify={'center'} align={'center'}>
            <Pagination
              size="md"
              total={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
              onChange={(page) => table.setPageIndex(page - 1)}
              onNextPage={table.nextPage}
              onPreviousPage={table.previousPage}
            />
          </Flex>
        </>
      )}
    </Container>
  );
};
