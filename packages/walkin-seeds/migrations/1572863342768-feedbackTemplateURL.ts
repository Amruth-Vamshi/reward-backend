import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  Table
} from "typeorm";
import { STATUS } from "@walkinserver/walkin-core/src/modules/common/constants";

export class feedbackTemplateURL1572863342768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const feedbackTemplateURLTable = new Table({
      name: "feedback_template_url",
      columns: [
        {
          name: "id",
          type: "int",
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment"
        },
        {
          name: "created_by",
          type: "varchar",
          isNullable: true
        },
        {
          name: "last_modified_by",
          type: "varchar",
          isNullable: true
        },
        {
          name: "created_time",
          type: "datetime(6)",
          default: "CURRENT_TIMESTAMP(6)",
          isNullable: true
        },
        {
          name: "last_modified_time",
          type: "datetime(6)",
          default: "CURRENT_TIMESTAMP(6)",
          isNullable: true
        },
        {
          name: "title",
          isNullable: false,
          type: "varchar"
        },
        {
          name: "description",
          isNullable: true,
          type: "varchar"
        },
        {
          name: "url",
          isNullable: false,
          type: "varchar"
        },
        {
          name: "status",
          isNullable: true,
          type: "varchar"
        }
      ]
    });

    await queryRunner.createTable(feedbackTemplateURLTable);
    const feedbackFormTable = await queryRunner.getTable("feedback_form");
    await queryRunner.dropColumn(feedbackFormTable, "templateURL");
    const feedbackTemplateURLIdColumn = new TableColumn({
      type: "int",
      isNullable: true,
      name: "feedbackTemplateURLId"
    });
    await queryRunner.addColumn(feedbackFormTable, feedbackTemplateURLIdColumn);
    await queryRunner.createForeignKey(
      feedbackFormTable,
      new TableForeignKey({
        columnNames: [feedbackTemplateURLIdColumn.name],
        referencedColumnNames: ["id"],
        referencedTableName: feedbackTemplateURLTable.name
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const feedbackFormTable = await queryRunner.getTable("feedback_form");
    for (const foreignKey of feedbackFormTable.foreignKeys) {
      if (foreignKey.columnNames[0] === "feedbackTemplateURLId") {
        await queryRunner.dropForeignKey(feedbackFormTable, foreignKey.name);
        await queryRunner.dropColumn(
          feedbackFormTable,
          foreignKey.columnNames[0]
        );
      }
    }
    await queryRunner.addColumn(
      feedbackFormTable,
      new TableColumn({
        type: "varchar",
        name: "templateURL"
      })
    );
    await queryRunner.dropTable("feedback_template_url");
  }
}
