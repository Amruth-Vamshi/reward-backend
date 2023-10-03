import gql from "graphql-tag";
import { STATUS } from "../../../../walkin-core/src/modules/common/constants";
import { COLLECTIONS_ENTITY_TYPE ,COLLECTIONS_TYPE} from "../common/constants/constant";

export const typeDefs = gql`
  scalar JSON

  type Organization

  type Campaign
  
  type PaginationInfo

  input PageOptions
  

  enum STATUS {
    ${[...Object.values(STATUS)]}
  }

  enum COLLECTIONS_ENTITY_TYPE {
      ${[...Object.values(COLLECTIONS_ENTITY_TYPE)]}
  }

  enum COLLECTIONS_TYPE {
      ${[...Object.values(COLLECTIONS_TYPE)]}
  }

  input createCollectionsInput {
      name: String!
      description: String
      campaignId: ID
      entity: COLLECTIONS_ENTITY_TYPE!
      status: STATUS
      ruleSetId: Int
  }

  type RuleSet {
        id: ID
        name: String
        description: String
        rules: JSON
        organization: Organization
  }

  type Collections {
      id: ID
      name: String
      description: String
      entity: COLLECTIONS_ENTITY_TYPE
      status: STATUS
      ruleSet: RuleSet
      collectionsItems: [JSON]
      organization: Organization
      campaign: Campaign
  }

  input FetchCollectionsWithFiltersInput {
    campaignId: Int
    status: STATUS
    entity: COLLECTIONS_ENTITY_TYPE
    name : String
    type : COLLECTIONS_TYPE
    pageOptions: PageOptions = {}
  }

  input updateCollectionsInput {
    collectionsId: String!
    name: String
    description: String
    campaignId: ID
    status: STATUS
  }
    

  type FetchCollectionsWithFiltersOutput {
    data: [Collections]
    paginationInfo: PaginationInfo
    count: Int
  }

  type Query {
    fetchCollectionsWithFilters(
      input: FetchCollectionsWithFiltersInput
    ): FetchCollectionsWithFiltersOutput @auth

    getCollectionsByCampaignId(
      campaignId: Int!
    ): FetchCollectionsWithFiltersOutput @auth

    getCollectionByCollectionId( collectionId: ID ): Collections @auth

    getCollectionsByListOfCollectionIds( collectionIdsList: [ID] ): [Collections] @auth
  }
  type Mutation {
    createCollections(input: createCollectionsInput!): Collections @auth

    deleteCollections(collectionId: ID!): Collections @auth

    disableCollections(collectionId: ID!) : Collections @auth

    updateCollections(input: updateCollectionsInput!) : Collections @auth
  }
`;
