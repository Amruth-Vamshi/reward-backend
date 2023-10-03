import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class AddRuleSetColumnToCollectionsTable1666074225710
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "collections",
      new TableColumn({
        isNullable: true,
        name: "rule_set_id",
        type: "int"
      })
    );
    await queryRunner.createForeignKey(
      "collections",
      new TableForeignKey({
        columnNames: ["rule_set_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "rule_set"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE collections DROP FOREIGN KEY (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'collections' AND COLUMN_NAME = 'rule_set_id')"
    );
    await queryRunner.query("ALTER TABLE collections DROP CLOUMN rule_set_id");
  }
}
