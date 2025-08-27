import { Button, Checkbox, Menu, Popover, Tooltip } from '@mantine/core';
import type { Table } from '@tanstack/react-table';
import { FaEye } from 'react-icons/fa';
import { convertCamelToTitleCase } from '~/utils/format';

type ColumnSelector<T> = {
  table: Table<T>;
  columnIds: (string | undefined)[];
};

export const ColumnVisibilitySelector = <T,>({ table, columnIds }: ColumnSelector<T>) => {
  const columnVisibilityCheckboxState = Object.entries(table.getState().columnVisibility)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value)
    .map(([key]) => key);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, id: string | undefined) => {
    const selectedOptions = e.target.checked ? [...columnVisibilityCheckboxState, id] : columnVisibilityCheckboxState.filter((key) => key !== id);
    table.setColumnVisibility(
      columnIds.reduce((acc: { [id: string]: boolean }, val) => {
        acc[val ?? ''] = selectedOptions.includes(val);
        return acc;
      }, {}),
    );
  };

  return (
    <Popover>
      <Popover.Target>
        <Tooltip label="Select Columns">
          <Button variant="outline">
            <FaEye size={22} />
          </Button>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <Menu>
          <Menu.Label fz={'sm'}>Visible Columns</Menu.Label>
          {columnIds.map((id, index) => (
            <Menu.Item key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Checkbox
                value={id}
                label={convertCamelToTitleCase(id ?? '')}
                checked={columnVisibilityCheckboxState.includes(id ?? '')}
                onChange={(e) => handleOnChange(e, id)}
              />
            </Menu.Item>
          ))}
        </Menu>
      </Popover.Dropdown>
    </Popover>
  );
};
