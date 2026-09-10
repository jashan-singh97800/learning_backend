import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderItemDiscount1710000000002 implements MigrationInterface {
  name = 'AddOrderItemDiscount1710000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_items" ADD "discount" numeric(10,2) NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "discount"`);
  }
}
