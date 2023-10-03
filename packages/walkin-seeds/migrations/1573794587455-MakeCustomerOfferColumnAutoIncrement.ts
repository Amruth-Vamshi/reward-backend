import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class MakeCustomerOfferColumnAutoIncrement1573794587455
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "customer_offers",
      "id",
      new TableColumn({
        type: "int(11)",
        name: "id",
        isNullable: false,
        isPrimary: true,
        isGenerated: true,
        generationStrategy: "increment"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "customer_offers",
      "id",
      new TableColumn({
        type: "varchar(255)",
        name: "id",
        isNullable: false,
        isPrimary: true
      })
    );
  }
}
