import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from "typeorm";
import { type } from "os";

// tslint:disable-next-line:class-name
export class communicationAppNullable1569569567913
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "communication",
      new TableColumn({
        name: "application_id",
        type: "varchar(36)"
      }),
      new TableColumn({
        name: "application_id",
        type: "varchar(36)",
        isNullable: true
      })
    );
    const table = await queryRunner.getTable("communication");
    if (table.columns.find(k => k.name === "communication_id")) {
      await queryRunner.dropColumn("communication", "communication_id");
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    //
  }
}
