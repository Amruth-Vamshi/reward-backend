import {
  ModuleContext
} from "@graphql-modules/core";
import { getManager } from "typeorm";
import { LoyaltyTransactionProvider } from "../loyalty-transaction/loyalty-transaction.provider";
import { LoyaltyLedgerProvider } from "../loyalty-ledger/loyalty-ledger.providers";
import { ActionUtils } from "../common/utils/ActionUtils";
import { JSON_SCHEMA, LOYALTY_ACTION_TYPE } from "../common/constants/constant";
import { startLoyaltyTransactionJob } from "@walkinserver/walkin-core/src/modules/common/utils/digdagJobsUtil";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { LoyaltyTransactionRepository } from "./loyalty-transaction.repository";
import Ajv from "ajv";
import { REWARDX_SCHEMA } from "../common/schema/loyalty-transaction-apis.schema";
const ajv = new Ajv()

export const resolvers = {
  Query: {
    earnableBurnablePoints: (
      { application, user },
      earnableBurnableInputArgs,
      { injector }: ModuleContext
    ) => {
      earnableBurnableInputArgs["organizationId"] = application?application.organization.id:user?user.organization.id:null;
      const validate = ajv.compile(REWARDX_SCHEMA[JSON_SCHEMA.EARNABLE_BURNABLE_POINTS])
      const valid = validate(earnableBurnableInputArgs)
      if (!valid){
        throw new WCoreError({
          HTTP_CODE:400,
          MESSAGE: validate.errors.map(e=>e.message).join(","),
          CODE:"VE"
        })
      }
      return getManager().transaction(async manager => {
        let result = await injector
          .get(LoyaltyTransactionProvider)
          .earnableBurnablePoints(manager, injector, earnableBurnableInputArgs);
        return result;
      });
    },
    loyaltyTransaction: (
      { application, user },
      {
        externalCustomerId,
        cardCode,
        organizationId,
        pageOptions,
        sortOptions
      },
      { injector }: ModuleContext
    ) => {
      let organization = null;
      if (
        !organizationId ||
        organizationId === null ||
        organizationId == undefined
      ) {
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        organization = organizationId;
      }
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyTransactionProvider)
          .getPageWiseLoyaltyTransaction(
            manager,
            pageOptions,
            sortOptions,
            injector,
            externalCustomerId,
            cardCode,
            organizationId
          );
      });
    },
    getCommunicationQuery: (
      _,
      { loyaltyProgramId, campaignID, transactionType, customerData },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyTransactionRepository)
          .sendCommunication(
            manager,
            injector,
            loyaltyProgramId,
            campaignID,
            transactionType,
            customerData,
            { points: "100" },
            null
          );
      });
    },
    loyaltyTransactionStatus: (
      { application, user },
      { loyaltyReferenceId },
      { injector }
    ) => {
      let organizationId:string;
      if(user){
        organizationId = user.organizaiton.id;
      } else if(application){
        organizationId = application.organizaiton.id;
      }
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(LoyaltyTransactionProvider)
          .getLoyaltyTransactionStatus(
            transactionalEntityManager,
            injector,
            loyaltyReferenceId,
            organizationId
          );
      });
    }
  },
  LoyaltyTransaction: {
    loyaltyLedgers: (loayltyTransaction, args, { injector }: ModuleContext) => {
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyLedgerProvider)
          .getLoayltyLedgersByLoyaltyTransactionId(
            manager,
            loayltyTransaction.id
          );
      });
    },
    customerLoyalty: (
      loyaltyTransaction,
      args,
      { injector }: ModuleContext
    ) => {
      return loyaltyTransaction.customerLoyalty;
    },
    loyaltyProgram: (loyaltyTransaction, args, { injector }: ModuleContext) => {
      return loyaltyTransaction.loyaltyProgram;
    }
  },
  Mutation: {
    issuePoints: (
      { application, user },
      { input },
      { injector }: ModuleContext
    ) => {
      if (!(input && input.organizationId)) {
        let organizationId = null;
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        input["organizationId"] = organizationId;
      }
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyTransactionProvider)
          .issuePoints(manager, injector, input);
      });
    },
    burnPoints: (
      { application, user },
      { input },
      { injector }: ModuleContext
    ) => {
      if (!(input && input.organizationId)) {
        let organizationId = null;
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        input["organizationId"] = organizationId;
      }
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyTransactionProvider)
          .burnPoints(manager, injector, input);
      });
    },
    expireCustomerLoyaltyPoints: async (
      { application, user },
      args,
      { injector }: ModuleContext
    ) => {
      let organizationId = null;
      if (application) {
        organizationId = application.organization.id;
      } else if (user) {
        organizationId = user.organization.id;
      }
      let result = await getManager().transaction(manager => {
        return injector.get(LoyaltyTransactionProvider).expirePointsUpdated(manager,injector,organizationId);
      });
      return result;
    },
    blockPoints: (
      { application, user },
      { input },
      { injector }: ModuleContext
    ) => {
      if (!(input && input.organizationId)) {
        let organizationId = null;
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        input["organizationId"] = organizationId;
      }
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyTransactionProvider)
          .blockPoints(manager, injector, input);
      });
    },
    applyBlock: (_, { loyaltyReferenceId }, { injector }: ModuleContext) => {
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyTransactionProvider)
          .applyBlock(manager, injector, loyaltyReferenceId);
      });
    },
    loyaltyTransactionCompleted: (
      {user, application},
      { loyaltyReferenceId },
      { injector }: ModuleContext
    ) => {
      let organizationId:string;
      if(user){
        organizationId = user.organizaiton.id;
      } else if(application){
        organizationId = application.organizaiton.id;
      }
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyTransactionProvider)
          .loyaltyTransactionCompleted(manager, injector, loyaltyReferenceId, organizationId);
      });
    },
    cancelLoyaltyTransaction: (
      { application, user },
      input,
      { injector }: ModuleContext
    ) => {
      if (!(input && input.organizationId)) {
        let organizationId = null;
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        input["organizationId"] = organizationId;
      }
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyTransactionProvider)
          .cancelLoyaltyTransaction(manager, injector, input);
      });
    },
    createLoyaltyTransactionStatusCodes: (
      _,
      { StatusInput },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyTransactionProvider)
          .createLoyaltyTransactionStatusCodes(manager, injector, StatusInput);
      });
    },

    processLoyaltyIssuance: (
      { application, user },
      processLoyaltyIssuranceInput,
      { injector }
    ) => {
      processLoyaltyIssuranceInput["organizationId"] = application?application.organization.id:user?user.organization.id:null;
      const validate = ajv.compile(REWARDX_SCHEMA[JSON_SCHEMA.EARNABLE_BURNABLE_POINTS])
      const valid = validate(processLoyaltyIssuranceInput)
      if (!valid){
        throw new WCoreError({
          HTTP_CODE:400,
          MESSAGE: validate.errors.map(e=>e.message).join(","),
          CODE:"VE"
        })
      }
      return getManager().transaction(async transactionalEntityManager => {
        processLoyaltyIssuranceInput["createCustomerIfNotExist"] = true;
          processLoyaltyIssuranceInput["statusCode"] = 102;
          return injector
            .get(LoyaltyTransactionProvider)
            .issuePoints(transactionalEntityManager, injector, processLoyaltyIssuranceInput);
      });
    },
    processLoyaltyRedemption: (
      { application, user },
      processLoyaltyRedemptionInput,
      { injector }
    ) => {
      processLoyaltyRedemptionInput["organizationId"] = application?application.organization.id:user?user.organization.id:null;
      const validate = ajv.compile(REWARDX_SCHEMA[JSON_SCHEMA.PROCESS_LOYALTY_REDMPTION])
      const valid = validate(processLoyaltyRedemptionInput)
      if (!valid){
        throw new WCoreError({
          HTTP_CODE:400,
          MESSAGE: validate.errors.map(e=>e.message).join(","),
          CODE:"VE"
        })
      }
      return getManager().transaction(async transactionalEntityManager => {
        processLoyaltyRedemptionInput["statusCode"] = 101;
          return injector
            .get(LoyaltyTransactionProvider)
            .burnPoints(transactionalEntityManager, injector, processLoyaltyRedemptionInput);
      });
    },
    createOrUpdateLoyaltyTransaction: (
      { application, user },
      processLoyaltyInput,
      { injector }
    ) => {
      let organizationId = null;
      if (!(processLoyaltyInput && processLoyaltyInput.organizationId)) {
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        processLoyaltyInput["organizationId"] = organizationId;
      }
      const validate = ajv.compile(REWARDX_SCHEMA[JSON_SCHEMA.CREATE_OR_UPDATE_LOYALTY_TRANSACTION])
      const valid = validate(processLoyaltyInput)
      if (!valid) {
        throw new WCoreError({
          HTTP_CODE: 400,
          MESSAGE: validate.errors.map(e => e.message).join(","),
          CODE: "VE"
        })
      }
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(LoyaltyTransactionProvider)
          .createOrUpdateLoyaltyTransaction(
            transactionalEntityManager,
            injector,
            processLoyaltyInput
          );
      });
    },
    processLoyaltyTransaction: async (
      { application, user, jwt },
      loyaltyTransactionInput,
      { injector }: ModuleContext
    ) => {
      let organizationId = null;
      if (application) {
        organizationId = application.organization.id;
      } else if (user) {
        organizationId = user.organization.id;
      }
      return getManager().transaction(async manager => {
        try {
          let result = await startLoyaltyTransactionJob(
            organizationId,
            jwt,
            loyaltyTransactionInput
          );
          return injector.get(LoyaltyTransactionProvider).statusReducer(result);
        } catch (error) {
          console.log("Error while calling digdag startLoyaltyTransactionJob");
          console.log(error);
        }
      });
    },
    issuePointsWithOrderId: (
      { application, user },
      { loyaltyReferenceId },
      { injector }
    ) => {
      let organizationId = null;
      if (application) {
        organizationId = application.organization.id;
      } else if (user) {
        organizationId = user.organization.id;
      }
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(LoyaltyTransactionProvider)
          .issuePointsWithOrderId(
            transactionalEntityManager,
            injector,
            loyaltyReferenceId,
            organizationId
          );
      });
    },
    initiateLoyaltyTransaction: (
      { application, user },
      loyaltyTransactionInput,
      { injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(LoyaltyTransactionProvider)
          .initiateLoyaltyTransaction(
            transactionalEntityManager,
            injector,
            loyaltyTransactionInput
          );
      });
    }
  }
};
