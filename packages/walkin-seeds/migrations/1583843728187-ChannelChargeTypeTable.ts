import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey
} from "typeorm";

export class ChannelChargeTypeTable1583843728187 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "channel_charge_type",
        columns: [
          {
            name: "id",
            type: "varchar(36)",
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
            name: "channel_id",
            type: "varchar(36)",
            isNullable: false
          },
          {
            name: "charge_type_id",
            type: "varchar(36)",
            isNullable: false
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "channel_charge_type",
      new TableForeignKey({
        columnNames: ["channel_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "channel",
        onDelete: "CASCADE"
      })
    );
    await queryRunner.createForeignKey(
      "channel_charge_type",
      new TableForeignKey({
        columnNames: ["charge_type_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "charge_type",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const channelChargeType = await queryRunner.getTable("channel_charge_type");
    if (channelChargeType) {
      await queryRunner.dropTable("channel_charge_type");
    }
  }
}
