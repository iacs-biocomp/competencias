import {MigrationInterface, QueryRunner} from "typeorm";

export class valNiv1628583610147 implements MigrationInterface {
    name = 'valNiv1628583610147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "valoracion" ADD "nivelId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_0aef78ef2ee894c5874a8e539da" FOREIGN KEY ("nivelId") REFERENCES "nivel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_0aef78ef2ee894c5874a8e539da"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP COLUMN "nivelId"`);
    }

}
