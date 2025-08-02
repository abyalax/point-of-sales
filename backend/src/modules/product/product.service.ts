import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { REPOSITORY } from '~/common/constants/database';
import { Product } from './entity/product.entity';
import { PayloadProductDto } from './dto/payload-product.dto';
import { ProductDto } from './dto/product.dto';
import { plainToInstance } from 'class-transformer';
import { QueryProductDto } from './dto/query-product.dto';
import { DEFAULT } from '~/common/constants/default';
import { MetaResponse } from '~/common/types/meta';
import { CategoryDto, CreateCategoryDto } from './dto/category-product.dto';
import { Category } from './entity/category.entity';
import { mapProductRows, RowProducts } from '~/modules/product/product.map';

@Injectable()
export class ProductService {
  constructor(
    @Inject(REPOSITORY.PRODUCT)
    private productRepository: Repository<Product>,

    @Inject(REPOSITORY.CATEGORY)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll(): Promise<ProductDto[]> {
    const data = await this.productRepository.find();
    return plainToInstance(ProductDto, data, { excludeExtraneousValues: true });
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
