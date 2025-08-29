import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generated1756462111501 implements MigrationInterface {
  name = 'Generated1756462111501';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`purchase_order_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`purchase_order_id\` int NOT NULL, \`product_id\` int NOT NULL, \`quantity\` int NOT NULL, \`price\` decimal(10,2) NOT NULL, \`sub_total\` decimal(10,2) NOT NULL DEFAULT '0.00', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`transaction_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`barcode\` varchar(100) NOT NULL, \`name\` varchar(100) NOT NULL, \`category\` varchar(100) NOT NULL, \`quantity\` int NOT NULL DEFAULT '1', \`price\` decimal(10,2) NOT NULL, \`cost_price\` decimal(10,2) NOT NULL, \`sell_price\` decimal(10,2) NOT NULL, \`final_price\` decimal(10,2) NOT NULL, \`tax_rate\` decimal(5,4) NOT NULL, \`discount\` decimal(5,4) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`transaction_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`purchase_payments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`purchase_order_id\` int NOT NULL, \`status\` enum ('paid', 'unpaid', 'partial') NOT NULL DEFAULT 'unpaid', \`amount\` decimal(10,2) NOT NULL, \`payment_date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`inventories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NOT NULL, \`stock\` int NOT NULL DEFAULT '0', \`min_stock\` int NOT NULL DEFAULT '0', \`max_stock\` int NOT NULL DEFAULT '0', \`supplier_id\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`inventory_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`inventory_id\` int NOT NULL, \`log_type\` enum ('Order', 'Pre Order', 'Sales', 'Cancel', 'Adjustment') NOT NULL, \`change_qty\` int NOT NULL, \`ref_id\` int NULL, \`status_delivery\` enum ('Pending', 'Delivered', 'Dropped', 'Completed', 'Cancel') NULL, \`status_payment\` enum ('Paid', 'Unpaid') NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`purchase_orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`supplier_id\` int NOT NULL, \`status\` enum ('pending', 'approved', 'delivered', 'completed', 'cancelled') NOT NULL DEFAULT 'pending', \`total_amount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`order_date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`expected_date\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`transactions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cashier\` varchar(100) NOT NULL, \`status\` enum ('Draft', 'Pending', 'Completed', 'Cancelled', 'Refunded') NOT NULL, \`sub_total\` decimal(10,2) NOT NULL, \`total_discount\` decimal(10,2) NOT NULL, \`total_price\` decimal(10,2) NOT NULL, \`total_profit\` decimal(10,2) NOT NULL, \`total_tax\` decimal(10,2) NOT NULL, \`last_price\` decimal(10,2) NOT NULL, \`pay_received\` decimal(10,2) NOT NULL, \`pay_return\` decimal(10,2) NOT NULL, \`payment_method\` enum ('Cash', 'Qris', 'Debit', 'Ewallet') NOT NULL, \`notes\` varchar(100) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`suppliers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`address\` varchar(255) NOT NULL, \`phone\` varchar(15) NOT NULL, \`email\` varchar(100) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`category_id\` int NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), FULLTEXT INDEX \`IDX_5b5720d9645cee7396595a16c9\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key_name\` varchar(80) NOT NULL, \`name_permission\` varchar(80) NOT NULL, UNIQUE INDEX \`IDX_4be56d0cb4f14292b2b5942d3b\` (\`key_name\`), UNIQUE INDEX \`IDX_e77c25aaad297ba331155532fa\` (\`name_permission\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), FULLTEXT INDEX \`IDX_8b0be371d28245da6e4f4b6187\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`barcode\` varchar(100) NOT NULL, \`price\` decimal(10,2) NOT NULL, \`cost_price\` decimal(10,2) NOT NULL, \`tax_rate\` decimal(5,4) NOT NULL, \`discount\` decimal(5,4) NOT NULL, \`status\` enum ('Available', 'UnAvailable') NOT NULL, \`category_id\` int NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), FULLTEXT INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(100) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id_role\` int NOT NULL AUTO_INCREMENT, \`name_role\` varchar(50) NOT NULL, PRIMARY KEY (\`id_role\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_roles\` (\`id_user\` int NOT NULL, \`id_role\` int NOT NULL, INDEX \`IDX_37a75bf56b7a6ae65144e0d5c0\` (\`id_user\`), INDEX \`IDX_af69ec5d5bd973309c025e7a62\` (\`id_role\`), PRIMARY KEY (\`id_user\`, \`id_role\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_permissions\` (\`id_role\` int NOT NULL, \`id_permission\` int NOT NULL, INDEX \`IDX_c0f5917f07a9e2bfd31ac5fb15\` (\`id_role\`), INDEX \`IDX_5e7caee2bb7c1030ab07ad70ec\` (\`id_permission\`), PRIMARY KEY (\`id_role\`, \`id_permission\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase_order_items\` ADD CONSTRAINT \`FK_3f92bb44026cedfe235c8b91244\` FOREIGN KEY (\`purchase_order_id\`) REFERENCES \`purchase_orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase_order_items\` ADD CONSTRAINT \`FK_d5089517fc19b1b9fb04454740c\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_items\` ADD CONSTRAINT \`FK_5926425896b30c0d681fe879af0\` FOREIGN KEY (\`transaction_id\`) REFERENCES \`transactions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase_payments\` ADD CONSTRAINT \`FK_e72e88d348ffb035d125408a546\` FOREIGN KEY (\`purchase_order_id\`) REFERENCES \`purchase_orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventories\` ADD CONSTRAINT \`FK_92fc0c77bab4a656b9619322c62\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventories\` ADD CONSTRAINT \`FK_3bed26289926c1ad4a08d4c7285\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_logs\` ADD CONSTRAINT \`FK_1608cc9510a9beab02f165ebfee\` FOREIGN KEY (\`inventory_id\`) REFERENCES \`inventories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase_orders\` ADD CONSTRAINT \`FK_d16a885aa88447ccfd010e739b0\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_e9acc6efa76de013e8c1553ed2b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`suppliers\` ADD CONSTRAINT \`FK_5382d68f1c9b36d06f2decbaeb0\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_37a75bf56b7a6ae65144e0d5c00\` FOREIGN KEY (\`id_user\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_af69ec5d5bd973309c025e7a62e\` FOREIGN KEY (\`id_role\`) REFERENCES \`roles\`(\`id_role\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_c0f5917f07a9e2bfd31ac5fb154\` FOREIGN KEY (\`id_role\`) REFERENCES \`roles\`(\`id_role\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_5e7caee2bb7c1030ab07ad70ec2\` FOREIGN KEY (\`id_permission\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_5e7caee2bb7c1030ab07ad70ec2\``);
    await queryRunner.query(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_c0f5917f07a9e2bfd31ac5fb154\``);
    await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_af69ec5d5bd973309c025e7a62e\``);
    await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_37a75bf56b7a6ae65144e0d5c00\``);
    await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\``);
    await queryRunner.query(`ALTER TABLE \`suppliers\` DROP FOREIGN KEY \`FK_5382d68f1c9b36d06f2decbaeb0\``);
    await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_e9acc6efa76de013e8c1553ed2b\``);
    await queryRunner.query(`ALTER TABLE \`purchase_orders\` DROP FOREIGN KEY \`FK_d16a885aa88447ccfd010e739b0\``);
    await queryRunner.query(`ALTER TABLE \`inventory_logs\` DROP FOREIGN KEY \`FK_1608cc9510a9beab02f165ebfee\``);
    await queryRunner.query(`ALTER TABLE \`inventories\` DROP FOREIGN KEY \`FK_3bed26289926c1ad4a08d4c7285\``);
    await queryRunner.query(`ALTER TABLE \`inventories\` DROP FOREIGN KEY \`FK_92fc0c77bab4a656b9619322c62\``);
    await queryRunner.query(`ALTER TABLE \`purchase_payments\` DROP FOREIGN KEY \`FK_e72e88d348ffb035d125408a546\``);
    await queryRunner.query(`ALTER TABLE \`transaction_items\` DROP FOREIGN KEY \`FK_5926425896b30c0d681fe879af0\``);
    await queryRunner.query(`ALTER TABLE \`purchase_order_items\` DROP FOREIGN KEY \`FK_d5089517fc19b1b9fb04454740c\``);
    await queryRunner.query(`ALTER TABLE \`purchase_order_items\` DROP FOREIGN KEY \`FK_3f92bb44026cedfe235c8b91244\``);
    await queryRunner.query(`DROP INDEX \`IDX_5e7caee2bb7c1030ab07ad70ec\` ON \`role_permissions\``);
    await queryRunner.query(`DROP INDEX \`IDX_c0f5917f07a9e2bfd31ac5fb15\` ON \`role_permissions\``);
    await queryRunner.query(`DROP TABLE \`role_permissions\``);
    await queryRunner.query(`DROP INDEX \`IDX_af69ec5d5bd973309c025e7a62\` ON \`user_roles\``);
    await queryRunner.query(`DROP INDEX \`IDX_37a75bf56b7a6ae65144e0d5c0\` ON \`user_roles\``);
    await queryRunner.query(`DROP TABLE \`user_roles\``);
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``);
    await queryRunner.query(`DROP TABLE \`products\``);
    await queryRunner.query(`DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\` ON \`categories\``);
    await queryRunner.query(`DROP TABLE \`categories\``);
    await queryRunner.query(`DROP INDEX \`IDX_e77c25aaad297ba331155532fa\` ON \`permissions\``);
    await queryRunner.query(`DROP INDEX \`IDX_4be56d0cb4f14292b2b5942d3b\` ON \`permissions\``);
    await queryRunner.query(`DROP TABLE \`permissions\``);
    await queryRunner.query(`DROP INDEX \`IDX_5b5720d9645cee7396595a16c9\` ON \`suppliers\``);
    await queryRunner.query(`DROP TABLE \`suppliers\``);
    await queryRunner.query(`DROP TABLE \`transactions\``);
    await queryRunner.query(`DROP TABLE \`purchase_orders\``);
    await queryRunner.query(`DROP TABLE \`inventory_logs\``);
    await queryRunner.query(`DROP TABLE \`inventories\``);
    await queryRunner.query(`DROP TABLE \`purchase_payments\``);
    await queryRunner.query(`DROP TABLE \`transaction_items\``);
    await queryRunner.query(`DROP TABLE \`purchase_order_items\``);
  }
}
