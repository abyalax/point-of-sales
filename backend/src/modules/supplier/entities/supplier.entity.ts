import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Inventory } from '~/modules/inventories/entities/inventory.entity';
import type { Category } from '~/modules/product/entity/category.entity';

@Entity({ name: 'suppliers' })
@Index(['name'], { fulltext: true })
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  is_active: boolean;

  @Column({ nullable: true })
  category_id: number;

  @ManyToOne('Category', 'suppliers', { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany('Inventory', 'supplier')
  inventories: Inventory[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  created_at?: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  updated_at?: string;
}
