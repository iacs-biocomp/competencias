import {MigrationInterface, QueryRunner} from "typeorm";

export class segundaMigracion1616675193041 implements MigrationInterface {
    name = 'segundaMigracion1616675193041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cat_contr" ("id" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_2c6ae3a79bf51fb778f16f28497" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trabajador" ("dni" character varying NOT NULL, "nombre" character varying(20) NOT NULL, "apellidos" character varying(50) NOT NULL, "area" character varying(50) NOT NULL, "unidad" character varying(50) NOT NULL, "departamento" character varying(50), CONSTRAINT "PK_03377b09a6267c14d5bd07f963f" PRIMARY KEY ("dni"))`);
        await queryRunner.query(`CREATE TABLE "periodo_trab" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "age" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "trabajadorDni" character varying, "catContrId" character varying, "catCompId" character varying, CONSTRAINT "PK_71beaa76adf3cfc046b815c42fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cat_comp" ("id" character varying NOT NULL, "description" character varying(25) NOT NULL, CONSTRAINT "UQ_de86b9f675c9538b0030ec2ddeb" UNIQUE ("description"), CONSTRAINT "PK_6599294e57c3563bb059a52be0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "periodo_trab" ADD CONSTRAINT "FK_fcc057f91dce6e5ca8a50e9553a" FOREIGN KEY ("trabajadorDni") REFERENCES "trabajador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "periodo_trab" ADD CONSTRAINT "FK_962c5e9036a46cd74e9252a1012" FOREIGN KEY ("catContrId") REFERENCES "cat_contr"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "periodo_trab" ADD CONSTRAINT "FK_ab01d99d85f5010d246eba615ab" FOREIGN KEY ("catCompId") REFERENCES "cat_comp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "periodo_trab" DROP CONSTRAINT "FK_ab01d99d85f5010d246eba615ab"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab" DROP CONSTRAINT "FK_962c5e9036a46cd74e9252a1012"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab" DROP CONSTRAINT "FK_fcc057f91dce6e5ca8a50e9553a"`);
        await queryRunner.query(`DROP TABLE "cat_comp"`);
        await queryRunner.query(`DROP TABLE "periodo_trab"`);
        await queryRunner.query(`DROP TABLE "trabajador"`);
        await queryRunner.query(`DROP TABLE "cat_contr"`);
    }

}
