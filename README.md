# Point of Sales (Monorepo)

Project ini menggunakan **pnpm workspace** untuk mengelola frontend dan backend dalam satu repository.

- **Frontend**: React + Vite + Mantine + Chart.js + TanStack (Router, Query, Table, Virtual)
- **Backend**: NestJS + TypeORM + MySQL + Zod + Jest

Project ini dioptimalkan agar **developer experience konsisten**:

- Node.js minimal **v22+** (ditentukan di `engines.node`)
- Package manager **pnpm@10.14.0** (ditentukan di `packageManager`, auto via Corepack)
- Prettier + ESLint terintegrasi dengan husky & lint-staged

---

## Prasyarat

1. **Node.js ≥ 22**
   Disarankan menggunakan [nvm](https://github.com/nvm-sh/nvm) atau [fnm](https://github.com/Schniz/fnm) untuk manajemen versi Node.

2. **pnpm@10.14.0**
   Aktifkan Corepack agar versi sesuai otomatis:

   ```bash
   corepack enable
   ```

3. **Database MySQL**
   - Buat database: `db_point_of_sales`
   - Jalankan service database (disarankan [Laragon](https://laragon.org/) di Windows atau MySQL lokal di Linux/Mac).

---

## Setup

1. Clone repository

   ```bash
   git clone https://github.com/abyalax/point-of-sales.git
   cd point-of-sales
   ```

2. Install Node.js via nvm

   ```bash
   nvm install 22
   nvm use 22

   ```

3. Install dependencies

   ```bash
   pnpm install
   ```

   > Pastikan `pnpm --version` sesuai `10.14.0`.

4. Setup database (migration & seed)

   ```bash
   pnpm migrate:generate
   pnpm migrate:run
   pnpm seed
   ```

5. Jalankan development server

   Frontend dan backend akan berjalan **concurrently** di satu terminal:

   ```bash
   pnpm dev
   ```

   - Frontend dev server: [http://localhost:5173](http://localhost:5173) (Vite default)
   - Backend dev server: [http://localhost:3000](http://localhost:3000) (NestJS default)

---

## Script Utama

Dijalankan di **root project**:

| Perintah                | Deskripsi                                          |
| ----------------------- | -------------------------------------------------- |
| `pnpm dev`              | Jalankan frontend & backend sekaligus (hot reload) |
| `pnpm build`            | Build frontend & backend sekaligus                 |
| `pnpm migrate:generate` | Generate migration baru (backend)                  |
| `pnpm migrate:run`      | Jalankan semua migration (backend)                 |
| `pnpm migrate:show`     | Lihat daftar migration (backend)                   |
| `pnpm migrate:revert`   | Rollback migration terakhir (backend)              |
| `pnpm schema:drop`      | Drop schema database (backend)                     |
| `pnpm seed`             | Jalankan database seeding (backend)                |
| `pnpm seed:create`      | Buat seed baru (backend)                           |
| `pnpm test`             | Jalankan test backend (Jest)                       |
| `pnpm lint`             | Jalankan ESLint untuk frontend & backend           |
| `pnpm format`           | Jalankan Prettier untuk seluruh project            |

---

## Struktur Monorepo

```
point-of-sales/
├─ frontend/        # React + Vite + Mantine + TanStack
│  ├─ vite.config.ts
│  ├─ tsconfig.json
│  └─ package.json
│
├─ backend/         # NestJS + TypeORM + MySQL
│  ├─ src/
│  ├─ test/
│  ├─ typeorm.config.ts
│  ├─ typeorm.seed.ts
│  └─ package.json
│
├─ package.json     # root workspace config + scripts
└─ pnpm-workspace.yaml
```

---

## Teknologi yang Digunakan

### Frontend

- **React 19** + **Vite 7**
- **Mantine UI** + **Mantine Form + Zod resolver**
- **TanStack Router, Query, Table, Virtual**
- **Chart.js + Plugins (matrix, datalabels)**
- **State management: Zustand**
- **Axios + Day.js + Fuse.js + Immer + Lottie**

### Backend

- **NestJS 11**
- **TypeORM + MySQL + TypeORM Extension (seed)**
- **Validation: Zod + Class Validator/Transformer**
- **Auth: JWT**
- **Testing: Jest + Supertest**
- **Bcrypt + Env-cmd + RxJS**
- **Linting: ESLint + Prettier (fix on save)**

---

## Quality & Workflow

- **Husky** hooks dan **lint-staged** sudah dikonfigurasi:
  > Format otomatis file `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.css`, `.md` sebelum commit.
- **ESLint** untuk konsistensi coding style di frontend dan backend.
- **Prettier** untuk code formatting.
- **Engines** diatur agar tidak salah versi Node.
- **pnpm workspace** untuk shared dependencies dan script root-level.

---

## Testing

Backend menggunakan **Jest**:

```bash
pnpm test        # Jalankan seluruh test
pnpm test:watch  # Jalankan test mode watch
pnpm test:cov    # Jalankan test dengan coverage
pnpm test:e2e    # Jalankan test end-to-end
```

---

## Build & Deploy

- **Build backend**:

  ```bash
  pnpm --filter backend build
  ```

  Output akan ada di folder `backend/dist`.

- **Build frontend**:

  ```bash
  pnpm --filter frontend build
  ```

  Output akan ada di folder `frontend/dist`.

- **Build keduanya sekaligus**:

  ```bash
  pnpm build
  ```

- **Start production backend**:

  ```bash
  pnpm --filter backend start:prod
  ```

Frontend dapat disajikan lewat static hosting (Netlify, Vercel, Nginx, dsb.).

---

## Catatan Tambahan

- **Direkomendasikan menggunakan Node 22** (sesuai `engines`).
- **Jangan gunakan npm atau yarn**, gunakan **pnpm** agar versi konsisten.
- **Gunakan Corepack** agar pnpm versi tepat (10.14.0).
- **Pastikan database sudah berjalan sebelum migrate & seed.**

---
