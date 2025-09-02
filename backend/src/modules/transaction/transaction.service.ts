import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ReportSales, SalesByCategory, ProductProfitable } from './transaction.schema';
import { TransactionItem } from './entities/transaction-item.entity';
import { FilterPeriodeDto } from '~/common/dto/filter-periode.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { QueryReportSales } from './dto/query-report-sales.dto';
import { calculateTransaction } from './transaction.calculate';
import { MetaResponse, Paginated } from '~/common/types/meta';
import { Transaction } from './entities/transaction.entity';
import { REPOSITORY } from '~/common/constants/database';
import { rangeFilter } from '~/common/helpers/query';
import { User } from '../user/entity/user.entity';
import { CartDto } from './dto/carts.dto';

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
    const data = await this.transactionRepository.query<{ id: string }[]>('SELECT id FROM transactions');
    return data.map((e) => Number(e.id));
  }

  async create(createTransactionDto: CartDto, userId: number): Promise<Transaction> {
    try {
      const calculate = calculateTransaction(createTransactionDto);
      const user = await this.userRepository.findOneByOrFail({ id: userId });
      const transaction_items: TransactionItem[] = calculate.items.map((item) => {
        return this.transactionItemRepository.create(item);
      });
      const transaction = this.transactionRepository.create({
        ...calculate,
        user,
        cashier: user.name,
        items: transaction_items,
      });
      const saved = await this.transactionRepository.manager.transaction(async (manager) => {
        const savedTransaction = await manager.save(Transaction, transaction);
        for (const item of calculate.items) {
          await manager.query(`UPDATE inventories SET stock = stock - ? WHERE product_id = ?`, [item.quantity, item.barcode]);
        }
        return savedTransaction;
      });
      return saved;
    } catch (e) {
      console.log(e);
      throw new UnprocessableEntityException('Failed to process transaction. Please try again later.');
    }
  }

  async find(query: QueryTransactionDto): Promise<Paginated<Transaction>> {
    const page = Number(query?.page);
    const per_page = Number(query?.per_page);
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
        t.id AS id,
        t.cashier AS cashier,
        t.status AS status,
        t.sub_total AS sub_total,
        t.total_discount AS total_discount,
        t.total_price AS total_price,
        t.total_profit AS total_profit,
        t.total_tax AS total_tax,
        t.last_price AS last_price,
        t.payment_method AS payment_method,
        t.pay_received AS pay_received,
        t.pay_return AS pay_return,
        t.notes AS notes,
        t.created_at AS created_at,
        t.updated_at AS updated_at,

        JSON_OBJECT(
          'id', u.id,
          'name', u.name,
          'email', u.email
        ) AS user,

        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', ti.id,
            'barcode', ti.barcode,
            'name', ti.name,
            'category', ti.category,
            'quantity', ti.quantity,
            'price', ti.price,
            'cost_price', ti.cost_price,
            'sell_price', ti.sell_price,
            'final_price', ti.final_price,
            'discount', ti.discount,
            'tax_rate', ti.tax_rate,
            'created_at', ti.created_at,
            'updated_at', ti.updated_at
          )
        ) AS items

      FROM paginated_tx ptx
      JOIN transactions t ON t.id = ptx.id
      JOIN users u ON u.id = t.user_id
      LEFT JOIN transaction_items ti ON ti.transaction_id = t.id
      GROUP BY t.id
      ORDER BY t.${sort_by} ${sort_order};
    `;

    const dataParams = [...params, per_page, offset];
    const data = await this.transactionRepository.query<Transaction[]>(dataQuery, dataParams);

    const meta: MetaResponse = {
      page,
      per_page,
      total_count,
      total_pages,
    };

    return { data, meta };
  }

  async productProfitable(query: FilterPeriodeDto): Promise<ProductProfitable[]> {
    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    if (query.year) {
      whereClauses.push(`YEAR(created_at) = ?`);
      params.push(query.year);
    }

    if (query.month) {
      whereClauses.push(`MONTH(created_at) = ?`);
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
    const data = await this.transactionItemRepository.query<ProductProfitable[]>(
      `
      SELECT
          category,
          name,
          SUM(quantity) AS quantity,
          CASE
              WHEN SUM(final_price * quantity) > 0 THEN ROUND(((SUM(final_price * quantity) - SUM(cost_price * quantity)) / SUM(final_price * quantity)), 4)
              ELSE 0
          END AS margin_percentage,
          SUM(final_price * quantity) AS revenue
      FROM
          transaction_items
      ${whereSQL}
      GROUP BY
          category,
          name
      ORDER BY
          category,
          revenue DESC;
    `,
      params,
    );
    return data;
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

  async findByID(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      loadEagerRelations: true,
    });
    if (transaction === null) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async remove(id: number): Promise<boolean> {
    const transaction = await this.transactionRepository.delete(id);
    if (transaction.affected === 0) throw new NotFoundException('Transaction not found');
    return true;
  }
}
