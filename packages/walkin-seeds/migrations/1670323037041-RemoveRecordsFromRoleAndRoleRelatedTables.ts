import { MigrationInterface, QueryRunner } from "typeorm";
import { Role } from "../../walkin-core/src/entity";

export class RemoveRecordsFromRoleAndRoleRelatedTables1670323037041 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection.transaction(async transactionManager => {
            const Roles = await transactionManager.getRepository(Role)
                .createQueryBuilder("role")
                .leftJoinAndSelect("role.apiKeys", "apiKeys")
                .leftJoinAndSelect("role.users", "users")
                .leftJoinAndSelect("role.policies", "policies")
                .where(`role.name NOT IN ("ADMIN", "MANAGER", "USER")`)
                .getMany();

            if (Roles.length > 0) {
                await transactionManager.remove(Roles);
            }
        })
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
