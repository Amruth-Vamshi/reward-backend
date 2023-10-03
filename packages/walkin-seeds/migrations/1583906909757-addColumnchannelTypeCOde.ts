import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex
} from "typeorm";

export class addColumnchannelTypeCOde1583906909757
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "channel",
      new TableColumn({
        name: "channelCode",
        type: "varchar",
        isNullable: false
      })
    );

    await queryRunner.dropIndex("channel", "UNIQUE_CHANNEL_NAME_FOR_ORG_ID");
    await queryRunner.createIndex(
      "channel",
      new TableIndex({
        name: "UNIQUE_CHANNEL_NAME_FOR_ORG_ID",
        columnNames: ["name", "organization_id", "channelCode"],
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
