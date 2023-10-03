import gql from "graphql-tag";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY,
} from "../../common/permissions";

const typeDefs = gql`
  scalar JSON
  enum STATUS
  type Organization
  input PageOptions
  input SortOptions
  type PaginationInfo
  type TaxType
  type Product
  type StoreFormat
  type Channel

  input ProductTaxTypeValueFilter {
    storeFormat: ID
    channel: ID
    productId: [ID]
    taxLevel: ID
  }

  input TaxValueFilter {
    productTaxValueId: ID
    productId: ID
    storeFormat: ID
    channel: ID
    taxLevel: ID
  }

  input ProductTaxTypeValueUpdateInput {
    productTaxValueId: ID!
    storeFormat: ID
    channel: ID
    taxLevel: ID
    taxValue: Float
  }

  input ProductTaxTypeValueInput {
    productId: ID!
    storeFormat: ID!
    channel: ID!
    taxLevel: ID!
    taxValue: Float!
  }

  input ProductTaxTypeValueForCatalogInput {
    catalogId: ID!
    storeFormat: ID!
    channel: ID!
    taxLevel: ID!
    taxValue: Float!
  }
  input ProductTaxTypeValueUpdateForCatalogInput {
    catalogId: ID!
    storeFormat: ID!
    channel: ID!
    taxLevel: ID!
    taxValue: Float!
  }
  input RemoveProductTaxValues {
    storeFormat: ID!
    channel: ID!
    taxLevel: ID!
  }
  input LinkProductTaxTypeValues {
    productId: ID!
  }
  type ProductTaxValue {
    id: ID
    product: Product
    storeFormat: StoreFormat
    channel: Channel
    taxValue: Float
    taxLevel: TaxType
  }
  type ProductTaxValuePage {
    data: [ProductTaxValue]
    paginationInfo: PaginationInfo
  }
  type Query {
    productTaxTypeValue(filter: TaxValueFilter): ProductTaxValue @auth
    productTaxTypeValues(
      filter: ProductTaxTypeValueFilter
      pageOptions: PageOptions
      sortOptions: SortOptions
    ): ProductTaxValuePage @auth
  }

  type Mutation {
    createTaxValueForProduct(input: ProductTaxTypeValueInput): ProductTaxValue
      @auth
    createProductTaxValueForCatalog(
      input: ProductTaxTypeValueForCatalogInput
    ): [ProductTaxValue] @auth
    updateProductTaxValueForCatalog(
      input: ProductTaxTypeValueUpdateForCatalogInput
    ): [ProductTaxValue] @auth
    updateTaxValueForProduct(
      input: ProductTaxTypeValueUpdateInput
    ): ProductTaxValue @auth

    linkTaxValuesForProduct(input: LinkProductTaxTypeValues): [ProductTaxValue]
      @auth
    removeProductTaxValues(input: RemoveProductTaxValues): [ProductTaxValue]
      @auth
    removeProductTaxValue(id: ID): ProductTaxValue @auth
  }
`;

export { typeDefs };
