import {MigrationInterface, QueryRunner,TableColumn,TableIndex} from "typeorm";

export class modifyLoyaltyReferenceIdAsNullableField1670302481093 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn(
            "loyalty_transaction",
            "loyalty_reference_id",
            new TableColumn({
                name: "loyalty_reference_id",
                isNullable: true,
                type: "varchar(225)"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
