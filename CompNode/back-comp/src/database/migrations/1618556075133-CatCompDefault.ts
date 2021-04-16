import {MigrationInterface, QueryRunner} from "typeorm";

export class CatCompDefault1618556075133 implements MigrationInterface {
    name = 'CatCompDefault1618556075133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cat_contr" DROP CONSTRAINT "FK_b00ec271818c99549423117fe5c"`);
        await queryRunner.query(`ALTER TABLE "cat_contr" DROP CONSTRAINT "UQ_b00ec271818c99549423117fe5c"`);
        await queryRunner.query(`ALTER TABLE "cat_contr" ADD CONSTRAINT "FK_b00ec271818c99549423117fe5c" FOREIGN KEY ("catCompId") REFERENCES "cat_comp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cat_contr" DROP CONSTRAINT "FK_b00ec271818c99549423117fe5c"`);
        await queryRunner.query(`ALTER TABLE "cat_contr" ADD CONSTRAINT "UQ_b00ec271818c99549423117fe5c" UNIQUE ("catCompId")`);
        await queryRunner.query(`ALTER TABLE "cat_contr" ADD CONSTRAINT "FK_b00ec271818c99549423117fe5c" FOREIGN KEY ("catCompId") REFERENCES "cat_comp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
