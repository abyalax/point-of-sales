import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { PurchaseOrder } from './purchase-order.entity';
import { EPaymentStatus } from '../purchase.schema';

@Entity({ name: 'purchase_payments' })
export class PurchasePayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  purchase_order_id: number;

  @ManyToOne('PurchaseOrder', 'payments', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;

  @Column({ type: 'enum', enum: EPaymentStatus, default: EPaymentStatus.UNPAID })
  status: EPaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  payment_date: string;
}
