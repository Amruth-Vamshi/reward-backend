import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AdditionalProductFieldsToProduct1583941218298
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "product",
      "type",
      new TableColumn({
        name: "product_type",
        type: "varchar(255)",
        isNullable: true
      })
    );
    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "listable",
        type: "boolean",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Do nothing
  }
}
