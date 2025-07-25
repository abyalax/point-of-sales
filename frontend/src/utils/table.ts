import type { FilterFn, SortingState } from '@tanstack/react-table';
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

export const reorder = (list: string[], startIndex: number, endIndex: number): string[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**Serializing at Frontend */
export const serializeSorting = (sorting: SortingState): string => sorting.map(s => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(',');

/**Deserialize at Backend */
export const deserializeSorting = (input?: string): SortingState => {
  if (input === undefined) return [];
  return input.split(',').map(s => {
    const [id, dir] = s.split(':');
    return {
      id,
      desc: dir === 'desc',
    };
  });
};
