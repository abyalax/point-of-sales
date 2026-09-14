## D:\typescript\point-of-sales\backend\src\modules\auth\entity\permission.entity.ts

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Role } from './role.entity';
@Entity({ name: 'permissions' })
export class Permission {
@PrimaryGeneratedColumn()
id: number;
@Column({ name: 'key_name', type: 'varchar', length: 80, unique: true })
key: string;
@Column({ name: 'name_permission', type: 'varchar', length: 80, unique: true })
name: string;
@ManyToMany('Role', 'permissions')
roles: Role[];
}

## D:\typescript\point-of-sales\backend\src\modules\auth\entity\role.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import type { User } from '~/modules/user/entity/user.entity';
import type { Permission } from './permission.entity';
@Entity({ name: 'roles' })
export class Role {
@PrimaryGeneratedColumn({ name: 'id_role' })
id: number;
@Column({ name: 'name_role', length: 50 })
name: string;
@ManyToMany('User', 'roles')
users: User[];
@ManyToMany('Permission', 'roles')
@JoinTable({
name: 'role_permissions',
joinColumn: { name: 'id_role', referencedColumnName: 'id' },
inverseJoinColumn: { name: 'id_permission', referencedColumnName: 'id' },
})
permissions: Permission[];
}

## D:\typescript\point-of-sales\backend\src\modules\inventories\entities\inventory-log.entity.ts

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

## D:\typescript\point-of-sales\backend\src\modules\inventories\entities\inventory.entity.ts

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
@Column({ type: 'varchar', length: 100 })
barcode: string;
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

## D:\typescript\point-of-sales\backend\src\modules\product\entity\category.entity.ts

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
created_at?: string;
@UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
updated_at?: string;
}

## D:\typescript\point-of-sales\backend\src\modules\product\entity\product.entity.ts

import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Inventory } from '~/modules/inventories/entities/inventory.entity';
import { EProductStatus } from '../product.schema';
import type { Category } from './category.entity';
@Entity({ name: 'products' })
@Index('product_name', ['name'], { fulltext: true })
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

## D:\typescript\point-of-sales\backend\src\modules\purchase\entities\purchase-order-item.entity.ts

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
sub_total: string; // price \* quantity
}

## D:\typescript\point-of-sales\backend\src\modules\purchase\entities\purchase-order.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import type { Supplier } from '~/modules/supplier/entities/supplier.entity';
import type { PurchaseOrderItem } from './purchase-order-item.entity';
import { EPurchaseStatus } from '../purchase.schema';
@Entity({ name: 'purchase_orders' })
export class PurchaseOrder {
@PrimaryGeneratedColumn()
id: number;
@Column({ nullable: false })
supplier_id: number;
@ManyToOne('Supplier', 'purchaseOrders', { eager: true })
@JoinColumn({ name: 'supplier_id' })
supplier: Supplier;
@Column({ type: 'enum', enum: EPurchaseStatus, default: EPurchaseStatus.PENDING })
status: EPurchaseStatus;
@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
total_amount: string;
@Column({ type: 'timestamp', name: 'order_date', default: () => 'CURRENT_TIMESTAMP' })
order_date: string;
@Column({ type: 'timestamp', name: 'expected_date', nullable: true })
expected_date?: string;
@CreateDateColumn({ name: 'created_at' })
created_at: string;
@UpdateDateColumn({ name: 'updated_at' })
updated_at: string;
@OneToMany('PurchaseOrderItem', 'purchaseOrder', { cascade: true })
items: PurchaseOrderItem[];
}

## D:\typescript\point-of-sales\backend\src\modules\purchase\entities\purchase-payment.entity.ts

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

## D:\typescript\point-of-sales\backend\src\modules\supplier\entities\supplier.entity.ts

import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Inventory } from '~/modules/inventories/entities/inventory.entity';
import type { Category } from '~/modules/product/entity/category.entity';
@Entity({ name: 'suppliers' })
@Index('supplier_name', ['name'], { fulltext: true })
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

