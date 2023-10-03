import { getManager } from "typeorm";
import { BasicProvider } from "./basic.providers";
import { Organizations } from "@walkinserver/walkin-core/src/modules/account/organization/organization.providers";
import { setOrganizationToInput, isUserOrAppAuthorizedToWorkOnOrganization } from "../common/utils/utils";

export const resolvers = {
    Mutation: {
        initializeWorkflowForOrg: async ({ user, application }, args, { injector }) => {
            return getManager().transaction(async transactionManager => {

                let input = args;

                input = setOrganizationToInput(input, user, application);
                await isUserOrAppAuthorizedToWorkOnOrganization(user, application, input.organizationId);

                const org = await injector
                    .get(Organizations)
                    .getOrganization(transactionManager, input.organizationId);

                const initializeWOrkflowForOrg = await injector
                    .get(BasicProvider)
                    .initialise(transactionManager, org, injector);

                if (initializeWOrkflowForOrg === undefined || initializeWOrkflowForOrg === null) {
                    return false;
                }
                return true;
            });
        }
    }
};
