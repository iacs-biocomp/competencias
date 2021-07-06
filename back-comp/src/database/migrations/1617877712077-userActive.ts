import { MigrationInterface, QueryRunner } from 'typeorm';

export class userActive1617877712077 implements MigrationInterface {
	name = 'userActive1617877712077';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "status" TO "active"`);
		await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "active"`);
		await queryRunner.query(`ALTER TABLE "user" ADD "active" boolean NOT NULL DEFAULT false`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "active"`);
		await queryRunner.query(`ALTER TABLE "user" ADD "active" character varying(8) NOT NULL DEFAULT 'INACTIVE'`);
		await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "active" TO "status"`);
	}
}
