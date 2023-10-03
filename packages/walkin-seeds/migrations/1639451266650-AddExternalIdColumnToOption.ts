import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddExternalIdColumnToOption1639451266650
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "option",
      new TableColumn({
        name: "external_option_id",
        type: "varchar",
        isNullable: true
      })
    );
    await queryRunner.addColumn(
      "option_value",
      new TableColumn({
        name: "external_option_value_id",
        type: "varchar",
        isNullable: true
      })
    );
    await queryRunner.addColumn(
      "option",
      new TableColumn({
        name: "code",
        type: "varchar",
        isNullable: true
      })
    );
    await queryRunner.addColumn(
      "option_value",
      new TableColumn({
        name: "code",
        type: "varchar",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
