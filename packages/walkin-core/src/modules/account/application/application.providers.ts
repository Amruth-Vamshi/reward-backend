import { Injectable } from "@graphql-modules/di";
import jwt, { SignOptions } from "jsonwebtoken";
import { Not, EntityManager, In } from "typeorm";
import { APIKey, Organization, User, Application, Role } from "../../../entity";
import {
  WalkinError,
  WalkinRecordNotFoundError
} from "../../common/exceptions/walkin-platform-error";
import {
  addMissingResourcesToAdminRole,
  findOrCreateAdminRole,
  getAPIOptions,
  updateEntity
} from "../../common/utils/utils";
import { checkEmptyFields } from "../../common/validations/Validations";
import { MutationCreateApplicationArgs } from "../../../graphql/generated-models";
import {
  getValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";
import { AnyARecord } from "dns";
import {
  CACHE_TTL,
  CACHING_KEYS,
  EXPIRY_MODE,
  LONG_CACHE_TTL,
  STATUS,
  StatusEnum,
  TYPEORM_CACHE_TTL,
  TYPEORM_SHORT_CACHE_TTL
} from "../../common/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
@Injectable()
export class ApplicationProvider {
  public async getAllApplications(entityManager) {
    return entityManager.find(Application, {
      relations: ["organization", "members", "apiKeys"],
      cache: TYPEORM_CACHE_TTL
    });
  }

  public async getApplicationById(
    entityManager: EntityManager,
    id: string
  ): Promise<Application> {
    return entityManager.findOne(Application, id, {
      relations: ["organization", "members", "eventTypes"],
      cache: TYPEORM_CACHE_TTL
    });
  }

  public async getApplicationByName(
    entityManager: EntityManager,
    appName,
    orgId
  ) {
    return entityManager.findOne(Application, {
      where: {
        organization: orgId,
        name: appName
      },
      relations: ["organization"],
      cache: TYPEORM_CACHE_TTL
    });
  }

  public async deleteApplication(entityManager: EntityManager, id: string) {
    const application = await entityManager.findOne(Application, id);
    if (application) {
      return entityManager.remove(application);
    } else {
      throw new WalkinRecordNotFoundError("Application Not Found!");
    }
  }

  public async updateApplication(
    entityManager: EntityManager,
    input: Partial<Application>
  ) {
    let application = await entityManager.findOne(Application, input.id);
    if (application) {
      const applicationNameFound = await entityManager.findOne(Application, {
        where: {
          id: Not(input.id),
          name: input.name
        }
      });
      if (applicationNameFound) {
        throw new WalkinError("Application name already exists");
      }
      application = updateEntity(application, input);
      return entityManager.save(application);
    } else {
      throw new WalkinRecordNotFoundError("Application Not Found!");
    }
  }

  public async generateAPIKey(
    entityManager: EntityManager,
    input: any,
    authUser?: User
  ) {
    const {
      id: applicationId,
      roleIds = [],
      environment,
      organizationId
    } = input;
    if (roleIds.length === 0) {
      throw new WCoreError(WCORE_ERRORS.ROLE_NOT_FOUND);
    }

    const application = await entityManager.findOne(Application, {
      where: {
        id: applicationId,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"],
      cache: TYPEORM_SHORT_CACHE_TTL
    });
    if (!application) {
      throw new WalkinRecordNotFoundError("Application Not Found!");
    }

    const foundRoles = await entityManager.find(Role, {
      where: {
        id: In(roleIds)
      },
      relations: ["policies"]
    });

    let response;
    if (foundRoles.length > 0) {
      for (const role of foundRoles) {
        if (role.name === "ADMIN") {
          await addMissingResourcesToAdminRole(entityManager, role);
        }
      }

      let apiKey = new APIKey();
      apiKey.generatedBy = authUser;
      apiKey.application = application;
      apiKey.environment = environment ? environment : "DEVELOPMENT";

      apiKey.roles = foundRoles;
      apiKey = await entityManager.save(apiKey);

      const validRoleIds = foundRoles.map(role => role.id);

      const signOptions = getAPIOptions();
      const payload = {
        app_id: application.id,
        org_id: application.organization.id,
        external_org_id: application.organization.externalOrganizationId,
        role_ids: validRoleIds
      };
      const signOptionsWithJWTId: SignOptions = {
        ...signOptions,
        jwtid: apiKey.id.toString()
      };
      const privateKey = process.env.PRIVATE_KEY;
      const token = jwt.sign(payload, privateKey, signOptionsWithJWTId);
      response = {
        ...apiKey,
        api_key: token
      };
    }
    return response;
  }

  public async getApiKeyById(entityManager: EntityManager, id: string) {
    const key = `${CACHING_KEYS.API_KEY}_${id}`;
    const apiKey = await entityManager.findOne(APIKey, {
      where: {
        id,
        status: STATUS.ACTIVE
      },
      relations: [
        "application",
        "application.organization",
        "roles",
        "roles.policies"
      ]
    });
    return apiKey;
  }

  public async deleteAPIKey(
    transactionEntityManager: EntityManager,
    input: any
  ) {
    const { id: apiKeyId } = input;
    const apiKey = await transactionEntityManager.findOne(APIKey, {
      where: {
        id: apiKeyId
      }
    });
    if (!apiKey) {
      throw new WCoreError(WCORE_ERRORS.API_KEY_NOT_FOUND);
    }
    if (apiKey.status == StatusEnum.ACTIVE) {
      apiKey.status = StatusEnum.INACTIVE;
      await transactionEntityManager.save(apiKey);
      return apiKey;
    } else {
      throw new WCoreError(WCORE_ERRORS.API_KEY_ALREADY_INACTIVE);
    }
  }

  public async updateAPIKey(entityManager: EntityManager, input: any) {
    let { roleIds, environment, organizationId, status, id } = input;
    let updateApiKeyInput: any = {},
      updatedApiKey,
      response;
    const existingApiKey = await entityManager.findOne(APIKey, {
      where: {
        id: id
      },
      relations: ["application"]
    });
    if (!existingApiKey) {
      throw new WalkinRecordNotFoundError("APIKey not found");
    }
    const application = await entityManager.findOne(Application, {
      where: {
        id: existingApiKey.application.id,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"],
      cache: TYPEORM_SHORT_CACHE_TTL
    });
    if (!application) {
      throw new WalkinRecordNotFoundError("Application Not Found!");
    }

    updateApiKeyInput.environment = environment
      ? environment
      : existingApiKey.environment;
    updateApiKeyInput.status = status ? status : existingApiKey.status;

    let foundRoles;
    if (!roleIds) {
      roleIds = [];
      const queryRunner = await entityManager.connection.createQueryRunner();
      const APIKeyRoles = await queryRunner.manager.query(
        `select * from api_key_roles_role where apiKeyId = '${existingApiKey.id}'`
      );
      await queryRunner.release();
      for (let index in APIKeyRoles) {
        roleIds.push(APIKeyRoles[index].roleId);
      }
    }
    if (roleIds) {
      foundRoles = await entityManager.find(Role, {
        where: {
          id: In(roleIds)
        },
        relations: ["policies"]
      });

      if (foundRoles.length > 0) {
        for (const role of foundRoles) {
          if (role.name === "ADMIN") {
            await addMissingResourcesToAdminRole(entityManager, role);
          }
        }

        updateApiKeyInput.roles = foundRoles;
      }
    }
    const newApiKey = await updateEntity(existingApiKey, updateApiKeyInput);
    updatedApiKey = await entityManager.save(newApiKey);

    const validRoleIds = foundRoles.map(role => role.id);

    const signOptions = getAPIOptions();
    const payload = {
      app_id: application.id,
      org_id: application.organization.id,
      external_org_id: application.organization.externalOrganizationId,
      role_ids: validRoleIds
    };
    const signOptionsWithJWTId: SignOptions = {
      ...signOptions,
      jwtid: updatedApiKey.id.toString()
    };
    const privateKey = process.env.PRIVATE_KEY;
    const token = jwt.sign(payload, privateKey, signOptionsWithJWTId);
    response = {
      ...updatedApiKey,
      api_key: token
    };
    return response;
  }

  public async createApplication(
    entityManager: EntityManager,
    organizationId: string,
    input: any // TODO: Fix the type
  ): Promise<Application> {
    const errors = [];
    await checkEmptyFields(input, errors);
    if (errors.length !== 0) {
      throw new WalkinError(errors.toString());
    }
    const organization = await entityManager.findOne(Organization, {
      where: {
        id: organizationId
      },
      relations: ["applications"]
    });
    if (!organization) {
      throw new WalkinRecordNotFoundError("Organization Not Found");
    }
    const applicationExists = await entityManager.findOne(Application, {
      name: input.name,
      organization
    });
    if (applicationExists) {
      throw new WalkinError("Application name already exists");
    }
    let application = new Application();
    application = updateEntity(application, input);
    input["organizationId"] = organizationId;
    const savedApp = await entityManager.save(application);
    organization.applications.push(savedApp);
    await entityManager.save(organization);

    return entityManager.findOne(Application, application.id, {
      relations: ["organization"]
    });
  }

  public async generateAPIKeyByApplicationId(
    entityManager: EntityManager,
    applicationId: string,
    environment?: string,
    authUser?: User
  ) {
    const application = await entityManager.findOne(
      Application,
      applicationId,
      {
        relations: ["organization"],
        cache: TYPEORM_SHORT_CACHE_TTL
      }
    );
    if (!application) {
      throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
    }

    let apiKey = new APIKey();
    apiKey = await entityManager.save(apiKey);
    apiKey.generatedBy = authUser;
    apiKey.application = application;
    apiKey.environment = environment ? environment : "TEST";
    apiKey = await entityManager.save(apiKey);
    const adminRole = await findOrCreateAdminRole(entityManager);
    apiKey.roles = [adminRole];
    apiKey = await entityManager.save(apiKey);
    // eslint-disable-next-line no-undef
    const signOptions = getAPIOptions();
    const payload = {
      app_id: application.id,
      org_id: application.organization.id,
      external_org_id: application.organization.externalOrganizationId
    };
    const signOptionsWithJWTId: SignOptions = {
      ...signOptions,
      jwtid: apiKey.id.toString()
    };
    const privateKey = process.env.PRIVATE_KEY;
    const token = jwt.sign(payload, privateKey, signOptionsWithJWTId);
    return {
      ...apiKey,
      api_key: token
    };
  }
}
