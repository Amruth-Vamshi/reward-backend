import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateTableProductOptionValue1631513705470 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
              name: "product_option_value",
              columns: [
                {
                  name: "id",
                  type: "int(11)",
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
                  name: "option_value_id",
                  type: "int(11)",
                  isNullable: false
                },
                {
                  name: "product_option_id",
                  type: "int(11)",
                  isNullable: false
                }
              ]
            }),
            true
          );
      
          await queryRunner.createForeignKey(
            "product_option_value",
            new TableForeignKey({
              columnNames: ["option_value_id"],
              referencedColumnNames: ["id"],
              referencedTableName: "option_value",
              onDelete:"CASCADE"
            })
          );
      
          await queryRunner.createForeignKey(
            "product_option_value",
            new TableForeignKey({
              columnNames: ["product_option_id"],
              referencedColumnNames: ["id"],
              referencedTableName: "product_option",
              onDelete:"CASCADE"
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
