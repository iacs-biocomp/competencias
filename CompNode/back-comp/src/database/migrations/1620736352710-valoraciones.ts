import {MigrationInterface, QueryRunner} from "typeorm";

export class valoraciones1620736352710 implements MigrationInterface {
    name = 'valoraciones1620736352710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "valoracion" ADD "valoracion" smallint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD "compId" character varying`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD "comportId" character varying`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_5c5722245a790e1473626f12b6d" FOREIGN KEY ("compId") REFERENCES "competencia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_76b91512ef1ca0628d8d4e9c6fd" FOREIGN KEY ("comportId") REFERENCES "comportamiento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_76b91512ef1ca0628d8d4e9c6fd"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_5c5722245a790e1473626f12b6d"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP COLUMN "comportId"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP COLUMN "compId"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP COLUMN "valoracion"`);
    }

}
