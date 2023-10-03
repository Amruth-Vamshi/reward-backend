import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnimageUrlToCategories1594893791745
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "category",
      new TableColumn({
        name: "imageUrl",
        type: "varchar(500)",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
