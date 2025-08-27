import { ReportSales, SalesByCategory, CartDtoSchema } from './transaction.schema';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionItem } from './entities/transaction-item.entity';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { QueryReportSales } from './dto/query-report-sales.dto';
import { calculateTransaction } from './transaction.calculate';
import { Transaction } from './entities/transaction.entity';
import { REPOSITORY } from '~/common/constants/database';
import { TransactionDto } from './dto/transaction.dto';
import { mapTransactionRows } from './transaction.map';
import { DEFAULT } from '~/common/constants/default';
import { rangeFilter } from '~/common/helpers/query';
import { plainToInstance } from 'class-transformer';
import { MetaResponse } from '~/common/types/meta';
import { User } from '../user/entity/user.entity';
import { CartDto } from './dto/carts.dto';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(REPOSITORY.TRANSACTION)
    private readonly transactionRepository: Repository<Transaction>,

    @Inject(REPOSITORY.TRANSACTION_ITEM)
    private readonly transactionItemRepository: Repository<TransactionItem>,

    @Inject(REPOSITORY.USER)
    private readonly userRepository: Repository<User>,
  ) {}

  async getIds(): Promise<number[]> {
    const data = await this.transactionRepository.find({ select: ['id'] });
    return data.map((e) => e.id);
  }

  async create(createTransactionDto: CartDto, userId: number): Promise<TransactionDto> {
    CartDtoSchema.parse(createTransactionDto);
    const calculate = calculateTransaction(createTransactionDto);
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    const transaction_items: TransactionItem[] = [];

    calculate.items.map((item) => {
      const transactionItem = this.transactionItemRepository.create(item);
      transaction_items.push(transactionItem);
    });

    const transaction = this.transactionRepository.create({
      ...calculate,
      user,
      cashier: user.name,
      items: transaction_items,
    });

    const saved = await this.transactionRepository.manager.transaction(async (manager) => {
      return await manager.save(Transaction, transaction);
    });

    return plainToInstance(TransactionDto, saved);
  }

  async find(query: QueryTransactionDto): Promise<{ data: TransactionDto[]; meta: MetaResponse }> {
    const page = query?.page ?? DEFAULT.PAGINATION.page;
    const per_page = query?.per_page ?? DEFAULT.PAGINATION.per_page;
    const offset = (page - 1) * per_page;
    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    if (query.status) {
      whereClauses.push(`t.status = ?`);
      params.push(query.status);
    }

    if (query.payment_method) {
      whereClauses.push(`t.payment_method = ?`);
      params.push(query.payment_method);
    }
    rangeFilter('t.total_profit', query.min_total_profit, query.max_total_profit, whereClauses, params);
    rangeFilter('t.total_discount', query.min_total_discount, query.max_total_discount, whereClauses, params);
    rangeFilter('t.total_price', query.min_total_price, query.max_total_price, whereClauses, params);
    rangeFilter('t.total_tax', query.min_total_tax, query.max_total_tax, whereClauses, params);

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const allowedSortFields = [
      'cashier',
      'status',
      'sub_total',
      'total_discount',
      'total_price',
      'total_profit',
      'total_tax',
      'payment_method',
      'created_at',
      'updated_at',
    ];
    const sort_by = allowedSortFields.includes(query?.sort_by ?? '') ? query?.sort_by : 'created_at';
    const sort_order = ['ASC', 'DESC'].includes(query?.sort_order ?? '') ? query?.sort_order : 'DESC';

    const countQuery = `
    SELECT COUNT(*) as total
    FROM transactions t
    ${whereSQL}
  `;
    const countResult = await this.transactionRepository.query(countQuery, params);
    const total_count = Number(countResult[0]?.total ?? 0);
    const total_pages = Math.ceil(total_count / per_page);

    const dataQuery = `
      WITH paginated_tx AS (
        SELECT t.id
        FROM transactions t
        ${whereSQL}
        ORDER BY t.${sort_by} ${sort_order}
        LIMIT ? OFFSET ?
      )
      SELECT
        t.id AS t_id,
        t.status AS t_status,
        t.sub_total AS t_sub_total,
        t.total_discount AS t_total_discount,
        t.total_price AS t_total_price,
        t.total_profit AS t_total_profit,
        t.total_tax AS t_total_tax,
        t.last_price AS t_last_price,
        t.payment_method AS t_payment_method,
        t.pay_received AS t_pay_received,
        t.pay_return AS t_pay_return,
        t.notes AS t_notes,
        t.created_at AS t_created_at,
        t.updated_at AS t_updated_at,

        u.id AS u_id,
        u.name AS u_name,
        u.email AS u_email,

        ti.id AS ti_id,
        ti.barcode AS ti_barcode,
        ti.name AS ti_name,
        ti.category AS ti_category,
        ti.quantity AS ti_quantity,
        ti.price AS ti_price,
        ti.cost_price AS ti_cost_price,
        ti.sell_price AS ti_sell_price,
        ti.final_price AS ti_final_price,
        ti.discount AS ti_discount,
        ti.tax_rate AS ti_tax_rate,
        ti.created_at AS ti_created_at,
        ti.updated_at AS ti_updated_at

      FROM paginated_tx ptx
      JOIN transactions t ON t.id = ptx.id
      JOIN users u ON u.id = t.user_id
      LEFT JOIN transaction_items ti ON ti.transaction_id = t.id
      ORDER BY t.${sort_by} ${sort_order};
    `;

    const dataParams = [...params, per_page, offset];
    const data = await this.transactionRepository.query<Transaction[]>(dataQuery, dataParams);

    const mappedData = mapTransactionRows(data);

    const meta: MetaResponse = {
      page,
      per_page,
      total_count,
      total_pages,
    };

    return { data: plainToInstance(TransactionDto, mappedData, { excludeExtraneousValues: true }), meta };
  }

  async reportSales(query: QueryReportSales): Promise<ReportSales> {
    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    if (query.start && query.end) {
      whereClauses.push(`DATE (created_at) BETWEEN ? AND ?`);
      params.push(query.start, query.end);
    }
    if (query.status) {
      whereClauses.push(`status = ?`);
      params.push(query.status);
    }
    if (query.year) {
      whereClauses.push(`YEAR (created_at) = ?`);
      params.push(query.year);
    }
    if (query.month) {
      whereClauses.push(`MONTH (created_at) = ?`);
      params.push(query.month);
    }
    if (query.week) {
      whereClauses.push(`CEIL(DAYOFMONTH (created_at) / 7) = ?`);
      params.push(query.week);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const data = await this.transactionRepository.query<ReportSales[]>(
      `
      SELECT
          SUM(total_price) AS total_sales,          -- penjualan kotor (belum diskon dan pajak)
          SUM(total_profit) AS total_profit,      -- keuntungan total
          SUM(last_price) AS total_revenue,        -- pendapatan (setelah diskon dan pajak)
          SUM(total_tax) AS total_tax             -- pajak yang harus di bayarkan
      FROM
          transactions
      ${whereSQL};
    `,
      params,
    );
    return data[0];
  }

  async reportSalesPerMonth(year: string): Promise<ReportSales[]> {
    return await this.transactionRepository.query<ReportSales[]>(
      `
      SELECT
          DATE_FORMAT (created_at, '%M') AS month,
          DATE_FORMAT(created_at, '%m') AS month_num,
          SUM(total_price) AS total_sales,                -- penjualan kotor (belum diskon dan pajak)
          SUM(total_profit) AS total_profit,            -- keuntungan total
          SUM(last_price) AS total_revenue,              -- pendapatan (setelah diskon dan pajak)
          SUM(total_tax) AS total_tax                   -- pajak yang harus di bayarkan
      FROM
          transactions
      WHERE
          status = 'Completed'
          AND YEAR(created_at) = ?
      GROUP BY
          month_num, month
      ORDER BY
          month_num ASC;
    `,
      [year],
    );
  }

  async reportSalesByCategory(year: string): Promise<SalesByCategory[]> {
    return await this.transactionItemRepository.query<SalesByCategory[]>(
      `
      SELECT
          category,
          SUM(final_price) as total_revenue,
          SUM(sell_price) as total_sales,
          SUM(sell_price - cost_price - discount) as total_profit,
          SUM(quantity) as total_qty
      FROM
          transaction_items
      WHERE
          YEAR (created_at) = ?
      GROUP BY
          category;
    `,
      [year],
    );
  }

  async findByID(id: number): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      loadEagerRelations: true,
    });
    if (transaction === null) throw new NotFoundException('Transaction not found');
    return plainToInstance(TransactionDto, transaction, { excludeExtraneousValues: true });
  }

  async update(id: number, updateTransactionDto: TransactionDto): Promise<boolean> {
    const transaction = await this.transactionRepository.update(id, updateTransactionDto);
    if (transaction.affected === 0) throw new NotFoundException('Transaction not found');
    return true;
  }

  async remove(id: number): Promise<boolean> {
    const transaction = await this.transactionRepository.delete(id);
    if (transaction.affected === 0) throw new NotFoundException('Transaction not found');
    return true;
  }
}
