import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableUnique} from "typeorm";

export class addStoreCodeToLoyaltyTransaction1667776282518 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "loyalty_transaction",
            new TableColumn({
              name: "store_id",
              type: "varchar(36)",
              isNullable: true
            })
        );

        await queryRunner.createForeignKey(
            "loyalty_transaction",
            new TableForeignKey({
              columnNames: ["store_id"],
              referencedColumnNames: ["id"],
              referencedTableName: "store"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
