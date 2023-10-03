import { MigrationInterface, QueryRunner, In } from "typeorm";
import { Customer } from "@walkinserver/walkin-core/src/entity";
import { updateEntity } from "../../walkin-core/src/modules/common/utils/utils";

export class FixCustomerIdentifierNotNullable1576824929632
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const customerObj = await Customer.find({
      where: {
        customerIdentifier: In([null, ""])
      }
    });

    if (customerObj.length > 0) {
      for (const customer of customerObj) {
        await queryRunner.manager.update(
          Customer,
          { id: customer.id },
          {
            customerIdentifier: customer.id
          }
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Do nothing
  }
}
