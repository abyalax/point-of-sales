import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity({ name: 'transaction_items' })
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 100 })
  barcode: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost_price: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sell_price: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  final_price: string;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  tax_rate: string;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  discount: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transaction_id' })
  transaction?: Transaction;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  created_at?: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  updated_at?: Date;
}
