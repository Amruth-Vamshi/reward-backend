import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table
} from "typeorm";

export class channelChargeType1583916031092 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("channel_charge_type", true);
    await queryRunner.createTable(
      new Table({
        name: "channel_charge_type",
        columns: [
          {
            name: "channelId",
            type: "varchar(36)",
            isNullable: false
          },
          {
            name: "chargeTypeId",
            type: "varchar(36)",
            isNullable: false
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "channel_charge_type",
      new TableForeignKey({
        columnNames: ["channelId"],
        referencedColumnNames: ["id"],
        referencedTableName: "channel",
        onDelete: "CASCADE"
      })
    );
    await queryRunner.createForeignKey(
      "channel_charge_type",
      new TableForeignKey({
        columnNames: ["chargeTypeId"],
        referencedColumnNames: ["id"],
        referencedTableName: "charge_type",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
