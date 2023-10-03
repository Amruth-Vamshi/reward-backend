import * as CoreEntities from "../../../../entity";
import {
  closeUnitTestConnection,
  createUnitTestConnection,
  getAdminUser,
} from "../../../../../__tests__/utils/unit";
import { getManager, getConnection, EntityManager } from "typeorm";
import { Chance } from "chance";
import { StoreModule } from "../../store/store.module";
import { Stores, StoreOpenTimingProvider } from "../../store/store.providers";
import { StoreFormatModule } from "../../../productcatalog/storeformat/storeFormat.module";
import { StoreFormatProvider } from "../../../productcatalog/storeformat/storeFormat.providers";
import { TaxTypeModule } from "../../../productcatalog/taxtype/taxtype.module";
import { TaxTypeProvider } from "../../../productcatalog/taxtype/taxtype.providers";
import { ChannelModule } from "../../../productcatalog/channel/channel.module";
import { ChannelProvider } from "../../../productcatalog/channel/channel.providers";
import { CatalogModule } from "../../../productcatalog/catalog/catalog.module";
import { CatalogProvider } from "../../../productcatalog/catalog/catalog.providers";
import {
  ENUM_DAY,
  STATUS,
  AREA_TYPE,
  ENUM_DELIVERY_LOCATION_TYPE,
  STAFF_ROLE,
  STORE_SERVICE_AREA_TYPE,
} from "../../../common/constants/constants";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { WCoreError } from "../../../common/exceptions";
import { StoreServiceAreaModule } from "../store-service-area.module";
import * as resolvers from "../store-service-area.resolvers";
import {
  StoreServiceAreaProvider,
  IStoreServiceArea,
} from "../store-service-area.providers";
import { OrganizationModule } from "../../organization/organization.module";
const storeFormatProvider = StoreFormatModule.injector.get(StoreFormatProvider);
const taxTypeProvider = TaxTypeModule.injector.get(TaxTypeProvider);
const channelProvider = ChannelModule.injector.get(ChannelProvider);
const catalogProvider = CatalogModule.injector.get(CatalogProvider);
const storeServiceArea = StoreServiceAreaModule.injector.get(
  StoreServiceAreaProvider
);
let user: CoreEntities.User;
const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const storeProvider: Stores = StoreModule.injector.get(Stores);
const storeOpenTimingProvider: StoreOpenTimingProvider = StoreModule.injector.get(
  StoreOpenTimingProvider
);

