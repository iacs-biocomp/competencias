import {MigrationInterface, QueryRunner} from "typeorm";

export class showingResultsNivelDescription1626894444853 implements MigrationInterface {
    name = 'showingResultsNivelDescription1626894444853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ev" ADD "isShowingResults" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "sub_model" ADD "nivelDescription" character varying(120) DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sub_model" DROP COLUMN "nivelDescription"`);
        await queryRunner.query(`ALTER TABLE "ev" DROP COLUMN "isShowingResults"`);
    }

}
