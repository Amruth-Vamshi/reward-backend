import gql from "graphql-tag";
import {
  POLICY_PERMISSION_ENTITY,
  POLICY_RESOURCES_ENTITY
} from "../../common/permissions";

import { PRODUCT_RELATIONSHIP } from "@walkinserver/walkin-core/src/modules/common/constants/constants";

import {
  COMBINATOR,
  EXPRESSION_TYPE,
  ORDER,
  ENUM_DAY,
  AREA_TYPE,
  ENUM_DELIVERY_LOCATION_TYPE,
  STAFF_ROLE
} from "../../common/constants/constants";

const typeDefs = gql`
	scalar JSON
	scalar DateTime

	type Organization
    type StoreFormat
    type Catalog
    type ProductValue
    type ProductTaxValue
    type ProductPrice
    type Category
    type Product
    type User
    type ProductDiscount
	enum STATUS
    enum ENUM_STORE_SERVICE_AREA_TYPE
	type StoreFormat
	type Channel
	type ProductTag
	input PageOptions
	input SortOptions
	type Option
	enum ENUM_DELIVERY_LOCATION_TYPE{
		${[...Object.values(ENUM_DELIVERY_LOCATION_TYPE)]}
	}
    enum ENUM_STAFF_ROLE{
		${[...Object.values(STAFF_ROLE)]}
	}
	type ProductVariant
	enum ProductTypeEnum
	type CatalogUsage
	type ProductRelationship

	type Store {
		id: ID
		name: String
		STATUS: STATUS
		addressLine1: String
		addressLine2: String
		city: String
		state: String
		pinCode: String
		country: String
		externalStoreId: String
		code: String
		extend: JSON
		email: String
        geoLocation: String
		organization: Organization
	}

	input UpdateStoreInput {
		id: ID!
		name: String
		STATUS: STATUS
		addressLine1: String
		addressLine2: String
		city: String
		state: String
		pinCode: String
		country: String
		externalStoreId: String
		extend: JSON
		email: String
		latitude: String
		longitude: String
		organizationId:String!
	}

	input UpdateStoreByCodeInput {
		code: String!
		name: String
		STATUS: STATUS
		addressLine1: String
		addressLine2: String
		city: String
		state: String
		pinCode: String
		country: String
		externalStoreId: String
		extend: JSON
		email: String
		latitude: String
		longitude: String
		organizationId:String!
	}

    input EnableStoreInput{
        storeId: ID!
        organizationId: ID!
     }

    input DisableStoreInput{
        storeId: ID!
        organizationId: ID!
    }

	input CreateStoreInput {
		name: String
		STATUS: STATUS
		addressLine1: String
		addressLine2: String
		city: String
		state: String
		pinCode: String
		country: String
		externalStoreId: String!
		extend: JSON
		code: String
		email: String
		latitude: String
		longitude: String
		organizationId:String
	}

	input StoreSearchFilters{
    	rules: [StoreFieldSearch]
    	combinator: COMBINATOR
   	}

    input UpdateStoreDeliveryInput{
        id:ID!
        organizationId: ID!
        deliveryAreaValue: String
        deliveryAreaType: AREA_TYPE
    }
   enum COMBINATOR{
    	${[...Object.values(COMBINATOR)]}
  	}
  
	input StoreFieldSearch{
		id: ID,
		attributeName:String
		attributeValue:String
		expressionType:EXPRESSION_TYPE
	}

	enum ORDER{
		${[...Object.values(ORDER)]}
	}

	enum ENUM_DAY{
		${[...Object.values(ENUM_DAY)]}
	}
    enum AREA_TYPE{
    	${[...Object.values(AREA_TYPE)]}
  	}
      input addStaffInput{
         name: String!
         phone:String!
        staff_role:ENUM_STAFF_ROLE!
        email: String
      }

    

     input RemoveStaffInput{
       id: ID!
     }
     type Staff{
         id:ID
        name: String
        phone: String
        staffRole: String
        status: String
        email: String
        organization: Organization
        store: [Store]
        busy: Boolean
    }

    input StaffForStoreInput{
        staffMemberId:ID!
        storeId:ID!
    }

    input StaffMembersForStoreInput {
        staffMemberIds:[ID!]
        storeId:ID!
    }

      input EditStaffInput{
        id: ID!
        name: String
        phone:String
        email: String
        staff_role:ENUM_STAFF_ROLE
     }
      input RemoveStoreDelivery{
          deliveryAreaId: ID!
          storeId: ID!
          organizationId: ID!
      }
      input AddStoreDeliveryInput{
        storeId: ID!
        organizationId: ID!
        deliveryAreaValue: String
        deliveryAreaType: AREA_TYPE
      }
    type StoreDelivery{
        store:Store
        id:ID
        areaType: AREA_TYPE
        pincode: String
        area: String
    }

	enum EXPRESSION_TYPE{
		${[...Object.values(EXPRESSION_TYPE)]}
	}

	input Sort{
		attributeName:String
		order:ORDER
	}

	type StoreSearchOutput{
		data:[JSON]
		total:Int
		page:Int
	}

	type StoreDefnition{
		entityName: String
		searchEntityName: String
		columns :[StoreColumn]
	}

	type PaginationInfo

	type StoreColumn{
		column_slug : String
		column_search_key: String
		column_label : String
		column_type : String
		searchable: Boolean
		extended_column: Boolean
	}

	type StoreAdminLevel{
		id: ID
		name: String
		code: String
		parent: StoreAdminLevel
		stores: [Store]
	}

	input CreateStoreAdminLevel{
		name: String!
		code: String!
		parentId: ID
	}

	input UpdateStoreAdminLevel{
		id: ID!
		name: String!
		code: String!
		parentId: ID
	}
    input StoreCatalogFilter{
        storeId: ID!
        channelIds:[ID!]
        listableProducts: Boolean
	}

    type ProductFormat{
        product:Product
        productChargeValue:ProductValue 
        productTaxValue: ProductTaxValue 
        productPriceValue: ProductPrice
        category:Category
	}

	type ProductValues{
		productChargeValues: [ProductValue]
		productTaxValues: [ProductTaxValue]
		productPriceValues: [ProductPrice]
        productDiscountValues:[ProductDiscount]
	}

	type CustomOption {
		id: ID
		name: String
		description: String
		organization : Organization
		sortSeq: String
		optionValues: [OptionValue]
		externalOptionId: String
		code: String
	}


	type CustomOptionValue {
		id: ID
		value: String
		option: CustomOption
		externalOptionValueId: String
		code: String
	}

	type ProductCustom {
		id: ID
		code: String
		name: String
		description: String
		productType: String
		imageUrl: String
		sku: String
		type: ProductTypeEnum
		extend: JSON
		status: STATUS
		listable: Boolean
        inventoryAvailable: Boolean
		variants: [ProductVariant]
		productValues: ProductValues
		externalProductId: String
		productRelationShip: [ProductRelationship]
		tags: [ProductTag] 
		options:[CustomOption]
		isPurchasedSeparately: Boolean
		categories:[Category]
		productPrices: ProductValues
		store: Store
		menuTimings: MenuTimings
	}

    input UpdateStaffInput{
        id: ID
    }

	type TimingDetail {
		id: ID
		openTime: Int
		closeTime: Int
	}
	  
	type DaysTiming {
		days: String
		data: [TimingDetail]
	}
	
	type MenuTimings {
		name: String
		code: String
		timings: [DaysTiming]
	}

	type CategoriesWithChildren{
		id: ID
		name: String
		description: String
		code: String
		extend: JSON
		status: STATUS
		products: [ProductCustom]
		parent: Category
		children: [CategoriesWithChildren]
		catalog: Catalog
        sortSeq: Int
		menuTimings: MenuTimings
		listable: Boolean
		productType: ProductTypeEnum
	}

	type CatalogForCategory{
		id: ID
		name: String
		catalogCode: String
		description: String
		organization: Organization
		usage: CatalogUsage
		categories: [CategoriesWithChildren]
	}

	type StoreCatalogForCategoriesWithChildren{
		id: ID
		name: String
		STATUS: STATUS
		addressLine1: String
		addressLine2: String
		city: String
		state: String
		pinCode: String
		country: String
		externalStoreId: String
		code: String
		extend: JSON
		email: String
		storeFormats: [StoreFormat]
		catalog: CatalogForCategory
		channels: [Channel]
	}

    type StoreCatalog{
        store:Store
        storeFormat:StoreFormat
        catalog: Catalog
				products:[ProductFormat],
				categories: [Category]
	}

	type StoreCatalogPage{
		data: [StoreCatalog]
		paginationInfo: PaginationInfo
	}

	type StorePage{
		data: [Store]
		paginationInfo: PaginationInfo
	}

	input StoreSearchInput{
		#deliveryLocationType:ENUM_DELIVERY_LOCATION_TYPE
		#deliveryLocationValue: String
		deliveryDateTime: String
		channel: [String]
		storeFormat: [String]
		organizationId: ID
	}

	input AddStoreOpenTimingInput{
		days:[ENUM_DAY]
		openTime:Int
		closeTime:Int
		storeId: ID!
		organizationId:ID
	}

    input Timings{
        openTime: Int!
        closeTime: Int!
    }
    input StoreTimings{
        days: ENUM_DAY!
        data: [Timings]
    }
    input AddBulkStoreOpeningTimings{
        storeTimings: [StoreTimings]
        storeId: ID!
		organizationId:ID!
    }
	input RemoveStoreOpenTimingInput{
		storeId: ID!
		id: ID!
		organizationId: ID
	}

    input RemoveStoreOpenTimingsInput{
		storeId: ID!
		id: [ID!]!
		organizationId: ID
	}

    type StoreTiming{
        id:ID
       openTime: Int
       closeTime: Int
    }
    type StoreOpeningTimings{
        store: Store
        days: String
        data: [StoreTiming]
    }

	type StoreOpenTiming{
		id: ID
		openTime: Int
		closeTime: Int
		days: String
		store: Store
	}

	type StoreOpenTimingPage{
		data: [StoreOpeningTimings]
		paginationInfo: PaginationInfo
	}

	type StorePage {
		data: [Store]
		paginationInfo: PaginationInfo
	}

    type StaffPage{
        data: [Staff]
		paginationInfo: PaginationInfo
    }
    input UpdateStaffBusyInput{
        id: ID!
        busy: Boolean!
    }

    input UpdateStoreStaffStatus{
        busy:Boolean!, 
        staffRole:ENUM_STAFF_ROLE!,
        storeId: String!
    }

    input StoreStaffStatus{
        staffRole:ENUM_STAFF_ROLE,
        storeId: String!
        organizationId: ID!
    }

	type Query {
		store(id: ID!): Store @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
		stores(input: StoreSearchInput, pageOptions: PageOptions!, sortOptions: SortOptions): StorePage @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
		storeByCode(code: String!): Store @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])

	#	storeSearch(organizationId: ID!, filterValues: StoreSearchFilters, pageNumber: Int! sort: Sort): StoreSearchOutput @auth

		storeDefnition(organizationId: ID!): StoreDefnition @disabled @auth

		getStoreCatalog(filter:StoreCatalogFilter): StoreCatalog @auth

		getStoreCatalogWithCategories(code:String!): StoreCatalogForCategoriesWithChildren @auth
		getPublishedStoreCatalogWithCategoriesFrom(code:String!): JSON @auth
		republishCatalog(codes: [String]!): String @auth

		storeOpenTiming(id: ID!, organizationId: ID): StoreOpenTiming @auth(requires:[{
			resource:${POLICY_RESOURCES_ENTITY.STORE},
			permission:${POLICY_PERMISSION_ENTITY.READ}
		}])

		storeOpenTimings(storeId: ID!, pageOptions: PageOptions!, sortOptions: SortOptions): StoreOpenTimingPage @auth(requires:[{
			resource:${POLICY_RESOURCES_ENTITY.STORE},
			permission:${POLICY_PERMISSION_ENTITY.READ}
		}])

        getStaffMembers(storeId: ID!, pageOptions: PageOptions!,staffRole:ENUM_STAFF_ROLE, sortOptions: SortOptions): StaffPage @auth(requires:[{
			resource:${POLICY_RESOURCES_ENTITY.STAFF},
			permission:${POLICY_PERMISSION_ENTITY.READ}
		}])

        getStaffMember(id: ID!): Staff @auth(requires:[{
			resource:${POLICY_RESOURCES_ENTITY.STAFF},
			permission:${POLICY_PERMISSION_ENTITY.READ}
		}])

        getStoreDeliverArea(storeId:ID!): StoreDelivery @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])

        getStoreStaffBusyStatus(input:StoreStaffStatus): Boolean @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STAFF},
		permission:${POLICY_PERMISSION_ENTITY.READ}
	}])
	}

	type Mutation {
		createStoreAdminLevel(input: CreateStoreAdminLevel!): StoreAdminLevel @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])


		updateStoreAdminLevel(input: UpdateStoreAdminLevel!) : StoreAdminLevel @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

		updateStore(input: UpdateStoreInput!): Store @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
		createStore(input: CreateStoreInput!): Store @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

		updateStoreByCode(input: UpdateStoreByCodeInput!): Store @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

        enableStore(input:EnableStoreInput): Store @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

        disableStore(input:DisableStoreInput): Store @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

        addStoreDelivery(input:AddStoreDeliveryInput): StoreDelivery @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

        updateStoreDelivery(input:UpdateStoreDeliveryInput): StoreDelivery @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

        removeStoreDelivery(input:RemoveStoreDelivery):StoreDelivery @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
	addStoreOpenTiming(input:AddStoreOpenTimingInput): StoreOpenTiming @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STORE},
		permission:${POLICY_PERMISSION_ENTITY.CREATE}
	}])

    addBulkStoreOpenTiming(input:AddBulkStoreOpeningTimings): [StoreOpeningTimings] @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STORE},
		permission:${POLICY_PERMISSION_ENTITY.CREATE}
	}])
	removeStoreOpenTiming(input:RemoveStoreOpenTimingInput): StoreOpenTiming @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STORE},
		permission:${POLICY_PERMISSION_ENTITY.UPDATE}
	}])

    removeStoreOpenTimings(input:RemoveStoreOpenTimingsInput): [StoreOpenTiming] @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STORE},
		permission:${POLICY_PERMISSION_ENTITY.UPDATE}
	}])

    addBulkStaffMembers(input:[addStaffInput]): [Staff] @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STAFF},
		permission:${POLICY_PERMISSION_ENTITY.UPDATE}
	}])
    addStaff(input:addStaffInput): Staff @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STAFF},
		permission:${POLICY_PERMISSION_ENTITY.UPDATE}
	}])

    removeStaff(input:RemoveStaffInput): Boolean @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STAFF},
		permission:${POLICY_PERMISSION_ENTITY.UPDATE}
	}])

    editStaff(input:EditStaffInput): Staff @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STAFF},
		permission:${POLICY_PERMISSION_ENTITY.UPDATE}
	}])

    activeStaffMamber(input:UpdateStaffInput): Staff @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STAFF},
		permission:${POLICY_PERMISSION_ENTITY.UPDATE}
	}])

    inactiveStaffMember(input:UpdateStaffInput): Staff @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STAFF},
		permission:${POLICY_PERMISSION_ENTITY.UPDATE}
	}])

    addStaffMemberToStore(input:StaffForStoreInput):Store @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STORE},
		permission:${POLICY_PERMISSION_ENTITY.UPDATE}
	}])

    addStaffMembersToStore(input:StaffMembersForStoreInput):Store @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STORE},
		permission:${POLICY_PERMISSION_ENTITY.UPDATE}
	}])
    markStaffBusyStatus(input:[UpdateStaffBusyInput]): [Staff] @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STAFF},
		permission:${POLICY_PERMISSION_ENTITY.UPDATE}
	}])
    makeAllStoreStaffBusyStatus(input:UpdateStoreStaffStatus): [Staff] @auth(requires:[{
		resource:${POLICY_RESOURCES_ENTITY.STAFF},
		permission:${POLICY_PERMISSION_ENTITY.UPDATE}
	}])

}



`;

export default typeDefs;
