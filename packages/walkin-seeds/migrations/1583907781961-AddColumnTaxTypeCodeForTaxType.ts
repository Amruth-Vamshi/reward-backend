import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex
} from "typeorm";

export class AddColumnTaxTypeCodeForTaxType1583907781961
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "tax_type",
      new TableColumn({
        name: "tax_type_code",
        type: "varchar(36)",
        isNullable: true
      })
    );

    await queryRunner.createIndex(
      "tax_type",
      new TableIndex({
        name: "UNIQUE_TAX_TYPE_CODE_FOR_ORG",
        columnNames: ["tax_type_code", "organization_id"],
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Do nothing
  }
}
