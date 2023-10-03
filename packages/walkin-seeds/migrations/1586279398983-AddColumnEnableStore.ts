import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnEnableStore1586279398983 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "store",
      new TableColumn({
        type: "boolean",
        name: "enable",
        default: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
