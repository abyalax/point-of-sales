---

# 📊 Komponen `Table` — Dokumentasi Penggunaan

Komponen `Table` adalah komponen reusable berbasis **TanStack Table** yang mendukung:

* Server-side pagination
* Client-side pagination (make sure data backend dikirim semua | backend tidak melakukan paginasi)
* Autocomplete Searching (fuzzyFilter di client side)
* Integrasi dengan TanStack Router
* Dynamic column visibility
* Custom column render (checkbox, status label, currency, dsb)

---

## 📦 Struktur Folder

```bash
├── _hooks/
│   ├── use-get-products.ts     # Hook fetch data
│   └── use-column.ts           # Konfigurasi kolom tabel
├── index.tsx                   # File route page
└── ...
```

---

## 🚀 Cara Penggunaan

### 1. Setup `Route` dan Validasi Search Params

```ts
import { createFileRoute } from '@tanstack/react-router';
import { queryProducts } from './_hooks/use-get-products';
import { queryProductsSchema, type QueryProducts } from '~/api/product/type';

export const Route = createFileRoute('/(protected)/products/')({
  component: RouteComponent,
  validateSearch: queryProductsSchema,
  beforeLoad: async ({ context, search }) => {
    const params: QueryProducts = {
      page: search.page ?? 1,
      per_page: search.per_page ?? 10,
      filters: search.filters,
      sort_by: search.sort_by,
      search: search.search,
    };
    await context.queryClient.ensureQueryData(queryProducts(params));
  },
});
```

Lihat contoh `queryProductsSchema` dan type query search disini

```
└── 📁api
    └── 📁product
        ├── api.ts
        ├── data.ts
        ├── type.ts
```

---

### 2. Komponen Page (`RouteComponent`)

```tsx
import useGetProducts from './_hooks/use-get-products';
import { useColumn } from './_hooks/use-column';
import { Table } from '~/components/fragments/table';
import type { Product } from '~/api/product/type';

function RouteComponent() {
  const search = Route.useSearch();
  const { data } = useGetProducts(search);
  const { columns, columnIds, initialColumnVisibility } = useColumn();

  return (
    <Table<Product>
      data={data}
      columns={columns}
      columnIds={columnIds}
      initialColumnVisibility={initialColumnVisibility}
      route={Route}
      path={{
        detail: '/products/$id',
        create: '/products/create',
        update: '/products/$id',
      }}
      control="server_side"
    />
  );
}
```

---

## 🧩 Konfigurasi Kolom: `useColumn`

```ts
import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@mantine/core";
import { formatCurrency } from "~/utils/format";
import { EProductStatus, type Product } from "~/api/product/type";

const columnHelper = createColumnHelper<Product>();

export const useColumn = () => {
  const columns = useMemo(() => [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          onClick={(e) => e.stopPropagation()}
          onChange={row.getToggleSelectedHandler()}
          checked={row.getIsSelected()}
        />
      ),
    }),
    columnHelper.accessor("name", { id: "name", header: "Product Name" }),
    columnHelper.accessor("price", {
      id: "price",
      header: "Price",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("stock", {
      id: "stock",
      header: "Stock",
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: "Status",
      cell: (info) =>
        info.getValue() === EProductStatus.AVAILABLE ? "Active" : "InActive",
    }),
  ], []);

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const defaultVisible = ['name', 'price', 'status', 'category', 'select', 'stock'];

  const initialColumnVisibility = useMemo(() => {
    return columnIds.reduce((acc, val) => {
      acc[val as keyof Product | "select"] = defaultVisible.includes(val);
      return acc;
    }, {} as Record<string, boolean>);
  }, [columnIds]);

  return { columns, columnIds, initialColumnVisibility };
};
```

- Note `defaultVisible` adalah properti entity yang di pakai misalkan disini `Product`

---

## 🔁 Fetch Data Produk: `useGetProducts`

```ts
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '~/api/product';
import type { QueryProducts } from '~/api/product/type';

export const queryProducts = (query: QueryProducts = {}) => ({
  queryKey: ['product.getAll', query],
  queryFn: () => getProducts(query),
});

const useGetProducts = (query: QueryProducts = {}) => {
  return useQuery(queryProducts(query));
};

export default useGetProducts;
```

---

## ⚙️ Properti Komponen `Table`

| Properti                  | Tipe                             | Deskripsi                                 |
| ------------------------- | -------------------------------- | ----------------------------------------- |
| `data`                    | `Array<T>`                       | Data yang akan ditampilkan                |
| `columns`                 | `ColumnDef<T, any>[]`            | Kolom untuk tabel                         |
| `columnIds`               | `string[]`                       | ID kolom yang tersedia                    |
| `initialColumnVisibility` | `Record<string, boolean>`        | Kontrol visibilitas kolom                 |
| `route`                   | `RouteObject`                    | Route saat ini (untuk akses search param) |
| `path.detail`             | `string`                         | Path detail view (`/products/$id`)        |
| `path.create`             | `string`                         | Path create view (`/products/create`)     |
| `path.update`             | `string`                         | Path update view (`/products/$id`)        |
| `control`                 | `'server_side' \| 'client_side'` | Mode kontrol data                         |

---

## 📎 Catatan Tambahan

- Kolom dengan ID `"select"` adalah custom column untuk checkbox select (dengan `getToggleSelectedHandler`).
- Pastikan `route` dan `validateSearch` diset di level TanStack Router untuk mendukung query param.

---
