import { MigrationInterface, QueryRunner } from 'typeorm';

export class catCompDescriptionLenght1619697067251 implements MigrationInterface {
	name = 'catCompDescriptionLenght1619697067251';
	// Cambiada a mano ya que el generador de migraciones hace Drop y add y se pierden datos
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "cat_comp" ALTER COLUMN "description" TYPE character varying(100)`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "cat_comp" ALTER COLUMN "description" TYPE character varying(25)`);
	}
}
