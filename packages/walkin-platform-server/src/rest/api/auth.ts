import express from "express";
const router = express.Router();
import { canAccessPermissions } from "../access/index";
import { Organizations } from "@walkinserver/walkin-core/src/modules/account/organization/organization.providers";
import { OrganizationModule } from "@walkinserver/walkin-core/src/modules/account/organization/organization.module";
import { ApplicationProvider } from "@walkinserver/walkin-core/src/modules/account/application/application.providers";
import { ApplicationModule } from "@walkinserver/walkin-core/src/modules/account/application/application.module";
import { getManager } from "typeorm";
import { Users } from "@walkinserver/walkin-core/src/modules/account/user/user.providers";
import { UserModule } from "@walkinserver/walkin-core/src/modules/account/user/user.module";
const organizationProvider = OrganizationModule.injector.get(Organizations);
const applicationProvider = ApplicationModule.injector.get(ApplicationProvider);
const userProvider = UserModule.injector.get(Users);
router.post(
  "/sa/get_org_api_key",
  canAccessPermissions(),
  async (request, response, next) => {
    const manager = getManager();
    const { org_id, org_code } = request.body;
    if (!org_id && !org_code) {
      return response.status(400).send({
        error: "Please provide org_id or org_code value"
      });
    }
    const organization = await organizationProvider.getOrganizationDetails(
      manager,
      { org_id, org_code }
    );
    if (!organization) {
      return response.status(404).send({
        error: "Organization does not exists"
      });
    }
    const { applications } = organization;
    let application;
    if (applications.length === 0) {
      application = await applicationProvider.createApplication(
        manager,
        organization.id,
        {
          name: "Peppo Integration"
        }
      );
    } else {
      application = applications[0];
    }

    const apiKey = await applicationProvider.generateAPIKeyByApplicationId(
      manager,
      application.id
    );

    return response.status(200).send({
      success: true,
      data: {
        api_key: apiKey.api_key
      },
      error: []
    });
  }
);

router.post(
  "/sa/verify_user_account",
  canAccessPermissions(),
  async (request, response, next) => {
    const manager = getManager();
    const { org_id, user_id } = request.body;
    const organization = await organizationProvider.getOrganizationById(
      manager,
      org_id
    );

    if (!organization) {
      return response.status(404).send({
        error: "Organization does not exists"
      });
    }

    const verifyUser = await userProvider.verifyUserEmail(manager, {
      organizationId: org_id,
      userId: user_id
    });
    console.log("organization", user_id);
    if (!verifyUser) {
      return response.status(404).send({
        error: "User not found"
      });
    }

    return response.status(200).send({
      success: true,
      data: {
        UserConfirmed: true
      },
      error: []
    });
  }
);

export { router as auth };
