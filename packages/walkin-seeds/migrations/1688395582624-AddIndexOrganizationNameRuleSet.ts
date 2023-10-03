import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIndexOrganizationNameRuleSet1688395582624 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection.transaction(async transactionManager => {
            await transactionManager.query(
              "CREATE index ORGANIZATION_ID_NAME on rule_set(name,organization_id);"
            );
          });
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
