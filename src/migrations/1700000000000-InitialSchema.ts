import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "email" VARCHAR NOT NULL,
        "password" VARCHAR NOT NULL,
        "name" VARCHAR NOT NULL,
        "phone" VARCHAR,
        "role" VARCHAR NOT NULL DEFAULT 'staff',
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "currentToken" VARCHAR,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create menu_items table
    await queryRunner.query(`
      CREATE TABLE "menu_items" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "name" VARCHAR NOT NULL,
        "price" DECIMAL(10,2) NOT NULL,
        "category" VARCHAR NOT NULL,
        "imageUrl" VARCHAR,
        "isAvailable" BOOLEAN NOT NULL DEFAULT true,
        "description" VARCHAR,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_menu_items" PRIMARY KEY ("id")
      )
    `);

    // Create index on menu category
    await queryRunner.query(`
      CREATE INDEX "IDX_menu_items_category" ON "menu_items" ("category")
    `);

    // Create orders table
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "orderNumber" VARCHAR NOT NULL,
        "customerName" VARCHAR NOT NULL,
        "customerPhone" VARCHAR,
        "staffId" UUID,
        "subtotal" DECIMAL(10,2) NOT NULL,
        "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
        "total" DECIMAL(10,2) NOT NULL,
        "status" VARCHAR NOT NULL DEFAULT 'completed',
        "notes" VARCHAR,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_orders" PRIMARY KEY ("id"),
        CONSTRAINT "FK_orders_staff" FOREIGN KEY ("staffId") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Create index on orders for date queries
    await queryRunner.query(`
      CREATE INDEX "IDX_orders_createdAt" ON "orders" ("createdAt")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_orders_customerName" ON "orders" ("customerName")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_orders_customerPhone" ON "orders" ("customerPhone")
    `);

    // Create order_items table
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "orderId" UUID NOT NULL,
        "menuItemId" UUID NOT NULL,
        "name" VARCHAR NOT NULL,
        "price" DECIMAL(10,2) NOT NULL,
        "quantity" INTEGER NOT NULL,
        "total" DECIMAL(10,2) NOT NULL,
        CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_items_order" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE
      )
    `);

    // Create index on order_items
    await queryRunner.query(`
      CREATE INDEX "IDX_order_items_orderId" ON "order_items" ("orderId")
    `);

    // Seed default admin user and user role (both use password: Admin@123)
    await queryRunner.query(`
      INSERT INTO "users" ("email", "password", "name", "phone", "role")
      VALUES 
      (
        'admin@restaurant.com',
        '$2b$10$3Z.6GVOXDWe3eUhzroH8cOUpZ6DiQtt/HsBZILjS3uquEceiwxCsW',
        'Admin',
        '9876543210',
        'admin'
      ),
      (
        'user@restaurant.com',
        '$2b$10$3Z.6GVOXDWe3eUhzroH8cOUpZ6DiQtt/HsBZILjS3uquEceiwxCsW',
        'User',
        '9876543211',
        'user'
      )
    `);

    // Seed sample menu items
    await queryRunner.query(`
      INSERT INTO "menu_items" ("name", "price", "category", "description") VALUES
      ('Margherita Pizza', 12.99, 'Pizza', 'Classic pizza with tomato sauce and mozzarella'),
      ('Pepperoni Pizza', 14.99, 'Pizza', 'Pizza with pepperoni and cheese'),
      ('Chicken Burger', 9.99, 'Burgers', 'Grilled chicken burger with lettuce and mayo'),
      ('Beef Burger', 11.99, 'Burgers', 'Juicy beef patty with all toppings'),
      ('Caesar Salad', 7.99, 'Salads', 'Fresh romaine lettuce with caesar dressing'),
      ('Pasta Carbonara', 13.99, 'Pasta', 'Creamy pasta with bacon and parmesan'),
      ('Coca Cola', 2.99, 'Beverages', 'Chilled soft drink'),
      ('Orange Juice', 3.99, 'Beverages', 'Fresh squeezed orange juice'),
      ('Garlic Bread', 4.99, 'Starters', 'Toasted bread with garlic butter'),
      ('Chicken Wings', 8.99, 'Starters', 'Crispy chicken wings with sauce'),
      ('Chocolate Cake', 5.99, 'Desserts', 'Rich chocolate layer cake'),
      ('Ice Cream', 4.49, 'Desserts', 'Vanilla ice cream with toppings')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_order_items_orderId"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP INDEX "IDX_orders_customerPhone"`);
    await queryRunner.query(`DROP INDEX "IDX_orders_customerName"`);
    await queryRunner.query(`DROP INDEX "IDX_orders_createdAt"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP INDEX "IDX_menu_items_category"`);
    await queryRunner.query(`DROP TABLE "menu_items"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
