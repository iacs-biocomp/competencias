import {MigrationInterface, QueryRunner} from "typeorm";

export class evsNivCompeComport1617092488014 implements MigrationInterface {
    name = 'evsNivCompeComport1617092488014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ev_model" RENAME COLUMN "description" TO "catCompId"`);
        await queryRunner.query(`ALTER TABLE "ev_model" RENAME CONSTRAINT "UQ_f4531a4eaff0c83e965f9982aa2" TO "UQ_28fd6fa682c7355fa835d0763bf"`);
        await queryRunner.query(`CREATE TABLE "competencia" ("id" character varying NOT NULL, "descripcion" character varying NOT NULL, CONSTRAINT "PK_e5c3f47e057a120138cd68862b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comportamiento" ("id" character varying NOT NULL, "descripcion" character varying NOT NULL, CONSTRAINT "PK_2bd67be74577ef552211fcd964a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nivel" ("id" character varying NOT NULL, "valor" double precision NOT NULL, CONSTRAINT "UQ_75497f15a06182cf1a1717bcc8a" UNIQUE ("valor"), CONSTRAINT "PK_95d0c2b904d0f34ab071aa1183a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sub_model" ("id" SERIAL NOT NULL, "nivelId" character varying, "competenciaId" character varying, CONSTRAINT "PK_7e1ad63eb28bcea2cd2846694b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sub_model_comportamientos_comportamiento" ("subModelId" integer NOT NULL, "comportamientoId" character varying NOT NULL, CONSTRAINT "PK_b156e5963cf581d4cc73b270017" PRIMARY KEY ("subModelId", "comportamientoId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1db340f239e4511371d26d8424" ON "sub_model_comportamientos_comportamiento" ("subModelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e03e7b57cff906ec13507d115" ON "sub_model_comportamientos_comportamiento" ("comportamientoId") `);
        await queryRunner.query(`CREATE TABLE "ev_model_sub_models_sub_model" ("evModelId" integer NOT NULL, "subModelId" integer NOT NULL, CONSTRAINT "PK_e90dbfd75194f8f539316f92492" PRIMARY KEY ("evModelId", "subModelId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_320d9c14bde22c82074a17cb00" ON "ev_model_sub_models_sub_model" ("evModelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_01023e9920521d827abc4d48bf" ON "ev_model_sub_models_sub_model" ("subModelId") `);
        await queryRunner.query(`ALTER TABLE "ev" ADD "catCompId" character varying`);
        await queryRunner.query(`ALTER TABLE "ev_model" DROP CONSTRAINT "UQ_28fd6fa682c7355fa835d0763bf"`);
        await queryRunner.query(`ALTER TABLE "ev_model" DROP COLUMN "catCompId"`);
        await queryRunner.query(`ALTER TABLE "ev_model" ADD "catCompId" character varying`);
        await queryRunner.query(`ALTER TABLE "sub_model" ADD CONSTRAINT "FK_c2e046a0b5548c36d512cbb0195" FOREIGN KEY ("nivelId") REFERENCES "nivel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_model" ADD CONSTRAINT "FK_5fcc0c596dd9ab4185f947f7377" FOREIGN KEY ("competenciaId") REFERENCES "competencia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ev_model" ADD CONSTRAINT "FK_28fd6fa682c7355fa835d0763bf" FOREIGN KEY ("catCompId") REFERENCES "cat_comp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ev" ADD CONSTRAINT "FK_80cd17de97046ba8d0723ddfec2" FOREIGN KEY ("catCompId") REFERENCES "cat_comp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_model_comportamientos_comportamiento" ADD CONSTRAINT "FK_1db340f239e4511371d26d84243" FOREIGN KEY ("subModelId") REFERENCES "sub_model"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_model_comportamientos_comportamiento" ADD CONSTRAINT "FK_9e03e7b57cff906ec13507d1157" FOREIGN KEY ("comportamientoId") REFERENCES "comportamiento"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ev_model_sub_models_sub_model" ADD CONSTRAINT "FK_320d9c14bde22c82074a17cb003" FOREIGN KEY ("evModelId") REFERENCES "ev_model"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ev_model_sub_models_sub_model" ADD CONSTRAINT "FK_01023e9920521d827abc4d48bf7" FOREIGN KEY ("subModelId") REFERENCES "sub_model"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ev_model_sub_models_sub_model" DROP CONSTRAINT "FK_01023e9920521d827abc4d48bf7"`);
        await queryRunner.query(`ALTER TABLE "ev_model_sub_models_sub_model" DROP CONSTRAINT "FK_320d9c14bde22c82074a17cb003"`);
        await queryRunner.query(`ALTER TABLE "sub_model_comportamientos_comportamiento" DROP CONSTRAINT "FK_9e03e7b57cff906ec13507d1157"`);
        await queryRunner.query(`ALTER TABLE "sub_model_comportamientos_comportamiento" DROP CONSTRAINT "FK_1db340f239e4511371d26d84243"`);
        await queryRunner.query(`ALTER TABLE "ev" DROP CONSTRAINT "FK_80cd17de97046ba8d0723ddfec2"`);
        await queryRunner.query(`ALTER TABLE "ev_model" DROP CONSTRAINT "FK_28fd6fa682c7355fa835d0763bf"`);
        await queryRunner.query(`ALTER TABLE "sub_model" DROP CONSTRAINT "FK_5fcc0c596dd9ab4185f947f7377"`);
        await queryRunner.query(`ALTER TABLE "sub_model" DROP CONSTRAINT "FK_c2e046a0b5548c36d512cbb0195"`);
        await queryRunner.query(`ALTER TABLE "ev_model" DROP COLUMN "catCompId"`);
        await queryRunner.query(`ALTER TABLE "ev_model" ADD "catCompId" character varying(25) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ev_model" ADD CONSTRAINT "UQ_28fd6fa682c7355fa835d0763bf" UNIQUE ("catCompId")`);
        await queryRunner.query(`ALTER TABLE "ev" DROP COLUMN "catCompId"`);
        await queryRunner.query(`DROP INDEX "IDX_01023e9920521d827abc4d48bf"`);
        await queryRunner.query(`DROP INDEX "IDX_320d9c14bde22c82074a17cb00"`);
        await queryRunner.query(`DROP TABLE "ev_model_sub_models_sub_model"`);
        await queryRunner.query(`DROP INDEX "IDX_9e03e7b57cff906ec13507d115"`);
        await queryRunner.query(`DROP INDEX "IDX_1db340f239e4511371d26d8424"`);
        await queryRunner.query(`DROP TABLE "sub_model_comportamientos_comportamiento"`);
        await queryRunner.query(`DROP TABLE "sub_model"`);
        await queryRunner.query(`DROP TABLE "nivel"`);
        await queryRunner.query(`DROP TABLE "comportamiento"`);
        await queryRunner.query(`DROP TABLE "competencia"`);
        await queryRunner.query(`ALTER TABLE "ev_model" RENAME CONSTRAINT "UQ_28fd6fa682c7355fa835d0763bf" TO "UQ_f4531a4eaff0c83e965f9982aa2"`);
        await queryRunner.query(`ALTER TABLE "ev_model" RENAME COLUMN "catCompId" TO "description"`);
    }

}
