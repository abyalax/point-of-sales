---

# **Architecture & Style Code**

## **Tujuan**

Dokumen ini menjelaskan struktur folder, pola penulisan kode, dan aturan konsistensi pada proyek. Fungsinya:

* Memberi konteks cepat untuk AI/LLM atau developer baru.
* Memastikan pola penulisan kode seragam di seluruh fitur.
* Mempermudah debugging dan scaling aplikasi.

---

## **Struktur Folder**

```
src/
├─ app/                   → Halaman utama (Tanstack Router)
│  └─ feature-name/
│     ├─ _components/     → Komponen khusus halaman ini
│     ├─ _hooks/          → Hooks khusus halaman ini
│     ├─ _schema/         → Validasi/Zod schema untuk halaman ini
│     └─ page.tsx         → Entry page
│
├─ modules/               → API contract & schema per domain
│  └─ product/
│     ├─ product.api.ts   → Panggilan API (axios/fetch)
│     └─ product.schema.ts→ Zod schema & types domain
│
├─ components/            → UI reusable dan fragment global
│  ├─ ui/                 → Komponen dasar ( pelengkap ui mantine )
│  └─ fragments/          → Pola siap pakai lintas fitur
│
├─ common/                → Helper, constants, types global
│  ├─ schema/             → Schema validasi global
│  ├─ types/              → Typescript types global
│  └─ utils/              → Formatter & helper murni
│
├─ stores/                → State management global (Zustand)
└─ utils/                 → Fungsi umum non-React
```

---

## **Aturan Penulisan**

### **1. API vs Hooks**

- Semua panggilan API didefinisikan di `modules/<feature>/*.api.ts`
  fetch api semua melalui axios api

  ```ts
  // modules/product/product.api.ts
  export const filterProducts = async (params: QueryProducts): Promise<TAxiosResponse<ProductPaginated>> => {
    return api.get('/products/search', { params });
  };
  ```

- Hooks untuk React Query/State dibuat di `app/.../_hooks/` dengan pola:

  ```ts
  // app/products/_hooks/use-filter-products.ts
  type Result = UseQueryOptions<TAxiosResponse<ProductPaginated>, TResponse, ProductPaginated | undefined, QueryKey<QueryProducts>[]>;

  export const queryFilterProducts = (query: QueryProducts = { engine: 'server_side' }): Result => ({
    queryKey: [QUERY_KEY.PRODUCT.GET_ALL, query],
    queryFn: () => filterProducts(query),
    select: (res) => res.data.data,
  });

  export const useFilterProducts = (query: QueryProducts = {}) => {
    return useQuery(queryFilterProducts(query));
  };
  ```

### **2. Schema & Types**

- Gunakan **Zod** untuk validasi API response dan form.
- Simpan schema di dekat API module (domain-based), bukan di folder random.
- Contoh:

  ```ts
  // modules/product/product.schema.ts
  export const productSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
  });
  export type Product = z.infer<typeof productSchema>;
  ```

### **3. Styling**

- Utamakan **Mantine theme** (`sx`, `createStyles`) untuk styling konsisten.
- Gunakan `.module.css` hanya untuk animasi atau layout kompleks.
- Semua warna, spacing, dan font diambil dari theme, **tidak hardcode**.

### **4. Penamaan File**

- Hooks: `use-*.ts`
- Schema: `*.schema.ts`
- API: `*.api.ts`
- DTO / Types: `*.dto.ts` atau `*.types.ts`
- Komponen reusable: PascalCase (`ProductCard.tsx`)
- Komponen halaman: selalu di `_components` atau langsung di `page.tsx`.

---

## **Prinsip Arsitektur**

1. **Separation of Concerns**: UI tidak langsung panggil API, selalu lewat hooks.
2. **Single Source of Truth**: Schema Zod adalah referensi utama struktur data.
3. **Reusable First**: Komponen dan hooks yang umum dipakai banyak fitur → pindah ke `components/` atau `common/`.
4. **Strict Type Checking**: TypeScript wajib strict mode ON.
5. **Consistent Import Path**: Gunakan path alias di `tsconfig.json`:

   ```json
   {
     "compilerOptions": {
       "paths": {
         "@modules/*": ["src/modules/*"],
         "@components/*": ["src/components/*"],
         "@utils/*": ["src/utils/*"]
       }
     }
   }
   ```

---

## **Alur Data Singkat**

1. **Halaman / Komponen** memanggil **hooks**.
2. **Hooks** mengonsumsi **API module** + validasi data dengan **Zod schema**.
3. **API module** hanya berisi fungsi HTTP murni (axios/fetch).
4. **Schema & types** memastikan data konsisten dari backend → UI.

---
