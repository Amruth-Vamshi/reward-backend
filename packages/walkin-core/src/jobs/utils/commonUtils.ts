import { queueProcessorModule } from "../../modules/queueProcessor/queueProcessor.module";
import { QueueProvider as Queue } from "../../modules/queueProcessor/queue.provider";
import { updateEntity } from "../../modules/common/utils/utils";
const QueueProvider = queueProcessorModule.injector.get(Queue);

export const updateSavedJob = async (
  transactionManager,
  savedJobId,
  organizationId
) => {
  // UPDATE JOB's LAST EXECUTION TIME
  if (savedJobId) {
    const jobDetails = await QueueProvider.getSavedJobById(
      transactionManager,
      savedJobId,
      organizationId
    );
    if (jobDetails) {
      console.log(`Updating last executed time for jobId: ${savedJobId}`);
      const input = {
        lastExecutedTime: new Date().toISOString()
      };
      updateEntity(jobDetails, input);
      transactionManager.save(jobDetails);
    }
  }
  return;
};
