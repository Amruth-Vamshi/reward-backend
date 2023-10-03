import { MigrationInterface, QueryRunner, In } from "typeorm";
import { WalkinProductsSeed } from "./data/walkin_product.seed";
import { WalkinProduct } from "@walkinserver/walkin-core/src/entity";
import { updateEntity } from "@walkinserver/walkin-core/src/modules/common/utils/utils";

// tslint:disable-next-line:class-name
export class walkinProducts1568635687359 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    for (const walkinProductSeed of WalkinProductsSeed) {
      let walkinProduct = new WalkinProduct();
      walkinProduct = updateEntity(walkinProduct, walkinProductSeed);
      walkinProduct = await walkinProduct.save();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const walkinProducts = WalkinProductsSeed.map(
      walkinProduct => walkinProduct.name
    );
    const savedWalkinProducts = await WalkinProduct.find({
      where: {
        name: In(walkinProducts)
      }
    });
    for (const walkinProduct of savedWalkinProducts) {
      await walkinProduct.remove();
    }
  }
}
