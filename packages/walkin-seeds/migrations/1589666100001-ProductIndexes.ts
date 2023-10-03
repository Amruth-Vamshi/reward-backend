import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class ProductIndexes1589666100001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createIndex(
            "product",
            new TableIndex({
                columnNames: ["listable"],
                name: "index_table_product_columns_listable",
            })
        );

        const product_charge_value = await queryRunner.getTable("product_charge_value");
        if (product_charge_value.indices.find(k => k.name === 'product_charge_value_product_id_IDX') !== undefined) {
            console.log("already exists");
        } else {
            await queryRunner.createIndex(
                "product_charge_value",
                new TableIndex({
                    columnNames: ["product_id", "store_format", "channel"],
                    name: "product_charge_value_product_id_IDX",
                })
            );
        }

        const product_tax_value = await queryRunner.getTable("product_tax_value");

        if (product_tax_value.indices.find(k => k.name === 'product_tax_value_store_format_IDX') !== undefined) {
            console.log("already exists");
        } else {
            await queryRunner.createIndex(
                "product_tax_value",
                new TableIndex({
                    columnNames: ["product_id", "store_format", "channel"],
                    name: "product_tax_value_store_format_IDX",
                })
            );
        }

        const product_price_value = await queryRunner.getTable("product_price_value");
        if (product_price_value.indices.find(k => k.name === 'product_price_value_product_id_IDX') !== undefined) {
            console.log("already exists");
        } else {
            await queryRunner.createIndex(
                "product_price_value",
                new TableIndex({
                    columnNames: ["product_id", "store_format", "channel"],
                    name: "product_price_value_product_id_IDX",
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
    }
}
