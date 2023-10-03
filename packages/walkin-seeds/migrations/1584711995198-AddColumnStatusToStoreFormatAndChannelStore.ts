import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnStatusToStoreFormatAndChannelStore1584711995198
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // WE ALREADY HAVE THIS COLUMN IN CreateManytoManyForStoreAndStoreFormat1583918768096
    // await queryRunner.addColumn(
    //   "store_format_store",
    //   new TableColumn({
    //     name: "status",
    //     type: "varchar",
    //     default: "'ACTIVE'"
    //   })
    // );

    await queryRunner.addColumn(
      "channel_store",
      new TableColumn({
        name: "status",
        type: "varchar",
        default: "'ACTIVE'",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Do nothing
  }
}
