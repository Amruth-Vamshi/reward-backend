// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { ProductCollectionProvider } from "../productCollection.providers";
import { ProductCollectionModule } from "../productCollection.module";
import { resolvers } from "../productCollection.resolvers";
import * as WCoreEntities from "../../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import { STATUS } from "../../../common/constants";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { ProductProvider } from "../../product/product.providers";
import { ProductModule } from "../../product/product.module";
import { ChannelProvider } from "../../channel/channel.providers";
import { ChannelModule } from "../../channel/channel.module";
import { ChargeTypeProvider } from "../../chargeType/chargeType.providers";
import { ChargeModule } from "../../chargeType/chargeType.module";
import { StoreFormatModule } from "../../storeformat/storeFormat.module";
import { StoreFormatProvider } from "../../storeformat/storeFormat.providers";
import { TaxTypeModule } from "../../taxtype/taxtype.module";
import { TaxTypeProvider } from "../../taxtype/taxtype.providers";
import { CollectionModule } from "../../collection/collection.module";
import { CollectionProvider } from "../../collection/collection.providers";
import { resolvers as collectionResolver } from "../../collection/collection.resolvers";
let user: WCoreEntities.User;
const chance = new Chance();

const productCollectionProvider: ProductCollectionProvider = ProductCollectionModule.injector.get(
  ProductCollectionProvider
);

const productProvider: ProductProvider = ProductModule.injector.get(
  ProductProvider
);

const channelProvider: ChannelProvider = ChannelModule.injector.get(
  ChannelProvider
);

const chargeTypeProvider: ChargeTypeProvider = ChargeModule.injector.get(
  ChargeTypeProvider
);

const storeFormatProvider: StoreFormatProvider = StoreFormatModule.injector.get(
  StoreFormatProvider
);

const taxTypeProvider: TaxTypeProvider = TaxTypeModule.injector.get(
  TaxTypeProvider
);

const collectionProvider: CollectionProvider = CollectionModule.injector.get(
  CollectionProvider
);

const createCustomTaxType = async manager => {
  return taxTypeProvider.createTaxType(manager, {
    name: chance.string(),
    description: "",
    taxTypeCode: chance.string({ length: 5 }),
    organizationId: user.organization.id,
    status: STATUS.ACTIVE
  });
};

const createProduct = async manager => {
  const productInput = {
    name: chance.string(),
    description: chance.sentence(),
    code: chance.string(),
    status: STATUS.ACTIVE,
    categoryIds: [],
    imageUrl: chance.url(),
    sku: chance.string()
  };
  const product = await productProvider.createProduct(manager, {
    ...productInput,
    organizationId: user.organization.id
  });

  return product;
};

const createCollection = async manager => {
  const name = chance.string();
  const createdcollection = await collectionResolver.Mutation.createCollection(
    { user },
    {
      input: { name }
    },
    { injector: CollectionModule.injector }
  );
  return createdcollection;
};

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should create a product", () => {
  test("should Create a product for valid input", async () => {
    const manager = getManager();
    const createdProduct = await createProduct(manager);
    const createdProduct1 = await createProduct(manager);
    const createdCollection1 = await createCollection(manager);
    const createdCollection2 = await createCollection(manager);
    const createCollection3 = await createCollection(manager);
    const createProductCollection = await resolvers.Mutation.addProductsToCollection(
      { user },
      {
        input: {
          productId: [createdProduct.id, createdProduct1.id],
          collectionCode: createdCollection1.code
        }
      },
      { injector: ProductCollectionModule.injector }
    );
    expect(createProductCollection).toBeDefined();
  });
});

describe("Should remove a product from collection", () => {
  test("Should remove a product from collection ", async () => {
    const manager = getManager();
    const createdProduct = await createProduct(manager);
    const createdProduct1 = await createProduct(manager);
    const createdCollection1 = await createCollection(manager);
    const createdCollection2 = await createCollection(manager);
    const createCollection3 = await createCollection(manager);
    const createProductCollection = await resolvers.Mutation.addProductsToCollection(
      { user },
      {
        input: {
          productId: [createdProduct.id, createdProduct1.id],
          collectionCode: createdCollection1.code
        }
      },
      { injector: ProductCollectionModule.injector }
    );
    const removeCollectionFromProduct = await resolvers.Mutation.removeProductsFromCollection(
      { user },
      {
        input: {
          productId: [createdProduct.id],
          collectionCode: createdCollection1.code
        }
      },
      { injector: ProductCollectionModule.injector }
    );
    expect(removeCollectionFromProduct).toBeDefined();
    expect(removeCollectionFromProduct).toHaveLength(1);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
