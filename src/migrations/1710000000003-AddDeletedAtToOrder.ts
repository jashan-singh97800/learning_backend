import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtToOrder1710000000003 implements MigrationInterface {
  name = 'AddDeletedAtToOrder1710000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deletedAt"`);
  }
}
