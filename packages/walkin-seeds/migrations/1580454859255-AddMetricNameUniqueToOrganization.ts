import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddMetricNameUniqueToOrganization1580454859255
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createIndex(
      "metric",
      new TableIndex({
        name: "UNIQUE_METRIC_NAME_TO_ORGANIZATION",
        columnNames: ["name", "organization_id"],
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex("metric", "UNIQUE_METRIC_NAME_TO_ORGANIZATION");
  }
}
