import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../walkin-core/__tests__/utils/unit/index";
import * as CoreEntities from "../../../../../walkin-core/src/entity";
import * as RewardxEntities from "../../../entity";
import Chance from "chance";
import { getConnection, getManager } from "typeorm";
import { ApplicationProvider } from "../../../../../walkin-core/src/modules/account/application/application.providers";
import { ApplicationModule } from "../../../../../walkin-core/src/modules/account/application/application.module";
import { CollectionsProvider } from "../../collections/collections.provider";
import { CollectionsModule } from "../../collections/collections.module";
import { STATUS } from "../../../../../walkin-core/src/modules/common/constants";
import { COLLECTIONS_ENTITY_TYPE } from "../../common/constants/constant";
import { CollectionsItemsProvider } from "../collection-items.provider";
import { CollectionsItemsModule } from "../collection-items.module";
import { ProductProvider } from "../../../../../walkin-core/src/modules/productcatalog/product/product.providers";
import { ProductModule } from "../../../../../walkin-core/src/modules/productcatalog/product/product.module";
import { WCORE_ERRORS } from "../../../../../walkin-core/src/modules/common/constants/errors";
import { WCoreError } from "../../../../../walkin-core/src/modules/common/exceptions";

let user: CoreEntities.User;
let application: CoreEntities.Application;
const chance = new Chance();
let productInput = {
  name: chance.string(),
  description: chance.string(),
  code: "PRODUCT_CODE",
  status: STATUS.ACTIVE,
  categoryIds: [],
  imageUrl: chance.url(),
  sku: chance.string(),
  isPurchasedSeparately: false
};

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);
const collectionsService: CollectionsProvider = CollectionsModule.injector.get(
  CollectionsProvider
);
const collectionItemssService: CollectionsItemsProvider = CollectionsItemsModule.injector.get(
  CollectionsItemsProvider
);
const productService: ProductProvider = ProductModule.injector.get(
  ProductProvider
);

let campaign: any;
const collectionsInjector = CollectionsModule.injector;
const collectionItemsInjector = CollectionsItemsModule.injector;

beforeAll(async () => {
  await createUnitTestConnection({ ...CoreEntities, ...RewardxEntities });
  ({ user } = await getAdminUser(getConnection()));
  const manager = getManager();

  application = await applicationService.createApplication(
    manager,
    user.organization.id,
    {
      name: chance.string({ length: 5 })
    }
  );
});

