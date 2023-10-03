import { MigrationInterface, QueryRunner, In } from "typeorm";
import { PolicySeed } from "./data/policy_seed";
import { Policy } from "@walkinserver/walkin-core/src/entity";
import { updateEntity } from "@walkinserver/walkin-core/src/modules/common/utils/utils";

export class Policies1569836832699 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    for (const policySeed of PolicySeed) {
      let policy = new Policy();
      policy = updateEntity(policy, policySeed);
      policy = await policy.save();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const policies = PolicySeed.map(policy => policy.resource);
    const savedPolicies = await Policy.find({
      where: {
        resource: In(policies)
      }
    });
    for (const policy of savedPolicies) {
      await policy.remove();
    }
  }
}
