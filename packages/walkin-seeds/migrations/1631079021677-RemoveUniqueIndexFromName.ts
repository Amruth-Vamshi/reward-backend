import {MigrationInterface, QueryRunner, TableIndex} from "typeorm";

export class RemoveUniqueIndexFromName1631079021677 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropIndex(
            "option",
            "IDX_5e47276c1d6a3fb881283fdbf1"
          );
      
          await queryRunner.createIndex(
            "option",
            new TableIndex({
              name: "IDX_FOR_NAME",
              columnNames: ["name"],
              isUnique: false
            })
          );

          await queryRunner.dropIndex(
            "option_value",
            "IDX_489f2d087b47aff8d3e31b6aaa"
          );
      
          await queryRunner.createIndex(
            "option_value",
            new TableIndex({
              name: "IDX_FOR_value",
              columnNames: ["value"],
              isUnique: false
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
