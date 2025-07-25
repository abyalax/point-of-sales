import type { EngineSide } from '~/components/fragments/table/_hooks/use-table-state';

interface Pagination {
  page?: number;
  per_page?: number;
}
interface Sorting<E> {
  sort_by?: keyof E | undefined;
  sort_order?: 'ASC' | 'DESC';
}
interface GlobalFilter {
  search?: string;
}
interface Config {
  engine?: EngineSide;
}

export interface MetaRequest<E> extends Pagination, Sorting<E>, GlobalFilter, Config {}

export interface MetaResponse {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
}
