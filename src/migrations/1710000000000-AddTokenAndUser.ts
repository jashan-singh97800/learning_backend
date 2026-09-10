import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTokenAndUser1710000000000 implements MigrationInterface {
  name = 'AddTokenAndUser1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if column exists just in case
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "currentToken" character varying`);
    
    // Insert the User role mock account
    await queryRunner.query(`
      INSERT INTO "users" ("email", "password", "name", "phone", "role")
      VALUES 
      (
        'user@restaurant.com',
        '$2b$10$3Z.6GVOXDWe3eUhzroH8cOUpZ6DiQtt/HsBZILjS3uquEceiwxCsW',
        'User',
        '9876543211',
        'user'
      )
      ON CONFLICT ("email") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" WHERE "email" = 'user@restaurant.com'`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "currentToken"`);
  }
}
