import { EntityManager } from "typeorm";
import fetch from "node-fetch";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { Service } from "typedi";
@Service()
export class ExternalIntegrationProvider {
  public async issuePoints(entityManager: EntityManager, inputParams) {
    try {
      const PEPPO_URL = process.env.PEPPO_SERVICE_URL;
      const PROCESS_LOYALTY_ISSUANCE_URL = `${PEPPO_URL}/api/process-loyalty-issuance`;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + inputParams.authToken
        },
        body: JSON.stringify({
          loyaltyType: inputParams.loyaltyType,
          externalCustomerId: inputParams.customer.externalCustomerId,
          loyaltyReferenceId: inputParams.loyaltyReferenceId,
          data: inputParams.payload
        }),
        json: true
      };
      const response = await fetch(PROCESS_LOYALTY_ISSUANCE_URL, {
        ...options
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.log("ISSUE_API_ERROR: ", error);
      throw new WCoreError(WCORE_ERRORS.ISSUE_API_INTERNAL_ERROR);
    }
  }
}
