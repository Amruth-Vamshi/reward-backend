import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  Table,
  TableForeignKey,
} from "typeorm";
import { STATUS } from "@walkinserver/walkin-core/src/modules/common/constants";

export class AddColumnStoreServiceArea1593961577057
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "store_service_area",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true,
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true,
          },

          {
            name: "area_type",
            type: "varchar(255)",
            isNullable: false,
          },
          {
            name: "area",
            type: "text",
            isNullable: true,
          },
          {
            name: "store_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "status",
            isNullable: true,
            type: "varchar",
            default: "'ACTIVE'",
          },
        ],
      }),
      true
    );
    await queryRunner.createForeignKey(
      "store_service_area",
      new TableForeignKey({
        columnNames: ["store_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
