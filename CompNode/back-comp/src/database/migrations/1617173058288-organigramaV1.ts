import {MigrationInterface, QueryRunner} from "typeorm";

export class organigramaV11617173058288 implements MigrationInterface {
    name = 'organigramaV11617173058288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trabajador_superiores_trabajador" ("trabajadorDni_1" character varying NOT NULL, "trabajadorDni_2" character varying NOT NULL, CONSTRAINT "PK_b1d74e05b53f2624d4b248d899b" PRIMARY KEY ("trabajadorDni_1", "trabajadorDni_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ad0a962a5eaaf67fcf013666d3" ON "trabajador_superiores_trabajador" ("trabajadorDni_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_ca8af7d79c908830ee5fa333ba" ON "trabajador_superiores_trabajador" ("trabajadorDni_2") `);
        await queryRunner.query(`CREATE TABLE "trabajador_pares_trabajador" ("trabajadorDni_1" character varying NOT NULL, "trabajadorDni_2" character varying NOT NULL, CONSTRAINT "PK_4a0552647a5f063372b49f94c03" PRIMARY KEY ("trabajadorDni_1", "trabajadorDni_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c3ae0449fa5a1ed60e89c01d27" ON "trabajador_pares_trabajador" ("trabajadorDni_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_ba69ce21f8f2fa3feaaf8c6c14" ON "trabajador_pares_trabajador" ("trabajadorDni_2") `);
        await queryRunner.query(`CREATE TABLE "trabajador_inferiores_trabajador" ("trabajadorDni_1" character varying NOT NULL, "trabajadorDni_2" character varying NOT NULL, CONSTRAINT "PK_820271dd5229c5543e7daded154" PRIMARY KEY ("trabajadorDni_1", "trabajadorDni_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4c8a44bc1343be85470c7339e0" ON "trabajador_inferiores_trabajador" ("trabajadorDni_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_c42dbe1198a374d875af3c7498" ON "trabajador_inferiores_trabajador" ("trabajadorDni_2") `);
        await queryRunner.query(`ALTER TABLE "trabajador_superiores_trabajador" ADD CONSTRAINT "FK_ad0a962a5eaaf67fcf013666d3f" FOREIGN KEY ("trabajadorDni_1") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trabajador_superiores_trabajador" ADD CONSTRAINT "FK_ca8af7d79c908830ee5fa333bab" FOREIGN KEY ("trabajadorDni_2") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trabajador_pares_trabajador" ADD CONSTRAINT "FK_c3ae0449fa5a1ed60e89c01d27c" FOREIGN KEY ("trabajadorDni_1") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trabajador_pares_trabajador" ADD CONSTRAINT "FK_ba69ce21f8f2fa3feaaf8c6c146" FOREIGN KEY ("trabajadorDni_2") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trabajador_inferiores_trabajador" ADD CONSTRAINT "FK_4c8a44bc1343be85470c7339e0a" FOREIGN KEY ("trabajadorDni_1") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trabajador_inferiores_trabajador" ADD CONSTRAINT "FK_c42dbe1198a374d875af3c74989" FOREIGN KEY ("trabajadorDni_2") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trabajador_inferiores_trabajador" DROP CONSTRAINT "FK_c42dbe1198a374d875af3c74989"`);
        await queryRunner.query(`ALTER TABLE "trabajador_inferiores_trabajador" DROP CONSTRAINT "FK_4c8a44bc1343be85470c7339e0a"`);
        await queryRunner.query(`ALTER TABLE "trabajador_pares_trabajador" DROP CONSTRAINT "FK_ba69ce21f8f2fa3feaaf8c6c146"`);
        await queryRunner.query(`ALTER TABLE "trabajador_pares_trabajador" DROP CONSTRAINT "FK_c3ae0449fa5a1ed60e89c01d27c"`);
        await queryRunner.query(`ALTER TABLE "trabajador_superiores_trabajador" DROP CONSTRAINT "FK_ca8af7d79c908830ee5fa333bab"`);
        await queryRunner.query(`ALTER TABLE "trabajador_superiores_trabajador" DROP CONSTRAINT "FK_ad0a962a5eaaf67fcf013666d3f"`);
        await queryRunner.query(`DROP INDEX "IDX_c42dbe1198a374d875af3c7498"`);
        await queryRunner.query(`DROP INDEX "IDX_4c8a44bc1343be85470c7339e0"`);
        await queryRunner.query(`DROP TABLE "trabajador_inferiores_trabajador"`);
        await queryRunner.query(`DROP INDEX "IDX_ba69ce21f8f2fa3feaaf8c6c14"`);
        await queryRunner.query(`DROP INDEX "IDX_c3ae0449fa5a1ed60e89c01d27"`);
        await queryRunner.query(`DROP TABLE "trabajador_pares_trabajador"`);
        await queryRunner.query(`DROP INDEX "IDX_ca8af7d79c908830ee5fa333ba"`);
        await queryRunner.query(`DROP INDEX "IDX_ad0a962a5eaaf67fcf013666d3"`);
        await queryRunner.query(`DROP TABLE "trabajador_superiores_trabajador"`);
    }

}
