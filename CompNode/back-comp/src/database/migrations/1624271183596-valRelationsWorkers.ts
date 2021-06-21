import {MigrationInterface, QueryRunner} from "typeorm";

export class valRelationsWorkers1624271183596 implements MigrationInterface {
    name = 'valRelationsWorkers1624271183596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_e0181634e2274da19b3dc28e885"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_f49beee7069f622de24da9be5ec"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "REL_e0181634e2274da19b3dc28e88"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "REL_f49beee7069f622de24da9be5e"`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_e0181634e2274da19b3dc28e885" FOREIGN KEY ("evaluadorDni") REFERENCES "trabajador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_f49beee7069f622de24da9be5ec" FOREIGN KEY ("evaluadoDni") REFERENCES "trabajador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_f49beee7069f622de24da9be5ec"`);
        await queryRunner.query(`ALTER TABLE "valoracion" DROP CONSTRAINT "FK_e0181634e2274da19b3dc28e885"`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "REL_f49beee7069f622de24da9be5e" UNIQUE ("evaluadoDni")`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "REL_e0181634e2274da19b3dc28e88" UNIQUE ("evaluadorDni")`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_f49beee7069f622de24da9be5ec" FOREIGN KEY ("evaluadoDni") REFERENCES "trabajador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "valoracion" ADD CONSTRAINT "FK_e0181634e2274da19b3dc28e885" FOREIGN KEY ("evaluadorDni") REFERENCES "trabajador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
