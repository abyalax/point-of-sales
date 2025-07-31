import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'categories' })
@Index(['name'], { fulltext: true })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products?: Product[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at?: Date;
}
