import { MigrationInterface, QueryRunner } from 'typeorm';

export class referenceModel1620888628211 implements MigrationInterface {
	name = 'referenceModel1620888628211';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "ev_model" ADD "reference" boolean NOT NULL DEFAULT false`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "ev_model" DROP COLUMN "reference"`);
	}
}
