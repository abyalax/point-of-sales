import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Supplier } from '~/modules/supplier/entities/supplier.entity';
import type { Product } from '~/modules/product/entity/product.entity';
import type { InventoryLog } from './inventory-log.entity';

@Entity({ name: 'inventories' })
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  product_id: number;

  @Column({ type: 'int', default: 0, nullable: false })
  stock: number;

  @Column({ type: 'int', default: 0, nullable: false })
  min_stock: number;

  @Column({ type: 'int', default: 0, nullable: false })
  max_stock: number;

  @ManyToOne('Product', 'inventories', { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: true })
  supplier_id?: number;

  @ManyToOne('Supplier', 'inventories', { onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToMany('InventoryLog', 'inventory')
  @JoinColumn({ name: 'inventory_id' })
  logs: InventoryLog[];

  @CreateDateColumn({ name: 'created_at' })
  created_at?: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at?: string;
}
