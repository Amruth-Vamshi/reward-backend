import { Injectable } from "@graphql-modules/di";
import { EntityManager, getManager, Transaction } from "typeorm";
import {
  Application,
  Customer,
  EntityExtend,
  Organization,
  Segment,
  Audience,
  AudienceMember,
  CampaignControl,
  GlobalControl
} from "../../entity";
import { WalkinPlatformError } from "../common/exceptions/walkin-platform-error";
import { WCORE_ERRORS } from "../common/constants/errors";
import { WCoreError } from "../common/exceptions/index";
import { STATUS } from "../../../../walkin-core/src/modules/common/constants/constants";
import { Campaign } from "../../../../walkin-rewardx/src/entity";
@Injectable()
class AudienceProvider {
  public async getAudienceBySegment(entityManager: EntityManager, segment) {
    return entityManager.findOne(Audience, {
      where: {
        segment
      },
      relations: ["campaign", "organization", "application", "segment"]
    });
  }

  public async getAudiencesForCampaign(
    entityManager: EntityManager,
    campaign: string
  ) {
    return entityManager.find(Audience, {
      where: {
        campaign
      },
      relations: ["organization", "application", "segment"]
    });
  }

  public async getAudienceById(
    entityManager: EntityManager,
    id: string
  ): Promise<Audience> {
    const e = await entityManager.findOne(Audience, id, {
      relations: ["organization", "application", "campaign", "segment"]
    });
    return e;
  }

  public async getAllAudience(
    transactionalEntityManager: EntityManager,
    organizationId: string,
    applicationId: string,
    campaignId: string,
    segmentId: string,
    status: string
  ): Promise<Audience[]> {
    const query: any = {};
    if (organizationId) {
      query.organization = organizationId;
    }
    if (applicationId) {
      query.application = applicationId;
    }
    if (campaignId) {
      query.campaign = campaignId;
    }
    if (segmentId) {
      query.segment = segmentId;
    }
    if (status) {
      query.status = status;
    }
    const options: any = {};
    options.where = query;
    options.relations = ["organization", "application", "campaign", "segment"];
    // return transactionalEntityManager.find(Audience, options);
    const audience = await transactionalEntityManager.find(Audience, options);
    return audience;
  }

  public async getCampaignControls(
    transactionalEntityManager: EntityManager,
    organizationId: string,
    campaignId: string,
    customerId: string
  ): Promise<CampaignControl[]> {
    const query: any = {};
    if (organizationId) {
      query.organization_id = organizationId;
    }
    if (campaignId) {
      query.campaign_id = campaignId;
    }
    if (customerId) {
      query.customer_id = customerId;
    }

    const options: any = {};
    options.where = query;
    options.relations = ["organization", "campaign", "customer"];
    // return transactionalEntityManager.find(CampaignControl, options);
    return transactionalEntityManager.find(CampaignControl, options);
  }

  public async getGlobalControls(
    transactionalEntityManager: EntityManager,
    organizationId: string,
    customerId: string
  ): Promise<GlobalControl[]> {
    const query: any = {};
    if (organizationId) {
      query.organization_id = organizationId;
    }
    if (customerId) {
      query.customer_id = customerId;
    }

    const options: any = {};
    options.where = query;
    options.relations = ["organization", "customer"];
    // return transactionalEntityManager.find(GlobalControl, options);
    const globalControl = transactionalEntityManager.find(
      GlobalControl,
      options
    );
    return globalControl;
  }

  public async getAudienceMembers(
    transactionalEntityManager: EntityManager,
    audienceId: string,
    customerId?: string
  ): Promise<AudienceMember[]> {
    const query: any = {};
    if (audienceId) {
      query.audience = {
        id: audienceId
      };
    }
    if (customerId) {
      query.customer = {
        id: customerId
      };
    }

    const options: any = {};
    options.where = query;
    options.relations = ["audience", "customer"];
    // return transactionalEntityManager.find(AudienceMember, options);
    const audienceMember = await transactionalEntityManager.find(
      AudienceMember,
      options
    );
    return audienceMember;
  }

  public async createAudience(
    entityManager: EntityManager,
    organization: Organization,
    application: Application,
    campaign: Campaign,
    segments: [Segment],
    status: string
  ): Promise<Audience> {
    const result: any = [];
    for (const segment of segments) {
      const audienceSchema: any = {
        organization,
        application,
        campaign,
        segment,
        status
      };
      let e = await entityManager.create(Audience, audienceSchema);
      // console.log("Before insert", e);
      e = await entityManager.save(e);
      const x = await entityManager.findOne(
        Audience,
        { id: e.id },
        {
          relations: ["organization", "application", "campaign", "segment"]
        }
      );
      result.push(x);
    }
    return result;
  }

  public async createCampaingControl(
    entityManager: EntityManager,
    organization: Organization,
    campaign: Campaign,
    customer: Customer,
    startTime: Date,
    endTime: Date,
    status: string
  ): Promise<CampaignControl> {
    const campaignControlSchema: any = {
      organization,
      campaign,
      customer,
      startTime,
      endTime,
      status
    };
    let e = await entityManager.create(CampaignControl, campaignControlSchema);
    console.log("Before insert", e);
    e = await entityManager.save(e);
    const x = await entityManager.findOne(
      CampaignControl,
      { id: e.id },
      {
        relations: ["organization", "campaign", "customer"]
      }
    );
    console.log(x);
    return x;
  }

