import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn
} from "typeorm";

export class feedbackUIConfig1570789561855 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "feedback_ui_config",
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
            name: "layoutCode",
            isNullable: false,
            type: "varchar"
          },
          {
            name: "backgroundColor",
            isNullable: true,
            type: "varchar"
          },
          {
            name: "accentColor",
            isNullable: true,
            type: "varchar"
          },
          {
            name: "logoUrl",
            isNullable: true,
            type: "varchar"
          },
          {
            name: "formStructure",
            isNullable: true,
            type: "varchar"
          },
          {
            name: "headerText",
            isNullable: true,
            type: "varchar"
          },
          {
            name: "exitMessage",
            isNullable: true,
            type: "varchar"
          },
          {
            name: "buttonText",
            isNullable: true,
            type: "varchar"
          },
          {
            name: "transition",
            isNullable: true,
            type: "varchar"
          }
        ]
      }),
      true
    );

    await queryRunner.addColumn(
      "feedback_form",
      new TableColumn({
        name: "feedbackUIConfigId",
        type: "int",
        isNullable: true
      })
    );

    await queryRunner.createForeignKey(
      "feedback_form",
      new TableForeignKey({
        columnNames: ["feedbackUIConfigId"],
        referencedColumnNames: ["id"],
        referencedTableName: "feedback_ui_config",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("feedback_ui_config", true, true);
  }
}
