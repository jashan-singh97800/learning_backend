import { MigrationInterface, QueryRunner } from 'typeorm';

export class SettingsSchema1730000000000 implements MigrationInterface {
  name = 'SettingsSchema1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "settings" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "gstPercentage" DECIMAL(5,2) NOT NULL DEFAULT 5.00,
        "discountPercentage" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_settings" PRIMARY KEY ("id")
      )
    `);

    // Insert default settings row
    await queryRunner.query(`
      INSERT INTO "settings" ("gstPercentage", "discountPercentage") VALUES (5.00, 0.00)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "settings"`);
  }
}
