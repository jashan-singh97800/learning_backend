import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderDiscount1710000000001 implements MigrationInterface {
  name = 'AddOrderDiscount1710000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" ADD "discount" numeric(10,2) NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "discount"`);
  }
}
