import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumngeoLocationsStores1585498284604
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "store",
      new TableColumn({
        name: "geo_location",
        type: "text",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
