import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnConfigToProductRelationship1629178277197
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "product_relationship",
      new TableColumn({
        name: "config",
        type: "text",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
