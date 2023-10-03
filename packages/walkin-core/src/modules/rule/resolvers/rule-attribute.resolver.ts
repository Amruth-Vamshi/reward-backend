import { Injector } from "@graphql-modules/di";
import { getConnection, getManager } from "typeorm";
import { RuleAttributeProvider } from "../providers";
import { RuleEntityProvider } from "../providers/rule-entity.provider";
import { WCoreError } from "../../common/exceptions/index";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { setOrganizationToInput } from "../../common/utils/utils";

export const ruleAttributeResolvers = {
  Query: {
    ruleAttributes: async (
      {user, application},
      { input ={} }:any,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        setOrganizationToInput(input, user, application);
      
        let ruleEntityId;
        if (input.entityName) {
          console.log("SEarches for entityName");
          ruleEntityId = await injector
            .get(RuleEntityProvider)
            .ruleEntities(transactionalEntityManager, {
              entityName: input.entityName,
              organizationId: input.organizationId
            });
          if (ruleEntityId.length === 0) {
            throw new WCoreError(WCORE_ERRORS.RULE_NOT_FOUND);
          }
          console.log(ruleEntityId);
          ruleEntityId = ruleEntityId[0];
          input.ruleEntity = ruleEntityId;
        }
        input.organization = input.organizationId;
        const products = await injector
          .get(RuleAttributeProvider)
          .ruleAttributes(transactionalEntityManager, input);
        return products;
      });
    },
    ruleAttribute: async ( {user, application}, { id }, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {

        const { organizationId } = setOrganizationToInput({}, user, application); 

        const products = await injector
          .get(RuleAttributeProvider)
          .ruleAttribute(transactionalEntityManager, {id, organizationId} );
        return products;
      });
    }
  },
  Mutation: {
    createRuleAttribute: async (
      {user, application},
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        
        input = setOrganizationToInput(input, user, application); 
    
        const product = await injector
          .get(RuleAttributeProvider)
          .createRuleAttribute(transactionalEntityManager, input);
        return product;
      });
    },
    disableRuleAttribute: async (
      {user, application},
      { id },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        const { organizationId } = setOrganizationToInput({}, user, application); 

        const product = await injector
          .get(RuleAttributeProvider)
          .disableRuleAttribute(transactionalEntityManager, {id, organizationId});
        return product;
      });
    }
  }
};
