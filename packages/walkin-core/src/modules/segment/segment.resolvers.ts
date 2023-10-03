import { Injector } from "@graphql-modules/di";
import { getManager } from "typeorm";
import { ApplicationProvider } from "../account/application/application.providers";
import { Organizations } from "../account/organization/organization.providers";
import {
  STATUS,
  RULE_TYPE,
  EXPRESSION_TYPE,
  SEGMENT_TYPE
} from "../common/constants/constants";
import { WalkinPlatformError } from "../common/exceptions/walkin-platform-error";
import { RuleProvider } from "../rule/providers/rule.provider";
import { SegmentProvider } from "./segment.providers";
import { AudienceProvider } from "../audience/audience.providers";
import { WCORE_ERRORS } from "../common/constants/errors";
import { WCoreError } from "../common/exceptions";
import { CampaignProvider } from "../../../../walkin-rewardx/src/modules/campaigns/campaign.providers";
import { WORKFLOW_STATES } from "../common/constants";

export const resolvers = {
  Query: {
    segment: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(SegmentProvider)
          .getSegment(transactionalEntityManager, args.id);
      });
    },
    segments: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        const organizationId =
          args.organization_id !== undefined ? args.organization_id : null;
        const applicationId =
          args.application_id !== undefined ? args.application_id : null;
        const segmentType =
          args.segmentType !== undefined ? args.segmentType : null;
        const name = args.name !== undefined ? args.name : null;
        const status = args.status !== undefined ? args.status : null;
        return injector
          .get(SegmentProvider)
          .getSegments(
            transactionalEntityManager,
            organizationId,
            applicationId,
            name,
            segmentType,
            status
          );
      });
    }
  },
  Mutation: {
    createSegmentForCustomers: async (
      { user },
      args,
      { injector }: { injector: Injector }
    ) => {
      let customerPhoneNumbers = args.customerPhoneNumbers;
      let segmentName = args.segmentName;
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(SegmentProvider)
          .createSegmentWithCustomerPhonenumbers(
            injector,
            transactionalEntityManager,
            user,
            customerPhoneNumbers,
            segmentName
          );
      });
    },
    createSegment: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        const input = args.input;
        const status = STATUS.ACTIVE;
        console.log(input);
        console.log(
          "******************* inside createSegment ****************************\n"
        );
        return injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, input.organization_id)
          .then(org => {
            console.log(
              "******************* GOT ORGANIZATION ****************************\n"
            );
            console.log(org);
            if (org !== undefined && org.status === STATUS.ACTIVE) {
              console.log(
                "******************* TRYING APPLICATION ****************************\n"
              );
              console.log(input.application_id);
              console.log(injector.get(ApplicationProvider));
              console.log(
                "******************* TRYING APPLICATION NOW ****************************\n"
              );
              return injector
                .get(ApplicationProvider)
                .getApplicationById(
                  transactionalEntityManager,
                  input.application_id
                )
                .then(app => {
                  console.log(
                    "******************* GOT APPLICATION ****************************\n"
                  );
                  if (app !== undefined) {
                    console.log(app);
                    console.log(injector.get(RuleProvider));
                    console.log(
                      "******************* Calling Rule ****************************\n"
                    );
                    return injector
                      .get(RuleProvider)
                      .rule(transactionalEntityManager, input.rule_id)
                      .then(rule => {
                        console.log(
                          "******************* GOT Rule ****************************\n"
                        );
                        console.log(rule);
                        if (
                          rule !== undefined &&
                          rule.status === STATUS.ACTIVE
                        ) {
                          return injector
                            .get(SegmentProvider)
                            .createSegment(
                              transactionalEntityManager,
                              input.name,
                              input.description,
                              input.segmentType,
                              org,
                              app,
                              rule.id,
                              status
                            );
                        } else {
                          console.log("Sorry rule_id is wrong");
                          throw new WalkinPlatformError(
                            "RULE_INVALID",
                            "Not a valid Rule",
                            input.rule_id,
                            400,
                            "Invalid rule_id or Rule is inactive."
                          );
                        }
                      });
                  } else {
                    console.log("Sorry application_id is wrong");
                    throw new WalkinPlatformError(
                      "APPLICATION_INVALID",
                      "Not a valid Application",
                      input.application_id,
                      400,
                      "Invalid application_id or application is inactive."
                    );
                  }
                });
            } else {
              console.log("Sorry organization_id is wrong");
              throw new WalkinPlatformError(
                "ORGANIZATION_INVALID",
                "Not a valid Organziation",
                input.organization_id,
                400,
                "Invalid organization_id or organization is inactive."
              );
            }
          });
      });
    },
    updateSegment: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const id = input.id !== undefined ? input.id : null;
        const description =
          input.description !== undefined ? input.description : null;
        const segmentType =
          input.segmentType !== undefined ? input.segmentType : null;
        const name = input.name !== undefined ? input.name : null;
        const status = input.status !== undefined ? input.status : null;
        const ruleId = input.rule_id !== undefined ? input.rule_id : null;
        let campaignId;

        /*
          Purpose: To update segment, check if campaign is not live
          Logistics:
            1. Check if the segment is part of any live campaign
            2. If not live, proceed with update, else throw error
        */

        const segment = await injector
          .get(SegmentProvider)
          .getSegment(transactionalEntityManager, input.id);

        if (segment === undefined || segment.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.SEGMENT_NOT_FOUND);
        }

        const audience = await injector
          .get(AudienceProvider)
          .getAudienceBySegment(transactionalEntityManager, segment.id);

        if (audience) {
          campaignId = audience.campaign.id;
        }

        const campaign = await injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, campaignId);

        if (
          campaign !== undefined &&
          campaign.campaignStatus === WORKFLOW_STATES.LIVE
        ) {
          throw new WCoreError(WCORE_ERRORS.LIVE_CAMPAIGN_CANNOT_BE_UPDATED);
        }

        if (ruleId == null) {
          console.log("NO rule_id");
          return injector
            .get(SegmentProvider)
            .updateSegment(
              transactionalEntityManager,
              id,
              name,
              description,
              segmentType,
              null,
              status
            );
        } else {
          return injector
            .get(RuleProvider)
            .rule(transactionalEntityManager, input.rule_id)
            .then(rule => {
              console.log(
                "******************* GOT RuleConfigurations ****************************\n"
              );
              console.log(rule);
              if (rule !== undefined && rule.status === STATUS.ACTIVE) {
                return injector
                  .get(SegmentProvider)
                  .updateSegment(
                    transactionalEntityManager,
                    id,
                    name,
                    description,
                    segmentType,
                    rule.id,
                    status
                  );
              } else {
                console.log("Sorry rule_id is wrong");
                throw new WalkinPlatformError(
                  "RULE_INVALID",
                  "Not a valid Rule",
                  input.rule_id,
                  400,
                  "Invalid rule_id or Rule is inactive."
                );
              }
            });
        }
      });
    },
    disableSegment: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args;
        const id = input.id !== undefined ? input.id : null;
        const status = STATUS.INACTIVE;
        let campaignId;

        /*
         Purpose: To disable segment, check if campaign is not live
         Logistics:
           1. Check if the segment is part of any live campaign
           2. If not live, proceed with update, else throw error
       */

        const segment = await injector
          .get(SegmentProvider)
          .getSegment(transactionalEntityManager, input.id);

        if (segment === undefined || segment.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.SEGMENT_NOT_FOUND);
        }

        const audience = await injector
          .get(AudienceProvider)
          .getAudienceBySegment(transactionalEntityManager, segment.id);

        if (audience) {
          campaignId = audience.campaign.id;
        }

        const campaign = await injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, campaignId);

        if (
          campaign !== undefined &&
          campaign.campaignStatus === WORKFLOW_STATES.LIVE
        ) {
          throw new WCoreError(WCORE_ERRORS.LIVE_CAMPAIGN_CANNOT_BE_UPDATED);
        }

        return injector
          .get(SegmentProvider)
          .updateSegment(
            transactionalEntityManager,
            id,
            null,
            null,
            null,
            null,
            status
          );
      });
    }
  }
};

export default resolvers;
