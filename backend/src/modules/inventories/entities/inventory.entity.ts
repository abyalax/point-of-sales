import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Product } from '~/modules/product/entity/product.entity';
import type { Supplier } from '~/modules/supplier/entities/supplier.entity';

enum EInventoryStockType {
  ORDER = 'order',
  PRE_ORDER = 'pre-order',
  SALES = 'sales',
  CANCEL = 'cancel',
}

enum EStatusDelivery {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  DROPPED = 'dropped',
  COMPLETED = 'completed',
  CANCEL = 'cancel',
}

enum EStatusPayment {
  PAID = 'paid',
  UNPAID = 'unpaid',
}

@Entity({ name: 'inventories' })
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  product_id?: number;

  @Column({ type: 'enum', enum: EInventoryStockType })
  stock_type: EInventoryStockType;

  @Column({ type: 'enum', enum: EStatusDelivery })
  status_delivery: EStatusDelivery;

  @Column({ type: 'enum', enum: EStatusPayment })
  status_payment: EStatusPayment;

  @Column({ type: 'int', default: 0, nullable: false })
  stock: number;

  @Column({ type: 'int', default: 0, nullable: false })
  total_order: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  sales: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  purchase: string;

  @ManyToOne('Product', 'inventories', { onDelete: 'NO ACTION', onUpdate: 'CASCADE', eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: true })
  supplier_id?: number;

  @ManyToOne('Supplier', 'inventories', { onDelete: 'NO ACTION', onUpdate: 'CASCADE', eager: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  created_at?: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  updated_at?: string;
}
