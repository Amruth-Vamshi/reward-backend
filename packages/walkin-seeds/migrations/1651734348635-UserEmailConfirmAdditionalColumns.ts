import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableIndex,
  } from "typeorm";

export class UserEmailConfirmAdditionalColumns1651734348635 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
        "user",
        new TableColumn({
            type: "boolean",
            name: "email_confirmed",
            default: false
        })
        );
    
        await queryRunner.addColumn(
        "user",
        new TableColumn({
            isNullable: true,
            type: "varchar",
            name: "reset_code"
        })
        );

        await queryRunner.addColumn(
            "user",
            new TableColumn({
              name: "userName",
              type: "varchar",
              isNullable: true,
            })
          );
      
          await queryRunner.createIndex(
            "user",
            new TableIndex({
              name: "UNIQUE_USER_NAME_FOR_USER",
              columnNames: ["userName"],
            })
          );
      
          await queryRunner.createIndex(
            "user",
            new TableIndex({
              name: "EMAIL_FOR_USER",
              columnNames: ["email"],
            })
          );
    
    }
    
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn("user", "email_confirmed");
        await queryRunner.dropColumn("user", "reset_code");
    }
}

