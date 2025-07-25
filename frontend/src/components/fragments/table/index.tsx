import TableProvider from './_hooks/use-table-state';
import { type TableProps, TableComponent } from './_ui/table';

export const Table = <T,>(props: TableProps<T>) => {
  return (
    <TableProvider>
      <TableComponent {...props} />
    </TableProvider>
  );
};
