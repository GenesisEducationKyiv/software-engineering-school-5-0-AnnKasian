import { EMAIL_DISPATCH_SETTINGS } from "../enums/enums.js";

const createBatchesHelper = <T>(
  items: T[],
  batchSize = EMAIL_DISPATCH_SETTINGS.BATCH_SIZE
): T[][] => {
  const batches: T[][] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  return batches;
};

export { createBatchesHelper };
