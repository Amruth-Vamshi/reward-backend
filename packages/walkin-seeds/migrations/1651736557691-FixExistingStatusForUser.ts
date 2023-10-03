import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "@walkinserver/walkin-core/src/entity";
import { STATUS } from "@walkinserver/walkin-core/src/modules/common/constants";

export class FixExistingStatusForUser1651736557691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection.transaction(async (transactionManager) => {
          const users = await transactionManager.find(User, {
            cache: false,
          });
          for (const user of users) {
            const { status } = user;
            if (status === "0") {
              user.status = STATUS.INACTIVE;
            } else if (status === "1") {
              user.status = STATUS.ACTIVE;
            }
            await transactionManager.save(user);
          }
        });
      }
    
      public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
      }

}

