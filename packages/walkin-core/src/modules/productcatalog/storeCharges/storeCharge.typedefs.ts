import gql from "graphql-tag";
import {
    POLICY_RESOURCES_ENTITY,
    POLICY_PERMISSION_ENTITY,
} from "../../common/permissions";
import {
    STORE_CHARGE_TYPE,
    STORE_CHARGE_VALUE_TYPE,
} from "../../common/constants";

const typeDefs = gql`
	scalar JSON
	enum STATUS
    type Store
    input PageOptions
    input SortOptions
    type PaginationInfo
    type TaxType

    enum StoreChargeTypeEnum{
		${[...Object.values(STORE_CHARGE_TYPE)]}
	}

    enum StoreChargeValueTypeEnum{
		${[...Object.values(STORE_CHARGE_VALUE_TYPE)]}
	}

    input StoreChargeSearchInput {
        storeId: ID
    }

    input StoreChargeInput{
        chargeType: StoreChargeTypeEnum!
        chargeValueType: StoreChargeValueTypeEnum!
        storeId: ID!
        chargeValue: Float!
    }

    input updateStoreChargeInput{
        chargeType: StoreChargeTypeEnum
        chargeValueType: StoreChargeValueTypeEnum!
        storeId: ID!
        chargeValue: Float!
    }

    type StoreCharge {
        id: ID
        chargeType: StoreChargeTypeEnum
        chargeValueType: StoreChargeValueTypeEnum
        store: Store
        chargeValue: Float
    }

    type StoreChargePage {
        data: [StoreCharge]
        paginationInfo: PaginationInfo
    }

    type Query {
		getStoreCharges( storeId: ID): StoreChargePage @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.STORE},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
    }

    type Mutation {
		createStoreCharges(input: StoreChargeInput): StoreCharge @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.STORE},
            permission:${POLICY_PERMISSION_ENTITY.CREATE}}
        ])

        updateStoreCharges(id:ID!, input: updateStoreChargeInput): StoreCharge @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.STORE},
            permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
        ])
    }

    `;

export default typeDefs;
