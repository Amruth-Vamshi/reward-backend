import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class customerPhoneHumber1574237097938 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "customer",
      "phoneNumber",
      new TableColumn({
        type: "varchar",
        name: "phoneNumber",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "customer",
      "phoneNumber",
      new TableColumn({
        type: "varchar",
        name: "phoneNumber",
        isNullable: false
      })
    );
  }
}
