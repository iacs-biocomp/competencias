import { MigrationInterface, QueryRunner } from 'typeorm';

export class trabPeriodoNotNull1618229029669 implements MigrationInterface {
	name = 'trabPeriodoNotNull1618229029669';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "periodo_trab" DROP CONSTRAINT "FK_fcc057f91dce6e5ca8a50e9553a"`);
		await queryRunner.query(`ALTER TABLE "periodo_trab" ALTER COLUMN "trabajadorDni" SET NOT NULL`);
		await queryRunner.query(
			`ALTER TABLE "periodo_trab" ADD CONSTRAINT "FK_fcc057f91dce6e5ca8a50e9553a" FOREIGN KEY ("trabajadorDni") REFERENCES "trabajador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "periodo_trab" DROP CONSTRAINT "FK_fcc057f91dce6e5ca8a50e9553a"`);
		await queryRunner.query(`ALTER TABLE "periodo_trab" ALTER COLUMN "trabajadorDni" DROP NOT NULL`);
		await queryRunner.query(
			`ALTER TABLE "periodo_trab" ADD CONSTRAINT "FK_fcc057f91dce6e5ca8a50e9553a" FOREIGN KEY ("trabajadorDni") REFERENCES "trabajador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}
}
