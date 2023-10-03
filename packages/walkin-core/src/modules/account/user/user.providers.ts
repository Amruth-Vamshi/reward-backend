import { Injectable, Inject } from "@graphql-modules/di";
import {
  EntityManager,
  getManager,
  getRepository,
  Transaction,
  Not,
  In
} from "typeorm";
import { WalkinRecordNotFoundError } from "../../../../src/modules/common/exceptions/walkin-platform-error";
import {
  Application,
  Organization,
  User,
  WalkinProduct,
  Role,
  Store,
  UserDevice
} from "../../../entity";
import { EnumStatus, STATUS, PageOptions } from "../../common/constants";
import {
  WalkinError,
  WalkinPlatformError
} from "../../common/exceptions/walkin-platform-error";
import {
  findOrCreateAdminRole,
  updateEntity,
  logMethod,
  addPaginateInfo,
  isPasswordValid,
  sendPushNotification,
  getUsersByStoreId,
  isValidString,
  validateStatus
} from "../../common/utils/utils";
import { validateAndReturnEntityExtendedData } from "../../entityExtend/utils/EntityExtension";
import { Organizations } from "../organization/organization.providers";
import {
  BASIC_METRIC_DATA,
  BASIC_RULE_ENTITY_DATA,
  BASIC_METRIC_FILTERS
} from "../../common/constants/orgLevelSeedData";
import { MetricProvider } from "../../metrics/metrics.providers";
import {
  RuleEntityProvider,
  RuleAttributeProvider
} from "../../rule/providers";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import * as jwt from "jsonwebtoken";
import { logger } from "../../common/utils/loggerUtil";
import * as bcrypt from "bcryptjs";
import { CommunicationProvider } from "@walkinserver/walkin-core/src/modules/communication/communication.providers";
import { MessageTemplate } from "@walkinserver/walkin-core/src/entity";
import { render } from "mustache";
import { MESSAGE_FORMAT } from "@walkinserver/walkin-core/src/modules/common/constants";
import { getJWTOptions } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import {
  CACHE_TTL,
  CACHING_KEYS,
  DEFAULT_TEMPLATES,
  ENTITY_TYPE,
  EXPIRY_MODE,
  SHORT_CACHE_TTL
} from "../../common/constants/constants";
import { WorkflowRouteService } from "../../workflow/workflow.providers";
import { workflowModule } from "../../workflow/workflow.module";
import Initialize from "../../common/utils/orgUtils";
import { isValidUser } from "../../common/validations/Validations";
import { find } from "lodash";
import { captureEvent, captureException, captureMessage } from "@sentry/node";
import { isEqualType } from "graphql";
import _ from "lodash";
import {
  getValueFromCache,
  setValueToCache,
  removeValueFromCache
} from "../../common/utils/redisUtils";
import { findCommonElements } from "../../common/utils";
import { Campaign } from "../../../../../walkin-rewardx/src/entity";
import Container from "typedi";
import { AccessControlRepository } from "../access-control/access-control.repository";
interface ILinkUserToStore {
  userId: string;
  storeId: string;
  organizationId: string;
}

interface IVerifyEmail {
  organizationId: string;
  userId: string;
}

interface ILinkUserToStore {
  userId: string;
  storeId: string;
  organizationId: string;
}

interface IUpdateUserPassword {
  password: string;
  organizationId: string;
  adminUserId: string;
  userId: string;
}

@Injectable()
export class Users {
  constructor(
    @Inject(Organizations) private organizationService: Organizations,
    @Inject(MetricProvider) private metricProvider: MetricProvider,
    @Inject(RuleEntityProvider) private ruleEntityProvider: RuleEntityProvider,
    @Inject(RuleAttributeProvider)
    private ruleAttributeProvider: RuleAttributeProvider,
    @Inject(CommunicationProvider)
    private communicationProvider: CommunicationProvider
  ) {}

  @addPaginateInfo
  public async getAllUsers(
    entityManager,
    pageOptions: PageOptions,
    sortOptions,
    organizationId
  ) {
    const options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    options.relations = ["organization", "roles", "roles.policies"];
    options.where = {
      organization: organizationId
    };
    const result = await entityManager.findAndCount(User, options);
    return result;
  }

