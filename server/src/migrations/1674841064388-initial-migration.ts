import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1674841064388 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "fee" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "fee" integer NOT NULL)`,
    );
    await queryRunner.query(`CREATE TABLE "setting" ("key" varchar PRIMARY KEY NOT NULL, "value" varchar NOT NULL)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "setting"`);
    await queryRunner.query(`DROP TABLE "fee"`);
  }
}
