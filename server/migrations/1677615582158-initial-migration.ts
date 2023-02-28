import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialMigration1677615582158 implements MigrationInterface {
  name = 'initialMigration1677615582158';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "fee" ("id" SERIAL NOT NULL, "fee" integer NOT NULL, CONSTRAINT "PK_ee7e51cc563615bc60c2b234635" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "setting" ("key" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_1c4c95d773004250c157a744d6e" PRIMARY KEY ("key"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "node" ("public_key" character varying NOT NULL, "alias" character varying NOT NULL, "color" character varying NOT NULL, "sockets" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_642aea9758caba3eb3923700e9f" PRIMARY KEY ("public_key"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "channel" ("id" character varying NOT NULL, "capacity" integer NOT NULL, "transaction_id" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL, "source_public_key" character varying NOT NULL, "target_public_key" character varying NOT NULL, CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "channel"`);
    await queryRunner.query(`DROP TABLE "node"`);
    await queryRunner.query(`DROP TABLE "setting"`);
    await queryRunner.query(`DROP TABLE "fee"`);
  }
}
