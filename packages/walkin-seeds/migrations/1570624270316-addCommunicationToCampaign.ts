import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class AddCommunicationToCampaign1570624270316
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable("campaign");

    if (!table.columns.find(k => k.name === "communication_id")) {
      await queryRunner.addColumn(
        "campaign",
        new TableColumn({
          name: "communication_id",
          type: "int(11)",
          isNullable: true
        })
      );

      await queryRunner.createForeignKey(
        "campaign",
        new TableForeignKey({
          columnNames: ["communication_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "communication"
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable("campaign");
    const communicationForeignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf("communication_id") !== -1
    );
    await queryRunner.dropForeignKey("communication", communicationForeignKey);
  }
}
