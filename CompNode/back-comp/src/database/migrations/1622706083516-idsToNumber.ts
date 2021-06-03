import {MigrationInterface, QueryRunner} from "typeorm";

export class idsToNumber1622706083516 implements MigrationInterface {
    name = 'idsToNumber1622706083516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ev_model_sub_models_sub_model" DROP CONSTRAINT "FK_320d9c14bde22c82074a17cb003"`);
        await queryRunner.query(`ALTER TABLE "ev_model_sub_models_sub_model" DROP CONSTRAINT "FK_01023e9920521d827abc4d48bf7"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_superiores_trabajador" DROP CONSTRAINT "FK_532d5f9b11c78ff5c9001a667a0"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_superiores_trabajador" DROP CONSTRAINT "FK_ba71cc350edbd349f05855cc959"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_pares_trabajador" DROP CONSTRAINT "FK_deac51994ff46df074043c7610f"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_pares_trabajador" DROP CONSTRAINT "FK_e9f76d83af6a535aa163af827e4"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_inferiores_trabajador" DROP CONSTRAINT "FK_acaa0c00d0b87df4c409961ed0a"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_inferiores_trabajador" DROP CONSTRAINT "FK_0790746ac7c818369a2e7de1fb3"`);
        await queryRunner.query(`ALTER TABLE "sub_model_comportamientos_comportamiento" DROP CONSTRAINT "FK_1db340f239e4511371d26d84243"`);
        await queryRunner.query(`ALTER TABLE "sub_model_comportamientos_comportamiento" DROP CONSTRAINT "FK_9e03e7b57cff906ec13507d1157"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86a650293c2a31b8328a97cabd0"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_13380e7efec83468d73fc37938e"`);
        await queryRunner.query(`ALTER TABLE "ev_model_sub_models_sub_model" ADD CONSTRAINT "FK_320d9c14bde22c82074a17cb003" FOREIGN KEY ("evModelId") REFERENCES "ev_model"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ev_model_sub_models_sub_model" ADD CONSTRAINT "FK_01023e9920521d827abc4d48bf7" FOREIGN KEY ("subModelId") REFERENCES "sub_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_superiores_trabajador" ADD CONSTRAINT "FK_532d5f9b11c78ff5c9001a667a0" FOREIGN KEY ("periodoTrabId") REFERENCES "periodo_trab"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_superiores_trabajador" ADD CONSTRAINT "FK_ba71cc350edbd349f05855cc959" FOREIGN KEY ("trabajadorDni") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_pares_trabajador" ADD CONSTRAINT "FK_deac51994ff46df074043c7610f" FOREIGN KEY ("periodoTrabId") REFERENCES "periodo_trab"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_pares_trabajador" ADD CONSTRAINT "FK_e9f76d83af6a535aa163af827e4" FOREIGN KEY ("trabajadorDni") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_inferiores_trabajador" ADD CONSTRAINT "FK_acaa0c00d0b87df4c409961ed0a" FOREIGN KEY ("periodoTrabId") REFERENCES "periodo_trab"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_inferiores_trabajador" ADD CONSTRAINT "FK_0790746ac7c818369a2e7de1fb3" FOREIGN KEY ("trabajadorDni") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "sub_model_comportamientos_comportamiento" ADD CONSTRAINT "FK_1db340f239e4511371d26d84243" FOREIGN KEY ("subModelId") REFERENCES "sub_model"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "sub_model_comportamientos_comportamiento" ADD CONSTRAINT "FK_9e03e7b57cff906ec13507d1157" FOREIGN KEY ("comportamientoId") REFERENCES "comportamiento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86a650293c2a31b8328a97cabd0" FOREIGN KEY ("userUsername") REFERENCES "user"("username") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_13380e7efec83468d73fc37938e" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_13380e7efec83468d73fc37938e"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86a650293c2a31b8328a97cabd0"`);
        await queryRunner.query(`ALTER TABLE "sub_model_comportamientos_comportamiento" DROP CONSTRAINT "FK_9e03e7b57cff906ec13507d1157"`);
        await queryRunner.query(`ALTER TABLE "sub_model_comportamientos_comportamiento" DROP CONSTRAINT "FK_1db340f239e4511371d26d84243"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_inferiores_trabajador" DROP CONSTRAINT "FK_0790746ac7c818369a2e7de1fb3"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_inferiores_trabajador" DROP CONSTRAINT "FK_acaa0c00d0b87df4c409961ed0a"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_pares_trabajador" DROP CONSTRAINT "FK_e9f76d83af6a535aa163af827e4"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_pares_trabajador" DROP CONSTRAINT "FK_deac51994ff46df074043c7610f"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_superiores_trabajador" DROP CONSTRAINT "FK_ba71cc350edbd349f05855cc959"`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_superiores_trabajador" DROP CONSTRAINT "FK_532d5f9b11c78ff5c9001a667a0"`);
        await queryRunner.query(`ALTER TABLE "ev_model_sub_models_sub_model" DROP CONSTRAINT "FK_01023e9920521d827abc4d48bf7"`);
        await queryRunner.query(`ALTER TABLE "ev_model_sub_models_sub_model" DROP CONSTRAINT "FK_320d9c14bde22c82074a17cb003"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_13380e7efec83468d73fc37938e" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86a650293c2a31b8328a97cabd0" FOREIGN KEY ("userUsername") REFERENCES "user"("username") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_model_comportamientos_comportamiento" ADD CONSTRAINT "FK_9e03e7b57cff906ec13507d1157" FOREIGN KEY ("comportamientoId") REFERENCES "comportamiento"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_model_comportamientos_comportamiento" ADD CONSTRAINT "FK_1db340f239e4511371d26d84243" FOREIGN KEY ("subModelId") REFERENCES "sub_model"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_inferiores_trabajador" ADD CONSTRAINT "FK_0790746ac7c818369a2e7de1fb3" FOREIGN KEY ("trabajadorDni") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_inferiores_trabajador" ADD CONSTRAINT "FK_acaa0c00d0b87df4c409961ed0a" FOREIGN KEY ("periodoTrabId") REFERENCES "periodo_trab"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_pares_trabajador" ADD CONSTRAINT "FK_e9f76d83af6a535aa163af827e4" FOREIGN KEY ("trabajadorDni") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_pares_trabajador" ADD CONSTRAINT "FK_deac51994ff46df074043c7610f" FOREIGN KEY ("periodoTrabId") REFERENCES "periodo_trab"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_superiores_trabajador" ADD CONSTRAINT "FK_ba71cc350edbd349f05855cc959" FOREIGN KEY ("trabajadorDni") REFERENCES "trabajador"("dni") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "periodo_trab_superiores_trabajador" ADD CONSTRAINT "FK_532d5f9b11c78ff5c9001a667a0" FOREIGN KEY ("periodoTrabId") REFERENCES "periodo_trab"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ev_model_sub_models_sub_model" ADD CONSTRAINT "FK_01023e9920521d827abc4d48bf7" FOREIGN KEY ("subModelId") REFERENCES "sub_model"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ev_model_sub_models_sub_model" ADD CONSTRAINT "FK_320d9c14bde22c82074a17cb003" FOREIGN KEY ("evModelId") REFERENCES "ev_model"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
