import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from "typeorm";
import { type } from "os";

export class AddPushAtrributesToMessageTemplate1567590922822
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "message_template",
      new TableColumn({
        name: "url",
        type: "varchar(500)"
      })
    );
    await queryRunner.addColumn(
      "message_template",
      new TableColumn({
        name: "imageUrl",
        type: "varchar(500)"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("message_template", "url");
    await queryRunner.dropColumn("message_template", "imageUrl");
  }
}
