import {MigrationInterface, QueryRunner} from "typeorm";

export class cambiosDescriptionEv1619476441453 implements MigrationInterface {
    name = 'cambiosDescriptionEv1619476441453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ev" DROP CONSTRAINT "UQ_3b2ea84202278a7df2b87754523"`);
        await queryRunner.query(`ALTER TABLE "ev" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "ev" ADD "description" character varying(35)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ev" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "ev" ADD "description" character varying(25) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ev" ADD CONSTRAINT "UQ_3b2ea84202278a7df2b87754523" UNIQUE ("description")`);
    }

}