  public async getUserByIdWithOrgId(
    entityManager: EntityManager,
    id: string,
    organizationId: string
  ) {
    const key = `${CACHING_KEYS.USER}_${id}`;
    let user: any = await getValueFromCache(key);
    if (!user) {
      user = await entityManager.findOne(User, id, {
        where: {
          organization: organizationId
        },
        relations: [
          "organization",
          "roles",
          "roles.policies"
          // "members",
          // "members.application"
        ]
      });
      if (user) {
        await setValueToCache(key, user, EXPIRY_MODE.EXPIRE, SHORT_CACHE_TTL);
        console.log("User Value Fetched from DB", user);
      }
    }

    if (!user) {
      throw new WalkinRecordNotFoundError("User not found");
    }
    user["resetPassword"] = !user.defaultPasswordReset;
    return user;
  }

  public async getUserById(entityManager: EntityManager, id: string) {
    const key = `${CACHING_KEYS.USER}_${id}`;
    let user: any = await getValueFromCache(key);
    if (!user) {
      user = await entityManager
        .getRepository(User)
        .createQueryBuilder("user")
        .innerJoin("user.organization", "organization")
        .innerJoin("user.roles", "roles")
        .innerJoin("roles.policies", "policies")
        .select([
          "user.id",
          "user.email",
          "user.userName",
          "user.firstName",
          "user.lastName",
          "organization.id",
          "organization.name",
          "organization.code",
          "organization.status",
          "roles.id",
          "policies.id",
          "policies.effect",
          "policies.resource",
          "policies.permission"
        ])
        .where("user.id =:id", { id })
        .cache(true)
        .getOne();

      if (user) {
        await setValueToCache(key, user, EXPIRY_MODE.EXPIRE, CACHE_TTL);
        console.log(
          "Fetched User from database and Added to Cache with key: ",
          key
        );
      } else {
        throw new WalkinRecordNotFoundError("User not found");
      }
    } else {
      console.log("Fetched User from Cache with key :", key);
    }
    return user;
  }

  public async verifyUserEmail(
    entityManager: EntityManager,
    input: IVerifyEmail
  ) {
    const { organizationId, userId } = input;
    let user = await entityManager.findOne(User, {
      where: {
        organization: organizationId,
        id: userId
      }
    });
    if (user) {
      user.emailConfirmed = true;
      user = await entityManager.save(user);
    }
    return user;
  }

  public async removeUserFromStore(
    entityManager: EntityManager,
    input: ILinkUserToStore
  ) {
    const { storeId, userId, organizationId } = input;
    const user = await entityManager.findOne(User, {
      where: {
        id: userId,
        organization: organizationId
      },
      // relations: ["store", "organization"]
      relations: ["organization"]
    });
    if (!user) {
      throw new WCoreError(WCORE_ERRORS.USER_NOT_FOUND);
    }
    // const { store } = user;
    // if (
    //   !find(store, singleStore => singleStore.id === storeId) ||
    //   (store && store.length === 0)
    // ) {
    //   throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    // }
    // const filteredStores = store.filter(
    //   singleStore => singleStore.id !== storeId
    // );
    // user.store = filteredStores;
    const savedUser = await entityManager.save(user);

    const keys = [`${CACHING_KEYS.USER}_${userId}`];
    removeValueFromCache(keys);

    return savedUser;
  }

  public async linkUserToStore(
    entityManager: EntityManager,
    input: ILinkUserToStore
  ) {
    const { storeId, userId, organizationId } = input;
    const user = await entityManager.findOne(User, {
      where: {
        id: userId,
        organization: organizationId
      },
      // relations: ["store", "organization"]
      relations: ["organization"]
    });
    if (!user) {
      throw new WCoreError(WCORE_ERRORS.USER_NOT_FOUND);
    }
    // const { store } = user;
    // if (store && store.length > 0) {
    //   const userExistingStore = find(store, st => st.id === storeId);
    //   if (userExistingStore) {
    //     throw new WCoreError(WCORE_ERRORS.USER_ALREADY_ADDED_TO_STORE);
    //   }
    // }
    // const foundStore = await entityManager.findOne(Store, {
    //   where: {
    //     id: storeId
    //   }
    // });
    // if (!foundStore) {
    //   throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    // }

    // user.store.push(foundStore);
    const savedUser = await entityManager.save(user);

    const keys = [`${CACHING_KEYS.USER}_${userId}`];
    removeValueFromCache(keys);

    return savedUser;
  }

