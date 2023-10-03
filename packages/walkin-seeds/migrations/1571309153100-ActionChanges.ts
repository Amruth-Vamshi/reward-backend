import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class ActionChanges1571034835979 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const actionTable = await queryRunner.getTable("action");

    if (actionTable) {
      if (actionTable.columns.find(k => k.name === "validation")) {
        await queryRunner.dropColumn("action", "validation");
      }
      if (actionTable.columns.find(k => k.name === "actionResult")) {
        await queryRunner.dropColumn("action", "actionResult");
      }
      if (actionTable.columns.find(k => k.name === "actionData")) {
        await queryRunner.dropColumn("action", "actionData");
      }
      if (actionTable.columns.find(k => k.name === "actionMessage")) {
        await queryRunner.dropColumn("action", "actionMessage");
      }
      if (actionTable.columns.find(k => k.name === "applicationId")) {
        if (
          actionTable.foreignKeys.find(
            k => k.name === "FK_cd282cee5d1c9e4e7d7b4c4df70"
          )
        ) {
          await queryRunner.dropForeignKey(
            "action",
            "FK_cd282cee5d1c9e4e7d7b4c4df70"
          );
        }
        await queryRunner.dropColumn("action", "applicationId");
      }
      if (actionTable.columns.find(k => k.name === "action_definition_id")) {
        if (
          actionTable.foreignKeys.find(
            k => k.name === "FK_9068aa368b8e6dd44f054054431"
          )
        ) {
          await queryRunner.dropForeignKey(
            "action",
            "FK_9068aa368b8e6dd44f054054431"
          );
        }
        await queryRunner.dropColumn("action", "action_definition_id");
      }
      if (actionTable.columns.find(k => k.name === "organization_id")) {
        if (
          actionTable.foreignKeys.find(
            k => k.name === "FK_e60f38865de4c5255fdef557955"
          )
        ) {
          await queryRunner.dropForeignKey(
            "action",
            "FK_e60f38865de4c5255fdef557955"
          );
        }
        await queryRunner.dropColumn("action", "organization_id");
      }
      if (!actionTable.columns.find(k => k.name === "status")) {
        await queryRunner.addColumn(
          "action",
          new TableColumn({
            name: "status",
            type: "varchar(255)"
          })
        );
      }
      if (!actionTable.columns.find(k => k.name === "request")) {
        await queryRunner.addColumn(
          "action",
          new TableColumn({
            name: "request",
            type: "text"
          })
        );
      }
      if (!actionTable.columns.find(k => k.name === "response")) {
        await queryRunner.addColumn(
          "action",
          new TableColumn({
            name: "response",
            type: "text"
          })
        );
      }
      if (!actionTable.columns.find(k => k.name === "action_definition_id")) {
        await queryRunner.addColumn(
          "action",
          new TableColumn({
            name: "action_definition_id",
            type: "int(11)"
          })
        );
      }
      if (!actionTable.columns.find(k => k.name === "organization_id")) {
        await queryRunner.addColumn(
          "action",
          new TableColumn({
            name: "organization_id",
            type: "varchar(255)"
          })
        );
      }

      await queryRunner.createForeignKey(
        "action",
        new TableForeignKey({
          columnNames: ["action_definition_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "action_definition",
          onDelete: "CASCADE"
        })
      );

      await queryRunner.createForeignKey(
        "action",
        new TableForeignKey({
          columnNames: ["organization_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "organization",
          onDelete: "CASCADE"
        })
      );
    }

    const actionDefinitionTable = await queryRunner.getTable(
      "action_definition"
    );

    if (actionDefinitionTable) {
      if (actionDefinitionTable.columns.find(k => k.name === "schema")) {
        await queryRunner.dropColumn("action_definition", "schema");
      }
      if (actionDefinitionTable.columns.find(k => k.name === "accessLevel")) {
        await queryRunner.dropColumn("action_definition", "accessLevel");
      }
      if (actionDefinitionTable.columns.find(k => k.name === "format")) {
        await queryRunner.dropColumn("action_definition", "format");
      }

      if (
        actionDefinitionTable.foreignKeys.find(
          k => k.name === "FK_8c22e041093b11f3287b982330e"
        )
      ) {
        await queryRunner.dropForeignKey(
          "action_definition",
          "FK_8c22e041093b11f3287b982330e"
        );
      }
      if (
        actionDefinitionTable.columns.find(k => k.name === "action_type_id")
      ) {
        await queryRunner.dropColumn("action_definition", "action_type_id");
      }

      if (!actionDefinitionTable.columns.find(k => k.name === "name")) {
        await queryRunner.addColumn(
          "action_definition",
          new TableColumn({
            name: "name",
            type: "varchar(255)",
            isNullable: false,
            isUnique: true
          })
        );
      }
      if (!actionDefinitionTable.columns.find(k => k.name === "type")) {
        await queryRunner.addColumn(
          "action_definition",
          new TableColumn({
            name: "type",
            type: "varchar(255)",
            isNullable: false
          })
        );
      }
      if (!actionDefinitionTable.columns.find(k => k.name === "status")) {
        await queryRunner.addColumn(
          "action_definition",
          new TableColumn({
            name: "status",
            type: "varchar(255)",
            isNullable: false
          })
        );
      }

      if (
        !actionDefinitionTable.columns.find(k => k.name === "configuration")
      ) {
        await queryRunner.addColumn(
          "action_definition",
          new TableColumn({
            name: "configuration",
            type: "JSON"
          })
        );
      }

      if (!actionDefinitionTable.columns.find(k => k.name === "input_schema")) {
        await queryRunner.addColumn(
          "action_definition",
          new TableColumn({
            name: "input_schema",
            type: "JSON"
          })
        );
      }
      if (
        !actionDefinitionTable.columns.find(k => k.name === "output_schema")
      ) {
        await queryRunner.addColumn(
          "action_definition",
          new TableColumn({
            name: "output_schema",
            type: "JSON"
          })
        );
      }

      if (
        !actionDefinitionTable.columns.find(k => k.name === "organization_id")
      ) {
        await queryRunner.addColumn(
          "action_definition",
          new TableColumn({
            name: "organization_id",
            type: "varchar(255)"
          })
        );
      }

      await queryRunner.createForeignKey(
        "action_definition",
        new TableForeignKey({
          columnNames: ["organization_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "organization",
          onDelete: "CASCADE"
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const actionTable = await queryRunner.getTable("action");

    if (actionTable) {
      if (actionTable.columns.find(k => k.name === "status")) {
        await queryRunner.dropColumn("action", "status");
      }
      if (actionTable.columns.find(k => k.name === "request")) {
        await queryRunner.dropColumn("action", "request");
      }
      if (actionTable.columns.find(k => k.name === "response")) {
        await queryRunner.dropColumn("action", "response");
      }

      if (!actionTable.columns.find(k => k.name === "validation")) {
        await queryRunner.addColumn(
          "action",
          new TableColumn({
            name: "validation",
            type: "tinyint(4)"
          })
        );
      }
      if (!actionTable.columns.find(k => k.name === "actionResult")) {
        await queryRunner.addColumn(
          "action",
          new TableColumn({
            name: "actionResult",
            type: "varchar(255)"
          })
        );
      }
      if (!actionTable.columns.find(k => k.name === "actionData")) {
        await queryRunner.addColumn(
          "action",
          new TableColumn({
            name: "actionData",
            type: "text"
          })
        );
      }
      if (!actionTable.columns.find(k => k.name === "actionMessage")) {
        await queryRunner.addColumn(
          "action",
          new TableColumn({
            name: "actionMessage",
            type: "text"
          })
        );
      }
      if (!actionTable.columns.find(k => k.name === "applicationId")) {
        await queryRunner.addColumn(
          "action",
          new TableColumn({
            name: "applicationId",
            type: "int(11)"
          })
        );
      }
    }

    // action_definition table
    const actionDefinitionTable = await queryRunner.getTable(
      "action_definition"
    );

    if (actionDefinitionTable) {
      if (actionDefinitionTable.columns.find(k => k.name === "type")) {
        await queryRunner.dropColumn("action_definition", "type");
      }

      if (actionDefinitionTable.columns.find(k => k.name === "name")) {
        await queryRunner.dropColumn("action_definition", "name");
      }

      if (actionDefinitionTable.columns.find(k => k.name === "status")) {
        await queryRunner.dropColumn("action_definition", "status");
      }

      if (actionDefinitionTable.columns.find(k => k.name === "configuration")) {
        await queryRunner.dropColumn("action_definition", "configuration");
      }

      if (actionDefinitionTable.columns.find(k => k.name === "input_schema")) {
        await queryRunner.dropColumn("action_definition", "input_schema");
      }

      if (actionDefinitionTable.columns.find(k => k.name === "output_schema")) {
        await queryRunner.dropColumn("action_definition", "output_schema");
      }

      if (!actionDefinitionTable.columns.find(k => k.name === "schema")) {
        await queryRunner.addColumn(
          "action_definition",
          new TableColumn({
            name: "schema",
            type: "varchar(255)"
          })
        );
      }
      if (!actionDefinitionTable.columns.find(k => k.name === "accessLevel")) {
        await queryRunner.addColumn(
          "action_definition",
          new TableColumn({
            name: "accessLevel",
            type: "varchar(255)"
          })
        );
      }
      if (!actionDefinitionTable.columns.find(k => k.name === "format")) {
        await queryRunner.addColumn(
          "action_definition",
          new TableColumn({
            name: "format",
            type: "varchar(255)"
          })
        );
      }

      if (
        !actionDefinitionTable.columns.find(k => k.name === "action_type_id")
      ) {
        await queryRunner.addColumn(
          "action_definition",
          new TableColumn({
            name: "action_type_id",
            type: "int"
          })
        );
      }
    }
  }
}
