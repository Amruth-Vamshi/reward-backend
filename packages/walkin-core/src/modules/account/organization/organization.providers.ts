import { Injectable, Inject } from "@graphql-modules/di";
import { getManager, In, Not, EntityManager } from "typeorm";
import {
  Application,
  Organization,
  Store,
  User,
  WalkinProduct,
  Catalog,
  Channel,
  StoreFormat
} from "../../../entity";
import {
  CACHE_TTL,
  ORGANIZATION_TYPES,
  StatusEnum,
  CACHING_KEYS,
  TYPEORM_CACHE_TTL,
  EXPIRY_MODE,
  BUSINESS_TYPE
} from "../../common/constants";
import {
  BASIC_METRIC_DATA,
  BASIC_METRIC_FILTERS
} from "../../common/constants/orgLevelSeedData";
import {
  WalkinError,
  WalkinPlatformError,
  WalkinRecordNotFoundError
} from "../../common/exceptions/walkin-platform-error";
import {
  findOrCreateAdminRole,
  updateEntity,
  callLoadStoreSearch,
  validateStatus,
  isValidString
} from "../../common/utils/utils";
import { validateAndReturnEntityExtendedData } from "../../entityExtend/utils/EntityExtension";
import { MetricProvider } from "../../metrics/metrics.providers";
import Initialize from "../../common/utils/orgUtils";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";

@Injectable()
export class Organizations {
  public getOrganization(
    entityManager: EntityManager,
    id: string
  ): Promise<Organization> {
    return entityManager.findOneOrFail(Organization, id, {
      relations: [
        "applications",
        "children",
        "users",
        "parent",
        "walkinProducts",
        "legalDocuments"
      ],
      cache: TYPEORM_CACHE_TTL
    });
  }

