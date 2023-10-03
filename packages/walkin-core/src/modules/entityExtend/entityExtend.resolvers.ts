import { Injector } from "@graphql-modules/di";
import { getConnection, TransactionManager } from "typeorm";
import { EntityExtendProvider } from "./entityExtend.providers";
import {
  VALUE_TYPE,
  STATUS,
  EXTEND_ENTITIES,
  ENTITY_SEARCH_SYNC_TYPE,
} from "../common/constants/constants";
import { WCoreError } from "../common/exceptions/index";
import { WCORE_ERRORS } from "../common/constants/errors";
import { RuleEntityProvider } from "../rule/providers/rule-entity.provider";
import { RuleAttributeProvider } from "../rule/providers/rule-attribute.provider";
import { startEntityClickhouseSyncJob } from "../common/utils/digdagJobsUtil";
import {
  authorizedToWorkOnOrganization,
  getAllEntityNames,
  getEntityByEntityName,
  isUserOrAppAuthorizedToWorkOnOrganization,
  setOrganizationToInput,
} from "../common/utils/utils";

export default {
  Query: {
    entities: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionManager) => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(EntityExtendProvider)
          .getEntities(transactionManager, organizationId);
      });
    },
    entityExtend: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionManager) => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(EntityExtendProvider)
          .getEntityExtend(transactionManager, args.id, organizationId);
      });
    },

    entityExtendByName: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionManager) => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(EntityExtendProvider)
          .getEntityExtendByName(
            transactionManager,
            args.entityName,
            organizationId
          );
      });
    },
    entityExtendField: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionManager) => {
        //TODO: THis doesnt make sense, root and jwtPayload has the same org
        // const jwtPayload: any = getJWTPayload(root.jwt);
        // await authorizedToWorkOnOrganization(root, jwtPayload.org_id);
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        const entityExtendField: any = await injector
          .get(EntityExtendProvider)
          .getEntityExtendField(transactionManager, args.id);

        if (!entityExtendField) {
          throw new WCoreError(WCORE_ERRORS.ENTITY_NOT_FOUND);
        }
        const entityExtendId = entityExtendField.entityExtend.id;

        const entityExtend = await injector
          .get(EntityExtendProvider)
          .getEntityExtend(transactionManager, entityExtendId, organizationId);

        if (!entityExtend) {
          throw new WCoreError(WCORE_ERRORS.ENTITY_NOT_FOUND);
        }
        return entityExtendField;
      });
    },

    basicFields: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionManager) => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );

        // Get all basic fields of an entity

        // const entityExtend: any = await injector
        //   .get(EntityExtendProvider)
        //   .getEntityExtend(transactionManager, args.entityExtendId, jwtPayload.org_id);

        const entityName = await getEntityByEntityName(args.entityName);

        const fields: any = await injector
          .get(EntityExtendProvider)
          .getBasicFields(transactionManager, entityName);
        return fields;
      });
    },
  },
  EntityExtend: {
    fields: (ee, _, { injector }: { injector: Injector }) => {
      return getConnection().transaction((transactionManager) => {
        return injector
          .get(EntityExtendProvider)
          .getEntityExtendFields(transactionManager, ee.id);
      });
    },
  },
  Mutation: {
    addEntityExtend: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionManager) => {
        const input = args.input;

        const organizationId = input.organization_id;
        const entityName = input.entity_name;
        const description = input.description;

        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          organizationId
        );

        return injector
          .get(EntityExtendProvider)
          .createEntityExtend(
            transactionManager,
            organizationId,
            entityName,
            description
          );
      });
    },

    addEntityExtendField: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionManager) => {
        const input = args.input;

        const slug = "extend_" + input.slug;
        const enityExtendField = await injector
          .get(EntityExtendProvider)
          .createEntityExtendField(
            transactionManager,
            input.entityExtendId,
            slug,
            input.label,
            input.help,
            input.type,
            input.required,
            input.choices,
            input.defaultValue,
            input.validator,
            input.description,
            input.searchable
          );
        if (enityExtendField === undefined) {
          throw new WCoreError(WCORE_ERRORS.ENTITY_NOT_FOUND);
        }
        let { organizationId } = setOrganizationToInput({}, user, application);
        const entityExtend = await injector
          .get(EntityExtendProvider)
          .getEntityExtend(
            transactionManager,
            input.entityExtendId,
            organizationId
          );
        if (entityExtend === undefined) {
          throw new WCoreError(WCORE_ERRORS.ENTITY_NOT_FOUND);
        }
        if (entityExtend.entityName === EXTEND_ENTITIES.customer) {
          // const ruleAttributeEntityNames = await getAllEntityNames();
          const entityNames = await getAllEntityNames();
          const ruleAttributeEntityNames = entityNames
            .map((entityName) => {
              if (
                EXTEND_ENTITIES.customer === entityName ||
                EXTEND_ENTITIES.customerSearch === entityName
              ) {
                return entityName;
              }
            })
            .filter((entityName) => {
              return entityName !== undefined;
            });
          console.log(ruleAttributeEntityNames);
          for (const ruleAttributeEntityName of ruleAttributeEntityNames) {
            const ruleEntity = await injector
              .get(RuleEntityProvider)
              .ruleEntities(transactionManager, {
                entityName: ruleAttributeEntityName,
                organizationId,
              });
            if (ruleEntity.length === 0) {
              throw new WCoreError(WCORE_ERRORS.RULE_ENTITY_NOT_FOUND);
            }
            organizationId = ruleEntity[0].organization.id;
            const ruleAttributeDetails: any = {
              organizationId: ruleEntity[0].organization.id,
              ruleEntityId: ruleEntity[0].id,
              attributeName: input.label,
              attributeValueType: input.type,
              status: STATUS.ACTIVE,
            };
            const ruleAttribute = await injector
              .get(RuleAttributeProvider)
              .createRuleAttribute(transactionManager, ruleAttributeDetails);

            if (ruleAttribute === undefined) {
              throw new WCoreError(
                WCORE_ERRORS.FAILED_TO_CREATE_RULE_ATTRIBUTE_FOR_THE_ENTITY
              );
            }
            // TODO: We will have to do this to generic entity but for now we can do only for customer
            try {
              await startEntityClickhouseSyncJob(
                organizationId,
                EXTEND_ENTITIES.customer,
                ENTITY_SEARCH_SYNC_TYPE.FULL
              );
            } catch (error) {
              // TODO; Pager needs to be sent
              console.log(
                "Error while calling digdag startEntityClickhouseSyncJob"
              );
              console.log(error);
            }
          }
        }
        return enityExtendField;
      });
    },
  },
};
