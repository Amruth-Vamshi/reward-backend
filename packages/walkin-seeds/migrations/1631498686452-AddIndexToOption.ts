import {MigrationInterface, QueryRunner, TableIndex} from "typeorm";

export class AddIndexToOption1631498686452 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createIndex(
            "option",
            new TableIndex({
              columnNames: ["name", "organization_id"],
              name: "IDX_NAME_ORGANIZATION",
              isUnique: true
            })
          );
        await queryRunner.createIndex(
          "option_value",
          new TableIndex({
            columnNames: ["value","option_id"],
            name: "IDX_FOR_VALUE_OPTION",
            isUnique: true
          })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
