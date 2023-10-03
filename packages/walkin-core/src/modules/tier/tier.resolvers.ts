import { ModuleContext, Resolvers } from "@graphql-modules/core";
import Container from "typedi";
import { getManager } from "typeorm";
import { setOrganizationToInputV2 } from "../common/utils/utils";
import { TierRepository } from "./tier.repository";

export const resolvers: Resolvers = {
    Query: {
        getTiers: (
            { user, application },
            { },
            { injector }: ModuleContext
        ) => {
            let input:any ={};
            input = setOrganizationToInputV2(input, user, application);
            return getManager().transaction(manager => {
                return Container.get(TierRepository).getTiers(manager, input);
            });
        },
        getTier: (
            { user, application },
            { input },
            { injector }: ModuleContext
        ) => {
            input = setOrganizationToInputV2(input, user, application);
            return getManager().transaction(manager => {
                return Container.get(TierRepository).getTier(manager, input);
            });
        }
    },
    Mutation: {
        createTier:(
            { user, application },
            { input },
            { injector }: ModuleContext
        ) => {
            input = setOrganizationToInputV2(input, user, application);
            return getManager().transaction(manager => {
                return Container.get(TierRepository).createTier(manager, input);
            });
        },
        deleteTier:(
            { user, application },
            { input },
            { injector }: ModuleContext
        ) => {
            input = setOrganizationToInputV2(input, user, application);
            return getManager().transaction(manager => {
                return Container.get(TierRepository).deleteTier(manager, input);
            });
        }
    }
}