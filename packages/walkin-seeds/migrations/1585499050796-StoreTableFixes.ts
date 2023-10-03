import { MigrationInterface, QueryRunner, In } from "typeorm";
import { Store } from "@walkinserver/walkin-core/src/entity";

export class StoreTableFixes1585499050796 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.connection.transaction(async transactionManager => {
      const storeObj: any = await transactionManager.find(Store);

      if (storeObj.length > 0) {
        for (const store of storeObj) {
          if (store.latitude && store.longitude) {
            store.geoLocation = `Point(${store.latitude} ${store.longitude})`;
            await transactionManager.save(store);
          }
        }
      }
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
