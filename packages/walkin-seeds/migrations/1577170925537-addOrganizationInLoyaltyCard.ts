import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class addOrganizationInLoyaltyCard1577170925537
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "loyalty_card",
      new TableColumn({
        name: "organization_id",
        type: "varchar",
        isNullable: false
      })
    );
    await queryRunner.createForeignKey(
      "loyalty_card",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
