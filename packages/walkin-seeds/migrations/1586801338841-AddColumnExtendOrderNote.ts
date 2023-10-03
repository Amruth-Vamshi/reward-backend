import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnExtendOrderNote1586801338841
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order_note",
      new TableColumn({
        name: "extend",
        type: "text",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
