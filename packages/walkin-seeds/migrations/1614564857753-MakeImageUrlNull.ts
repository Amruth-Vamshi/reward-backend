import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class MakeImageUrlNull1614564857753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "product",
      new TableColumn({
        name: "imageUrl",
        type: "varchar(255)"
      }),
      new TableColumn({
        name: "imageUrl",
        type: "varchar(255)",
        isNullable: true,
        default: null
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
