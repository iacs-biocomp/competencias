import {MigrationInterface, QueryRunner} from "typeorm";

export class nivObjetivo1628851816659 implements MigrationInterface {
    name = 'nivObjetivo1628851816659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "objective_level" ("id" SERIAL NOT NULL, "competenciaId" character varying, "nivelId" integer, "evId" integer, CONSTRAINT "REL_31ded1bed0498befd50ab3b87a" UNIQUE ("competenciaId"), CONSTRAINT "REL_037c4090b234b0081c014e4a90" UNIQUE ("nivelId"), CONSTRAINT "PK_0995eec48d48162d0b846087360" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ev" ADD "organiDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "objective_level" ADD CONSTRAINT "FK_31ded1bed0498befd50ab3b87a6" FOREIGN KEY ("competenciaId") REFERENCES "competencia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "objective_level" ADD CONSTRAINT "FK_037c4090b234b0081c014e4a909" FOREIGN KEY ("nivelId") REFERENCES "nivel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "objective_level" ADD CONSTRAINT "FK_4c3d9e11226cd54cd62ab973881" FOREIGN KEY ("evId") REFERENCES "ev"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "objective_level" DROP CONSTRAINT "FK_4c3d9e11226cd54cd62ab973881"`);
        await queryRunner.query(`ALTER TABLE "objective_level" DROP CONSTRAINT "FK_037c4090b234b0081c014e4a909"`);
        await queryRunner.query(`ALTER TABLE "objective_level" DROP CONSTRAINT "FK_31ded1bed0498befd50ab3b87a6"`);
        await queryRunner.query(`ALTER TABLE "ev" DROP COLUMN "organiDate"`);
        await queryRunner.query(`DROP TABLE "objective_level"`);
    }

}
