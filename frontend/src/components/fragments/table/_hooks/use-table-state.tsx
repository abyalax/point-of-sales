import { createContext, useContext, useState } from 'react';
import type { FC, Dispatch, ReactNode, SetStateAction } from 'react';
import type { PaginationState, SortingState } from '@tanstack/react-table';

export type EngineSide = 'client_side' | 'server_side';

interface TableConfigContextProps {
  engine: EngineSide;
  setEngine: Dispatch<SetStateAction<EngineSide>>;

  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;

  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;

  globalFilter: string | undefined;
  setGlobalFilter: Dispatch<SetStateAction<string | undefined>>;
}

const TableConfigContext = createContext<TableConfigContextProps | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTableState = () => {
  const context = useContext(TableConfigContext);
  if (!context) throw new Error('useTableState must be used within a TableProvider');
  return context;
};

const TableProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [engine, setEngine] = useState<EngineSide>('server_side');
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState<string | undefined>(undefined);
  const [sorting, setSorting] = useState<SortingState>([]);

  return (
    <TableConfigContext.Provider
      value={{
        engine,
        setEngine,
        pagination,
        setPagination,
        globalFilter,
        setGlobalFilter,
        sorting,
        setSorting,
      }}
    >
      {children}
    </TableConfigContext.Provider>
  );
};

export default TableProvider;
