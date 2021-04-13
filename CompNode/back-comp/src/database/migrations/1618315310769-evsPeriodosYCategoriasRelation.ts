import {MigrationInterface, QueryRunner} from "typeorm";

export class evsPeriodosYCategoriasRelation1618315310769 implements MigrationInterface {
    name = 'evsPeriodosYCategoriasRelation1618315310769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ev" ADD "iniDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ev" ADD "finPropuestas" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ev" ADD "iniValidacion" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ev" ADD "endValidacion" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ev" ADD "iniValoracion" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ev" ADD "endValoracion" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ev" ADD "iniPerEvaluado" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ev" ADD "endPerEvaluado" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cat_contr" ADD "catCompId" character varying`);
        await queryRunner.query(`ALTER TABLE "cat_contr" ADD CONSTRAINT "UQ_b00ec271818c99549423117fe5c" UNIQUE ("catCompId")`);
        await queryRunner.query(`ALTER TABLE "cat_contr" ADD CONSTRAINT "FK_b00ec271818c99549423117fe5c" FOREIGN KEY ("catCompId") REFERENCES "cat_comp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cat_contr" DROP CONSTRAINT "FK_b00ec271818c99549423117fe5c"`);
        await queryRunner.query(`ALTER TABLE "cat_contr" DROP CONSTRAINT "UQ_b00ec271818c99549423117fe5c"`);
        await queryRunner.query(`ALTER TABLE "cat_contr" DROP COLUMN "catCompId"`);
        await queryRunner.query(`ALTER TABLE "ev" DROP COLUMN "endPerEvaluado"`);
        await queryRunner.query(`ALTER TABLE "ev" DROP COLUMN "iniPerEvaluado"`);
        await queryRunner.query(`ALTER TABLE "ev" DROP COLUMN "endValoracion"`);
        await queryRunner.query(`ALTER TABLE "ev" DROP COLUMN "iniValoracion"`);
        await queryRunner.query(`ALTER TABLE "ev" DROP COLUMN "endValidacion"`);
        await queryRunner.query(`ALTER TABLE "ev" DROP COLUMN "iniValidacion"`);
        await queryRunner.query(`ALTER TABLE "ev" DROP COLUMN "finPropuestas"`);
        await queryRunner.query(`ALTER TABLE "ev" DROP COLUMN "iniDate"`);
    }

}
