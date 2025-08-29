import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EInventoryLogType, EStatusDelivery, EStatusPayment } from '../inventories.schema';
import { Inventory } from './inventory.entity';

@Entity({ name: 'inventory_logs' })
export class InventoryLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  inventory_id: number;

  @Column({ type: 'enum', enum: EInventoryLogType })
  log_type: EInventoryLogType;

  @Column({ type: 'int', nullable: false })
  change_qty: number;

  @Column({ nullable: true })
  ref_id?: number;

  @Column({ type: 'enum', enum: EStatusDelivery, nullable: true })
  status_delivery?: EStatusDelivery;

  @Column({ type: 'enum', enum: EStatusPayment, nullable: true })
  status_payment?: EStatusPayment;

  @CreateDateColumn({ name: 'created_at' })
  created_at?: string;

  @ManyToOne('Inventory', 'logs', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;
}
