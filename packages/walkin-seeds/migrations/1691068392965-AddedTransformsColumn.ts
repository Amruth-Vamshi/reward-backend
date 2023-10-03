import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddedTransformsColumn1691068392965 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "rule_condition",
            new TableColumn({
              name: "transforms",
              type: "JSON",
              isNullable: true
              
            })
          );
          await queryRunner.addColumn(
            "rule_effect",
            new TableColumn({
              name: "transforms",
              type: "JSON",
              isNullable: true
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
