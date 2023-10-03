import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
} from "typeorm";
import { STATUS } from "@walkinserver/walkin-core/src/modules/common/constants";

export class AddTableBankAccount1588524564332 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const bankAccount = await queryRunner.getTable("bank_account");
    if (!bankAccount) {
      await queryRunner.createTable(
        new Table({
          name: "bank_account",
          columns: [
            {
              name: "id",
              type: "varchar",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "uuid",
            },
            {
              name: "created_by",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "last_modified_by",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "created_time",
              type: "datetime(6)",
              default: "CURRENT_TIMESTAMP(6)",
              isNullable: false,
            },
            {
              name: "last_modified_time",
              type: "datetime(6)",
              default: "CURRENT_TIMESTAMP(6)",
              isNullable: false,
            },
            {
              name: "name",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "phone",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "email",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "status",
              type: "varchar",
              isNullable: false,
              default: "'ACTIVE'",
            },
            {
              name: "gst_number",
              type: "varchar(255)",
              isNullable: false,
            },
            {
              name: "account_number",
              type: "varchar(255)",
              isNullable: false,
            },
            {
              name: "ifsc_code",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "organization_id",
              type: "varchar(255)",
              isNullable: false,
            },
            {
              name: "verified",
              type: "boolean",
              isNullable: false,
              default: false,
            },
            {
              name: "account_type",
              type: "varchar(255)",
              isNullable: false,
            },
          ],
        })
      );

      await queryRunner.createForeignKey(
        "bank_account",
        new TableForeignKey({
          columnNames: ["organization_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "organization",
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const bankAccount = await queryRunner.getTable("bank_account");
    if (bankAccount) {
      await queryRunner.dropTable("bank_account");
    }
  }
}
