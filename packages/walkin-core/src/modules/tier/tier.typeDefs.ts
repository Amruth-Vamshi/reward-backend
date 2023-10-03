import gql from "graphql-tag";

export const typeDefs = gql`

    type Organization

    type Tier{
        id:ID
        code:String
        description:String
        organization: Organization
        organizationId: ID
    }

    input getTierInput{
        id: ID
        code: String
    }

    input CreateTierInput{
        code: String!
        description: String
    }

    type Query{
        getTier(input: getTierInput): Tier @auth
        getTiers: [Tier] @auth
    }

    type Mutation{
        createTier(input: CreateTierInput): Tier @auth
        deleteTier(input: getTierInput): Boolean @auth
    }

`;