import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table
} from "typeorm";

export class CreateLoyaltyProgram1572342156266 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const loyaltyProgramTable = await queryRunner.getTable("loyalty_program");
    if (!loyaltyProgramTable) {
      await queryRunner.createTable(
        new Table({
          name: "loyalty_program",
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment"
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
              type: "varchar",
              isNullable: false
            },
            {
              name: "code",
              type: "varchar",
              isNullable: false
            },
            {
              name: "description",
              type: "varchar",
              isNullable: true
            },
            {
              name: "expiry_value",
              type: "int",
              isNullable: false
            },
            {
              name: "expiry_unit",
              type: "varchar",
              isNullable: false
            },
            {
              name: "loyalty_card_id",
              type: "int",
              isNullable: false
            },
            {
              name: "loyalty_earn_rule_id",
              type: "int",
              isNullable: true
            },
            {
              name: "loyalty_burn_rule_id",
              type: "int",
              isNullable: true
            },
            {
              name: "loyalty_expiry_rule_id",
              type: "int",
              isNullable: true
            },
            {
              name: "campaign_id",
              type: "int",
              isNullable: false
            },
            {
              name: "organization_id",
              type: "varchar(36)",
              isNullable: false
            }
          ]
        })
      );

      await queryRunner.createForeignKey(
        "loyalty_program",
        new TableForeignKey({
          columnNames: ["loyalty_card_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "loyalty_card"
        })
      );
      await queryRunner.createForeignKey(
        "loyalty_program",
        new TableForeignKey({
          columnNames: ["loyalty_earn_rule_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "rule"
        })
      );
      await queryRunner.createForeignKey(
        "loyalty_program",
        new TableForeignKey({
          columnNames: ["loyalty_burn_rule_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "rule"
        })
      );
      await queryRunner.createForeignKey(
        "loyalty_program",
        new TableForeignKey({
          columnNames: ["loyalty_expiry_rule_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "rule"
        })
      );
      await queryRunner.createForeignKey(
        "loyalty_program",
        new TableForeignKey({
          columnNames: ["campaign_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "campaign"
        })
      );
      await queryRunner.createForeignKey(
        "loyalty_program",
        new TableForeignKey({
          columnNames: ["organization_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "organization"
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("loyalty_program");
  }
}
