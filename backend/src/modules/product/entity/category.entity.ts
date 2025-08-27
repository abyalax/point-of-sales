import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Supplier } from '~/modules/supplier/entities/supplier.entity';
import type { Product } from './product.entity';

@Entity({ name: 'categories' })
@Index(['name'], { fulltext: true })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany('Product', 'category')
  products?: Product[];

  @OneToMany('Supplier', 'category')
  suppliers?: Supplier[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  created_at?: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  updated_at?: string;
}
