import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import type { Supplier } from '~/modules/supplier/entities/supplier.entity';
import type { PurchaseOrderItem } from './purchase-order-item.entity';
import { EPurchaseStatus } from '../purchase.schema';

@Entity({ name: 'purchase_orders' })
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  supplier_id: number;

  @ManyToOne('Supplier', 'purchaseOrders', { eager: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'enum', enum: EPurchaseStatus, default: EPurchaseStatus.PENDING })
  status: EPurchaseStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: string;

  @Column({ type: 'timestamp', name: 'order_date', default: () => 'CURRENT_TIMESTAMP' })
  order_date: string;

  @Column({ type: 'timestamp', name: 'expected_date', nullable: true })
  expected_date?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: string;

  @OneToMany('PurchaseOrderItem', 'purchaseOrder', { cascade: true })
  items: PurchaseOrderItem[];
}
