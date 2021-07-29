import {MigrationInterface, QueryRunner} from "typeorm";

export class nulls1627455416620 implements MigrationInterface {
    name = 'nulls1627455416620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ev_model" DROP CONSTRAINT "FK_28fd6fa682c7355fa835d0763bf"`);
        await queryRunner.query(`ALTER TABLE "ev_model" ALTER COLUMN "catCompId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_e0181634e2274da19b3dc28e885"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_f49beee7069f622de24da9be5ec"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_f16af939e76f3da9a38f3274137"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_5c5722245a790e1473626f12b6d"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_76b91512ef1ca0628d8d4e9c6fd"`);
        await queryRunner.query(`ALTER TABLE "valoracion" ALTER COLUMN "evaluadorDni" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "valoracion" ALTER COLUMN "evaluadoDni" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "valoracion" ALTER COLUMN "evId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "valoracion" ALTER COLUMN "compId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "valoracion" ALTER COLUMN "comportId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ev_model" ADD CONSTRAINT "FK_28fd6fa682c7355fa835d0763bf" FOREIGN KEY ("catCompId") REFERENCES "cat_comp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_e0181634e2274da19b3dc28e885" FOREIGN KEY ("evaluadorDni") REFERENCES "trabajador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_f49beee7069f622de24da9be5ec" FOREIGN KEY ("evaluadoDni") REFERENCES "trabajador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_f16af939e76f3da9a38f3274137" FOREIGN KEY ("evId") REFERENCES "ev"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_5c5722245a790e1473626f12b6d" FOREIGN KEY ("compId") REFERENCES "competencia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_76b91512ef1ca0628d8d4e9c6fd" FOREIGN KEY ("comportId") REFERENCES "comportamiento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_76b91512ef1ca0628d8d4e9c6fd"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_5c5722245a790e1473626f12b6d"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_f16af939e76f3da9a38f3274137"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_f49beee7069f622de24da9be5ec"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_e0181634e2274da19b3dc28e885"`);
        await queryRunner.query(`ALTER TABLE "ev_model" DROP CONSTRAINT "FK_28fd6fa682c7355fa835d0763bf"`);
        await queryRunner.query(`ALTER TABLE "valoracion" ALTER COLUMN "comportId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "valoracion" ALTER COLUMN "compId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "valoracion" ALTER COLUMN "evId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "valoracion" ALTER COLUMN "evaluadoDni" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "valoracion" ALTER COLUMN "evaluadorDni" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_76b91512ef1ca0628d8d4e9c6fd" FOREIGN KEY ("comportId") REFERENCES "comportamiento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_5c5722245a790e1473626f12b6d" FOREIGN KEY ("compId") REFERENCES "competencia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_f16af939e76f3da9a38f3274137" FOREIGN KEY ("evId") REFERENCES "ev"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_f49beee7069f622de24da9be5ec" FOREIGN KEY ("evaluadoDni") REFERENCES "trabajador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_e0181634e2274da19b3dc28e885" FOREIGN KEY ("evaluadorDni") REFERENCES "trabajador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ev_model" ALTER COLUMN "catCompId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ev_model" ADD CONSTRAINT "FK_28fd6fa682c7355fa835d0763bf" FOREIGN KEY ("catCompId") REFERENCES "cat_comp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
