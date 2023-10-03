import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class createLoyaltyProgramDetailsTable1658136150497
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "loyalty_program_detail",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: false
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: false
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "experiment_name",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "experiment_code",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "description",
            type: "varchar(1000)",
            isNullable: true
          },
          {
            name: "organization_id",
            type: "varchar(36)",
            isNullable: false
          },
          {
            name: "loyalty_program_config_id",
            type: "int",
            isNullable: false
          },
          {
            name: "extended",
            type: "json",
            isNullable: true
          },
          {
            name: "loyalty_earn_rule_set_id",
            type: "int",
            isNullable: false
          },
          {
            name: "collection_ids",
            type: "json",
            isNullable: true
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "loyalty_program_detail",
      new TableForeignKey({
        columnNames: ["loyalty_program_config_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "loyalty_program_config"
      })
    );

    await queryRunner.createForeignKey(
      "loyalty_program_detail",
      new TableForeignKey({
        columnNames: ["loyalty_earn_rule_set_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "rule_set"
      })
    );

    await queryRunner.createForeignKey(
      "loyalty_program_detail",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("loyalty_program_detail");
  }
}
