import { MigrationInterface, QueryRunner, In } from "typeorm";
import { RoleSeed } from "./data/role_seed";
import { Role } from "@walkinserver/walkin-core/src/entity";
import { updateEntity } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
export class Roles1569836173159 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    for (const roleSeed of RoleSeed) {
      let role = new Role();
      role = updateEntity(role, roleSeed);
      role = await role.save();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const roles = RoleSeed.map(role => role.name);
    const savedRoles = await Role.find({
      where: {
        name: In(roles)
      }
    });
    for (const role of savedRoles) {
      await role.remove();
    }
  }
}
