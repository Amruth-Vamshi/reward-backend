import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnGeoLocationToAddress1585479936964
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "address",
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
