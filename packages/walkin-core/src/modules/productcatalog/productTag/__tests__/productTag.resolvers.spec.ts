// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { ProductTagProvider } from "../productTag.providers";
import { ProductTagModule } from "../productTag.module";
import { resolvers } from "../productTag.resolvers";
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
import { TagModule } from "../../tag/tag.module";
import { TagProvider } from "../../tag/tag.providers";
import { resolvers as tagResolver } from "../../tag/tag.resolvers";
let user: WCoreEntities.User;
const chance = new Chance();

const productTagProviders: ProductTagProvider = ProductTagModule.injector.get(
  ProductTagProvider
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

const tagProvider: TagProvider = TagModule.injector.get(TagProvider);

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

const createTag = async manager => {
  const name = chance.string();
  const createdTag = await tagResolver.Mutation.createTag(
    { user },
    {
      input: {
        name
      }
    },
    { injector: TagModule.injector }
  );
  return createdTag;
};

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should create a product tag", () => {
  test("should Create a product tag for valid input", async () => {
    const manager = getManager();
    const createdProduct = await createProduct(manager);
    const createdTag1 = await createTag(manager);
    const createdTag2 = await createTag(manager);
    const createdTag3 = await createTag(manager);
    const productTag = await resolvers.Mutation.addTagsToProduct(
      { user },
      {
        input: {
          productId: createdProduct.id,
          tagCodes: [createdTag1.code, createdTag2.code, createdTag3.code]
        }
      },
      { injector: ProductTagModule.injector }
    );

    expect(productTag).toBeDefined();
    expect(productTag[0].product).toBeDefined();
    expect(productTag[0].product.id).toBeDefined();
  });
});

describe("Should Remove a product tag", () => {
  test("should be able to remove a product tag", async () => {
    const manager = getManager();
    const createdProduct = await createProduct(manager);
    const createdTag1 = await createTag(manager);
    const createdTag2 = await createTag(manager);
    const createdTag3 = await createTag(manager);
    const productTag = await resolvers.Mutation.addTagsToProduct(
      { user },
      {
        input: {
          productId: createdProduct.id,
          tagCodes: [createdTag1.code, createdTag2.code, createdTag3.code]
        }
      },
      { injector: ProductTagModule.injector }
    );

    const removeProductTag = await resolvers.Mutation.removeTagsFromProduct(
      { user },
      {
        input: {
          productId: createdProduct.id,
          tagCodes: [createdTag1.code, createdTag2.code]
        }
      },
      { injector: ProductTagModule.injector }
    );

    expect(removeProductTag).toBeDefined();
    expect(removeProductTag).toHaveLength(2);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
