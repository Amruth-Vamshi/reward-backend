import {
    MigrationInterface,
    QueryRunner,
    TableForeignKey,
    Table,
    TableIndex,
    TableColumn
} from "typeorm";

export class storeDeliveryAreaIncreaeAreaColumn1588948423099 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn(
            "store_delivery_area",
            new TableColumn({
                name: "area",
                type: "varchar(255)"
            }),
            new TableColumn({
                name: "area",
                type: "text"
            })
        );

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        //do nothing
    }

}
