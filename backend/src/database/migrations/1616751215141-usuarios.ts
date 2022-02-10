import { MigrationInterface, QueryRunner } from 'typeorm';

export class usuarios1616751215141 implements MigrationInterface {
	name = 'usuarios1616751215141';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "ev_model" ("id" SERIAL NOT NULL, "description" character varying(25) NOT NULL, CONSTRAINT "UQ_f4531a4eaff0c83e965f9982aa2" UNIQUE ("description"), CONSTRAINT "PK_b49ca1a74f3b844b91a6acd7458" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "ev" ("id" SERIAL NOT NULL, "description" character varying(25) NOT NULL, "modelId" integer, CONSTRAINT "UQ_3b2ea84202278a7df2b87754523" UNIQUE ("description"), CONSTRAINT "PK_b2378e0f22f29eee0a97effc04d" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "ev" ADD CONSTRAINT "FK_cd91b22f5b09992256a4679059d" FOREIGN KEY ("modelId") REFERENCES "ev_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "ev" DROP CONSTRAINT "FK_cd91b22f5b09992256a4679059d"`);
		await queryRunner.query(`DROP TABLE "ev"`);
		await queryRunner.query(`DROP TABLE "ev_model"`);
	}
}
