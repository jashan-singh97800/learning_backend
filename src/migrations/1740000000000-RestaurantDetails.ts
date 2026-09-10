import { MigrationInterface, QueryRunner } from 'typeorm';

export class RestaurantDetails1740000000000 implements MigrationInterface {
  name = 'RestaurantDetails1740000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "restaurant_details" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "name" VARCHAR NOT NULL DEFAULT 'RestoBill',
        "address" VARCHAR,
        "phone" VARCHAR,
        "gstin" VARCHAR,
        "email" VARCHAR,
        "tagline" VARCHAR,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_restaurant_details" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      INSERT INTO "restaurant_details" ("name", "address", "phone", "gstin", "tagline")
      VALUES (
        'EATNREPEAT',
        'SHOPNO-2 LOWER MALL PATIALA',
        '9646686001',
        '',
        'Fresh Food, Fast Service'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "restaurant_details"`);
  }
}
