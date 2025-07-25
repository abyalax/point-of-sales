import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { REPOSITORY } from '~/common/constants/database';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

  async find(query?: QueryProductDto): Promise<{ data: ProductDto[]; meta: MetaResponse }> {
    console.log(query);
    const page = query?.page ?? DEFAULT.PAGINATION.page;
    const per_page = query?.per_page ?? DEFAULT.PAGINATION.per_page;
    const offset = (page - 1) * per_page;
    const params: unknown[] = [];
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
    const sort_by = allowedSortFields.includes(query?.sort_by ?? '') ? query!.sort_by : 'created_at';
    const sort_order = ['ASC', 'DESC'].includes(query?.sort_order ?? '') ? query!.sort_order : 'DESC';

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
        product.id AS id,
        product.name AS name,
        product.price AS price,
        product.status AS status,
        product.stock AS stock,
        product.category_id AS category_id,
        product.created_at AS created_at,
        product.updated_at AS updated_at,
        category.name AS category_name,
        category.created_at AS category_created_at,
        category.updated_at AS category_updated_at
      ${baseQuery}
      ORDER BY product.${sort_by} ${sort_order}
      ${isServerSide ? pagination : ';'}
    `;

    const data = await this.productRepository.query<Product[]>(dataQuery, [...params, isServerSide ? per_page : '', isServerSide ? offset : '']);
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

  async createCategory(category: CreateCategoryDto): Promise<CategoryDto> {
    console.log(category);
    const data = await this.categoryRepository.save({ name: category.name });
    return plainToInstance(CategoryDto, data, { excludeExtraneousValues: true });
  }

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    const product = await this.productRepository.save(createProductDto);
    return plainToInstance(ProductDto, product, { excludeExtraneousValues: true });
  }

  async findOneByID(id: number): Promise<ProductDto> {
    const products = await this.productRepository.findOneBy({ id });
    if (products === null) throw new NotFoundException('Product not found');
    return plainToInstance(ProductDto, products, { excludeExtraneousValues: true });
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<boolean> {
    const product = await this.productRepository.update(id, updateProductDto);
    if (product.affected === 0) throw new NotFoundException();
    return true;
  }

  async remove(id: number) {
    const product = await this.productRepository.delete(id);
    if (product.affected === 0) throw new NotFoundException();
    return true;
  }
}
