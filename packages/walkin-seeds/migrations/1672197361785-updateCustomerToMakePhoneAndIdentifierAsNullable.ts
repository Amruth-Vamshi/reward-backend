import {MigrationInterface, QueryRunner} from "typeorm";

export class updateCustomerToMakePhoneAndIdentifierAsNullable1672197361785 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            "ALTER TABLE customer MODIFY COLUMN phoneNumber VARCHAR(255) NULL"
        );
        await queryRunner.query(
            "ALTER TABLE customer MODIFY COLUMN customerIdentifier VARCHAR(255) NULL"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            "ALTER TABLE customer MODIFY COLUMN phoneNumber VARCHAR(255) NOT NULL"
        );
        await queryRunner.query(
            "ALTER TABLE customer MODIFY COLUMN customerIdentifier VARCHAR(255) NOT NULL"
        );
    }

}