describe("Create collection items", () => {
  test("Create collection items with valid input", async () => {
    test("Create Collections with valid inputs", async () => {
      const manager = getManager();

      const createCollectionsInput = {
        name: chance.string(),
        description: chance.string(),
        status: STATUS.ACTIVE,
        organizationId: user.organization.id,
        campaignId: campaign.id,
        entity: COLLECTIONS_ENTITY_TYPE.PRODUCT
      };
      const createdCollections = await collectionsService.createCollections(
        manager,
        collectionsInjector,
        createCollectionsInput
      );
      expect(createdCollections).toBeDefined();
      expect(createdCollections.id).toBeDefined();
      expect(createdCollections.organizationId).toBe(user.organization.id);

      productInput["organizationId"] = user.organization.id;
      const product = await productService.createProduct(manager, {
        ...productInput,
        organizationId: user.organization.id
      });

      const createCollectionItemsInput = {
        itemId: product.id,
        collectionsId: createdCollections.id,
        itemDetails: {
          "name": chance.string(),
          "code": chance.string(),
          "phoneNumber": "9292929292",
          "externalCustomerId": chance.string(),
          "externalProductId": chance.string(),
          "latitude": chance.latitude(),
          "longitude": chance.longitude
        }
      };
      const createCollectionItems = await collectionItemssService.createCollectionItems(
        manager,
        collectionItemsInjector,
        createCollectionItemsInput
      );
      expect(createCollectionItems).toBeDefined();
      expect(createCollectionItems.id).toBeDefined();
      expect(createCollectionItems.itemId).toBe(product.id);
      expect(createCollectionItems.collectionsId).toBe(createdCollections.id);
    });
    test("Create Collections when item is not present", async () => {
      const manager = getManager();

      const createCollectionsInput = {
        name: chance.string(),
        description: chance.string(),
        status: STATUS.ACTIVE,
        organizationId: user.organization.id,
        campaignId: campaign.id,
        entity: COLLECTIONS_ENTITY_TYPE.PRODUCT
      };
      const createdCollections = await collectionsService.createCollections(
        manager,
        collectionsInjector,
        createCollectionsInput
      );
      expect(createdCollections).toBeDefined();
      expect(createdCollections.id).toBeDefined();
      expect(createdCollections.organizationId).toBe(user.organization.id);

      productInput["organizationId"] = user.organization.id;
      const product = await productService.createProduct(manager, {
        ...productInput,
        organizationId: user.organization.id
      });

      const createCollectionItemsInput = {
        itemId: chance.string(),
        collectionsId: createdCollections.id,
        itemDetails: {
          "name": chance.string(),
          "code": chance.string(),
          "phoneNumber": "9292929292",
          "externalCustomerId": chance.string(),
          "externalProductId": chance.string(),
          "latitude": chance.latitude(),
          "longitude": chance.longitude
        }
      };
      const createCollectionItems = await collectionItemssService.createCollectionItems(
        manager,
        collectionItemsInjector,
        createCollectionItemsInput
      );
      expect(createCollectionItems).toBeDefined();
      expect(createCollectionItems.id).toBeDefined();
      expect(createCollectionItems.itemId).toBeDefined();
      expect(createCollectionItems.collectionsId).toBe(createdCollections.id);
    });
    test("Fetch Collection item with valid inputs", async () => {
      const manager = getManager();

      const createCollectionsInput = {
        name: chance.string(),
        description: chance.string(),
        status: STATUS.ACTIVE,
        organizationId: user.organization.id,
        campaignId: campaign.id,
        entity: COLLECTIONS_ENTITY_TYPE.PRODUCT
      };
      const createdCollections = await collectionsService.createCollections(
        manager,
        collectionsInjector,
        createCollectionsInput
      );
      expect(createdCollections).toBeDefined();
      expect(createdCollections.id).toBeDefined();
      expect(createdCollections.organizationId).toBe(user.organization.id);

      productInput["organizationId"] = user.organization.id;
      const product = await productService.createProduct(manager, {
        ...productInput,
        organizationId: user.organization.id
      });

      const createCollectionItemsInput = {
        itemId: product.id,
        collectionsId: createdCollections.id
      };
      const createCollectionItems = await collectionItemssService.createCollectionItems(
        manager,
        collectionItemsInjector,
        createCollectionItemsInput
      );
      expect(createCollectionItems).toBeDefined();
      expect(createCollectionItems.id).toBeDefined();
      expect(createCollectionItems.itemId).toBe(product.id);
      expect(createCollectionItems.collectionsId).toBe(createdCollections.id);

      const collectionItem = await collectionItemssService.getCollectionItemsById(
        manager,
        createCollectionItems.id,
        user.organization.id
      );
      expect(collectionItem).toBeDefined();
      expect(collectionItem.id).toBeDefined();
      expect(collectionItem.itemId).toBe(product.id);
      expect(collectionItem.collectionsId).toBe(createdCollections.id);
    });
    test("Fetch Collection items with valid inputs", async () => {
      const manager = getManager();

      const createCollectionsInput = {
        name: chance.string(),
        description: chance.string(),
        status: STATUS.ACTIVE,
        organizationId: user.organization.id,
        campaignId: campaign.id,
        entity: COLLECTIONS_ENTITY_TYPE.PRODUCT
      };
      const createdCollections = await collectionsService.createCollections(
        manager,
        collectionsInjector,
        createCollectionsInput
      );
      expect(createdCollections).toBeDefined();
      expect(createdCollections.id).toBeDefined();
      expect(createdCollections.organizationId).toBe(user.organization.id);

      productInput["organizationId"] = user.organization.id;
      const product = await productService.createProduct(manager, {
        ...productInput,
        organizationId: user.organization.id
      });

      const createCollectionItemsInput = {
        itemId: product.id,
        collectionsId: createdCollections.id
      };
      const createCollectionItems = await collectionItemssService.createCollectionItems(
        manager,
        collectionItemsInjector,
        createCollectionItemsInput
      );
      expect(createCollectionItems).toBeDefined();
      expect(createCollectionItems.id).toBeDefined();
      expect(createCollectionItems.itemId).toBe(product.id);
      expect(createCollectionItems.collectionsId).toBe(createdCollections.id);

      const getCollectionItemsInput = {
        itemId: product.id,
        collectionsId: createdCollections.id
      };
      const collectionItems = await collectionItemssService.getCollectionItems(
        manager,
        collectionItemsInjector,
        getCollectionItemsInput
      );
      expect(collectionItems).toBeDefined();
      expect(collectionItems[0].id).toBeDefined();
      expect(collectionItems[0].itemId).toBe(product.id);
      expect(collectionItems[0].collectionsId).toBe(createdCollections.id);
    });
    test("Should FAIL to create collections items for invalid item id", async () => {
      const manager = getManager();

      const createCollectionsInput = {
        name: chance.string(),
        description: chance.string(),
        status: STATUS.ACTIVE,
        organizationId: user.organization.id,
        campaignId: campaign.id,
        entity: COLLECTIONS_ENTITY_TYPE.PRODUCT
      };
      const createdCollections = await collectionsService.createCollections(
        manager,
        collectionsInjector,
        createCollectionsInput
      );
      expect(createdCollections).toBeDefined();
      expect(createdCollections.id).toBeDefined();
      expect(createdCollections.organizationId).toBe(user.organization.id);

      const createCollectionItemsInput = {
        itemId: chance.string(),
        collectionsId: createdCollections.id
      };
      try {
        await collectionItemssService.createCollectionItems(
          manager,
          collectionItemsInjector,
          createCollectionItemsInput
        );
      } catch (e) {
        const error = WCORE_ERRORS.ENTITY_NOT_FOUND;
        error.MESSAGE = `Product not found`;
        expect(e).toEqual(new WCoreError(error));
      }
    });
    test("Should FAIL to create collections items for invalid collections id", async () => {
      const manager = getManager();
      productInput["organizationId"] = user.organization.id;
      const product = await productService.createProduct(manager, {
        ...productInput,
        organizationId: user.organization.id
      });

      const createCollectionItemsInput = {
        itemId: product.id,
        collectionsId: chance.string()
      };
      try {
        await collectionItemssService.createCollectionItems(
          manager,
          collectionItemsInjector,
          createCollectionItemsInput
        );
      } catch (error) {
        expect(error).toEqual(
          new WCoreError(WCORE_ERRORS.COLLECTIONS_NOT_FOUND)
        );
      }
    });
    test("Remove collection items", async () => {
      const manager = getManager();
      const createCollectionsInput = {
        name: chance.string(),
        description: chance.string(),
        status: STATUS.ACTIVE,
        organizationId: user.organization.id,
        campaignId: campaign.id,
        entity: COLLECTIONS_ENTITY_TYPE.PRODUCT
      };
      const createdCollections = await collectionsService.createCollections(
        manager,
        collectionsInjector,
        createCollectionsInput
      );
      expect(createdCollections).toBeDefined();
      expect(createdCollections.id).toBeDefined();
      expect(createdCollections.organizationId).toBe(user.organization.id);

      productInput["organizationId"] = user.organization.id;
      const product = await productService.createProduct(manager, {
        ...productInput,
        organizationId: user.organization.id
      });

      const createCollectionItemsInput = {
        itemId: product.id,
        collectionsId: createdCollections.id
      };
      const createCollectionItems = await collectionItemssService.createCollectionItems(
        manager,
        collectionItemsInjector,
        createCollectionItemsInput
      );
      expect(createCollectionItems).toBeDefined();
      expect(createCollectionItems.id).toBeDefined();
      expect(createCollectionItems.itemId).toBe(product.id);
      expect(createCollectionItems.collectionsId).toBe(createdCollections.id);

      const removeCollectionItemsInput = {
        collectionItemsId: createCollectionItems.id,
        organizationId: user.organization.id
      };
      const removedCollectionItems = await collectionItemssService.removeCollectionItems(
        manager,
        collectionItemsInjector,
        removeCollectionItemsInput
      );
      expect(removedCollectionItems).toBeDefined();
    });
    test("Should FAIL to remove invalid collection items", async () => {
      const manager = getManager();
      const createCollectionsInput = {
        name: chance.string(),
        description: chance.string(),
        status: STATUS.ACTIVE,
        organizationId: user.organization.id,
        campaignId: campaign.id,
        entity: COLLECTIONS_ENTITY_TYPE.PRODUCT
      };
      const createdCollections = await collectionsService.createCollections(
        manager,
        collectionsInjector,
        createCollectionsInput
      );
      expect(createdCollections).toBeDefined();
      expect(createdCollections.id).toBeDefined();
      expect(createdCollections.organizationId).toBe(user.organization.id);

      productInput["organizationId"] = user.organization.id;
      const product = await productService.createProduct(manager, {
        ...productInput,
        organizationId: user.organization.id
      });

      const createCollectionItemsInput = {
        itemId: product.id,
        collectionsId: createdCollections.id
      };
      const createCollectionItems = await collectionItemssService.createCollectionItems(
        manager,
        collectionItemsInjector,
        createCollectionItemsInput
      );
      expect(createCollectionItems).toBeDefined();
      expect(createCollectionItems.id).toBeDefined();
      expect(createCollectionItems.itemId).toBe(product.id);
      expect(createCollectionItems.collectionsId).toBe(createdCollections.id);

      try {
        const removeCollectionItemsInput = {
          collectionItemsId: chance.string(),
          organizationId: user.organization.id
        };
        collectionItemssService.removeCollectionItems(
          manager,
          collectionItemsInjector,
          removeCollectionItemsInput
        );
      } catch (error) {
        expect(error).toEqual(
          new WCoreError(WCORE_ERRORS.COLLECTION_ITEM_NOT_FOUND)
        );
      }
    });
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
