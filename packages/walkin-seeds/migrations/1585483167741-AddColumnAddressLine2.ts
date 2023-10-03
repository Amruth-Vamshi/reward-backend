import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnAddressLine21585483167741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "address",
      new TableColumn({
        name: "addressLine2",
        type: "varchar(255)",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
