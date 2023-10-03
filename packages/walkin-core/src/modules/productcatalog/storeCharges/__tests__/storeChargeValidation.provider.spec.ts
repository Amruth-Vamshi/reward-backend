import { getManager, getConnection } from "typeorm";
import * as CoreEntities from "@walkinserver/walkin-core/src/entity";
import {
    createUnitTestConnection,
    getAdminUser,
    closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import { OrganizationModule } from "../../../account/organization/organization.module";
import { Organizations } from "../../../account/organization/organization.providers";
import {
    WALKIN_PRODUCTS,
    STATUS,
    ENUM_DAY,
    STAFF_ROLE,
    STORE_CHARGE_TYPE,
    STORE_CHARGE_VALUE_TYPE
} from "../../../common/constants";
import { OrderXEntities } from "../../../../../../walkin-orderx/src";
import * as StoreResolvers from "../../../account/store/store.resolvers";
import { StoreModule } from "../../../account/store/store.module";
import { resolvers as ChannelResolvers } from "../../channel/channel.resolvers";
import { ChannelModule } from "../../channel/channel.module";
import { TaxTypeProvider } from "../../taxtype/taxtype.providers";
import { TaxTypeModule } from "../../taxtype/taxtype.module";
import { Chance } from "chance";
import { StoreFormatModule } from "../../storeformat/storeFormat.module";
import * as storeFormatResolvers from "../../storeformat/storeFormat.resolvers";
import * as catalogResolver from "../../catalog/catalog.resolvers";
import { CatalogModule } from "../../catalog/catalog.module";
import { StoreOpenTimingProvider } from "../../../account/store/store.providers";
import { StoreChargeProvider } from "../storeCharge.providers";
import { StoreChargeModule } from "../storeCharge.module";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
const organizationService: Organizations = OrganizationModule.injector.get(
    Organizations
);
const storeOpenTimingProvider: StoreOpenTimingProvider = StoreModule.injector.get(
    StoreOpenTimingProvider
);
const taxTypeProvider: TaxTypeProvider = TaxTypeModule.injector.get(
    TaxTypeProvider
);
const storeChargeProvider: StoreChargeProvider = StoreChargeModule.injector.get(
    StoreChargeProvider
);
let user: CoreEntities.User;
let channel: CoreEntities.Channel;
const chance = new Chance();
beforeAll(async () => {
    await createUnitTestConnection({ ...CoreEntities, ...OrderXEntities });
    ({ user } = await getAdminUser(getConnection()));
    const manager = getManager();
    const walkinProducts = [WALKIN_PRODUCTS.ORDERX];
    const org = await organizationService.linkOrganizationToWalkinProducts(
        manager,
        user.organization.id,
        walkinProducts
    );
    const name = chance.string();
    channel = await ChannelResolvers.Mutation.createChannel(
        { user },
        {
            input: {
                name,
                channelCode: "BOT"
            }
        },
        { injector: ChannelModule.injector }
    );
    user.organization.applications.push(org.applications);
});

const createCustomTaxType = async manager => {
    return taxTypeProvider.createTaxType(manager, {
        name: chance.string(),
        description: "",
        taxTypeCode: chance.string({ length: 5 }),
        organizationId: user.organization.id,
        status: STATUS.ACTIVE
    });
};

describe("Create store charge", () => {
    test("Should FAIL to create DELIVERY_CHARGE charge type if it already exists for a store", async () => {
        const manager = getManager();
        const taxType = await createCustomTaxType(manager);
        const storeFormatCode = chance.string({ length: 5 });
        const name = chance.string();
        const createStoreFormat = await storeFormatResolvers.default.Mutation.createStoreFormat(
            { user },
            {
                input: {
                    name,
                    description: chance.string(),
                    storeFormatCode,
                    taxTypeCodes: [taxType.taxTypeCode],
                    organizationId: user.organization.id,
                    status: STATUS.ACTIVE
                }
            },
            { injector: StoreFormatModule.injector }
        );
        const catalogInput = {
            name: chance.string(),
            catalogCode: chance.string({ length: 5 }),
            description: chance.string(),
            organizationId: user.organization.id,
            usage: {
                purpose: chance.string()
            }
        };
        const application = null;
        const createdCatalog = await catalogResolver.default.Mutation.createCatalog(
            { user, application },
            {
                input: {
                    ...catalogInput
                }
            },
            {
                injector: CatalogModule.injector
            }
        );
        const storeInput = {
            name: chance.string(),
            STATUS: STATUS.ACTIVE,
            parentOrganizationId: user.organization.id,
            code: chance.string(),
            storeFormatCode,
            catalogCode: catalogInput.catalogCode,
            channelCodes: [channel.channelCode],
            organizationId: user.organization.id,
            latitude: chance.latitude(),
            longitude: chance.longitude(),
            addressLine1: chance.address(),
            addressLine2: chance.address(),
            city: chance.city(),
            state: chance.state(),
            country: chance.country(),
            pinCode: "456001"
        };
        const createStore = await StoreResolvers.default.Mutation.createStore(
            { user },
            {
                input: {
                    ...storeInput
                }
            },
            { injector: StoreModule.injector }
        );
        const managerInfo = {
            name: chance.name(),
            phone: `+91${chance.phone({ formatted: false })}`,
            staff_role: STAFF_ROLE.STORE_MANAGER
        };
        const addedStaff = await StoreResolvers.default.Mutation.addStaff(
            { user },
            {
                input: {
                    ...managerInfo
                }
            },
            { injector: StoreModule.injector }
        );
        await StoreResolvers.default.Mutation.addStaffMemberToStore(
            { user },
            {
                input: {
                    organizationId: user.organization.id,
                    staffMemberId: addedStaff.id,
                    storeId: createStore.id
                }
            },
            { injector: StoreModule.injector }
        );
        const deliveryAgent = {
            name: chance.name(),
            phone: `+91${chance.phone({ formatted: false })}`,
            staff_role: STAFF_ROLE.DELIVERY,
            busy: false
        };
        const addedDeliveryStaff = await StoreResolvers.default.Mutation.addStaff(
            { user },
            {
                input: {
                    ...deliveryAgent
                }
            },
            { injector: StoreModule.injector }
        );
        await StoreResolvers.default.Mutation.addStaffMemberToStore(
            { user },
            {
                input: {
                    organizationId: user.organization.id,
                    staffMemberId: addedDeliveryStaff.id,
                    storeId: createStore.id
                }
            },
            { injector: StoreModule.injector }
        );
        const storeOpenTimeInput = {
            storeId: createStore.id,
            organizationId: user.organization.id,
            days: [ENUM_DAY.MONDAY, ENUM_DAY.FRIDAY],
            openTime: 0,
            closeTime: 2359
        };
        const openTime = await storeOpenTimingProvider.addStoreOpenTiming(
            manager,
            storeOpenTimeInput
        );
        const deliveryCharge = await storeChargeProvider.createStoreCharges(
            manager,
            {
                chargeType: STORE_CHARGE_TYPE.DELIVERY_CHARGE,
                chargeValueType: STORE_CHARGE_VALUE_TYPE.ABSOLUTE,
                storeId: createStore.id,
                chargeValue: 65.5,
                organizationId: user.organization.id
            }
        );
        expect(deliveryCharge).toBeDefined();

        try {
            await storeChargeProvider.createStoreCharges(
                manager,
                {
                    chargeType: STORE_CHARGE_TYPE.DELIVERY_CHARGE,
                    chargeValueType: STORE_CHARGE_VALUE_TYPE.ABSOLUTE,
                    storeId: createStore.id,
                    chargeValue: 65.5,
                    organizationId: user.organization.id
                }
            );
        } catch (error) {
            expect(error).toEqual(new WCoreError(WCORE_ERRORS.STORE_CHARGE_TYPE_ALREADY_EXISTS));
        }
    });

    test("Should create PACKAGING_CHARGE charge type after creating DELIVERY_CHARGE charge type for a store", async () => {
        const manager = getManager();
        const taxType = await createCustomTaxType(manager);
        const storeFormatCode = chance.string({ length: 5 });
        const name = chance.string();
        const createStoreFormat = await storeFormatResolvers.default.Mutation.createStoreFormat(
            { user },
            {
                input: {
                    name,
                    description: chance.string(),
                    storeFormatCode,
                    taxTypeCodes: [taxType.taxTypeCode],
                    organizationId: user.organization.id,
                    status: STATUS.ACTIVE
                }
            },
            { injector: StoreFormatModule.injector }
        );
        const catalogInput = {
            name: chance.string(),
            catalogCode: chance.string({ length: 5 }),
            description: chance.string(),
            organizationId: user.organization.id,
            usage: {
                purpose: chance.string()
            }
        };
        const application = null;
        const createdCatalog = await catalogResolver.default.Mutation.createCatalog(
            { user, application },
            {
                input: {
                    ...catalogInput
                }
            },
            {
                injector: CatalogModule.injector
            }
        );
        const storeInput = {
            name: chance.string(),
            STATUS: STATUS.ACTIVE,
            parentOrganizationId: user.organization.id,
            code: chance.string(),
            storeFormatCode,
            catalogCode: catalogInput.catalogCode,
            channelCodes: [channel.channelCode],
            organizationId: user.organization.id,
            latitude: chance.latitude(),
            longitude: chance.longitude(),
            addressLine1: chance.address(),
            addressLine2: chance.address(),
            city: chance.city(),
            state: chance.state(),
            country: chance.country(),
            pinCode: "456001"
        };
        const createStore = await StoreResolvers.default.Mutation.createStore(
            { user },
            {
                input: {
                    ...storeInput
                }
            },
            { injector: StoreModule.injector }
        );
        const managerInfo = {
            name: chance.name(),
            phone: `+91${chance.phone({ formatted: false })}`,
            staff_role: STAFF_ROLE.STORE_MANAGER
        };
        const addedStaff = await StoreResolvers.default.Mutation.addStaff(
            { user },
            {
                input: {
                    ...managerInfo
                }
            },
            { injector: StoreModule.injector }
        );
        await StoreResolvers.default.Mutation.addStaffMemberToStore(
            { user },
            {
                input: {
                    organizationId: user.organization.id,
                    staffMemberId: addedStaff.id,
                    storeId: createStore.id
                }
            },
            { injector: StoreModule.injector }
        );
        const deliveryAgent = {
            name: chance.name(),
            phone: `+91${chance.phone({ formatted: false })}`,
            staff_role: STAFF_ROLE.DELIVERY,
            busy: false
        };
        const addedDeliveryStaff = await StoreResolvers.default.Mutation.addStaff(
            { user },
            {
                input: {
                    ...deliveryAgent
                }
            },
            { injector: StoreModule.injector }
        );
        await StoreResolvers.default.Mutation.addStaffMemberToStore(
            { user },
            {
                input: {
                    organizationId: user.organization.id,
                    staffMemberId: addedDeliveryStaff.id,
                    storeId: createStore.id
                }
            },
            { injector: StoreModule.injector }
        );
        const storeOpenTimeInput = {
            storeId: createStore.id,
            organizationId: user.organization.id,
            days: [ENUM_DAY.MONDAY, ENUM_DAY.FRIDAY],
            openTime: 0,
            closeTime: 2359
        };
        const openTime = await storeOpenTimingProvider.addStoreOpenTiming(
            manager,
            storeOpenTimeInput
        );
        const deliveryCharge = await storeChargeProvider.createStoreCharges(
            manager,
            {
                chargeType: STORE_CHARGE_TYPE.DELIVERY_CHARGE,
                chargeValueType: STORE_CHARGE_VALUE_TYPE.ABSOLUTE,
                storeId: createStore.id,
                chargeValue: 65.5,
                organizationId: user.organization.id
            }
        );
        const storeChargeValue = await storeChargeProvider.createStoreCharges(
            manager,
            {
                chargeType: STORE_CHARGE_TYPE.PACKAGING_CHARGE,
                chargeValueType: STORE_CHARGE_VALUE_TYPE.ABSOLUTE,
                storeId: createStore.id,
                chargeValue: 65.5,
                organizationId: user.organization.id
            }
        );
        expect(storeChargeValue).toBeDefined();
    });
})

afterAll(async () => {
    await closeUnitTestConnection();
});