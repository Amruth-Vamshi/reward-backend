import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class AddColumnCustomerToAddress1585076764830
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "address",
      new TableColumn({
        name: "customer",
        type: "varchar(255)",
        isNullable: true
      })
    );

    await queryRunner.createForeignKey(
      "address",
      new TableForeignKey({
        columnNames: ["customer"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
