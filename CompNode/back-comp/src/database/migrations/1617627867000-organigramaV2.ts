import { MigrationInterface, QueryRunner } from 'typeorm';

export class organigramaV21617627867000 implements MigrationInterface {
	name = 'organigramaV21617627867000';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "valoracion" ("id" SERIAL NOT NULL, "evaluadorDni" character varying, "evaluadoDni" character varying, "evId" integer, CONSTRAINT "REL_e0181634e2274da19b3dc28e88" UNIQUE ("evaluadorDni"), CONSTRAINT "REL_f49beee7069f622de24da9be5e" UNIQUE ("evaluadoDni"), CONSTRAINT "REL_f16af939e76f3da9a38f327413" UNIQUE ("evId"), CONSTRAINT "PK_f600c62375f0641fa63a03b6114" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "periodo_trab_superiores_trabajador" ("periodoTrabId" integer NOT NULL, "trabajadorDni" character varying NOT NULL, CONSTRAINT "PK_78398d63d8781463732b9d07057" PRIMARY KEY ("periodoTrabId", "trabajadorDni"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_532d5f9b11c78ff5c9001a667a" ON "periodo_trab_superiores_trabajador" ("periodoTrabId") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_ba71cc350edbd349f05855cc95" ON "periodo_trab_superiores_trabajador" ("trabajadorDni") `,
		);
		await queryRunner.query(
			`CREATE TABLE "periodo_trab_pares_trabajador" ("periodoTrabId" integer NOT NULL, "trabajadorDni" character varying NOT NULL, CONSTRAINT "PK_7311fb2f8f03611f6e7044e5572" PRIMARY KEY ("periodoTrabId", "trabajadorDni"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_deac51994ff46df074043c7610" ON "periodo_trab_pares_trabajador" ("periodoTrabId") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_e9f76d83af6a535aa163af827e" ON "periodo_trab_pares_trabajador" ("trabajadorDni") `,
		);
		await queryRunner.query(
			`CREATE TABLE "periodo_trab_inferiores_trabajador" ("periodoTrabId" integer NOT NULL, "trabajadorDni" character varying NOT NULL, CONSTRAINT "PK_3546697c2121e2f5d3e154a801d" PRIMARY KEY ("periodoTrabId", "trabajadorDni"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_acaa0c00d0b87df4c409961ed0" ON "periodo_trab_inferiores_trabajador" ("periodoTrabId") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_0790746ac7c818369a2e7de1fb" ON "periodo_trab_inferiores_trabajador" ("trabajadorDni") `,
		);
		await queryRunner.query(`ALTER TABLE "competencia" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
		await queryRunner.query(
			`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_e0181634e2274da19b3dc28e885" FOREIGN KEY ("evaluadorDni") REFERENCES "trabajador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_f49beee7069f622de24da9be5ec" FOREIGN KEY ("evaluadoDni") REFERENCES "trabajador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_f16af939e76f3da9a38f3274137" FOREIGN KEY ("evId") REFERENCES "ev"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "periodo_trab_superiores_trabajador" ADD CONSTRAINT "FK_532d5f9b11c78ff5c9001a667a0" FOREIGN KEY ("periodoTrabId") REFERENCES "periodo_trab"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "periodo_trab_superiores_trabajador" ADD CONSTRAINT "FK_ba71cc350edbd349f05855cc959" FOREIGN KEY ("trabajadorDni") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "periodo_trab_pares_trabajador" ADD CONSTRAINT "FK_deac51994ff46df074043c7610f" FOREIGN KEY ("periodoTrabId") REFERENCES "periodo_trab"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "periodo_trab_pares_trabajador" ADD CONSTRAINT "FK_e9f76d83af6a535aa163af827e4" FOREIGN KEY ("trabajadorDni") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "periodo_trab_inferiores_trabajador" ADD CONSTRAINT "FK_acaa0c00d0b87df4c409961ed0a" FOREIGN KEY ("periodoTrabId") REFERENCES "periodo_trab"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "periodo_trab_inferiores_trabajador" ADD CONSTRAINT "FK_0790746ac7c818369a2e7de1fb3" FOREIGN KEY ("trabajadorDni") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "periodo_trab_inferiores_trabajador" DROP CONSTRAINT "FK_0790746ac7c818369a2e7de1fb3"`,
		);
		await queryRunner.query(
			`ALTER TABLE "periodo_trab_inferiores_trabajador" DROP CONSTRAINT "FK_acaa0c00d0b87df4c409961ed0a"`,
		);
		await queryRunner.query(
			`ALTER TABLE "periodo_trab_pares_trabajador" DROP CONSTRAINT "FK_e9f76d83af6a535aa163af827e4"`,
		);
		await queryRunner.query(
			`ALTER TABLE "periodo_trab_pares_trabajador" DROP CONSTRAINT "FK_deac51994ff46df074043c7610f"`,
		);
		await queryRunner.query(
			`ALTER TABLE "periodo_trab_superiores_trabajador" DROP CONSTRAINT "FK_ba71cc350edbd349f05855cc959"`,
		);
		await queryRunner.query(
			`ALTER TABLE "periodo_trab_superiores_trabajador" DROP CONSTRAINT "FK_532d5f9b11c78ff5c9001a667a0"`,
		);
		await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_f16af939e76f3da9a38f3274137"`);
		await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_f49beee7069f622de24da9be5ec"`);
		await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_e0181634e2274da19b3dc28e885"`);
		await queryRunner.query(`ALTER TABLE "competencia" DROP COLUMN "created_at"`);
		await queryRunner.query(`DROP INDEX "IDX_0790746ac7c818369a2e7de1fb"`);
		await queryRunner.query(`DROP INDEX "IDX_acaa0c00d0b87df4c409961ed0"`);
		await queryRunner.query(`DROP TABLE "periodo_trab_inferiores_trabajador"`);
		await queryRunner.query(`DROP INDEX "IDX_e9f76d83af6a535aa163af827e"`);
		await queryRunner.query(`DROP INDEX "IDX_deac51994ff46df074043c7610"`);
		await queryRunner.query(`DROP TABLE "periodo_trab_pares_trabajador"`);
		await queryRunner.query(`DROP INDEX "IDX_ba71cc350edbd349f05855cc95"`);
		await queryRunner.query(`DROP INDEX "IDX_532d5f9b11c78ff5c9001a667a"`);
		await queryRunner.query(`DROP TABLE "periodo_trab_superiores_trabajador"`);
		await queryRunner.query(`DROP TABLE "valoracion"`);
	}
}
