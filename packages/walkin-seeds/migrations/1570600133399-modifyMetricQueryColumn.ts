import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ModifyMetricQueryColumn1570600133399
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "metric",
      new TableColumn({
        name: "query",
        type: "varchar(255)"
      }),
      new TableColumn({
        name: "query",
        type: "varchar(700)"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "metric",
      new TableColumn({
        name: "query",
        type: "varchar(255)"
      }),
      new TableColumn({
        name: "query",
        type: "varchar(255)"
      })
    );
  }
}
