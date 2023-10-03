import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFieldProductTypeInCategory1629254494018
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "category",
      new TableColumn({
        name: "product_type",
        type: "varchar",
        isNullable: false,
        default: "'PRODUCT'"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