describe("Add  store service area", () => {
  test("should add store service area", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 }),
      },
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 6 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode],
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id,
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const storeServiceAreaValue: IStoreServiceArea = {
      storeId: store.id,
      organizationId: store.organization.id,
      serviceAreaValue: "2500",
      serviceAreaType: STORE_SERVICE_AREA_TYPE.RADIUS,
    };
    const addStoreServiceArea = await resolvers.default.Mutation.addStoreServiceArea(
      { user },
      {
        input: storeServiceAreaValue,
      },
      { injector: StoreServiceAreaModule.injector }
    );
    expect(addStoreServiceArea).toBeDefined();
    expect(addStoreServiceArea.area).toBe(
      storeServiceAreaValue.serviceAreaValue
    );
  });

  test("should update store service  area for geo area", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 }),
      },
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 10 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode],
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id,
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const storeServiceAreaValue: IStoreServiceArea = {
      storeId: store.id,
      organizationId: store.organization.id,
      serviceAreaValue: "2500",
      serviceAreaType: STORE_SERVICE_AREA_TYPE.RADIUS,
    };
    const addStoreServiceArea = await resolvers.default.Mutation.addStoreServiceArea(
      { user },
      {
        input: storeServiceAreaValue,
      },
      { injector: StoreServiceAreaModule.injector }
    );

    const updateStoreServiceAreaValues: IStoreServiceArea = {
      id: addStoreServiceArea.id,
      serviceAreaValue: "2600",
      serviceAreaType: STORE_SERVICE_AREA_TYPE.RADIUS,
    };
    const updateStoreServiceArea = await resolvers.default.Mutation.updateStoreServiceArea(
      { user },
      {
        input: updateStoreServiceAreaValues,
      },
      { injector: StoreServiceAreaModule.injector }
    );
    expect(updateStoreServiceArea).toBeDefined();
    expect(updateStoreServiceArea.area).toBeDefined();
    expect(updateStoreServiceArea.area).toBe(
      updateStoreServiceAreaValues.serviceAreaValue
    );
  });

  test("should disbale store service  area for geo area", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 }),
      },
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 10 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode],
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id,
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const storeServiceAreaValue: IStoreServiceArea = {
      storeId: store.id,
      organizationId: store.organization.id,
      serviceAreaValue: "2500",
      serviceAreaType: STORE_SERVICE_AREA_TYPE.RADIUS,
    };
    const addStoreServiceArea = await resolvers.default.Mutation.addStoreServiceArea(
      { user },
      {
        input: storeServiceAreaValue,
      },
      { injector: StoreServiceAreaModule.injector }
    );
    const updateStoreServiceArea = await resolvers.default.Mutation.disableStoreServiceArea(
      { user },
      {
        id: addStoreServiceArea.id,
        organizationId: user.organization.id,
      },
      { injector: StoreServiceAreaModule.injector }
    );
    expect(updateStoreServiceArea).toBeDefined();
    expect(updateStoreServiceArea.area).toBeDefined();
    expect(updateStoreServiceArea.status).toBeDefined();
    expect(updateStoreServiceArea.status).toBe(STATUS.INACTIVE);
  });

  test("should enable a disbaled store service  area for geo area", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 }),
      },
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 10 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode],
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id,
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const storeServiceAreaValue: IStoreServiceArea = {
      storeId: store.id,
      organizationId: store.organization.id,
      serviceAreaValue: "2500",
      serviceAreaType: STORE_SERVICE_AREA_TYPE.RADIUS,
    };
    const addStoreServiceArea = await resolvers.default.Mutation.addStoreServiceArea(
      { user },
      {
        input: storeServiceAreaValue,
      },
      { injector: StoreServiceAreaModule.injector }
    );
    const updateStoreServiceArea = await resolvers.default.Mutation.disableStoreServiceArea(
      { user },
      { id: addStoreServiceArea.id, organizationId: user.organization.id },
      { injector: StoreServiceAreaModule.injector }
    );
    const enableStoreServiceArea = await resolvers.default.Mutation.enableStoreServiceArea(
      { user },
      { id: addStoreServiceArea.id, organizationId: user.organization.id },
      { injector: StoreServiceAreaModule.injector }
    );
    expect(enableStoreServiceArea).toBeDefined();
    expect(enableStoreServiceArea.area).toBeDefined();
    expect(enableStoreServiceArea.status).toBeDefined();
    expect(enableStoreServiceArea.status).toBe(STATUS.ACTIVE);
  });

  test("should get a store service area", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 }),
      },
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 6 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode],
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id,
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const storeServiceAreaValue: IStoreServiceArea = {
      storeId: store.id,
      organizationId: store.organization.id,
      serviceAreaValue: "2500",
      serviceAreaType: STORE_SERVICE_AREA_TYPE.RADIUS,
    };
    const addStoreServiceArea = await resolvers.default.Mutation.addStoreServiceArea(
      { user },
      {
        input: storeServiceAreaValue,
      },
      { injector: StoreServiceAreaModule.injector }
    );
    const getStoreServiceArea = await resolvers.default.Query.getStoreServiceArea(
      { user },
      {
        id: addStoreServiceArea.id,
        organizationId: user.organization.id,
      },
      { injector: StoreServiceAreaModule.injector }
    );
    expect(getStoreServiceArea).toBeDefined();
    expect(getStoreServiceArea.area).toBe(
      storeServiceAreaValue.serviceAreaValue
    );
  });

  test("should get multiple store service area", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 }),
      },
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 6 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode],
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id,
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const storeServiceAreaValue: IStoreServiceArea = {
      storeId: store.id,
      organizationId: store.organization.id,
      serviceAreaValue: "2500",
      serviceAreaType: STORE_SERVICE_AREA_TYPE.RADIUS,
    };
    await resolvers.default.Mutation.addStoreServiceArea(
      { user },
      {
        input: storeServiceAreaValue,
      },
      { injector: StoreServiceAreaModule.injector }
    );
    const storeServiceAreaValue1: IStoreServiceArea = {
      storeId: store.id,
      organizationId: store.organization.id,
      serviceAreaValue: "2500",
      serviceAreaType: STORE_SERVICE_AREA_TYPE.RADIUS,
    };
    await resolvers.default.Mutation.addStoreServiceArea(
      { user },
      {
        input: storeServiceAreaValue1,
      },
      { injector: StoreServiceAreaModule.injector }
    );
    const getStoreServiceAreas = await resolvers.default.Query.getStoreServiceAreas(
      { user },
      {
        storeId: store.id,
        organizationId: user.organization.id,
      },
      { injector: StoreServiceAreaModule.injector }
    );
    expect(getStoreServiceAreas).toBeDefined();
    expect(getStoreServiceAreas).toHaveLength(2);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
