import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class createLoyaltyProgramConfigTable1658122877228
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "loyalty_program_config",
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
            name: "name",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "code",
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
            name: "campaign_id",
            type: "int",
            isNullable: true
          },
          {
            name: "loyalty_card_id",
            type: "int",
            isNullable: false
          },
          {
            name: "expiry_value",
            type: "int",
            isNullable: true
          },
          {
            name: "expiry_unit",
            type: "varchar(255)",
            isNullable: true
          },
          {
            name: "extended",
            type: "json",
            isNullable: true
          },
          {
            name: "loyalty_burn_rule_set_id",
            type: "int",
            isNullable: false
          },
          {
            name: "cancel_transaction_rules",
            type: "json",
            isNullable: true
          },
          {
            name: "applicable_events",
            type: "json",
            isNullable: true
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "loyalty_program_config",
      new TableForeignKey({
        columnNames: ["loyalty_burn_rule_set_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "rule_set"
      })
    );

    await queryRunner.createForeignKey(
      "loyalty_program_config",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );

    await queryRunner.createForeignKey(
      "loyalty_program_config",
      new TableForeignKey({
        columnNames: ["campaign_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "campaign"
      })
    );

    await queryRunner.createForeignKey(
      "loyalty_program_config",
      new TableForeignKey({
        columnNames: ["loyalty_card_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "loyalty_card"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("loyalty_program_config");
  }
}
