import type { FilterFn } from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

export const createFuzzyFilter = <T>(): FilterFn<T> => {
  return (row, columnId, value, addMeta) => {
    if (!value || value === '') return true;
    const itemValue = row.getValue(columnId);
    if (itemValue === null || itemValue === undefined) return false;
    const itemRank = rankItem(String(itemValue), String(value));
    addMeta({ itemRank });
    return itemRank.passed;
  };
};
