import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class AddCustomerOffers1567755916900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable("coupon");
    if (table) {
      await queryRunner.dropTable("coupon");
    }

    // create customer offer table

    await queryRunner.createTable(
      new Table({
        name: "customer_offers",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: false
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: false
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "campaign_id",
            type: "int",
            isNullable: true
          },
          {
            name: "offer_id",
            type: "int",
            isNullable: true
          },
          {
            name: "customer_id",
            type: "varchar",
            isNullable: true
          },
          {
            name: "coupon",
            type: "varchar",
            isNullable: true
          },
          {
            name: "status",
            type: "varchar",
            isNullable: true
          },
          {
            name: "organization_id",
            type: "varchar",
            isNullable: true
          }
        ]
      }),
      true
    );

    await queryRunner.createForeignKey(
      "customer_offers",
      new TableForeignKey({
        columnNames: ["campaign_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "campaign"
      })
    );

    await queryRunner.createForeignKey(
      "customer_offers",
      new TableForeignKey({
        columnNames: ["offer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "offer"
      })
    );

    await queryRunner.createForeignKey(
      "customer_offers",
      new TableForeignKey({
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer"
      })
    );

    await queryRunner.createForeignKey(
      "customer_offers",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );
  }

  // tslint:disable-next-line:no-empty
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
