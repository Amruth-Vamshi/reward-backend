import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableColumn
} from "typeorm";

export class AddOrgColumnToMetricFilter1580457628058
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "metric_filter",
      new TableColumn({
        name: "organization_id",
        type: "varchar(36)",
        isNullable: true
      })
    );

    await queryRunner.createForeignKey(
      "metric_filter",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable("metric_filter");
    const organizationForeignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf("organizationId") !== -1
    );
    await queryRunner.dropForeignKey("metric_filter", organizationForeignKey);
  }
}
