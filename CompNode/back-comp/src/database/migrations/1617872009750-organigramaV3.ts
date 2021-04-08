import {MigrationInterface, QueryRunner} from "typeorm";

export class organigramaV31617872009750 implements MigrationInterface {
    name = 'organigramaV31617872009750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "periodo_trab" ADD "actual" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "periodo_trab" DROP COLUMN "actual"`);
    }

}
