import { MigrationInterface, QueryRunner } from "typeorm";
import { updateEntity } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { WalkinProduct } from "@walkinserver/walkin-core/src/entity";

export class addWalkinProductOrderx1584446686092 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let walkinProductSeed = {
            name: "ORDERX",
            description: "Walkin OrderX",
            latest_version: "0.10",
            status: "ACTIVE"
        };
        let walkinProduct = new WalkinProduct();
        walkinProduct = updateEntity(walkinProduct, walkinProductSeed);
        walkinProduct = await walkinProduct.save();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
