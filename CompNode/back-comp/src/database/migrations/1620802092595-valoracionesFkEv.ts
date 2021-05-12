import {MigrationInterface, QueryRunner} from "typeorm";

export class valoracionesFkEv1620802092595 implements MigrationInterface {
    name = 'valoracionesFkEv1620802092595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_f16af939e76f3da9a38f3274137"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "REL_f16af939e76f3da9a38f327413"`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_f16af939e76f3da9a38f3274137" FOREIGN KEY ("evId") REFERENCES "ev"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_f16af939e76f3da9a38f3274137"`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "REL_f16af939e76f3da9a38f327413" UNIQUE ("evId")`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_f16af939e76f3da9a38f3274137" FOREIGN KEY ("evId") REFERENCES "ev"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
