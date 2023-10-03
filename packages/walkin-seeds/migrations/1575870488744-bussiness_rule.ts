import {
  MigrationInterface,
  QueryRunner,
  TableIndex,
  TableForeignKey,
  TableColumn
} from "typeorm";

export class bussinessRule1575870488744 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "business_rule_detail",
      new TableColumn({
        name: "organization_id",
        type: "varchar(36)",
        isNullable: false
      })
    );

    await queryRunner.createIndex(
      "business_rule_detail",
      new TableIndex({
        columnNames: ["organization_id"],
        name: "IDX_BUSINESS_RULE_DETAIL_ORG_ID"
      })
    );
    // business_rule_detail foriegn keys

    await queryRunner.createForeignKey(
      "business_rule_detail",
      new TableForeignKey({
        name: "FK_BUSINESS_RULE_DETAIL_ORG_ID",
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex(
      "business_rule_detail",
      "IDX_BUSINESS_RULE_DETAIL_ORG_ID"
    );

    await queryRunner.dropForeignKey(
      "business_rule_detail",
      "FK_BUSINESS_RULE_DETAIL_ORG_ID"
    );

    queryRunner.dropColumn("business_rule_detail", "organization_id");
  }
}
