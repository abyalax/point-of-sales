import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import { Autocomplete, Table, Button, UnstyledButton, Container } from '@mantine/core';
import type { Row } from '@tanstack/react-table';

import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { useState } from 'react';

import { getColors } from '~/components/themes';
import { createFuzzyFilter } from '~/utils/table';
import { useColumn } from '../_hooks/use-column';
import type { Product } from '~/modules/product/product.schema';

export function TableModal({ products, handleLoadMore }: { products: Product[]; handleLoadMore: VoidFunction }) {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const fuzzyFilter = createFuzzyFilter<Product>();
  const columns = useColumn();

  const table = useReactTable<Product>({
    data: products ?? [],
    columns,
    debugTable: true,
    enableGlobalFilter: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <Container unstyled style={{ minHeight: '65vh' }}>
      <Autocomplete
        data={products?.map((product) => product.name) ?? []}
        value={globalFilter}
        onChange={(value) => setGlobalFilter(value)}
        placeholder="Search..."
      />
      <Table.ScrollContainer minWidth={'100%'} maxHeight={'60vh'}>
        <Table highlightOnHover stickyHeader stickyHeaderOffset={-10} striped>
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th key={header.id} colSpan={header.colSpan}>
                    <UnstyledButton onClick={header.column.getToggleSortingHandler()}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <FaArrowUp style={{ margin: '0 5px' }} />,
                        desc: <FaArrowDown style={{ margin: '0 5px' }} />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </UnstyledButton>
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {table.getRowModel().rows.map((row: Row<Product>) => (
              <Table.Tr bg={row.getIsSelected() ? getColors('secondary') : undefined} style={{ cursor: 'pointer' }} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
          <Table.Tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <Table.Tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <Table.Th key={header.id}>{flexRender(header.column.columnDef.footer, header.getContext())}</Table.Th>
                ))}
              </Table.Tr>
            ))}
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Button fullWidth onClick={handleLoadMore}>
                  Load More...
                </Button>
              </Table.Td>
            </Table.Tr>
          </Table.Tfoot>
          <Table.Caption>{table.getRowModel().rows.length} Rows Found</Table.Caption>
        </Table>
      </Table.ScrollContainer>
    </Container>
  );
}
