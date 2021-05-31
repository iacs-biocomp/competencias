import { MigrationInterface, QueryRunner } from 'typeorm';

export class refColumnNivel1621839664158 implements MigrationInterface {
	name = 'refColumnNivel1621839664158';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "nivel" ADD "reference" boolean NOT NULL DEFAULT false`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "nivel" DROP COLUMN "reference"`);
	}
}
