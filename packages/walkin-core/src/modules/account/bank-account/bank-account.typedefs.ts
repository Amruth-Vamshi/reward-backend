import gql from "graphql-tag";
import {
    POLICY_RESOURCES_ENTITY,
    POLICY_PERMISSION_ENTITY,
} from "../../common/permissions";
import { ACCOUNT_TYPE } from "../../common/constants";

const typeDefs = gql`
	scalar JSON
	enum STATUS
    type Organization
    input PageOptions
    enum ORDER
    input SortOptions {
        sortBy: String = "id"
        sortOrder: ORDER = ASC
    }
    type PaginationInfo
    enum ACCOUNT_TYPE{
        ${[...Object.values(ACCOUNT_TYPE)]}
    }
    input BankAccountsFilter{
        organizationId: ID!
        pageOptions:PageOptions
        sortOptions:SortOptions
    }

   

    input BankAccountFilter{
        id:ID!
    }

    type BankAccount{
        id:ID
        name: String
        phone: String
        email: String
        accountNumber: String
        ifscCode: String
        accountType:ACCOUNT_TYPE
        verified: Boolean
        organization:Organization
        beneficiaryName: String
    }

    input BankAccountInput{
        name: String!
        phone: String
        email: String
        bank_account_number: String!
        ifsc_code: String!
        beneficiaryName: String!
    }

    input BankAccountUpdateInput{
        id:ID!
        name: String
        phone: String
        email: String
        bank_account_number: String
        ifsc_code: String
        beneficiaryName: String
    }

    input DeactivateBankAccountInput{
        id:ID!
    }

    input ActivateBankAccountInput{
        id:ID!
    }

    input VerifyBankAccountInput{
        id:ID!
    }

    input PrimaryBankAccountInput{
        organizationId: ID!
        bankAccountId: ID!
    }

    type BankAccountPage{
        data:[BankAccount]
        paginationInfo:PaginationInfo
    }

    type Query {
		getBankAccount(filter:BankAccountFilter): BankAccount @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.BANK_ACCOUNT},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
        getBankAccounts(filter:BankAccountsFilter): BankAccountPage @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.BANK_ACCOUNT},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
    }

    type Mutation {
		addBankAccountDetails(input: BankAccountInput): BankAccount @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.BANK_ACCOUNT},
            permission:${POLICY_PERMISSION_ENTITY.CREATE}}
        ])

        updateBankAccountDetails(input: BankAccountUpdateInput): BankAccount @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.BANK_ACCOUNT},
            permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
        ])

        deactivateBankAccount(input: DeactivateBankAccountInput): BankAccount @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.BANK_ACCOUNT},
            permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
        ])
        activateBankAccount(input: ActivateBankAccountInput): BankAccount @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.BANK_ACCOUNT},
            permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
        ])

        verifyBankAccount(input: VerifyBankAccountInput): BankAccount @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.BANK_ACCOUNT},
            permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
        ])


        changePrimaryBankAccount(input:PrimaryBankAccountInput):BankAccount @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.BANK_ACCOUNT},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])


    }

    `;

export default typeDefs;
