import {
    MigrationInterface,
    QueryRunner,
  } from "typeorm";
  import { User } from "@walkinserver/walkin-core/src/entity";
import { STATUS } from "@walkinserver/walkin-core/src/modules/common/constants";

export class UpdateUserData1651737002398 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

      await queryRunner.connection.transaction(async transactionManager => {
        const users = await User.find({
            cache: false,
            where: {
            status: STATUS.ACTIVE
            }
        })
        for (const user of users) {
            user.emailConfirmed = true;
            user.userName = user.email;
            await transactionManager.save(user);
        }
        });
      }
    
      public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
      }

}
  