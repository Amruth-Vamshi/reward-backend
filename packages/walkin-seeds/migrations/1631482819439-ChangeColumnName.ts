import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeColumnName1631482819439 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection.transaction(async (TransactionManager) => {
            try{
                await TransactionManager.query(
                  "ALTER TABLE product_option CHANGE COLUMN `category_product_option_level` `productOptionLevel` varchar(255) NULL"
                );

            }catch(error){
                console.log("COLUMN ERROR",error)
            }
          });
        
        await queryRunner.connection.transaction(async (TransactionManager) => {
            try{
                await TransactionManager.query(
                    // category_product_option_level_id
                  "ALTER TABLE product_option CHANGE COLUMN `category_product_option_level_id` `productOptionLevelId` varchar(255) NULL"
                );
            }catch(error){
                console.log("NEW COLUMN ERROR",error)
            }
          });
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
