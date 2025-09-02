import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Paginated, MetaResponse } from '~/common/types/meta';
import { QueryInventoryDto } from './dto/query-inventory.dto';
import { REPOSITORY } from '~/common/constants/database';
import { Inventory } from './entities/inventory.entity';
import { DEFAULT } from '~/common/constants/default';
import { Inventories } from './inventories.schema';

@Injectable()
export class InventoriesService {
  constructor(
    @Inject(REPOSITORY.INVENTORY)
    private readonly inventoriesRepository: Repository<Inventory>,
  ) {}

  create(createInventoryDto: CreateInventoryDto) {
    return this.inventoriesRepository.save(createInventoryDto);
  }

  async find(query: QueryInventoryDto): Promise<Paginated<Inventories>> {
    const page = Number(query?.page ?? DEFAULT.PAGINATION.page);
    const per_page = Number(query?.per_page ?? DEFAULT.PAGINATION.per_page);
    const offset = (page - 1) * per_page;

    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    if (query.search) {
      whereClauses.push(`MATCH(p.name) AGAINST (? IN NATURAL LANGUAGE MODE)`);
      params.push(query.search);
    }

    if (query?.min_stock) {
      whereClauses.push(`i.min_stock >= ?`);
      params.push(query.min_stock);
    }

    if (query?.max_stock) {
      whereClauses.push(`i.max_stock <= ?`);
      params.push(query.max_stock);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Sorting
    const allowedSortFields = ['stock', 'created_at', 'updated_at'];
    const sort_by = allowedSortFields.includes(query?.sort_by ?? '') ? query?.sort_by : 'created_at';
    const sort_order = ['ASC', 'DESC'].includes(query?.sort_order ?? '') ? query?.sort_order : 'DESC';

    // Count query (hitung unique inventory.id)
    const countQuery = `
    SELECT COUNT(*) as total
    FROM inventories i
    JOIN products p ON p.id = i.product_id
    LEFT JOIN suppliers s ON s.id = i.supplier_id
    ${whereSQL};
  `;
    const countResult = await this.inventoriesRepository.query(countQuery, params);
    const total_count = Number(countResult[0]?.total ?? 0);
    const total_pages = Math.ceil(total_count / per_page);

    // Data query with pagination at inventory level
    const dataQuery = `
    WITH paginated_inv AS (
      SELECT i.id
      FROM inventories i
      JOIN products p ON p.id = i.product_id
      LEFT JOIN suppliers s ON s.id = i.supplier_id
      ${whereSQL}
      ORDER BY i.${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    )
    SELECT
      i.id AS id,
      i.stock AS stock,
      i.min_stock AS min_stock,
      i.max_stock AS max_stock,
      i.created_at AS created_at,
      i.updated_at AS updated_at,

      p.id AS product_id,
      p.name AS product_name,
      p.barcode AS product_barcode,
      p.status AS product_status,

      s.id AS supplier_id,
      s.name AS supplier_name

    FROM paginated_inv ptx
    JOIN inventories i ON i.id = ptx.id
    JOIN products p ON p.id = i.product_id
    LEFT JOIN suppliers s ON s.id = i.supplier_id
    ORDER BY i.${sort_by} ${sort_order};
  `;

    const dataParams = [...params, per_page, offset];
    const data = await this.inventoriesRepository.query<Inventories[]>(dataQuery, dataParams);

    const meta: MetaResponse = {
      page,
      per_page,
      total_count,
      total_pages,
    };

    return { data, meta };
  }

  async findAll(): Promise<Inventory[]> {
    return await this.inventoriesRepository.find();
  }

  async getIds(): Promise<number[]> {
    const rows = await this.inventoriesRepository.query<{ id: string }[]>(`SELECT id FROM inventories;`);
    return rows.map((row) => Number(row.id));
  }

  findOne(id: number) {
    return this.inventoriesRepository.findOneBy({ id });
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto): Promise<boolean> {
    const updated = await this.inventoriesRepository.update(id, updateInventoryDto);
    if (updated.affected === 0) throw new UnprocessableEntityException('Failed to Update Inventories');
    return true;
  }

  async remove(id: number): Promise<boolean> {
    const deleted = await this.inventoriesRepository.delete(id);
    if (deleted.affected === 0) throw new NotFoundException('ID Inventories to be deleted not found');
    return true;
  }
}
