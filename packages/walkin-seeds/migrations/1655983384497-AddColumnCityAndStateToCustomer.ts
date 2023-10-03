import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnCityAndStateToCustomer1655983384497
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "customer",
      new TableColumn({
        name: "city",
        type: "varchar(255)",
        isNullable: true
      })
    );
    await queryRunner.addColumn(
      "customer",
      new TableColumn({
        name: "state",
        type: "varchar(255)",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
