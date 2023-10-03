import { Service } from "typedi";
import { EntityManager } from "typeorm";
import { Role, User } from "../../../entity";
import { CACHING_KEYS } from "../../common/constants";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import { removeValueFromCache } from "../../common/utils/redisUtils";

@Service()
export class AccessControlRepository {
    public async unlinkUserToRole(
        entityManager: EntityManager,
        userId: string,
        roleId: string
    ) {
        const user = await entityManager.findOne(User, {
            where: {
                id: userId
            },
            relations: ["roles"]
        });

        if (!user) {
            throw new WCoreError(WCORE_ERRORS.USER_NOT_FOUND);
        }

        const existingRole = user.roles.filter((value) => {
            return value.id == roleId;
        });
        if (existingRole.length === 0) {
            throw new WCoreError(WCORE_ERRORS.EXISTING_ROLE_NOT_FOUND);
        }

        const role = await entityManager.findOne(Role, {
            where: {
                id: roleId
            }
        });
        if (!role) {
            const roleNotFoundError = Object.assign({}, WCORE_ERRORS.ROLE_NOT_FOUND);
            roleNotFoundError.MESSAGE = `Role id: ${roleId} not found`;
            throw new WCoreError(roleNotFoundError);
        }

        let filteredRoles = user.roles.filter((value, index, arr) => {
            return value.id != role.id;
        });
        user.roles = filteredRoles;

        const keys = [`${CACHING_KEYS.USER}_${user.id}`];
        removeValueFromCache(keys);

        return entityManager.save(user);
    }

    public async linkUserToRole(
        entityManager: EntityManager,
        userId: string,
        roleId: string
    ) {
        const user = await entityManager.findOne(User, {
            where: {
                id: userId
            },
            relations: ["roles"]
        });
        if (!user) {
            throw new WCoreError(WCORE_ERRORS.USER_NOT_FOUND);
        }

        const role = await entityManager.findOne(Role, {
            where: {
                id: roleId
            }
        });
        if (!role) {
            const roleNotFoundError = Object.assign({}, WCORE_ERRORS.ROLE_NOT_FOUND);
            roleNotFoundError.MESSAGE = `Role id: ${roleId} not found`;
            throw new WCoreError(roleNotFoundError);
        }

        const existingRole = user.roles.filter((value) => {
            return value.id == role.id;
        });
        if (existingRole.length === 0) {
            user.roles.push(role);
        }

        const keys = [`${CACHING_KEYS.USER}_${user.id}`];
        removeValueFromCache(keys);

        return entityManager.save(user);
    }
}