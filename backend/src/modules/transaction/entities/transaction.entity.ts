import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { TransactionItem } from './transaction-item.entity';
import type { User } from '~/modules/user/entity/user.entity';
import { EPaymentMethod, EStatusTransactions } from '../transaction.schema';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User', 'transactions', { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100, nullable: false })
  cashier: string;

  @Column({ type: 'enum', enum: EStatusTransactions })
  status: EStatusTransactions;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sub_total: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_discount: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_profit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_tax: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  last_price: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pay_received: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pay_return: string;

  @Column({ type: 'enum', enum: EPaymentMethod })
  payment_method: string;

  @OneToMany('TransactionItem', 'transaction', { cascade: ['insert'], eager: true })
  items: TransactionItem[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  created_at?: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  updated_at?: string;
}
