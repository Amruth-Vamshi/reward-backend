import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class RemoveUniqueMetricNameAddOrgSpecific1580715069309
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex(
      "metric_filter",
      "IDX_99ee6eca594b7fd47ec208385e"
    );

    await queryRunner.dropIndex(
      "metric_filter",
      "IDX_1192c0fd503a6cf0728a903864"
    );

    await queryRunner.createIndex(
      "metric_filter",
      new TableIndex({
        name: "UNIQUE_METRIC_FILTER_NAME_TO_ORGANIZATION",
        columnNames: ["name", "organization_id"],
        isUnique: true
      })
    );

    await queryRunner.createIndex(
      "metric_filter",
      new TableIndex({
        name: "UNIQUE_METRIC_FILTER_KEY_TO_ORGANIZATION",
        columnNames: ["key", "organization_id"],
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex(
      "metric_filter",
      "UNIQUE_METRIC_FILTER_NAME_TO_ORGANIZATION"
    );
    await queryRunner.dropIndex(
      "metric_filter",
      "UNIQUE_METRIC_FILTER_KEY_TO_ORGANIZATION"
    );
  }
}
