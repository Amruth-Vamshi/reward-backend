import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class updateLoyaltyTransactionDataTable1660111252785
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "loyalty_transaction_data",
      "id",
      new TableColumn({
        name: "id",
        type: "varchar",
        length: "36",
        isNullable: false,
        isPrimary: true,
        isGenerated: true,
        generationStrategy: "uuid"
      })
    );

    await queryRunner.changeColumn(
      "loyalty_transaction_data",
      "data_input",
      new TableColumn({
        name: "data_input",
        isNullable: false,
        type: "text"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
