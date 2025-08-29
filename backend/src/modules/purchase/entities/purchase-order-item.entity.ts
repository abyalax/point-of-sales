import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Product } from '~/modules/product/entity/product.entity';
import type { PurchaseOrder } from './purchase-order.entity';

@Entity({ name: 'purchase_order_items' })
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  purchase_order_id: number;

  @ManyToOne('PurchaseOrder', 'items', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;

  @Column({ nullable: false })
  product_id: number;

  @ManyToOne('Product', 'purchaseOrderItems', { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: string; // harga per unit

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  sub_total: string; // price * quantity
}
