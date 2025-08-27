import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Inventory } from '~/modules/inventories/entities/inventory.entity';
import { EProductStatus } from '../product.schema';
import type { Category } from './category.entity';

@Entity({ name: 'products' })
@Index(['name'], { fulltext: true })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  barcode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  cost_price: string;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: false })
  tax_rate: string;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: false })
  discount: string;

  @Column({ type: 'enum', enum: EProductStatus })
  status: EProductStatus;

  @Column({ type: 'int', nullable: false, default: 0 })
  stock: number;

  @Column({ nullable: true })
  category_id: number;

  @ManyToOne('Category', 'products', { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany('Inventory', 'product')
  inventories?: Inventory[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  created_at?: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  updated_at?: string;
}
