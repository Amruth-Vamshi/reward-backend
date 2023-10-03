import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addingStatusToEvent1571660316811 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "event",
      new TableColumn({
        name: "processedStatus",
        isNullable: true,
        type: "text"
      })
    );
    await queryRunner.addColumn(
      "event",
      new TableColumn({
        name: "processedData",
        isNullable: true,
        type: "text"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("event", "processedStatus");
    await queryRunner.dropColumn("event", "processedData");
  }
}
