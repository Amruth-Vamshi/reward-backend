import { defaultFieldResolver } from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";
import { promisify } from "util";

import {
  getUserPermission,
  getUserDetails
} from "@walkinserver/walkin-core/src/modules/common/utils/accessControlUtils";

export class AccessdDirective extends SchemaDirectiveVisitor {
  public getUser = promisify(getUserDetails);

  public visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async (...args) => {
      const context = args[2];
      const operation = args[3];

      const requiredPermissions = this.args.requires;

      if (!requiredPermissions || requiredPermissions.length < 1) {
        return args;
      }

      let req: any;
      let res: any;

      if (context.session) {
        ({ req, res } = context.session);
      } else if (operation.session) {
        ({ req, res } = operation.session);
      } else {
        return null;
      }

      const { user, apiKey } = (await this.getUser(req, res)) as any;

      if (user) {
        const userPermission = getUserPermission(user, requiredPermissions);
        if (userPermission) {
          return resolve.apply(this, args);
        } else {
          return null;
        }
      } else if (apiKey) {
        const userPermission = getUserPermission(apiKey, requiredPermissions);
        if (userPermission) {
          return resolve.apply(this, args);
        } else {
          return null;
        }
      } else {
        return null;
      }
    };
  }
}
