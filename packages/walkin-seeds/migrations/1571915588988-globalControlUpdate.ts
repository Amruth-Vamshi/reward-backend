import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class globalControlUpdate1571915588988 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "global_control",
      new TableColumn({
        name: "customer_id",
        type: "varchar(36)",
        isNullable: false
      })
    );

    await queryRunner.createForeignKey(
      "global_control",
      new TableForeignKey({
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const global_control = await queryRunner.getTable("global_control");

    const customerForeignKey = global_control.foreignKeys.find(
      fk => fk.columnNames.indexOf("customer_id") !== -1
    );

    await queryRunner.dropForeignKey("global_control", customerForeignKey);

    await queryRunner.dropColumn(global_control, "customer_id");
  }
}
