import { getConnection, getManager } from "typeorm";
import {
  WalkinError,
  WalkinPlatformError
} from "../../common/exceptions/walkin-platform-error";
import { Organizations } from "../organization/organization.providers";
import { Users } from "./user.providers";
import { Resolvers, ModuleContext } from "@graphql-modules/core";
import Initialize from "../../common/utils/orgUtils";
import {
  MutationCreateUserArgs,
  User
} from "../../../graphql/generated-models";
import { WCoreError } from "../../common/exceptions";
import { isValidOrg, isValidUser, validateWalkinProducts } from "../../common/validations/Validations";
import {
  isUserOrAppAuthorizedToWorkOnOrganization,
  setOrganizationToInput
} from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { IAuthResolverArgs } from "../auth-guard/auth-guard.interface";
import { Injector } from "@graphql-modules/di";

const resolvers = {
  Query: {
    users: async ({ user, application }, args, { injector }) => {
      const organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );
      return getConnection().transaction(transactionalEntityManager =>
        injector
          .get(Users)
          .getAllUsers(
            transactionalEntityManager,
            args.pageOptions,
            args.sortOptions,
            organizationId
          )
      );
    },

    user: async ({ user, application }, args, { injector }) => {
      const organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );
      return getConnection().transaction(transactionalEntityManager =>
        injector
          .get(Users)
          .getUserByIdWithOrgId(
            transactionalEntityManager,
            args.id,
            organizationId
          )
      );
    },
    checkUserNameAvailability: (
      _,
      { userName },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionalEntityManager => {
        return injector
          .get(Users)
          .checkUserNameAvailability(transactionalEntityManager, userName);
      });
    }
  },
  User: {
    createdCampaigns: (user, _, { injector }) => {
      getConnection().transaction(transactionalEntityManager =>
        injector.get(Users).getCampaign(transactionalEntityManager, user.id)
      );
    },
    store: async (user, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(Users)
          .getStoresByUserId(transactionalEntityManager, user.id);
      });
    }
  },
  Mutation: {
    createUser: async (
      _,
      { input, createOrganization, walkinProducts }: MutationCreateUserArgs,
      { injector }: ModuleContext
    ) => {
      return getManager()
        .transaction(async transactionalEntityManager => {
          await validateWalkinProducts(walkinProducts);

          await isValidUser(transactionalEntityManager, input);

          const savedUser = await injector
            .get(Users)
            .createUser(transactionalEntityManager, input);
          await isValidOrg(transactionalEntityManager, createOrganization);

          if (createOrganization) {
            let savedOrganization;
            savedOrganization = await injector
              .get(Organizations)
              .createOrganization(
                transactionalEntityManager,
                createOrganization
              );
            savedOrganization = await injector
              .get(Organizations)
              .addAdmin(
                transactionalEntityManager,
                savedOrganization,
                savedUser
              );
            await Initialize.initOrganization(
              injector,
              transactionalEntityManager,
              savedOrganization,
              walkinProducts
            );
            const userAutoConfirm = Number(process.env.WCORE_USER_AUTO_CONFIRM);
            savedUser.organization = savedOrganization;
            // There is a bug in condition. It enters the if block if the check is false. Need to verify
            // need a better way to handle verification
            // if (!userAutoConfirm) {
            //   // Send email confirmation to user
            //   await injector
            //     .get(Users)
            //     .sendConfirmationEmailToUser(transactionalEntityManager, savedUser);
            // } else {
            //   savedUser.emailConfirmed = true;
            //   await transactionalEntityManager.save(savedUser);
            // }
          }
          return injector
            .get(Users)
            .getUserById(transactionalEntityManager, savedUser.id);
        })
        .catch(err => {
          console.log("TCL: getManager err", err);
          throw new WalkinError(err);
        });
    },
    updateUser: (obj, args, { injector }) =>
      getConnection().transaction(transactionalEntityManager =>
        injector.get(Users).updateUser(transactionalEntityManager, args.input)
      ),
    changeUserType: (obj, { input }, { injector }) => {
      return getConnection().transaction(async transactionalEntityManager => {
        const response = await injector.get(Users).changeUserType(transactionalEntityManager, input);
        return response;
      })
    },
    linkUserToStore: (
      { apiKey, application, jwt, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionalEntityManager => {
        let input = args.input;
        input = setOrganizationToInput(input, user, application);

        return injector
          .get(Users)
          .linkUserToStore(transactionalEntityManager, input);
      }),
    removeUserFromStore: (
      { apiKey, application, jwt, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionalEntityManager => {
        let input = args.input;
        input = setOrganizationToInput(input, user, application);

        return injector
          .get(Users)
          .removeUserFromStore(transactionalEntityManager, input);
      }),

    addUserToOrganization: (
      _,
      { userData, organization_id, role_id },
      { injector }
    ) => {
      return getConnection().transaction(transactionalEntityManager =>
        injector
          .get(Users)
          .addUserToOrganization(
            transactionalEntityManager,
            userData,
            organization_id,
            role_id
          )
      );
    },
    deleteUserById: (obj, args, { injector }) =>
      getConnection().transaction(transactionalEntityManager =>
        injector.get(Users).deleteUserById(transactionalEntityManager, args.id)
      ),
    linkApplicationToUser: (obj, { userId, applicationID }, { injector }) =>
      getConnection().transaction(transactionalEntityManager =>
        injector
          .get(Users)
          .linkApplicationToUser(
            transactionalEntityManager,
            userId,
            applicationID
          )
      ),
    confirmEmail: (obj, { email, emailToken }, { injector }) => {
      return getConnection().transaction(transactionalEntityManager => {
        return injector
          .get(Users)
          .confirmEmail(transactionalEntityManager, email, emailToken);
      });
    },
    sendPasswordResetLink: (obj, { email }, { injector }) => {
      return getConnection().transaction(transactionalEntityManager => {
        return injector
          .get(Users)
          .sendPasswordResetLink(transactionalEntityManager, email);
      });
    },
    updatePassword: ({ user }, { oldPassword, newPassword }, { injector }) => {
      return getConnection().transaction(transactionalEntityManager => {
        return injector
          .get(Users)
          .updatePassword(
            transactionalEntityManager,
            oldPassword,
            newPassword,
            user
          );
      });
    },
    updateUserPassword: (
      { user }: { user: User },
      { userId, password },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(transactionalEntityManager => {
        const {
          organization: { id }
        } = user;
        const adminUserId = user.id;
        return injector
          .get(Users)
          .updateUserPassword(transactionalEntityManager, {
            password,
            organizationId: id,
            adminUserId,
            userId
          });
      });
    },
    resetPassword: (
      _,
      { token, password },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(transactionalEntityManager => {
        return injector.get(Users).resetPassword(transactionalEntityManager, {
          token,
          password
        });
      });
    },
    createUpdateDeviceInfo: (
      _,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(transactionalEntityManager => {
        return injector
          .get(Users)
          .createUpdateDeviceInfo(transactionalEntityManager, input);
      });
    }
  }
};

export default resolvers;
