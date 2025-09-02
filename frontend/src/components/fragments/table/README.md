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
});
```

Lihat contoh `queryProductsSchema` dan type query search disini

```
└── 📁modules
    └── 📁product
        ├── product.api.ts
        └── product.schema.ts
```

---

### 2. Komponen Page (`RouteComponent`)

```tsx
function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const defaultVisible: TProductColumn[] = ['name', 'price', 'status', 'category', 'select', 'stock'];
  const { columns, columnIds, initialColumnVisibility } = useColumn({ defaultVisible });
  const { data: dataProducts, isLoading: isLoadingProducts } = useFilterProducts({
    ...search,
    sort_by: search.sort_by as keyof Partial<Product>,
  });
  const { data: dataCategories, isLoading } = useGetProductCategories();

  const categories = dataCategories?.map((e) => {
    return {
      label: e.name,
      value: e.id.toString(),
    };
  });

  const onMinPriceChange = useDebouncedCallback((value: number) => {
    navigate({ search: (prev) => ({ ...prev, min_price: value }), replace: true, viewTransition: true });
  }, DEFAULT.DEBOUNCE_INPUT);

  const onMaxPriceChange = useDebouncedCallback((value: number) => {
    navigate({ search: (prev) => ({ ...prev, max_price: value }), replace: true, viewTransition: true });
  }, DEFAULT.DEBOUNCE_INPUT);

  const onStatusChange = (e: string) => {
    navigate({
      search: (prev) => ({ ...prev, status: e === '' ? undefined : e }),
      replace: true,
      viewTransition: true,
    });
  };

  const onCategoryChange = (e: string | null) => {
    const value = e === '' ? undefined : Number(e);
    navigate({
      search: (prev) => ({ ...prev, category: value }),
      replace: true,
      viewTransition: true,
    });
  };

  return (
    <Skeleton visible={isLoadingProducts}>
      {isLoadingProducts && <Loader />}
      <Table
        data={dataProducts}
        columns={columns}
        columnIds={columnIds}
        route={Route}
        path={{
          detail: '/products/$id',
          update: '/products/$id',
        }}
        enableFeature={{
          engineSide: 'server_side',
          pagination: true,
          search: { fieldSearchable: 'name' },
          columnVisibilitySelector: { initialColumnVisibility },
          virtualizer: { virtualizeAt: 1000 },
          menufilter: (
            <Menu position="bottom-start">
              <Menu.Target>
                <Tooltip label="Filter Data">
                  <Button variant="light">
                    <FaFilter />
                  </Button>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Fieldset legend="Filter Data">
                  <Flex gap={'md'} direction={'column'}>
                    {isLoading ? null : (
                      <Select
                        onChange={onCategoryChange}
                        clearable
                        onClear={() => onCategoryChange('')}
                        checkIconPosition="left"
                        value={search.category?.toString()}
                        allowDeselect
                        searchable
                        data={categories}
                        label="Category"
                        placeholder="Select Category"
                      />
                    )}
                    <Flex gap={'md'}>
                      <NumberInput value={search.min_price} placeholder="Min Price" label="Min Price" onChange={(e) => onMinPriceChange(Number(e))} />
                      <NumberInput value={search.max_price} placeholder="Max Price" label="Max Price" onChange={(e) => onMaxPriceChange(Number(e))} />
                    </Flex>
                    <SegmentedControl
                      value={search.status}
                      onChange={onStatusChange}
                      data={[
                        { label: 'Available', value: EProductStatus.AVAILABLE },
                        { label: 'UnAvailable', value: EProductStatus.UNAVAILABLE },
                        { label: 'All', value: '' },
                      ]}
                    />
                  </Flex>
                </Fieldset>
              </Menu.Dropdown>
            </Menu>
          ),
        }}
      />
    </Skeleton>
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
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { filterProducts } from '~/modules/product/product.api';
import type { ProductPaginated, QueryProducts } from '~/modules/product/product.schema';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import type { TAxiosResponse, TResponse } from '~/common/types/response';

type Result = UseQueryOptions<TAxiosResponse<ProductPaginated>, TResponse, ProductPaginated | undefined, QueryKey<QueryProducts>[]>;

export const queryFilterProducts = (query: QueryProducts): Result => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_ALL, query],
  queryFn: () => filterProducts(query),
  select: (res) => res.data.data,
});

export const useFilterProducts = (query: QueryProducts = {}) => {
  return useQuery(queryFilterProducts(query));
};
```

---

## ⚙️ Properti Komponen `Table`

### Props

| Properti        | Tipe                                 | Deskripsi                                                                                                |
| --------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `route`         | `AnyRoute`                           | Route saat ini (untuk akses search param)                                                                |
| `enableFeature` | `EnableFeature<T>`                   | Opsi tambahan untuk mengontrol fitur tabel (lihat detail di bawah)                                       |
| `columns`       | `ColumnDef<T, any>[]`                | Daftar kolom untuk tabel                                                                                 |
| `columnIds`     | `(string \| undefined)[]`            | ID kolom yang tersedia (mengikuti urutan `columns`)                                                      |
| `data`          | `{ data: T[]; meta: MetaResponse }?` | Data yang ditampilkan dalam tabel beserta informasi meta (opsional, khusus untuk server-side pagination) |
| `path.detail`   | `FileRouteTypes['to']?`              | Path detail view, misal `/products/$id` (opsional)                                                       |
| `path.create`   | `FileRouteTypes['to']?`              | Path create view, misal `/products/create` (opsional)                                                    |
| `path.update`   | `FileRouteTypes['to']?`              | Path update view, misal `/products/$id` (opsional)                                                       |

### Enable Feature

| Properti                   | Tipe                                                    | Deskripsi                                                                                                  |
| -------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `search`                   | `{ fieldSearchable: keyof T; debounceSearch?: number }` | Mengaktifkan pencarian dengan field tertentu, bisa ditambahkan delay pencarian (`debounceSearch` dalam ms) |
| `virtualizer`              | `{ virtualizeAt: number }`                              | Mengaktifkan virtual rendering saat jumlah data melebihi `virtualizeAt`                                    |
| `columnVisibilitySelector` | `{ initialColumnVisibility: Record<string, boolean> }`  | Mengatur visibilitas awal kolom serta menyediakan selector untuk mengubah visibilitas                      |
| `engineSide`               | `'client_side' \| 'server_side'`                        | Mode kontrol data (client-side atau server-side)                                                           |
| `pagination`               | `boolean`                                               | Menentukan apakah tabel menggunakan pagination                                                             |
| `menufilter`               | `ReactNode`                                             | Komponen filter tambahan yang ditampilkan di atas tabel                                                    |

---

## 📎 Catatan Tambahan

- Kolom dengan ID `"select"` adalah custom column untuk checkbox select (dengan `getToggleSelectedHandler`).
- Pastikan `route` dan `validateSearch` diset di level TanStack Router untuk mendukung type safety and validated query param (isi dengan schema zod) .

---
