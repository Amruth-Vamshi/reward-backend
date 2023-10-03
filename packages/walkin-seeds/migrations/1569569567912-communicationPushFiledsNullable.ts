import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from "typeorm";
import { type } from "os";

// tslint:disable-next-line:class-name
export class communicationPushFiledsNullable1569569567912
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "message_template",
      new TableColumn({
        name: "url",
        type: "varchar(500)"
      }),
      new TableColumn({
        name: "url",
        type: "varchar(500)",
        isNullable: true
      })
    );
    await queryRunner.changeColumn(
      "message_template",
      new TableColumn({
        name: "imageUrl",
        type: "varchar(500)"
      }),
      new TableColumn({
        name: "imageUrl",
        type: "varchar(500)",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    //
  }
}