## D:\typescript\point-of-sales\backend\src\modules\transaction\entities\transaction-item.entity.ts

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Transaction } from './transaction.entity';
@Entity({ name: 'transaction_items' })
export class TransactionItem {
@PrimaryGeneratedColumn()
id: number;
@Column({ type: 'varchar', length: 100 })
barcode: string;
@Column({ type: 'varchar', length: 100 })
name: string;
@Column({ type: 'varchar', length: 100 })
category: string;
@Column({ type: 'int', default: 1 })
quantity: number;
@Column({ type: 'decimal', precision: 10, scale: 2 })
price: string;
@Column({ type: 'decimal', precision: 10, scale: 2 })
cost_price: string;
@Column({ type: 'decimal', precision: 10, scale: 2 })
sell_price: string;
@Column({ type: 'decimal', precision: 10, scale: 2 })
final_price: string;
@Column({ type: 'decimal', precision: 5, scale: 4 })
tax_rate: string;
@Column({ type: 'decimal', precision: 5, scale: 4 })
discount: string;
@ManyToOne('Transaction', 'items', { cascade: ['insert'], onDelete: 'CASCADE' })
@JoinColumn({ name: 'transaction_id' })
transaction?: Transaction;
@CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
created_at?: string;
@CreateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
updated_at?: string;
}

## D:\typescript\point-of-sales\backend\src\modules\transaction\entities\transaction.entity.ts

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { TransactionItem } from './transaction-item.entity';
import type { User } from '~/modules/user/entity/user.entity';
import { EPaymentMethod, EStatusTransactions } from '../transaction.schema';
@Entity({ name: 'transactions' })
export class Transaction {
@PrimaryGeneratedColumn()
id: number;
@ManyToOne('User', 'transactions', { onDelete: 'NO ACTION' })
@JoinColumn({ name: 'user_id' })
user: User;
@Column({ type: 'varchar', length: 100, nullable: false })
cashier: string;
@Column({ type: 'enum', enum: EStatusTransactions })
status: EStatusTransactions;
@Column({ type: 'decimal', precision: 10, scale: 2 })
sub_total: string;
@Column({ type: 'decimal', precision: 10, scale: 2 })
total_discount: string;
@Column({ type: 'decimal', precision: 10, scale: 2 })
total_price: string;
@Column({ type: 'decimal', precision: 10, scale: 2 })
total_profit: string;
@Column({ type: 'decimal', precision: 10, scale: 2 })
total_tax: string;
@Column({ type: 'decimal', precision: 10, scale: 2 })
last_price: string;
@Column({ type: 'decimal', precision: 10, scale: 2 })
pay_received: string;
@Column({ type: 'decimal', precision: 10, scale: 2 })
pay_return: string;
@Column({ type: 'enum', enum: EPaymentMethod })
payment_method: string;
@OneToMany('TransactionItem', 'transaction', { cascade: ['insert'], eager: true })
items: TransactionItem[];
@Column({ type: 'varchar', length: 100, nullable: true })
notes?: string;
@CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
created_at?: string;
@UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
updated_at?: string;
}

## D:\typescript\point-of-sales\backend\src\modules\user\entity\user.entity.ts

import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Transaction } from '~/modules/transaction/entities/transaction.entity';
import type { Role } from '~/modules/auth/entity/role.entity';
@Entity({ name: 'users' })
export class User {
@PrimaryGeneratedColumn()
id: number;
@Column({ type: 'varchar', length: 100, nullable: false })
name: string;
@Column({ type: 'varchar', length: 100, nullable: false })
email: string;
@Column({ type: 'varchar', length: 100, nullable: false })
password?: string;
@ManyToMany('Role', 'users')
@JoinTable({
name: 'user_roles',
joinColumn: { name: 'id_user', referencedColumnName: 'id' },
inverseJoinColumn: { name: 'id_role', referencedColumnName: 'id' },
})
roles?: Role[];
@OneToMany('Transaction', 'user')
transactions?: Transaction[];
@CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
created_at?: string;
@UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP(6)', nullable: false })
updated_at?: string;
}
