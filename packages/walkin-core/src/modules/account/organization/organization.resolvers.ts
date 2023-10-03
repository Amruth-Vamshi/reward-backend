import { getConnection, getManager } from "typeorm";
import { WalkinError } from "../../common/exceptions/walkin-platform-error";
import { Users } from "../user/user.providers";
import { Organizations } from "./organization.providers";
import { ModuleContext } from "@graphql-modules/core";
import Initialize from "../../common/utils/orgUtils";
import { isValidOrg, isValidUser } from "../../common/validations/Validations";
import {
  WalkinProduct,
  WalkinProducts,
  MutationLinkOrganizationToWalkinProductsArgs
} from "../../../graphql/generated-models";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";

const resolvers = {
  Query: {
    organization: (_, args, { injector }) =>
      getConnection().transaction(transactionManager =>
        injector.get(Organizations).getOrganization(transactionManager, args.id)
      ),
    organizationHierarchies: async (root, args, ctx, info) => {
      // HOW TO USE RESOLVER FROM ANOTHER RESOLVER FROM
      // const testAuth = info.schema.getType("Query").getFields().user;
      // const data = await testAuth.resolve(
      // 	root,
      // 	{ id: root.user.id },
      // 	ctx,
      // 	info
      // );
      // console.log(data);

      return getConnection().transaction(transactionManager =>
        ctx.injector
          .get(Organizations)
          .getOrganizationHierarchies(transactionManager)
      );
    },
    organizationHierarchy: (_, { rootId }, { injector }) =>
      getConnection().transaction(transactionManager =>
        injector
          .get(Organizations)
          .getOrganizationHierarchy(transactionManager, rootId)
      ),
    organizationRoots: (_, __, { injector }) =>
      getConnection().transaction(transactionManager =>
        injector.get(Organizations).getOrganizationRoots(transactionManager)
      ),
    subOrganizations: (_, { parentId, type, status }, { injector }) =>
      getConnection().transaction(async transactionManager =>
        injector
          .get(Organizations)
          .subOrganizations(transactionManager, parentId, type, status)
      )
  },
  Organization: {
    children: async (parentOrg, args, { injector }) => {
      return getManager().transaction(async transactionManager => {
        const organization = await injector
          .get(Organizations)
          .getOrganization(transactionManager, parentOrg.id);
        if (organization.children && organization.children.length > 0) {
          const idArray = organization.children.map(org => org.id);
          const childrens = await injector
            .get(Organizations)
            .getOrganizations(transactionManager, idArray);
          return childrens;
        } else {
          return null;
        }
      });
    },
    store: async (parentOrg, args, { injector }) => {
      if (parentOrg) {
        return getManager().transaction(async transactionManager => {
          const stores = await injector
            .get(Organizations)
            .getOrganizationStores(transactionManager, parentOrg.id);
          return stores;
        });
      }
    }
  },
  Mutation: {
    createOrganization: async (
      _,
      { organizationInput, parentId, walkinProducts, adminUserInput },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        await isValidOrg(transactionalEntityManager, organizationInput);

        // Create Organization
        let newOrganization = await injector
          .get(Organizations)
          .createOrganization(
            transactionalEntityManager,
            organizationInput,
            parentId
          );
        if (parentId === undefined && adminUserInput === undefined) {
          throw new WalkinError(
            "Cannot create root organization without an admin user! Please use adminUserInput to add admin user"
          );
        }
        if (adminUserInput) {
          await isValidUser(transactionalEntityManager, adminUserInput);

          // Create User
          const adminUser = await injector
            .get(Users)
            .createUser(transactionalEntityManager, adminUserInput);
          if (!adminUser) {
            throw new WalkinError("Admin user couldn't be created");
          }
          newOrganization = await injector
            .get(Organizations)
            .addAdmin(transactionalEntityManager, newOrganization, adminUser);

          const userAutoConfirm = Number(process.env.WCORE_USER_AUTO_CONFIRM);
          adminUser.organization = newOrganization;
          // There is a bug in condition. It enters the if block if the check is false. Need to verify

          // meed to find a better way to handle verification
          //   if (!userAutoConfirm) {
          //     // Send email confirmation to user
          //     await injector
          //       .get(Users)
          //       .sendConfirmationEmailToUser(transactionalEntityManager, adminUser);
          //   }
        }

        if (walkinProducts) {
          await Initialize.initOrganization(
            injector,
            transactionalEntityManager,
            newOrganization,
            walkinProducts
          );
        }

        return injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, newOrganization.id);
      });
    },
    deleteOrganization: (_, args, { injector }) =>
      getConnection().transaction(transactionManager =>
        injector
          .get(Organizations)
          .deleteOrganization(transactionManager, args.id)
      ),
    updateOrganization: (_, { organization }, { injector }) =>
      getConnection().transaction(transactionManager =>
        injector
          .get(Organizations)
          .updateOrganization(transactionManager, organization)
      ),
    deleteOrganizationHierarchy: (_, { id }, { injector }) =>
      getConnection().transaction(transactionManager =>
        injector
          .get(Organizations)
          .deleteOrganizationHierarchy(transactionManager, id)
      ),
    linkUserToOrganization: (_, { organizationId, userId }, { injector }) =>
      getConnection().transaction(transactionManager =>
        injector
          .get(Organizations)
          .linkUserToOrganization(transactionManager, organizationId, userId)
      ),
    linkOrganizationToWalkinProducts: (
      _,
      {
        organizationId,
        walkinProducts
      }: MutationLinkOrganizationToWalkinProductsArgs,
      { injector }: ModuleContext
    ) => {
      return getConnection().transaction(async transactionManager =>
        injector
          .get(Organizations)
          .linkOrganizationToWalkinProducts(
            transactionManager,
            organizationId,
            walkinProducts
          )
      );
    },
    linkOrganizationToMetrics: (
      _,
      { organizationId, walkinProducts },
      { injector }
    ) =>
      getConnection().transaction(transactionManager =>
        injector
          .get(Organizations)
          .linkOrganizationToMetrics(
            transactionManager,
            organizationId,
            walkinProducts,
            injector
          )
      )
  }
};

export default resolvers;
