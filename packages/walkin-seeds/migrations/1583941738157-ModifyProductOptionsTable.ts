import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ModifyCategoryProductOptionsTable1583941738157 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.addColumn(
            "product_option",
            new TableColumn({
                name: "category_product_option_level",
                type: "varchar(36)",
                isNullable: true
            })
        );

        await queryRunner.addColumn(
            "product_option",
            new TableColumn({
                name: "category_product_option_level_id",
                type: "varchar(36)",
                isNullable: true
            })
        );

        // Throwing error while renaming the table name - Need to check
        // await queryRunner.renameTable(
        //     "product_option",
        //     "category_product_option"
        // );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // Do nothing
    }

}
