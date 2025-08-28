import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CategoryDto, CreateCategoryDto } from './dto/category-product.dto';
import { mapProductRows, RowProducts } from '~/modules/product/product.map';
import { ProductDiscountImpact, ProductFrequencySold, ProductTrending, ProductTrendPeriode } from './product.schema';
import { QueryProductReportDto } from './dto/query-product-report.dto';
import { FilterPeriodeDto } from '~/common/dto/filter-periode.dto';
import { OmitProduct } from '../transaction/transaction.schema';
import { PayloadProductDto } from './dto/payload-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { REPOSITORY } from '~/common/constants/database';
import { ProductTrendDto } from './dto/product-trend.dto';
import { DEFAULT } from '~/common/constants/default';
import { Category } from './entity/category.entity';
import { plainToInstance } from 'class-transformer';
import { MetaResponse } from '~/common/types/meta';
import { Product } from './entity/product.entity';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(REPOSITORY.PRODUCT)
    private readonly productRepository: Repository<Product>,

    @Inject(REPOSITORY.CATEGORY)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAll(): Promise<OmitProduct[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .select([
        'product.name AS name',
        'product.barcode AS barcode',
        'product.price AS price',
        'product.cost_price AS cost_price',
        'product.tax_rate AS tax_rate',
        'product.discount AS discount',
        'product.status AS status',
        'category.name AS category',
      ])
      .getRawMany();

    return products;
  }

  /**
   * @title for Heatmap Charts Product Seasoning / Trending
   * @description Mengambil data trend penjualan produk dalam 12 minggu terakhir
   * @returns ProductTrendDto[]
   */
  async getProductTrends(periode: ProductTrendPeriode = 'week'): Promise<ProductTrendDto[]> {
    const periodeSql = periode === 'week' ? 'YEARWEEK(ti.created_at, 1)' : "DATE_FORMAT(ti.created_at, '%m')";
    const interval = periode === 'week' ? '12 WEEK' : '6 MONTH';

    const data = await this.productRepository.query<ProductTrending[]>(`
      SELECT
          p.id AS id,
          p.name AS name,
          ${periodeSql} AS periode,
          SUM(ti.quantity) AS total_qty
      FROM
          transaction_items ti
          JOIN (
            SELECT id, barcode, name
            FROM products
            ORDER BY name ASC
            LIMIT 10
          ) p ON p.barcode = ti.barcode
      WHERE
          ti.created_at >= DATE_SUB(CURDATE(), INTERVAL ${interval})
      GROUP BY
          p.id,
          periode
      ORDER BY
          periode ASC,
          total_qty DESC;
    `);
    return plainToInstance(ProductTrendDto, data, { excludeExtraneousValues: true });
  }

  /**
   * @title for Bar Charts Product Move Performance
   * @description Mengambil data penjualan produk dalam waktu tertentu
   * @returns ProductFrequencySoldSchema[]
   */
  async productSold(query: QueryProductReportDto): Promise<ProductFrequencySold[]> {
    const params: (string | number)[] = [];
    const whereClauses: string[] = [];
    const sort_order = query.sort_order === 'ASC' ? 'ASC' : 'DESC';

    if (query.year) {
      whereClauses.push(`YEAR (created_at) = ?`);
      params.push(query.year);
    }

    if (query.month) {
      whereClauses.push(`MONTH (created_at) = ?`);
      params.push(query.month);
    }

    if (query.week) {
      whereClauses.push(`CEIL(DAYOFMONTH(created_at) / 7) = ?`);
      params.push(query.week);
    }

    if (query.start && query.end) {
      whereClauses.push(`created_at BETWEEN ? AND ?`);
      params.push(query.start, query.end);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const data = await this.productRepository.query<ProductFrequencySold[]>(
      `
      SELECT DISTINCT
          SUM(quantity) AS total_product,
          category,
          name
      FROM
          transaction_items
      ${whereSQL}
      GROUP BY
          YEAR (created_at),
          MONTH (created_at),
          CEIL(DAYOFMONTH(created_at) / 7),
          category,
          name
      ORDER BY
          total_product ${sort_order}
      LIMIT 10;
    `,
      params,
    );
    return data;
  }

  /**
   * @title for Clustered Bar Charts Product Discount Impact
   * @description Mengambil data penjualan produk dalam waktu tertentu
   * ketika diberi discount dan ketika tidak di beri discount
   * @returns ProductDiscountImpact[]
   */
  async productDiscountImpact(query: FilterPeriodeDto): Promise<ProductDiscountImpact[]> {
    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    if (query.year) {
      whereClauses.push(`YEAR(t.created_at) = ?`);
      params.push(query.year);
    }

    if (query.month) {
      whereClauses.push(`MONTH(t.created_at) = ?`);
      params.push(query.month);
    }

    if (query.week) {
      whereClauses.push(`CEIL(DAYOFMONTH(t.created_at) / 7) = ?`);
      params.push(query.week);
    }

    if (query.start && query.end) {
      whereClauses.push(`t.created_at BETWEEN ? AND ?`);
      params.push(query.start, query.end);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const data = await this.productRepository.query<ProductDiscountImpact[]>(
      `
      SELECT
          p.name AS name,
          COALESCE(
              SUM(
                  CASE
                      WHEN ti.discount > 0 THEN ti.quantity
                  END
              ),
              0
          ) AS with_discount,
          COALESCE(
              SUM(
                  CASE
                      WHEN ti.discount = 0 THEN ti.quantity
                  END
              ),
              0
          ) AS without_discount
      FROM
          transaction_items ti
          JOIN products p ON p.barcode = ti.barcode
          JOIN transactions t ON t.id = ti.transaction_id
      ${whereSQL}
      GROUP BY
          p.name
      HAVING
          with_discount > 0 AND without_discount > 0  -- hanya produk yang pernah ada diskon
      ORDER BY
          with_discount + without_discount DESC
      LIMIT 10;
    `,
      params,
    );
    return data;
  }

  async searchByName(query: { search: string }): Promise<ProductDto[]> {
    const data = await this.productRepository.query(
      `SELECT product.*, category.id AS category_id, category.name AS category_name
        FROM products product
        LEFT JOIN categories category
        ON category.id = product.category_id
      WHERE MATCH(product.name) AGAINST (? IN NATURAL LANGUAGE MODE)
      ;`,
      [query.search],
    );

    const mappedData = mapProductRows(data as unknown as RowProducts[]);
    return plainToInstance(ProductDto, mappedData, { excludeExtraneousValues: true });
  }

  async find(query: QueryProductDto): Promise<{ data: ProductDto[]; meta: MetaResponse }> {
    const page = query?.page ?? DEFAULT.PAGINATION.page;
    const per_page = query?.per_page ?? DEFAULT.PAGINATION.per_page;
    const offset = (page - 1) * per_page;
    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    if (query?.search) {
      whereClauses.push(`MATCH(product.name) AGAINST (? IN NATURAL LANGUAGE MODE)`);
      params.push(query.search);
    }

    if (query?.status) {
      whereClauses.push(`product.status = ?`);
      params.push(query.status);
    }

    if (query?.min_price && !query?.max_price) {
      whereClauses.push(`product.price >= ?`);
      params.push(query.min_price);
    }

    if (!query?.min_price && query?.max_price) {
      whereClauses.push(`product.price <= ?`);
      params.push(query.max_price);
    }

    if (query?.min_price && query?.max_price && query.max_price > query.min_price) {
      whereClauses.push(`product.price BETWEEN ? AND ?`);
      params.push(query.min_price, query.max_price);
    }

    if (query?.category) {
      whereClauses.push(`category.id = ?`);
      params.push(query.category);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const allowedSortFields = ['name', 'price', 'status', 'stock', 'created_at', 'updated_at'];
    const sort_by = allowedSortFields.includes(query?.sort_by ?? '') ? query?.sort_by : 'created_at';
    const sort_order = ['ASC', 'DESC'].includes(query?.sort_order ?? '') ? query?.sort_order : 'DESC';

    const baseQuery = `
      FROM products product
      LEFT JOIN categories category ON category.id = product.category_id
      ${whereSQL}
    `;

    // Count total
    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
    const countResult = await this.productRepository.query(countQuery, params);
    const total_count = Number(countResult[0]?.total ?? 0);
    const total_pages = Math.ceil(total_count / per_page);
    const pagination = `LIMIT ? OFFSET ?`;
    const isServerSide = query?.engine === 'server_side';

    // Data query
    const dataQuery = `
      SELECT
        product.*,
        category.name AS category_name,
        category.created_at AS category_created_at,
        category.updated_at AS category_updated_at
      ${baseQuery}
      ORDER BY product.${sort_by} ${sort_order}
      ${isServerSide ? pagination : ';'}
    `;

    const data = await this.productRepository.query<Product[]>(dataQuery, [
      ...params,
      isServerSide ? parseInt(per_page as unknown as string) : '',
      isServerSide ? parseInt(offset as unknown as string) : '',
    ]);
    const mappedData = mapProductRows(data as unknown as RowProducts[]);
    const meta: MetaResponse = {
      page,
      per_page,
      total_count,
      total_pages,
    };
    return {
      data: plainToInstance(ProductDto, mappedData, { excludeExtraneousValues: true }),
      meta,
    };
  }

  async getCategories(): Promise<CategoryDto[]> {
    const data = await this.categoryRepository.find();
    return plainToInstance(CategoryDto, data, { excludeExtraneousValues: true });
  }

  async getIds(): Promise<number[]> {
    const data = await this.productRepository.query<{ id: number }[]>('SELECT id FROM products');
    return data.map((product) => product.id);
  }

  async createCategory(category: CreateCategoryDto): Promise<CategoryDto> {
    const data = await this.categoryRepository.save({ name: category.name });
    return plainToInstance(CategoryDto, data, { excludeExtraneousValues: true });
  }

  async create(payloadProductDto: PayloadProductDto): Promise<ProductDto> {
    const category = await this.categoryRepository.findOneOrFail({ where: { name: payloadProductDto.category } });
    const product = await this.productRepository.save({
      ...payloadProductDto,
      category,
    });
    return plainToInstance(ProductDto, product, { excludeExtraneousValues: true });
  }

  async findOneByID(id: number): Promise<ProductDto> {
    const products = await this.productRepository.findOneBy({ id });
    if (products === null) throw new NotFoundException('Product not found');
    return plainToInstance(ProductDto, products, { excludeExtraneousValues: true });
  }

  async update(id: number, payloadProductDto: PayloadProductDto): Promise<boolean> {
    const category = await this.categoryRepository.findOneOrFail({ where: { name: payloadProductDto.category } });
    const product = await this.productRepository.update(id, {
      ...payloadProductDto,
      category,
    });
    if (product.affected === 0) throw new NotFoundException();
    return true;
  }

  async remove(id: number): Promise<boolean> {
    const product = await this.productRepository.delete(id);
    if (product.affected === 0) throw new NotFoundException();
    return true;
  }
}
