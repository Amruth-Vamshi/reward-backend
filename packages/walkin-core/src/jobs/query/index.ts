export const UPDATE_WEBHOOK_EVENT_DATA = `mutation updateWebhookEventData($id:ID!,$organizationId:ID!,$webhookId:ID!,$webhookResponse:String, $httpStatus:String){
    updateWebhookEventData(input:{
      id: $id
      organizationId:$organizationId,
      webhookId:$webhookId,
      webhookResponse:$webhookResponse,
      httpStatus:$httpStatus
    }){
      id
    }
  }`;