  public async checkEmailAvailability(
    entityManager: EntityManager,
    email: string
  ) {
    const checkUserWithEmail = await entityManager.findOne(User, {
      where: {
        email
      },
      cache: false
    });
    if (checkUserWithEmail) {
      throw new WCoreError(WCORE_ERRORS.EMAIL_EXISTS);
    }
    return true;
  }

  public async checkUserNameAvailability(
    entityManager: EntityManager,
    userName: string
  ) {
    const checkUserWithUserName = await entityManager.findOne(User, {
      where: {
        userName
      },
      cache: false
    });
    if (checkUserWithUserName) {
      return false;
    }
    return true;
  }
  public async createUser(
    entityManager: EntityManager,
    user: Partial<User>
  ): Promise<User> {
    if (user.userName && !isValidString(user.userName)) {
      throw new WCoreError(WCORE_ERRORS.PLEASE_PROVIDE_VALID_INPUTS);
    }

    if (!isValidString(user.email)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_EMAIL);
    }

    const newUser = new User();
    if (user.email) {
      await isValidUser(entityManager, user);
      newUser.email = user.email;
    }
    if (user.userName) {
      const usernameAvailable = await this.checkUserNameAvailability(
        entityManager,
        user.userName
      );
      if (!usernameAvailable) {
        throw new WCoreError(WCORE_ERRORS.USER_NAME_ALREADY_TAKEN);
      }
      newUser.userName = user.userName;
    }

    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.status = STATUS.ACTIVE;
    const userAutoConfirm = Number(process.env.WCORE_USER_AUTO_CONFIRM);
    newUser.emailConfirmed = Boolean(userAutoConfirm);
    try {
      // Replace with injector
      const saltWorkfactor = Number(process.env.SALT_WORK_FACTOR);
      const salt = await bcrypt.genSalt(saltWorkfactor);
      // hash the password using our new salt
      const hashedPassword = await bcrypt.hash(user.password, salt);
      newUser.password = hashedPassword;
      const savedUser = await entityManager.save(newUser);
      return savedUser;
    } catch (error) {
      console.log(error);
      // throw new WalkinPlatformError(error);
    }
  }

  public async getRoleById(entityManager, roleId) {
    const foundRole = await entityManager.findOne(Role, {
      id: roleId
    });
    return foundRole;
  }

  public async getUserRoleFromUserRolesRole(entityManager, userId, roleId) {
    let foundRole = await entityManager.query(
      `Select * from user_roles_role where userId = '${userId}' and roleId = '${roleId}'`
    );
    foundRole = foundRole[0] ? foundRole[0] : {};
    return foundRole;
  }

  public async changeUserType(entityManager: EntityManager, input) {
    const { userId, existingRoleId, newRoleId } = input;
    if (!isValidString(userId)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_USER_ID);
    }

    if (!isValidString(existingRoleId)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_EXISTING_ROLE_ID);
    }

    if (!isValidString(newRoleId)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_NEW_ROLE_ID);
    }

    // Unlink existing Role
    await Container.get(AccessControlRepository).unlinkUserToRole(
      entityManager,
      userId,
      existingRoleId
    );

    // Link new Role
    const user = await Container.get(AccessControlRepository).linkUserToRole(
      entityManager,
      userId,
      newRoleId
    );
    return user;
  }

  public async updateUser(entityManager: EntityManager, user) {
    let foundUser = await entityManager.findOne(User, user.id);
    if (!foundUser) {
      throw new WalkinRecordNotFoundError("User not found");
    }
    if (user.status) {
      const validStatus = await validateStatus(user.status);
      if (!validStatus) {
        throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
      }
    }

    if (user.email) {
      const checkExistingUserEmail = await entityManager.findOne(User, {
        where: {
          email: user.email,
          id: Not(foundUser.id)
        }
      });
      if (checkExistingUserEmail) {
        throw new WCoreError(WCORE_ERRORS.EMAIL_EXISTS);
      }
    }
    if (user.userName) {
      const checkExistingUserUserName = await entityManager.findOne(User, {
        where: {
          userName: user.userName,
          id: Not(foundUser.id)
        }
      });
      if (checkExistingUserUserName) {
        throw new WCoreError(WCORE_ERRORS.USER_NAME_ALREADY_TAKEN);
      }
    }

    foundUser = updateEntity(foundUser, user);
    // Handle Entity Extensions
    const { extend } = user;
    if (extend !== undefined) {
      try {
        const extendData = await validateAndReturnEntityExtendedData(
          entityManager,
          extend,
          foundUser.organization.id,
          "user"
        );
        foundUser.extend = extendData;
      } catch (e) {
        throw new WalkinPlatformError(
          "cust005",
          "entity extended data is invalid",
          e,
          400,
          ""
        );
      }
    }
    // Handle Entity Extensions

    const updatedUser = await entityManager.save(foundUser);

    const keys = [`${CACHING_KEYS.USER}_${foundUser.id}`];
    removeValueFromCache(keys);

    return updatedUser;
  }

  public async deleteUserById(entityManager, id) {
    const foundUser = await entityManager.findOne(User, id);
    if (!foundUser) {
      throw new WalkinRecordNotFoundError("User not found");
    }

    const deletedUser = await entityManager.remove(foundUser);

    const keys = [`${CACHING_KEYS.USER}_${id}`];
    removeValueFromCache(keys);

    return deletedUser;
  }

  public async linkApplicationToUser(entityManager, userId, applicationId) {
    const foundUser = await entityManager.findOne(User, userId);
    if (!foundUser) {
      throw new WalkinRecordNotFoundError("User not found");
    }
    foundUser.applications = await entityManager.findOne(
      Application,
      applicationId
    );
    return entityManager.save(foundUser);
  }

  // Register new user with one of internal applications.
  // Internal applications are applications related to FirstWalkin Organization
  public async registerNewUser(entityManager, user) {
    try {
      const walkinProduct = await entityManager.findOne(WalkinProduct, {
        where: {
          name: user.serviceName
        },
        relations: ["organizations"]
      });
      if (!walkinProduct) {
        throw new WalkinError("Service not found", "SERVICE_NOT_FOUND");
      }
      let savedOrganization = await entityManager.findOne(Organization, {
        where: {
          code: user.organization.code
        }
      });
      if (!savedOrganization) {
        // Organization
        const newOrganization = entityManager.create(
          Organization,
          user.organization
        );

        savedOrganization = await entityManager.save(newOrganization);
        walkinProduct.organizations.push(savedOrganization);
        await entityManager.save(walkinProduct);
      }
      const newUser = entityManager.create(User, {
        ...user,
        organization: savedOrganization,
        services: []
      });
      const salt = await bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR));
      // hash the password using our new salt
      const hashedPassword = await bcrypt.hash(user.password, salt);
      newUser.password = hashedPassword;

      // assign super admin role to the user
      const adminRole = await findOrCreateAdminRole(entityManager);
      newUser.roles = [adminRole];

      // newUser.services.push(service);
      return entityManager.save(newUser);
    } catch (err) {
      if (err instanceof WalkinError) {
        throw err;
      }
      throw new WalkinPlatformError(err);
    }
  }

  public async resetPassword(entityManager: EntityManager, input: any) {
    const { token, password } = input;

    // validate the password inputs

    if (password.trim().length === 0) {
      throw new WCoreError(WCORE_ERRORS.PASSWORD_CANNOT_BE_EMPTY);
    }

    /**
     * Verify the integrity of token
     * then verify validity of token
     */
    const publicKey = process.env.PUBLIC_PASSWORD_RESET_KEY;
    const verified = jwt.verify(token, publicKey);
    if (!verified) {
      throw new WCoreError(WCORE_ERRORS.TOKEN_NOT_VALID);
    }
    const { id, org_id } = jwt.decode(token) as any;
    const foundUser = await entityManager.findOne(User, {
      where: {
        id,
        organization: org_id
      },
      relations: ["organization", "roles"]
    });
    if (!foundUser) {
      throw new WCoreError(WCORE_ERRORS.USER_NOT_FOUND);
    }
    const passwordValid = isPasswordValid(foundUser, password);
    const matched = await bcrypt.compare(password, foundUser.password);
    if (matched) {
      throw new WCoreError(
        WCORE_ERRORS.OLD_PASSWORD_NEW_PASSWORD_CANNOT_BE_SAME
      );
    }
    if (!passwordValid) {
      throw new WCoreError(WCORE_ERRORS.PASSWORD_NOT_VALID);
    }
    if (!foundUser.resetCode && foundUser.resetCode !== token) {
      throw new WCoreError(WCORE_ERRORS.TOKEN_NOT_VALID);
    }
    try {
      const saltWorkfactor = Number(process.env.SALT_WORK_FACTOR);
      const salt = await bcrypt.genSalt(saltWorkfactor);
      // hash the password using our new salt
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = updateEntity(foundUser, {
        password: hashedPassword,
        resetCode: null,
        defaultPasswordReset: true
      });

      await entityManager.save(user);

      const keys = [`${CACHING_KEYS.USER}_${foundUser.id}`];
      removeValueFromCache(keys);

      const newIssuedToken = await this.prepareAuthToken(user);
      this.sendPasswordConfirmationEmailToUser(entityManager, user);
      return {
        updated: true,
        token: newIssuedToken
      };
    } catch (error) {
      console.log("error", error);
      captureException(error);
      captureMessage("Error creating hashed password");
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  public async preparePasswordAuthToken(user) {
    const privateKey = process.env.PRIVATE_PASSWORD_RESET_KEY;
    const payload = {
      email: user.email,
      id: user.id,
      org_id: user.organization ? user.organization.id : null
    };
    const signOptions = {
      issuer: process.env.JWT_ISSUER,
      expiresIn: process.env.JWT_PASSWORD_TOKEN_EXPIRES_IN,
      algorithm: process.env.JWT_ALGORITHM as any
    };
    const token = jwt.sign(payload, privateKey, signOptions);
    return token;
  }

  public async sendPasswordResetLink(
    entityManager: EntityManager,
    email: string
  ) {
    const user = await entityManager.findOne(User, {
      where: {
        email
      },
      relations: ["organization"]
    });
    if (!user) {
      throw new WalkinRecordNotFoundError("User not found");
    }
    const serverURL =
      process.env.CONSOLE_URL + process.env.RESET_PASSWORD_URL_PREFIX;
    const token = await this.preparePasswordAuthToken(user);
    const verifyLink = serverURL + "?token=" + token;

    const messageLog = await this.sendEmail(
      entityManager,
      user,
      {
        verifyUrl: verifyLink
      },
      process.env.WALKIN_COMMS_CHANNEL_NAME_EMAIL_DEFAULT,
      DEFAULT_TEMPLATES.PASSWORD_RESET_MAIL_TEMPLATE
    );
    user.resetCode = token;
    await entityManager.save(user);
    logger.info(messageLog);
    return {
      userId: user.id,
      email,
      sentLink: true
    };
  }

  public async sendPasswordConfirmationEmailToUser(
    entityManager: EntityManager,
    user: User
  ) {
    const messageLog = await this.sendEmail(
      entityManager,
      user,
      {},
      process.env.WALKIN_COMMS_CHANNEL_NAME_EMAIL_DEFAULT,
      DEFAULT_TEMPLATES.PASSWORD_RESET_CONFIRMATION
    );
  }

  public async sendConfirmationEmailToUser(entityManager, user: User) {
    const serverURL =
      process.env.CONSOLE_URL + process.env.CONFIRM_EMAIL_URL_PREFIX;
    const verifyLink =
      serverURL + "?token=" + (await this.prepareAuthToken(user));

    const messageLog = await this.sendEmail(
      entityManager,
      user,
      {
        verifyLink
      },
      process.env.WALKIN_COMMS_CHANNEL_NAME_EMAIL_DEFAULT,
      DEFAULT_TEMPLATES.NEW_USER_CONFIRM_MAIL_TEMPLATE
    );
    logger.info(messageLog);
  }

  public async prepareAuthToken(user: User) {
    const privateKey = process.env.PRIVATE_KEY;
    const payload = {
      id: user.id,
      org_id: user.organization ? user.organization.id : null
    };
    const signOptions = getJWTOptions();
    const token = jwt.sign(payload, privateKey, signOptions);
    return token;
  }

  public async sendEmail(
    entityManager: EntityManager,
    user: User,
    additionalProperties: any,
    format: string,
    templateName: string
  ) {
    const email = user.email;
    const commsChannelName = "";
    const template: MessageTemplate = await entityManager.findOne(
      MessageTemplate,
      {
        name: templateName,
        organization: {
          id: user.organization.id
        }
      }
    );
    let subject = "";
    let messageBody = "";
    if (template) {
      subject = template.templateSubjectText;
      messageBody = template.templateBodyText;
    }
    console.log("formattedMessageBody", additionalProperties);
    const formattedSubject = render(subject, {
      ...user,
      ...additionalProperties
    });
    const formattedMessageBody = render(messageBody, {
      ...user,
      ...additionalProperties
    });
    console.log("formattedMessageBody", formattedMessageBody);
    const messageSentInfo = await this.communicationProvider.sendMessage(
      entityManager,
      {
        format,
        messageBody: formattedMessageBody,
        messageSubject: formattedSubject,
        to: email,
        channel_name: commsChannelName,
        user_id: user.id
      }
    );
    return messageSentInfo;
  }

  public async confirmEmail(entityManager, email: string, emailToken: string) {
    /**
     * Verify email token is valid.
     */
    const publicKey = process.env.PUBLIC_KEY;
    const verified = jwt.verify(emailToken, publicKey);
    if (!verified) {
      throw new WalkinError("Email token invalid");
    }
    const { id } = jwt.decode(emailToken) as any;
    const user = await this.getUserById(entityManager, id);

    /**
     * Check for input mail and actual users mail
     */
    if (email !== user.email) {
      throw new WalkinError("Email not matched");
    }
    if (user.emailConfirmed === true) {
      throw new WalkinError("User email already confirmed");
    }
    /**
     * Mark user's emailConfirmed status to true
     */
    user.emailConfirmed = true;
    const savedUser: User = await entityManager.save(User, user);
    logger.info("Saved user", savedUser);
    return {
      userId: id,
      email,
      verified: true
    };
  }

  public async getCampaign(entityManager, userId) {
    const campaigns = await entityManager
      .getRepository(Campaign)
      .createQueryBuilder("campaign")
      .leftJoinAndSelect("campaign.organization", "organization")
      .leftJoinAndSelect("campaign.application", "application")
      .where("campaign.ownerId=  :userId", {
        userId
      })
      .getMany();
    return campaigns;
  }

  public async updateUserPassword(
    entityManager: EntityManager,
    input: IUpdateUserPassword
  ) {
    const { adminUserId, organizationId, password, userId } = input;

    if (password.trim().length === 0) {
      throw new WCoreError(WCORE_ERRORS.PASSWORD_CANNOT_BE_EMPTY);
    }

    const foundUser: User = await entityManager.findOne(User, {
      where: {
        id: userId
      },
      // relations: ["organization", "roles", "store"]
      relations: ["organization", "roles"]
    });
    if (!foundUser) {
      throw new WCoreError(WCORE_ERRORS.USER_NOT_FOUND);
    }
    const adminUser = await entityManager.findOne(User, {
      where: {
        id: adminUserId
      },
      relations: ["organization"]
      // relations: ["organization", "store"]
    });
    const userOrganization = foundUser.organization.id;
    /**
     * if both users belong to different organization don;t change password
     */
    if (userOrganization !== organizationId) {
      throw new WCoreError(WCORE_ERRORS.OPERATION_NOT_ALLOWED);
    }
    /**
     * if role is admin password change should not be allowed
     */
    const isAdmin = foundUser.roles.find(role => role.name === "ADMIN");
    if (isAdmin) {
      throw new WCoreError(WCORE_ERRORS.OPERATION_NOT_ALLOWED);
    }
    // const store1Ids = foundUser.store.map(item => item.id);
    // const store2Ids = adminUser.store.map(item => item.id);
    /**
     * check if 2 users have a store in common
     * only move forward if there is a store in common
     */
    // const hasCommonStore = await findCommonElements(store1Ids, store2Ids);
    // if (!hasCommonStore) {
    //   throw new WCoreError(WCORE_ERRORS.OPERATION_NOT_ALLOWED);
    // }

    try {
      const saltWorkfactor = Number(process.env.SALT_WORK_FACTOR);
      const salt = await bcrypt.genSalt(saltWorkfactor);
      // hash the password using our new salt
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = updateEntity(foundUser, {
        password: hashedPassword,
        defaultPasswordReset: true
      });

      await entityManager.save(user);

      const keys = [`${CACHING_KEYS.USER}_${foundUser.id}`];
      removeValueFromCache(keys);

      this.sendPasswordUpdationEmailToUser(entityManager, adminUser, {
        managerUserName: foundUser.userName
      });
      return {
        updated: true
      };
    } catch (error) {
      logger.error("Error occured while generating hashed password", error);
      throw new WalkinError("Generating hashed password failed");
    }
  }

  public async sendPasswordUpdationEmailToUser(
    entityManager: EntityManager,
    user: User,
    payload: any
  ) {
    const messageLog = await this.sendEmail(
      entityManager,
      user,
      payload,
      process.env.WALKIN_COMMS_CHANNEL_NAME_EMAIL_DEFAULT,
      DEFAULT_TEMPLATES.USER_PASSWORD_RESET_TEMPLATE
    );
  }

  public async updatePassword(
    entityManager: EntityManager,
    oldPassword: string,
    newPassword: string,
    loggedInUser: User
  ) {
    const foundUser: User = await entityManager.findOne(User, {
      where: {
        id: loggedInUser.id
      },
      relations: ["organization", "roles"]
    });

    if (newPassword.trim().length === 0) {
      throw new WCoreError(WCORE_ERRORS.PASSWORD_CANNOT_BE_EMPTY);
    }
    if (_.isEqual(newPassword, oldPassword)) {
      throw new WCoreError(
        WCORE_ERRORS.OLD_PASSWORD_NEW_PASSWORD_CANNOT_BE_SAME
      );
    }
    const passwordValid = isPasswordValid(foundUser, newPassword);
    if (!passwordValid) {
      throw new WCoreError(WCORE_ERRORS.PASSWORD_NOT_VALID);
    }
    const matched = await bcrypt.compare(oldPassword, foundUser.password);
    if (!matched) {
      throw new WalkinError("Old password not matched");
    }
    try {
      const saltWorkfactor = Number(process.env.SALT_WORK_FACTOR);
      const salt = await bcrypt.genSalt(saltWorkfactor);
      // hash the password using our new salt
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const user = updateEntity(foundUser, {
        password: hashedPassword,
        defaultPasswordReset: true
      });
      await entityManager.save(user);

      const keys = [`${CACHING_KEYS.USER}_${foundUser.id}`];
      removeValueFromCache(keys);

      this.sendPasswordConfirmationEmailToUser(entityManager, user);
      return {
        updated: true
      };
    } catch (error) {
      logger.error("Error occured while generating hashed password", error);
      throw new WalkinError("Generating hashed password failed");
    }
  }

  public async addUserToOrganization(
    entityManager,
    input,
    organizationId,
    roleId
  ) {
    const organization = await entityManager.findOne(Organization, {
      id: organizationId
    });
    if (!organization) {
      throw new WalkinRecordNotFoundError("Organization not found!");
    }
    const foundRole = await entityManager.findOne(Role, {
      id: roleId
    });

    const createdUser = await this.createUser(entityManager, input);
    createdUser.roles = [foundRole];
    createdUser.emailConfirmed = true;
    createdUser.organization = organization;
    return entityManager.save(createdUser);
  }

  /**
   * registerUserForUnitTest
   * TODO: Move this to a utility file
   */
  public async registerUserForUnitTest(
    transactionalEntityManager,
    input,
    createOrganization,
    walkinProducts
  ): Promise<User> {
    const savedUser = await this.createUser(transactionalEntityManager, input);
    if (createOrganization) {
      let savedOrganization;
      savedOrganization = await this.organizationService.createOrganization(
        transactionalEntityManager,
        createOrganization
      );
      savedOrganization = await this.organizationService.addAdmin(
        transactionalEntityManager,
        savedOrganization,
        savedUser
      );
      if (walkinProducts) {
        await this.organizationService.linkOrganizationToWalkinProducts(
          transactionalEntityManager,
          savedOrganization.id,
          walkinProducts
        );

        if (savedOrganization.id) {
          const filters = [];

          for (const metricFilter of BASIC_METRIC_FILTERS) {
            const metricFilterInput: any = metricFilter;
            metricFilterInput.organizationId = savedOrganization.id;

            const metricFilterResult = await this.metricProvider.createMetricFilter(
              transactionalEntityManager,
              metricFilterInput
            );

            filters.push(metricFilterResult);
          }
          const metrics = BASIC_METRIC_DATA;
          for (const metric of metrics) {
            const metricInput: any = metric;
            metricInput.organizationId = savedOrganization.id;
            metricInput.filters = filters;

            await this.metricProvider.createMetric(
              transactionalEntityManager,
              metricInput
            );
          }

          // Creates the basic Rule Entity or Entity Attributes
          for (const ruleEntityObj of BASIC_RULE_ENTITY_DATA) {
            const ruleEntityDetails = {
              organizationId: savedOrganization.id,
              entityName: ruleEntityObj.entityName,
              entityCode: ruleEntityObj.entityCode,
              status: ruleEntityObj.status
            };
            const newRuleEntityObj = await this.ruleEntityProvider.createRuleEntity(
              transactionalEntityManager,
              ruleEntityDetails
            );
            if (newRuleEntityObj) {
              for (const attribute of ruleEntityObj.attributes) {
                const ruleAttributeDetails = attribute;
                ruleAttributeDetails["ruleEntityId"] = newRuleEntityObj.id;
                ruleAttributeDetails["organizationId"] = savedOrganization.id;
                await this.ruleAttributeProvider.createRuleAttribute(
                  transactionalEntityManager,
                  ruleAttributeDetails
                );
              }
            }
          }
        }

        const workflowRoutes = await workflowModule.injector
          .get(WorkflowRouteService)
          .workflowRoutes(
            transactionalEntityManager,
            savedOrganization.id,
            ENTITY_TYPE.CAMPAIGN,
            STATUS.ACTIVE
          );
        if (workflowRoutes.length === 0) {
          await Initialize.fetchAndInitializeProduct(
            transactionalEntityManager,
            savedOrganization,
            "CORE"
          );
        }

        // Force emailConfirmationToBeTrue for savedUser
        savedUser.emailConfirmed = true;
        await transactionalEntityManager.save(savedUser);
      }
      return this.getUserById(transactionalEntityManager, savedUser.id);
    }
  }

  public async createUpdateDeviceInfo(transactionalEntityManager, input) {
    const userInfo = await transactionalEntityManager.findOne(User, {
      where: {
        id: input.userId
      }
    });
    if (!userInfo) {
      throw new WCoreError(WCORE_ERRORS.USER_NOT_FOUND);
    }
    let userDeviceInfo = await transactionalEntityManager.findOne(UserDevice, {
      where: {
        deviceId: input.deviceId,
        user: userInfo
      }
    });
    if (userDeviceInfo) {
      userDeviceInfo = updateEntity(userDeviceInfo, input);
      userDeviceInfo.user = userInfo;
      return transactionalEntityManager.save(userDeviceInfo);
    } else {
      const deviceInfo = transactionalEntityManager.create(UserDevice, input);

      deviceInfo.user = userInfo;
      const createdDevice = transactionalEntityManager.save(deviceInfo);
      return createdDevice;
    }
  }

  public async sendNotification(orderData, templateName) {
    try {
      const entityManager = await getManager();
      const storeId = orderData.store.id;
      let users = await getUsersByStoreId(entityManager, storeId);

      if (users.length > 0) {
        let userDevices = await entityManager.find(UserDevice, {
          where: {
            user_id: In(users)
          },
          relations: ["user"]
        });

        const template: MessageTemplate = await entityManager.findOne(
          MessageTemplate,
          {
            name: templateName,
            organization: {
              id: orderData.organization.id
            }
          }
        );
        let data = {
          order_id: orderData.order.id,
          order_status: orderData.order.status,
          type: orderData.type,
          store_id: storeId,
          body: template ? template.templateBodyText : "",
          title: template ? template.templateSubjectText : ""
        };

        for (const device of userDevices) {
          const notifData = {
            organizationId: orderData.organization.id,
            format: process.env.WALKIN_COMMS_CHANNEL_NAME_PUSH_DEFAULT,
            fcmToken: device.fcmToken,
            data: data,
            user_id: device.user.id
          };
          const sendNotificationToUser = await sendPushNotification(
            this.communicationProvider,
            entityManager,
            notifData
          );
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error in sending Notification", error);
      return false;
    }
  }
  public async getStoresByUserId(entityManager, userId) {
    let user = await entityManager.findOne(User, {
      where: {
        id: userId
      }
      // relations: ["store"]
    });
    let stores = user.store;
    return stores;
  }
}
