import { Injector } from "@graphql-modules/di";
import { EntityManager, getManager, TransactionManager } from "typeorm";
import { ApplicationProvider } from "../account/application/application.providers";
import { Organizations } from "../account/organization/organization.providers";
import { CampaignProvider } from "../../../../walkin-rewardx/src/modules/campaigns/campaign.providers";
import { STATUS, WORKFLOW_STATES } from "../common/constants/constants";
import { WalkinPlatformError } from "../common/exceptions/walkin-platform-error";
import { CustomerProvider } from "../customer/customer.providers";
import { SegmentProvider } from "../segment/segment.providers";
import { AudienceProvider } from "./audience.providers";
import { WCoreError } from "../common/exceptions";
import { WCORE_ERRORS } from "../common/constants/errors";
import { RuleProvider } from "../rule/providers";
import {
  combineExpressions,
  frameFinalQueries,
  executeQuery,
  getJWTPayload,
  removeDuplicates
} from "../common/utils/utils";

const resolvers = {
  Query: {
    audience: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(AudienceProvider)
          .getAudienceById(transactionalEntityManager, args.id);
      });
    },

    totalAudienceCountForCampaign: async (
      root,
      args,
      { injector }: { injector: Injector },
      info
    ) => {
      return getManager().transaction(async trasanctionalEntityManager => {
        /*
          Purpose: To fetch totalAudienceCountForCampaign
          Logic:
              1. Fetch audience for the campaign & filter segments
              2. Push all segments rules to rule Array
              3. Validate and verify the audienceFilterRule.
                  A.If rules Array is not empty
                    A.1: Fetch ruleConfiguration & run it against clickhouse
                    A.2: If the count is less than audienceCount, output the ruleCount
                    A.3: If the count is greater than or equal to audienceCount. output audienceCount
                  B.If rules Array is empty
                    A.1: Output zero

        */

        let segments;
        let rules = [];
        const ruleObj = [];
        let totalAudienceFilterRule: any;
        const result: any = {};

        const jwtPayload: any = await getJWTPayload(root.jwt);

        // Validate Campaign
        const campaign = await injector
          .get(CampaignProvider)
          .getCampaign(trasanctionalEntityManager, args.campaignId);

        if (
          campaign === undefined ||
          campaign.campaignStatus === STATUS.INACTIVE
        ) {
          throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_FOUND);
        }

        const organization = await injector
          .get(Organizations)
          .getOrganization(trasanctionalEntityManager, jwtPayload.org_id);

        // Get Segment IDs for an audience
        let audiences = await injector
          .get(AudienceProvider)
          .getAudiencesForCampaign(trasanctionalEntityManager, campaign.id);

        if (audiences === undefined || audiences.length === 0) {
          result.count = 0;
          return result;
        }

        if (audiences !== undefined && audiences.length > 0) {
          // Return audiences whose status is ACTIVE
          audiences = audiences.filter(audience => {
            if (audience.status === STATUS.ACTIVE) {
              return audience;
            }
          });
          segments = audiences.map(audience => {
            return audience.segment.id;
          });
        }
        // Get Rule from Campaign

        for (const segment of segments) {
          const seg = await injector
            .get(SegmentProvider)
            .getSegment(trasanctionalEntityManager, segment);
          if (seg === undefined || seg.status === STATUS.INACTIVE) {
            throw new WCoreError(WCORE_ERRORS.SEGMENT_NOT_FOUND);
          }
          rules.push(seg.rule.id);
        }
        // if (campaign.audienceFilterRule !== null) {
        //   rules.push(campaign.audienceFilterRule.id);
        // }

        // Filter and remove duplicate rules

        rules = removeDuplicates(rules);
        console.log(rules);

        for (const ruleId of rules) {
          const rule = await injector
            .get(RuleProvider)
            .rule(trasanctionalEntityManager, ruleId);
          // }

          if (rule === undefined || rule.status === STATUS.INACTIVE) {
            throw new WCoreError(WCORE_ERRORS.RULE_NOT_FOUND);
          }

          ruleObj.push(rule.ruleConfiguration);
        }

        const combinedQuery = await combineExpressions(ruleObj);

        if (combinedQuery.trim() !== "()") {
          const {
            finalTotalResultQuery,
            finalBaseQuery
          } = await frameFinalQueries(
            combinedQuery,
            organization.code,
            1,
            args.sort
          );
          totalAudienceFilterRule = await executeQuery(finalTotalResultQuery);
        }
        result.count =
          totalAudienceFilterRule !== undefined &&
          totalAudienceFilterRule.length > 0
            ? totalAudienceFilterRule[0].count
            : 0;

        return result;
      });
    },

    audienceCount: async (
      root,
      args,
      { injector }: { injector: Injector },
      info
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const organization = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, args.organizationId);

        if (
          organization === undefined ||
          organization.status === STATUS.INACTIVE
        ) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }
        const segments = args.segments ? args.segments : null;
        if (segments.length === 0) {
          throw new WCoreError(WCORE_ERRORS.INVALID_QUERY_PARAMS);
        }
        let rules: any = [];
        for (const segment of segments) {
          const seg = await injector
            .get(SegmentProvider)
            .getSegment(transactionalEntityManager, segment);
          if (seg === undefined || seg.status === STATUS.INACTIVE) {
            throw new WCoreError(WCORE_ERRORS.SEGMENT_NOT_FOUND);
          }
          rules.push(seg.rule.id);
        }

        // Filter and remove duplicate rules

        rules = removeDuplicates(rules);

        // Fetch unique rule Expression

        const ruleObjs = [];
        for (const rule of rules) {
          const ruleObj = await injector
            .get(RuleProvider)
            .rule(transactionalEntityManager, rule);
          if (ruleObj === undefined) {
            throw new WCoreError(WCORE_ERRORS.RULE_NOT_FOUND);
          }
          ruleObjs.push(ruleObj.ruleConfiguration);
        }

        if (ruleObjs.length === 0) {
          throw new WCoreError(WCORE_ERRORS.RULE_CONFIGURATION_NOT_FOUND);
        }

        const combinedQuery = await combineExpressions(ruleObjs);
        const {
          finalTotalResultQuery,
          finalBaseQuery
        } = await frameFinalQueries(
          combinedQuery,
          organization.code,
          1,
          args.sort
        );
        const totalData = await executeQuery(finalTotalResultQuery);

        return totalData !== undefined ? totalData[0] : 0;
      });
    },

    audiences: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        const organizationId =
          args.organization_id !== undefined ? args.organization_id : null;
        const applicationId =
          args.application_id !== undefined ? args.application_id : null;
        const campaignId =
          args.campaign_id !== undefined ? args.campaign_id : null;
        const segmentId =
          args.segment_id !== undefined ? args.segment_id : null;
        const actionDefinitionId =
          args.action_definition_id !== undefined
            ? args.action_definition_id
            : null;
        const status = args.status !== undefined ? args.status : null;
        return injector
          .get(AudienceProvider)
          .getAllAudience(
            transactionalEntityManager,
            organizationId,
            applicationId,
            campaignId,
            segmentId,
            status
          );
      });
    },
    campaignControls: (_, args, { injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        const organization_id =
          args.organization_id !== undefined ? args.organization_id : null;
        const campaign_id =
          args.campaign_id !== undefined ? args.campaign_id : null;
        const customer_id =
          args.customer_id !== undefined ? args.customer_id : null;

        return injector
          .get(AudienceProvider)
          .getCampaignControls(
            transactionalEntityManager,
            organization_id,
            campaign_id,
            customer_id
          );
      });
    },
    globalControls: (_, args, { injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        const organization_id =
          args.organization_id !== undefined ? args.organization_id : null;
        const customer_id =
          args.customer_id !== undefined ? args.customer_id : null;

        return injector
          .get(AudienceProvider)
          .getGlobalControls(
            transactionalEntityManager,
            organization_id,
            customer_id
          );
      });
    },
    audienceMembers: (_, args, { injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        const audience_id =
          args.audience_id !== undefined ? args.audience_id : null;
        const customer_id =
          args.customer_id !== undefined ? args.customer_id : null;

        return injector
          .get(AudienceProvider)
          .getAudienceMembers(
            transactionalEntityManager,
            audience_id,
            customer_id
          );
      });
    }
  },
  Mutation: {
    createAudience: async (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const status =
          input.status !== undefined ? input.status : STATUS.ACTIVE;

        console.log(
          "******************* inside createAudience ****************************\n"
        );

        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, input.organization_id);
        if (org !== undefined && org.status === STATUS.ACTIVE) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "ORGANIZATION_INVALID",
            "Not a valid Organziation",
            input.organization_id,
            400,
            "Invalid organization_id or organization is inactive."
          );
        }
        let app;
        if (input.application_id) {
          app = await injector
            .get(ApplicationProvider)
            .getApplicationById(
              transactionalEntityManager,
              input.application_id
            );
          if (app !== undefined) {
            // pass
          } else {
            throw new WalkinPlatformError(
              "APPLICATION_INVALID",
              "Not a valid Application",
              input.application_id,
              400,
              "Invalid application_id or application is inactive."
            );
          }
        }

        const campaign = await injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, input.campaign_id);
        if (
          campaign !== undefined &&
          // campaign.status === STATUS.ACTIVE &&
          campaign.campaignStatus !== WORKFLOW_STATES.ABANDONED
        ) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "CAMPAIGN_INVALID",
            "Not a valid Campaign",
            input.campaign_id,
            400,
            "Invalid campaign_id or Campaign is inactive."
          );
        }

        for (const segmentId of input.segment_id) {
          const segment = await injector
            .get(SegmentProvider)
            .getSegment(transactionalEntityManager, segmentId);
          if (segment !== undefined && segment.status === STATUS.ACTIVE) {
            // pass
          } else {
            throw new WalkinPlatformError(
              "SEGMENT_INVALID",
              "Not a valid Segment",
              input.segment_id,
              400,
              "Invalid segment_id or Segment is inactive."
            );
          }
        }
        // console.log(injector.get(AudienceProvider).createAudience);
        return injector
          .get(AudienceProvider)
          .createAudience(
            transactionalEntityManager,
            org,
            app,
            campaign,
            input.segment_id,
            status
          );
      });
    },

    createAudienceForCampaign: async (_, args, { injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        // const input = args.input;
        return injector
          .get(AudienceProvider)
          .createAudienceForCampaign(
            transactionalEntityManager,
            args.campaignId,
            args.segments
          );
      });
    },

    updateAudience: async (_, args, { injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        const input = args.input;
        const status = input.status !== undefined ? input.status : null;
        console.log(
          "******************* inside updateAudience ****************************\n"
        );
        return injector
          .get(AudienceProvider)
          .updateAudience(
            transactionalEntityManager,
            input.id,
            null,
            null,
            status
          );
      });
    },

    createCampaignControl: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const status = STATUS.ACTIVE;

        console.log(
          "******************* inside createCampaignControl ****************************\n"
        );

        const startTime = new Date(input.startTime);
        const endTime = new Date(input.endTime);
        const d: Date = new Date();
        if (d > startTime) {
          throw new WalkinPlatformError(
            "START_TIME_SHOULD_BE_LATER_THAN_NOW",
            "Start time should be greater than today.",
            startTime,
            400,
            "Start time should be greater than today"
          );
        }
        if (startTime > endTime) {
          throw new WalkinPlatformError(
            "END_TIME_SHOULD_BE_LATER_THAN_START_TIME",
            "End time should be greater than start time.",
            startTime,
            400,
            "End time should be greater than start time."
          );
        }

        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, input.organization_id);
        if (org !== undefined && org.status == STATUS.ACTIVE) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "ORGANIZATION_INVALID",
            "Not a valid Organziation",
            input.organization_id,
            400,
            "Invalid organization_id or organization is inactive."
          );
        }

        const campaign = await injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, input.campaign_id);
        if (
          campaign !== undefined &&
          campaign.campaignStatus == STATUS.ACTIVE
        ) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "CAMPAIGN_INVALID",
            "Not a valid Campaign",
            input.campaign_id,
            400,
            "Invalid campaign_id or Campaign is inactive."
          );
        }

        const customer = await injector
          .get(CustomerProvider)
          .getCustomer(transactionalEntityManager, input.customer_id);
        if (customer !== undefined && customer.status == STATUS.ACTIVE) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "CUSTOMER_INVALID",
            "Not a valid Customer",
            input.segment_id,
            400,
            "Invalid customer_id or Customer is inactive."
          );
        }

        return injector
          .get(AudienceProvider)
          .createCampaingControl(
            transactionalEntityManager,
            org,
            campaign,
            customer,
            startTime,
            endTime,
            status
          );
      });
    },

    updateCampaignControl: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const status = input.status !== undefined ? input.status : null;
        const endTime = input.endTime !== undefined ? input.endTime : null;

        console.log(
          "******************* inside updateCampaignControl ****************************\n"
        );
        return injector
          .get(AudienceProvider)
          .updateCampaignControl(
            transactionalEntityManager,
            input.id,
            endTime,
            status
          );
      });
    },

    createGlobalControl: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const status = STATUS.ACTIVE;

        console.log(
          "******************* inside createGlobalControl ****************************\n"
        );

        const startTime = new Date(input.startTime);
        const endTime = new Date(input.endTime);
        const d: Date = new Date();
        if (d > startTime) {
          throw new WalkinPlatformError(
            "START_TIME_SHOULD_BE_LATER_THAN_NOW",
            "Start time should be greater than today.",
            startTime,
            400,
            "Start time should be greater than today"
          );
        }
        if (startTime > endTime) {
          throw new WalkinPlatformError(
            "END_TIME_SHOULD_BE_LATER_THAN_START_TIME",
            "End time should be greater than start time.",
            startTime,
            400,
            "End time should be greater than start time."
          );
        }

        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, input.organization_id);
        if (org !== undefined && org.status == STATUS.ACTIVE) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "ORGANIZATION_INVALID",
            "Not a valid Organziation",
            input.organization_id,
            400,
            "Invalid organization_id or organization is inactive."
          );
        }

        const customer = await injector
          .get(CustomerProvider)
          .getCustomer(transactionalEntityManager, input.customer_id);
        if (customer !== undefined && customer.status == STATUS.ACTIVE) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "CUSTOMER_INVALID",
            "Not a valid Customer",
            input.segment_id,
            400,
            "Invalid customer_id or Customer is inactive."
          );
        }

        return injector
          .get(AudienceProvider)
          .createGlobalControl(
            transactionalEntityManager,
            org,
            customer,
            startTime,
            endTime,
            status
          );
      });
    },

    deactivateGlobalControl: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const status = STATUS.INACTIVE;
        return injector
          .get(AudienceProvider)
          .updateGlobalControl(
            transactionalEntityManager,
            args.id,
            null,
            status
          );
      });
    },
    createAudienceMember: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const audience_id =
          input.audience_id !== undefined ? input.audience_id : null;
        const customer_id =
          input.customer_id !== undefined ? input.customer_id : null;
        const status = input.status !== undefined ? input.status : null;

        const customer = await injector
          .get(CustomerProvider)
          .getCustomer(transactionalEntityManager, customer_id);
        if (customer !== undefined && customer.status === STATUS.ACTIVE) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "CUSTOMER_INVALID",
            "Not a valid Customer",
            input.customer_id,
            400,
            "Invalid customer_id or Customer is inactive."
          );
        }

        const audience = await injector
          .get(AudienceProvider)
          .getAudienceById(transactionalEntityManager, audience_id);
        if (audience !== undefined && audience.status === STATUS.ACTIVE) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "CUSTOMER_INVALID",
            "Not a valid Customer",
            input.audience_id,
            400,
            "Invalid customer_id or Customer is inactive."
          );
        }

        console.log(
          "******************* inside createAudienceMember ****************************\n"
        );
        return injector
          .get(AudienceProvider)
          .createAudienceMember(
            transactionalEntityManager,
            audience,
            customer,
            status
          );
      });
    },
    updateAudienceMember: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const status = input.status !== undefined ? input.status : null;
        console.log(
          "******************* inside updateAudienceMember ****************************\n"
        );
        return injector
          .get(AudienceProvider)
          .updateAudienceMember(transactionalEntityManager, input.id, status);
      });
    }
  }
};

export default resolvers;
