---

# **NestJS 11 API – Project Documentation**

## **Tech Stack**

* **Framework:** NestJS 11
* **Database:** MySQL + TypeORM + TypeORM Extension (seed)
* **Validation:** Zod + Class Validator/Transformer
* **Authentication:** JWT (access & refresh token)
* **Testing:** Jest + Supertest
* **Security & Utilities:** Bcrypt, Env-cmd, RxJS
* **Linting & Style:** ESLint + Prettier

---

## **Architecture & Design Pattern**

### **Folder Structure**

```
src
 ├─ common/                # shared resources
 │   ├─ constants/         # app constants (credential, database, defaults)
 │   ├─ decorators/        # custom decorators (roles)
 │   ├─ dto/               # common DTO (filter-periode, meta-request)
 │   ├─ filters/           # global exception filter, handler
 │   ├─ guards/            # auth, jwt, roles guards
 │   ├─ helpers/           # utility functions (query builder, etc.)
 │   ├─ schema/            # Zod schemas
 │   └─ types/             # global types & response types
 │
 ├─ infrastructure/
 │   └─ database/
 │       ├─ migrations/    # database migrations
 │       ├─ mock/          # mock data (transactions, carts)
 │       ├─ seeds/         # seed files (products, users, transactions)
 │       ├─ database.module.ts
 │       └─ database.provider.ts
 │
 ├─ modules/
 │   ├─ auth/              # auth module
 │   │   ├─ dto/           # sign-in, sign-up, permission, role DTO
 │   │   ├─ entity/        # role, permission entities
 │   │   ├─ auth.controller.ts / .spec.ts
 │   │   ├─ auth.service.ts / .spec.ts
 │   │   └─ auth.module.ts
 │   │
 │   ├─ product/           # product module
 │   │   ├─ dto/           # category, payload, discount impact, trends
 │   │   ├─ entity/        # product, category entities
 │   │   ├─ product.controller.ts / .spec.ts
 │   │   ├─ product.service.ts / .spec.ts
 │   │   ├─ product.module.ts
 │   │   ├─ product.provider.ts
 │   │   └─ product.schema.ts
 │
 ├─ app.controller.ts / .spec.ts
 ├─ app.module.ts
 ├─ app.service.ts
 ├─ index.ts
 └─ main.ts
```

---

## **Repository Pattern (Manual Injection)**

> **No Active Record** – Entity hanya mendeskripsikan struktur data, tidak mengandung logic database. Semua query dilakukan melalui repository injection.

**Provider Definition:**

```ts
export const productProvider = [
  {
    provide: REPOSITORY.PRODUCT,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Product),
    inject: [DATABASE.MYSQL.PROVIDE],
  },
  {
    provide: REPOSITORY.CATEGORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
    inject: [DATABASE.MYSQL.PROVIDE],
  },
];
```

**Inject in Service:**

```ts
@Injectable()
export class ProductService {
  constructor(
    @Inject(REPOSITORY.PRODUCT)
    private readonly productRepository: Repository<Product>,
    @Inject(REPOSITORY.CATEGORY)
    private readonly categoryRepository: Repository<Category>,
  ) {}
}
```

---

## **Controller Standard**

- Gunakan `@HttpCode(HttpStatus.XXX)`
- DTO digunakan di semua input (query/body)
- Response mengikuti format `TResponse<Dto>`
- Lempar exception jika data kosong

```ts
@HttpCode(HttpStatus.OK)
@Get('/discount/impact')
async getProductDiscountImpact(
  @Query() query: FilterPeriodeDto
): Promise<TResponse<ProductDiscountImpactSchema[]>> {
  const data = await this.productService.productDiscountImpact(query);
  if (data.length === 0) {
    throw new NotFoundException('Data Products Not Found');
  }
  return { statusCode: HttpStatus.OK, data };
}
```

---

## **Global Exception Filter**

- Menggunakan `Map<ErrorConstructor, ExceptionHandler>` untuk handle error secara terstruktur.
- Memudahkan penambahan error baru tanpa ubah core filter.

```ts
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    for (const [klass, handler] of handlers.entries()) {
      if (exception instanceof klass) {
        const handleResponse = handler(exception);
        return response.status(handleResponse.statusCode).json(handleResponse);
      }
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: exception instanceof Error ? (exception as HttpException).message : 'Unknown error',
    });
  }
}
```

