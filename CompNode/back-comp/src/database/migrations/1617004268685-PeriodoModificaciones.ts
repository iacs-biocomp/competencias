import {MigrationInterface, QueryRunner} from "typeorm";

export class PeriodoModificaciones1617004268685 implements MigrationInterface {
    name = 'PeriodoModificaciones1617004268685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "periodo_trab" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab" ADD "endAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "periodo_trab" DROP COLUMN "endAt"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab" ADD "age" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "periodo_trab" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "periodo_trab" ADD "firstName" character varying NOT NULL`);
    }

}
