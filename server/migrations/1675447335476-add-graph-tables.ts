import { MigrationInterface, QueryRunner } from 'typeorm';

export class addGraphTables1675447335476 implements MigrationInterface {
  name = 'addGraphTables1675447335476';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "node" ("public_key" varchar PRIMARY KEY NOT NULL, "alias" varchar NOT NULL, "color" varchar NOT NULL, "sockets" varchar NOT NULL, "updated_at" datetime NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "channel" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "transaction_id" varchar NOT NULL, "updated_at" datetime NOT NULL, "source_public_key" varchar NOT NULL, "target_public_key" varchar NOT NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "channel"`);
    await queryRunner.query(`DROP TABLE "node"`);
  }
}