  public async getOrganizationById(
    entityManager: EntityManager,
    id: string
  ): Promise<Organization> {
    const key = `${CACHING_KEYS.ORGANIZATION}_${id}`;
    let organization: any = await getValueFromCache(key);
    if (!organization) {
      organization = await entityManager.findOne(Organization, {
        where: {
          id
        },
        relations: ["applications"],
        cache: TYPEORM_CACHE_TTL
      });

      if (organization) {
        await setValueToCache(key, organization, EXPIRY_MODE.EXPIRE, CACHE_TTL);
        console.log("Fetched from database and Added to Cache with key: ", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }

    return organization;
  }

  public async getOrganizationDetails(
    entityManager: EntityManager,
    input: any
  ) {
    const { org_id, org_code } = input;
    let filter = {};
    if (org_id) {
      filter = {
        id: org_id
      };
    }
    if (org_code) {
      filter = {
        code: org_code
      };
    }
    return entityManager.findOne(Organization, {
      where: {
        ...filter
      },
      relations: ["applications"],
      cache: TYPEORM_CACHE_TTL
    });
  }

  public getOrganizations(entityManager: EntityManager, idArray?: string[]) {
    return entityManager.find(Organization, {
      where: {
        id: In(idArray)
      },
      relations: [
        "store",
        "applications",
        "children",
        "users",
        "parent",
        "walkinProducts"
      ],
      cache: TYPEORM_CACHE_TTL
    });
  }

  public async getOrganizationHierarchies(
    entityManager: EntityManager
  ): Promise<Organization[]> {
    const orgTreeRepo = entityManager.getTreeRepository(Organization);
    const tree = await orgTreeRepo.findTrees();
    return tree;
  }

  public async getOrganizationHierarchy(
    entityManager: EntityManager,
    rootId: string
  ): Promise<Organization> {
    const rootOrg = await entityManager.findOne(Organization, {
      where: { id: rootId },
      cache: TYPEORM_CACHE_TTL
    });
    if (rootOrg) {
      const orgTreeRepo = entityManager.getTreeRepository(Organization);
      const trees = await orgTreeRepo.findDescendantsTree(rootOrg);
      return trees;
    } else {
      throw new WalkinRecordNotFoundError("INVALIR_ROOT");
    }
  }

  public async createOrganization(
    entityManager: EntityManager,
    input: Partial<Organization>,
    parentId?: string
  ) {
    const isValidStatus = validateStatus(input.status);
    if (!isValidStatus) {
      throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
    }

    const { organizationType, businessType } = input;

    const validOrganizationTypeString = isValidString(organizationType);
    const allowedOrganizationType = Object.values(ORGANIZATION_TYPES);
    const validOrganizationType = allowedOrganizationType.includes(organizationType);
    if (!validOrganizationTypeString || !validOrganizationType) {
      throw new WCoreError(WCORE_ERRORS.INVALID_ORGANIZATION_TYPE);
    }

    const validBusinessTypeString = isValidString(businessType);
    const allowedBusinessType = Object.values(BUSINESS_TYPE);
    const validBusinessType = allowedBusinessType.includes(businessType);
    if (!validBusinessTypeString || !validBusinessType) {
      throw new WCoreError(WCORE_ERRORS.INVALID_BUSINESS_TYPE);
    }

    let newOrganization = new Organization();
    if (!input.legalName) {
      input.legalName = input.name;
    }
    newOrganization = updateEntity(newOrganization, input);

    if (parentId) {
      const parent = await entityManager.findOneOrFail(Organization, parentId);
      if (!parent) {
        throw new WalkinError("Parent not found");
      }
      newOrganization.parent = parent;
    }
    let savedOrganization = await entityManager.save(newOrganization);

    // Handle Entity Extensions
    const { extend } = input;
    if (extend !== undefined) {
      try {
        const extendData = await validateAndReturnEntityExtendedData(
          entityManager,
          extend,
          savedOrganization.id,
          "organization"
        );
        savedOrganization.extend = extendData;
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
    savedOrganization = await entityManager.save(savedOrganization);
    /*if (savedOrganization.organizationType === ORGANIZATION_TYPES.STORE) {
      const store = await this.createStore(entityManager, savedOrganization);
      if (!store) {
        throw new WalkinError("Store Couldn't be created");
      }
      savedOrganization.store = store;
      savedOrganization = await entityManager.save(savedOrganization);
    }*/
    return savedOrganization;
  }

  public async createStore(
    entityManager: EntityManager,
    newOrganization: Partial<Organization>,
    {
      storeFormat,
      catalog,
      channels
    }: {
      storeFormat: StoreFormat;
      catalog: Catalog;
      channels: Channel[];
    }
  ) {
    const store = new Store();
    store.name = newOrganization.name;
    store.code = newOrganization.code;
    store.addressLine1 = newOrganization.addressLine1;
    store.addressLine2 = newOrganization.addressLine2;
    store.city = newOrganization.city;
    store.state = newOrganization.state;
    store.pinCode = newOrganization.pinCode;
    store.country = newOrganization.country;
    store.STATUS = StatusEnum.ACTIVE;
    // store.storeFormats = [storeFormat];
    // store.channels = channels;
    // store.catalog = catalog;
    return entityManager.save(store);
  }

  public async addAdmin(
    entityManager: EntityManager,
    newOrganization: Organization,
    adminUser: User
  ) {
    const adminRole = await findOrCreateAdminRole(entityManager);
    // add role to org
    adminUser.roles = [adminRole];
    // save and return org
    const admin = await entityManager.save(adminUser);
    newOrganization.users = newOrganization.users ? newOrganization.users : [];
    newOrganization.users.push(admin);
    return entityManager.save(newOrganization);
  }

  public async deleteOrganization(
    entityManager: EntityManager,
    id: string
  ): Promise<Organization> {
    const selectedOrganization = await entityManager.findOne(Organization, id);
    if (!selectedOrganization) {
      throw new WalkinRecordNotFoundError("The selected node does not exists");
    }
    const treeRepo = entityManager.getTreeRepository(Organization);
    const orgTree = await treeRepo.findDescendantsTree(selectedOrganization);
    if (orgTree.children && orgTree.children.length > 0) {
      throw new WalkinRecordNotFoundError(
        "The selected node has childrens first remove all the children then delete this node"
      );
    } else {
      const deletedOrg = await treeRepo.remove(selectedOrganization);
      if (selectedOrganization.organizationType === ORGANIZATION_TYPES.STORE) {
        // const storeTodelete = selectedOrganization.store;
        // await entityManager.remove(storeTodelete);
      }
      return deletedOrg;
    }
  }

  public async deleteOrganizationHierarchy(
    entityManager: EntityManager,
    id: string
  ) {
    const selectedOrganization = await entityManager.findOne(Organization, id);
    if (!selectedOrganization) {
      throw new WalkinRecordNotFoundError("The selected node does not exists");
    }
    const organizationRepo = getManager().getTreeRepository(Organization);
    const descendantOrganizations = await organizationRepo.findDescendants(
      selectedOrganization
    );
    return organizationRepo.remove(descendantOrganizations);
  }

  public async updateOrganization(entityManager, organization) {
    let organizationToUpdate = await entityManager.findOne(
      Organization,
      organization.id
    );
    if (!organizationToUpdate) {
      throw new WalkinRecordNotFoundError("Organization Not Found");
    }
    if (organization.code) {
      const uniqueOrganizationCode = await entityManager.findOne(Organization, {
        where: {
          code: organization.code,
          id: Not(organization.id)
        }
      });
      if (uniqueOrganizationCode) {
        throw new WCoreError(WCORE_ERRORS.ORG_CODE_EXISTS);
      }
    }
    organizationToUpdate = updateEntity(organizationToUpdate, organization);
    // Handle Entity Extensions

    const { extend } = organization;
    if (extend !== undefined) {
      try {
        const extendData = await validateAndReturnEntityExtendedData(
          entityManager,
          extend,
          organization.id,
          "organization"
        );
        organizationToUpdate.extend = extendData;
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

    const orgToUpdate = entityManager.save(organizationToUpdate);
    const stores = await this.getOrganizationStores(
      entityManager,
      organization.id
    );
    for (const store of stores) {
      callLoadStoreSearch(store.id);
    }

    const keys = [`${CACHING_KEYS.ORGANIZATION}_${organization.id}`];
    removeValueFromCache(keys);

    return orgToUpdate;
  }

  public async getOrganizationRoots(
    entityManager: EntityManager
  ): Promise<Organization[]> {
    const roots = await entityManager
      .getTreeRepository(Organization)
      .findRoots();
    return roots;
  }

  public async linkUserToOrganization(entityManager, organizationId, userId) {
    const organization = await entityManager.findOneOrFail(
      Organization,
      {
        where: {
          id: organizationId
        }
      },
      {
        relations: ["users"]
      }
    );
    const user = await entityManager.findOneOrFail(User, {
      where: {
        id: userId
      }
    });
    if (organization.users && organization.users.length > 0) {
      organization.users.push(user);
    } else {
      organization.users = [user];
    }
    return entityManager.save(organization);
  }
  public async linkOrganizationToWalkinProducts(
    entityManager,
    organizationId,
    walkinProductNames
  ) {
    let organization = await this.getOrganization(
      entityManager,
      organizationId
    );
    const walkinProducts = await entityManager.find(WalkinProduct, {
      where: {
        name: In(walkinProductNames)
      }
    });
    if (walkinProducts.length > 0) {
      walkinProducts.forEach(walkinProduct => {
        organization.walkinProducts.push(walkinProduct);
      });
    }
    organization = await Initialize.initProducts(
      entityManager,
      organization,
      walkinProducts
    );
    return entityManager.save(organization);
  }

  public async subOrganizations(transactionManager, parentId, type, status) {
    const parentOrganization = await this.getOrganization(
      transactionManager,
      parentId
    );
    const trees = await transactionManager
      .getTreeRepository(Organization)
      .findDescendants(parentOrganization);
    return trees.filter(org => {
      if (type && org.organizationType !== type) {
        return false;
      }
      if (status && org.status !== status) {
        return false;
      }
      return true;
    });
  }

  public async linkOrganizationToMetrics(
    entityManager,
    organizationId,
    walkinProduct,
    injector
  ) {
    const result: any = [];

    const organization: Organization = await entityManager.findOneOrFail(
      Organization,
      {
        where: {
          id: organizationId
        }
      },
      {
        relations: ["metrics", "walkinProducts"]
      }
    );
    const metrics = BASIC_METRIC_DATA;
    const savedOrganization = organization;

    const filters = [];

    for (const metricFilter of BASIC_METRIC_FILTERS) {
      const metricFilterInput: any = metricFilter;

      metricFilterInput.organizationId = savedOrganization.id;

      const metricFilterResult = await injector
        .get(MetricProvider)
        .createMetricFilter(entityManager, metricFilterInput);
      filters.push(metricFilterResult);

      for (const metric of metrics) {
        const metricInput: any = metric;
        metricInput.filters = filters;
        metricInput.organization = savedOrganization.id;
        const res = await injector
          .get(MetricProvider)
          .createMetric(entityManager, metricInput);
        result.push(res);
      }
      return result;
    }
  }

  public async getOrganizationStores(
    entityManager: EntityManager,
    organizationId: String
  ): Promise<Store[] | any> {
    let stores = await entityManager
      .getRepository(Store)
      .createQueryBuilder("store")
      .leftJoinAndSelect("store.organization", "organization")
      .where("organization.id=:organizationId", {
        organizationId
      })
      .getMany();

    return stores;
  }
}