  public async createGlobalControl(
    entityManager: EntityManager,
    organization: Organization,
    customer: Customer,
    startTime: Date,
    endTime: Date,
    status: string
  ): Promise<GlobalControl> {
    const globalControlSchema: any = {
      organization,
      customer,
      startTime,
      endTime,
      status
    };
    let e = entityManager.create(GlobalControl, globalControlSchema);
    console.log("Before insert", e);
    e = await entityManager.save(e);
    const x = await entityManager.findOne(
      GlobalControl,
      { id: e.id },
      {
        relations: ["organization", "customer"]
      }
    );
    console.log(x);
    return x;
  }

  public async createAudienceMember(
    entityManager: EntityManager,
    audience: Audience,
    customer: Customer,
    status: string
  ): Promise<AudienceMember> {
    const audienceMemberSchhema: any = {
      customer,
      audience,
      status
    };
    let e = await entityManager.create(AudienceMember, audienceMemberSchhema);
    console.log("Before insert", e);
    e = await entityManager.save(e);
    const x = await entityManager.findOne(
      AudienceMember,
      { id: e.id },
      {
        relations: ["customer", "audience"]
      }
    );
    console.log(x);
    return x;
  }

  public async updateAudience(
    entityManager: EntityManager,
    id: string,
    campaign: Campaign,
    segment: Segment,
    status: string
  ) {
    const e = await entityManager.findOne(Audience, id);
    if (e) {
      // pass
    } else {
      throw new WalkinPlatformError(
        "AUDIENCE_INVALID",
        "Not a valid Audience",
        id,
        400,
        "Invalid id or Audience is not found."
      );
    }

    if (campaign != null) {
      e.campaign = campaign;
    }
    if (segment != null) {
      e.segment = segment;
    }
    if (status != null) {
      e.status = status;
    }

    console.log("Before updating", e);
    const u = await entityManager.save(e);
    const x = await entityManager.findOne(Audience, id, {
      relations: ["organization", "application", "campaign", "segment"]
    });
    console.log(x);
    return x;
  }

  public async updateCampaignControl(
    entityManager: EntityManager,
    id: string,
    endTime: Date,
    status: string
  ) {
    const e = await entityManager.findOne(CampaignControl, id);
    if (e) {
      // pass
    } else {
      throw new WalkinPlatformError(
        "CAMPAIGNCONTROL_INVALID",
        "Not a valid CampaignControl",
        id,
        400,
        "Invalid id or CampaignControl is not found."
      );
    }

    if (status != null) {
      e.status = status;
    }

    if (endTime != null) {
      e.endTime = endTime;
    }

    console.log("Before updating", e);
    const u = await entityManager.save(e);
    const x = await entityManager.findOne(CampaignControl, id, {
      relations: ["organization", "campaign", "customer"]
    });
    console.log(x);
    return x;
  }

  public async createAudienceForCampaign(
    entityManager: EntityManager,
    id: string,
    segments: [string]
  ) {
    const campaignSchema: any = {
      id
    };
    const result = [];
    const campaign = await entityManager.findOne(Campaign, campaignSchema);

    if (campaign === undefined || campaign.campaignStatus === STATUS.INACTIVE) {
      throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_FOUND);
    }

    const existingAudiencesegments = await entityManager.find(Audience, {
      where: {
        campaign: id
      },
      relations: ["segment", "campaign"]
    });

    if (existingAudiencesegments.length > 0) {
      existingAudiencesegments.forEach(audienceSegment => {
        audienceSegment.status = STATUS.INACTIVE;
      });
      const res = await entityManager.save(existingAudiencesegments);
    }
    for (const segment of segments) {
      const audiences = await entityManager.find(Audience, {
        where: {
          segment,
          campaign: campaign.id
        },
        relations: ["segment", "campaign"]
      });
      if (audiences.length > 0) {
        for (const audience of audiences) {
          audience.status = STATUS.ACTIVE;
          const u = await entityManager.save(audience);
          result.push(u);
        }
      } else {
        // check if segment exists
        const seg = await entityManager.findOne(Segment, {
          where: {
            id: segment
          },
          relations: ["organization", "application"]
        });

        if (seg) {
          const u = await this.createAudience(
            entityManager,
            seg.organization,
            seg.application,
            campaign,
            [seg],
            STATUS.ACTIVE
          );
          result.push(u[0]);
        } else {
          // TODO: throw wcore error instead error segment doesn't exist
          // throw new WCoreError(HYPERX_ERRORS.SEGMENT_NOT_FOUND);
        }
      }
    }
    return result;
  }

  public async updateGlobalControl(
    entityManager: EntityManager,
    id: string,
    endTime: Date,
    status: string
  ) {
    const e = await entityManager.findOne(GlobalControl, id);
    if (e) {
      // pass
    } else {
      throw new WalkinPlatformError(
        "GLOBALCONTROL_INVALID",
        "Not a valid GlobalControl",
        id,
        400,
        "Invalid id or GlobalControl is not found."
      );
    }

    if (status != null) {
      e.status = status;
    }

    if (endTime != null) {
      e.endTime = endTime;
    }

    console.log("Before updating", e);
    const u = await entityManager.save(e);
    const x = await entityManager.findOne(GlobalControl, id, {
      relations: ["organization", "customer"]
    });
    console.log(x);
    return x;
  }

  public async updateAudienceMember(
    entityManager: EntityManager,
    id: string,
    status: string
  ) {
    const e = await entityManager.findOne(AudienceMember, id);
    if (e) {
      // pass
    } else {
      throw new WalkinPlatformError(
        "AUDIENCEMEMBER_INVALID",
        "Not a valid AudienceMember",
        id,
        400,
        "Invalid id or AudienceMember is not found."
      );
    }

    if (status != null) {
      e.status = status;
    }

    console.log("Before updating", e);
    const u = await entityManager.save(e);
    const x = await entityManager.findOne(AudienceMember, {
      relations: ["audience", "customer"]
    });
    console.log(x);
    return x;
  }
}

export { AudienceProvider };
