import { type MigrationInterface, type QueryRunner } from "typeorm";

class InitialMigration1747320040887 implements MigrationInterface {
  name = "InitialMigration1747320040887";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE \"public\".\"subscription_frequency_enum\" AS ENUM('hourly', 'daily')"
    );
    await queryRunner.query(
      'CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "token" uuid NOT NULL DEFAULT uuid_generate_v4(), "city" character varying(100) NOT NULL, "frequency" "public"."subscription_frequency_enum" NOT NULL, "confirmed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ba857f4e5d61b74f184c26de3c4" UNIQUE ("email"), CONSTRAINT "UQ_0571948f069a682bba84859732a" UNIQUE ("token"), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))'
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_ba857f4e5d61b74f184c26de3c" ON "subscription" ("email") '
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX "public"."IDX_ba857f4e5d61b74f184c26de3c"'
    );
    await queryRunner.query('DROP TABLE "subscription"');
    await queryRunner.query('DROP TYPE "public"."subscription_frequency_enum"');
  }
}

export { InitialMigration1747320040887 };
