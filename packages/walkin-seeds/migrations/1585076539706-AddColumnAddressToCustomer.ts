import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class AddColumnAddressToCustomer1585076539706
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "customer",
      new TableColumn({
        name: "address",
        type: "varchar(255)",
        isNullable: true
      })
    );

    await queryRunner.createForeignKey(
      "customer",
      new TableForeignKey({
        columnNames: ["address"],
        referencedColumnNames: ["id"],
        referencedTableName: "address"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
