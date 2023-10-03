import { Status } from "@walkinserver/walkin-rewardx/src/entity";
import {MigrationInterface, QueryRunner, In} from "typeorm";
import { WalkinStatusSeed } from "./data/intial_status_seed";
import { updateEntity } from "@walkinserver/walkin-core/src/modules/common/utils/utils";

export class addIntitalStatus1671425763900 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        for (const walkinStatusSeed of WalkinStatusSeed) {
            let status = new Status();
            status = updateEntity(status, walkinStatusSeed);
            status = await status.save();
          }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const status = WalkinStatusSeed.map(
            status => status.statusCode
        );
        const savedWalkinStatuses = await Status.find({
        where: {
            statusCode: In(status)
        }
        });
        for (const walkinStatus of savedWalkinStatuses) {
        await walkinStatus.remove();
        }
    }

}