---

## **Testing Standard**

### **Folder Structure**

```
test
 ├─ auth/            # auth.e2e-spec.ts
 ├─ common/          # constants, exception, helper, mock
 ├─ product/         # product.e2e-spec.ts
 ├─ transaction/     # transaction.e2e-spec.ts
 ├─ utils/           # schema validation utils
 ├─ app.e2e-spec.ts
 ├─ jest-e2e.config.ts
 ├─ jest-spec.config.ts
 └─ setup_e2e.ts
```

---

### **Base Test Boilerplate**

- Semua domain test diawali dengan inisialisasi app & auth
- Menggunakan cookie untuk auth (access & refresh token)

```ts
describe('Module Transaction', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    [app, moduleFixture] = await setupApplication();
  });

  describe('Response Success', () => {
    let access_token: string;
    let refresh_token: string;
    let ids: number[] = [];

    beforeEach(async () => {
      const res = await request(app.getHttpServer()).post('/auth/login').send({ email: USER.email, password: USER.password });

      const cookies = res.headers['set-cookie'];
      access_token = extractHttpOnlyCookie('access_token', cookies) ?? '';
      refresh_token = extractHttpOnlyCookie('refresh_token', cookies) ?? '';

      await request(app.getHttpServer())
        .get('/transaction/ids')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200)
        .expect((res) => {
          ids = res.body.data;
        });
    });

    test('POST Test Token Cookie for Request', async () => {
      expect(refresh_token).toBeDefined();
      expect(access_token).toBeDefined();
      const id = ids[Math.floor(Math.random() * ids.length)];
      await request(app.getHttpServer())
        .get('/transaction/' + id)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);
    });
  });
});
```

---

### **Testing Format Guidelines**

1. Nama test = **`METHOD /endpoint`**
2. Set cookie untuk auth
3. Expect **status code sesuai controller**
4. Validasi **schema data (Zod)** sesuai tipe data response controller ( lihat di file .schema.ts didomain modulenya )
5. Expect hasil validasi **`.toBeDefined()`** ( make sure zod validation passed )

```ts
test('GET /transaction/sales', async () => {
  const res = await request(app.getHttpServer())
    .get('/transaction/sales')
    .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
    .expect(200);

  const data = res.body.data;
  const validate = validateSchema(ReportSalesSchema, data);
  expect(validate).toBeDefined();
});
```

For Information

- Testing mengadopsi konsep singleton, dan tetap modular agar bisa pakai fitur extension jest untuk menjalankan testing secara isolated per function test
- http server di custom untuk pakai server development first ( prevent overhead starting nest project di setiap testing ),
- Kalau server dev mati fallback ke start module nest project

```ts
let cachedApp: NestExpressApplication | null = null;
let cachedModule: TestingModule | null = null;

export const setupApplication = async (): Promise<[NestExpressApplication, TestingModule]> => {
  if (cachedApp && cachedModule) return [cachedApp, cachedModule];

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: NestExpressApplication = moduleFixture.createNestApplication();
  app.use(cookieParser(CREDENTIALS.COOKIE_SECRET));
  await app.init();

  const originalGetHttpServer = app.getHttpServer.bind(app) as () => Server;
  let useLocal = false;
  try {
    await axios.get('http://localhost:3000/health', { timeout: 500 });
    useLocal = true;
  } catch {
    useLocal = false;
  }

  app.getHttpServer = () => {
    if (useLocal) return 'http://localhost:3000' as unknown as Server;
    return originalGetHttpServer();
  };

  cachedApp = app;
  cachedModule = moduleFixture;
  return [app, moduleFixture];
};
```

---

## **Key Principles**

- **Manual Repository Injection (Data Mapper Pattern)** → Entity tidak tahu cara disimpan.
- **Strict DTO & Validation** → Gunakan Zod + Class Validator di semua input.
- **Consistent Controller Response** → Selalu kembalikan `TResponse<T>`.
- **Global Error Handling** → Satu pintu via Exception Filter.
- **End-to-End Testing** → Semua test pakai Jest + Supertest, selalu validasi schema.

---
