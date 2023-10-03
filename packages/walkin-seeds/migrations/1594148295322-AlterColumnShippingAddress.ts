import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableColumn,
} from "typeorm";
// import { Order } from "@walkinserver/walkin-orderx/src/entity";

export class AlterColumnShippingAddress1594148295322
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection.transaction(async (TransactionManager) => {
      await TransactionManager.query(
        "ALTER TABLE `order` MODIFY COLUMN shipping_address_id varchar(255) NULL"
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
