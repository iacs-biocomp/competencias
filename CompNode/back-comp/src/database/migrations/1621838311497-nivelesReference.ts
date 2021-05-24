import {MigrationInterface, QueryRunner} from "typeorm";

export class nivelesReference1621838311497 implements MigrationInterface {
    name = 'nivelesReference1621838311497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nivel" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nivel" ADD "minRango" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nivel" ADD "maxRango" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sub_model" DROP CONSTRAINT "FK_c2e046a0b5548c36d512cbb0195"`);
        await queryRunner.query(`ALTER TABLE "nivel" DROP CONSTRAINT "PK_95d0c2b904d0f34ab071aa1183a"`);
        await queryRunner.query(`ALTER TABLE "nivel" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "nivel" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nivel" ADD CONSTRAINT "PK_95d0c2b904d0f34ab071aa1183a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "nivel" DROP CONSTRAINT "UQ_75497f15a06182cf1a1717bcc8a"`);
        await queryRunner.query(`ALTER TABLE "sub_model" DROP CONSTRAINT "FK_5fcc0c596dd9ab4185f947f7377"`);
        await queryRunner.query(`ALTER TABLE "sub_model" DROP COLUMN "nivelId"`);
        await queryRunner.query(`ALTER TABLE "sub_model" ADD "nivelId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sub_model" ALTER COLUMN "competenciaId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sub_model" ADD CONSTRAINT "FK_c2e046a0b5548c36d512cbb0195" FOREIGN KEY ("nivelId") REFERENCES "nivel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_model" ADD CONSTRAINT "FK_5fcc0c596dd9ab4185f947f7377" FOREIGN KEY ("competenciaId") REFERENCES "competencia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_model" DROP CONSTRAINT "FK_5fcc0c596dd9ab4185f947f7377"`);
        await queryRunner.query(`ALTER TABLE "sub_model" DROP CONSTRAINT "FK_c2e046a0b5548c36d512cbb0195"`);
        await queryRunner.query(`ALTER TABLE "sub_model" ALTER COLUMN "competenciaId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sub_model" DROP COLUMN "nivelId"`);
        await queryRunner.query(`ALTER TABLE "sub_model" ADD "nivelId" character varying`);
        await queryRunner.query(`ALTER TABLE "sub_model" ADD CONSTRAINT "FK_5fcc0c596dd9ab4185f947f7377" FOREIGN KEY ("competenciaId") REFERENCES "competencia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nivel" ADD CONSTRAINT "UQ_75497f15a06182cf1a1717bcc8a" UNIQUE ("valor")`);
        await queryRunner.query(`ALTER TABLE "nivel" DROP CONSTRAINT "PK_95d0c2b904d0f34ab071aa1183a"`);
        await queryRunner.query(`ALTER TABLE "nivel" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "nivel" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nivel" ADD CONSTRAINT "PK_95d0c2b904d0f34ab071aa1183a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "sub_model" ADD CONSTRAINT "FK_c2e046a0b5548c36d512cbb0195" FOREIGN KEY ("nivelId") REFERENCES "nivel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nivel" DROP COLUMN "maxRango"`);
        await queryRunner.query(`ALTER TABLE "nivel" DROP COLUMN "minRango"`);
        await queryRunner.query(`ALTER TABLE "nivel" DROP COLUMN "code"`);
    }

}
