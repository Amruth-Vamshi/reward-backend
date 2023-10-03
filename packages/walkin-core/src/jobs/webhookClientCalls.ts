import { client } from "./utils";
import { gql } from 'apollo-server';
import { UPDATE_WEBHOOK_EVENT_DATA } from './query';

export const updateWebhookEventData = async (id, organizationId, jwt, webhookId, responseData, statusCode) => {
    try {
        const result = await client.mutate({
            mutation: gql`
          ${UPDATE_WEBHOOK_EVENT_DATA}
        `,
            variables: {
                id,
                organizationId,
                webhookId,
                webhookResponse: responseData,
                httpStatus: statusCode.toString(),
            },
            context: {
                headers: {
                    Authorization: "Bearer " + jwt
                }
            }
        });
        return result;
    } catch (error) {
        console.log("ERROR updating webhook response data, webhook-data-event-id :", id, error);
    }
};