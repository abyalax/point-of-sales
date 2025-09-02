import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ProductDiscountImpact, ProductFrequencySold, ProductTrending, ProductTrendPeriode } from './product.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryProductReportDto } from './dto/query-product-report.dto';
import { FilterPeriodeDto } from '~/common/dto/filter-periode.dto';
import { OmitProduct } from '../transaction/transaction.schema';
import { MetaResponse, Paginated } from '~/common/types/meta';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { REPOSITORY } from '~/common/constants/database';
import { DEFAULT } from '~/common/constants/default';
import { Category } from './entity/category.entity';
import { Product } from './entity/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

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
  async getProductTrends(periode: ProductTrendPeriode = 'week'): Promise<ProductTrending[]> {
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
    return data;
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

  /**
   * @title Search products at Page POS
   * @returns
   */
  async searchByName(query: { search: string }): Promise<Product[]> {
    const data = await this.productRepository.query<Product[]>(
      `SELECT
        p.id,
        p.name,
        p.barcode,
        p.price,
        p.cost_price,
        p.tax_rate,
        p.discount,
        p.status,
        p.created_at,
        p.updated_at,
        JSON_OBJECT(
          'id', c.id,
          'name', c.name,
          'created_at', c.created_at,
          'updated_at', c.updated_at
        ) AS category
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE MATCH(p.name) AGAINST (? IN NATURAL LANGUAGE MODE)
      ;`,
      [query.search],
    );
    return data;
  }

  /**
   * @title For Table Management Products
   * @param query QueryProduct (params untuk filtering dan pagination)
   * @returns Data paginated products
   */
  async find(query: QueryProductDto): Promise<Paginated<Product>> {
    const page = Number(query?.page ?? DEFAULT.PAGINATION.page);
    const per_page = Number(query?.per_page ?? DEFAULT.PAGINATION.per_page);
    const offset = (page - 1) * per_page;

    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    if (query?.search) {
      whereClauses.push(`MATCH(p.name) AGAINST (? IN NATURAL LANGUAGE MODE)`);
      params.push(query.search);
    }
    if (query?.status) {
      whereClauses.push(`p.status = ?`);
      params.push(query.status);
    }
    if (query?.min_price) {
      whereClauses.push(`p.price >= ?`);
      params.push(query.min_price);
    }
    if (query?.max_price) {
      whereClauses.push(`p.price <= ?`);
      params.push(query.max_price);
    }
    if (query?.category) {
      whereClauses.push(`c.id = ?`);
      params.push(query.category);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const allowedSortFields = ['name', 'price', 'status', 'created_at', 'updated_at'];
    const sort_by = allowedSortFields.includes(query?.sort_by ?? '') ? query?.sort_by : 'created_at';
    const sort_order = ['ASC', 'DESC'].includes(query?.sort_order ?? '') ? query?.sort_order : 'DESC';

    const countQuery = `
      SELECT COUNT(p.id) as total
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ${whereSQL}
    `;
    const countResult = await this.productRepository.query(countQuery, params);
    const total_count = Number(countResult[0]?.total ?? 0);
    const total_pages = Math.ceil(total_count / per_page);

    const dataQuery = `
      WITH paginated_products AS (
        SELECT p.id
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        ${whereSQL}
        ORDER BY p.${sort_by} ${sort_order}
        LIMIT ? OFFSET ?
      )
      SELECT
        p.id,
        p.name,
        p.barcode,
        p.price,
        p.cost_price,
        p.tax_rate,
        p.discount,
        p.status,
        p.created_at,
        p.updated_at,
        JSON_OBJECT(
          'id', c.id,
          'name', c.name,
          'created_at', c.created_at,
          'updated_at', c.updated_at
        ) AS category
      FROM paginated_products pp
      JOIN products p ON p.id = pp.id
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.${sort_by} ${sort_order}
    `;

    const dataParams = [...params, per_page, offset];
    const data = await this.productRepository.query<Product[]>(dataQuery, dataParams);

    const meta: MetaResponse = {
      page,
      per_page,
      total_count,
      total_pages,
    };

    return { data, meta };
  }

  /**
   * @title get all category products to field select exist categories
   * @returns unique name categories with incluedes id
   */
  async getCategories(): Promise<Category[]> {
    const data = await this.categoryRepository.query<Category[]>(`
      SELECT c.*
      FROM categories c
      JOIN (
          SELECT name, MIN(id) AS id
          FROM categories
          GROUP BY name
      ) x ON c.name = x.name AND c.id = x.id;
    `);
    return data;
  }

  async getIds(): Promise<number[]> {
    const data = await this.productRepository.query<{ id: number }[]>('SELECT id FROM products');
    return data.map((product) => Number(product.id));
  }

  async createCategory(category: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.save({ name: category.name });
  }

  async create(payloadProduct: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOneOrFail({ where: { name: payloadProduct.category } });
    const product = await this.productRepository.save({
      ...payloadProduct,
      category,
    });
    return product;
  }

  async findOneByID(id: number): Promise<Product> {
    const products = await this.productRepository.findOneBy({ id });
    if (products === null) throw new NotFoundException('Product not found');
    return products;
  }

  async update(id: number, payloadProduct: UpdateProductDto): Promise<boolean> {
    const category = await this.categoryRepository.findOneOrFail({ where: { name: payloadProduct.category } });
    const product = await this.productRepository.update(id, {
      ...payloadProduct,
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
