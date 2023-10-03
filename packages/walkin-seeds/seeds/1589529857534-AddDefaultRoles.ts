import { MigrationInterface, QueryRunner, In } from "typeorm";
import { RoleSeed } from "./data/role_seed";
import { updateEntity } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { Role, Policy } from "@walkinserver/walkin-core/src/entity";

export class AddDefaultRoles1589529857534 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    for (const roleSeed of RoleSeed) {
      const roleName = roleSeed.name;
      const savedRole = await Role.findOne({
        where: {
          name: roleName,
        },
      });
      if (!savedRole) {
        let role = new Role();
        role = updateEntity(role, roleSeed);
        if (roleSeed.policies && roleSeed.policies.length > 0) {
          for (const policySeed of roleSeed.policies) {
            const accessLevel: any = policySeed.accessLevel;
            const effect: any = policySeed.effect;
            const permission: any = policySeed.permission;
            const resource: any = policySeed.resource;
            const type: any = policySeed.type;

            let foundPolicy = await Policy.findOne({
              where: {
                accessLevel,
                effect,
                permission,
                resource,
                type,
              },
            });
            if (!foundPolicy) {
              let policy = new Policy();
              policy = updateEntity(policy, policySeed);
              foundPolicy = await policy.save();
            }
            role.policies.push(foundPolicy);
          }
        }
        role = await role.save();
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const roles = RoleSeed.map((role) => role.name);
    const savedRoles = await Role.find({
      where: {
        name: In(roles),
      },
    });
    for (const role of savedRoles) {
      await role.remove();
    }
  }
}
