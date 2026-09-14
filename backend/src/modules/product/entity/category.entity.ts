import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Supplier } from '~/modules/supplier/entities/supplier.entity';
import type { Product } from './product.entity';

@Entity({ name: 'categories' })
@Index('category_name', ['name'], { fulltext: true })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @OneToMany('Product', 'category')
  products?: Product[];

  @OneToMany('Supplier', 'category')
  suppliers?: Supplier[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
  updated_at?: Date;
}
