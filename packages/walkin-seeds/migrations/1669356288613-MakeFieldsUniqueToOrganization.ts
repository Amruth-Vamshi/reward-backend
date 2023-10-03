import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex
} from "typeorm";

export class MakeFieldsUniqueToOrganization1669356288613
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createIndex(
      "product",
      new TableIndex({
        name: "UNIQUE_PRODUCT_CODE_FOR_ORG",
        columnNames: ["code", "organization_id"],
        isUnique: true
      })
    );
    await queryRunner.createIndex(
      "store",
      new TableIndex({
        name: "UNIQUE_EXTERNAL_STORE_ID_FOR_ORG",
        columnNames: ["externalStoreId", "organization_id"],
        isUnique: true
      })
    );
    await queryRunner.createIndex(
      "rule_effect",
      new TableIndex({
        name: "UNIQUE_RULE_ENTITY_NAME_FOR_ORG",
        columnNames: ["name", "organization_id"],
        isUnique: true
      })
    );
    await queryRunner.createIndex(
      "rule_condition",
      new TableIndex({
        name: "UNIQUE_RULE_CONDITION_NAME_FOR_ORG",
        columnNames: ["name", "organization_id"],
        isUnique: true
      })
    );
    await queryRunner.createIndex(
      "rule",
      new TableIndex({
        name: "UNIQUE_RULE_NAME_FOR_ORG",
        columnNames: ["name", "organization_id"],
        isUnique: true
      })
    );
    await queryRunner.createIndex(
      "rule_set",
      new TableIndex({
        name: "UNIQUE_RULE_SET_NAME_FOR_ORG",
        columnNames: ["name", "organization_id"],
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex("product", "UNIQUE_PRODUCT_CODE_FOR_ORG");
    await queryRunner.dropIndex("store", "UNIQUE_EXTERNAL_STORE_ID_FOR_ORG");
    await queryRunner.dropIndex(
      "rule_effect",
      "UNIQUE_RULE_ENTITY_NAME_FOR_ORG"
    );
    await queryRunner.dropIndex(
      "rule_condition",
      "UNIQUE_RULE_CONDITION_NAME_FOR_ORG"
    );
    await queryRunner.dropIndex("rule", "UNIQUE_RULE_NAME_FOR_ORG");
    await queryRunner.dropIndex("rule_set", "UNIQUE_RULE_SET_NAME_FOR_ORG");
  }
}
