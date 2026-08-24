import { test } from '@playwright/test';
import { offerings } from '../../offerings.mjs';

const anomalies = offerings
  .filter((offering) => offering.anomalyRefs.length > 0)
  .map((offering) => [offering.id, offering.mappingStatus, offering.anomalyRefs, offering.mappingEvidence.reason]);

for (let index = 0; index < anomalies.length; index += 4) {
  const chunk = anomalies.slice(index, index + 4);
  test(`M2_ANOMALY_CHUNK_${index / 4 + 1}`, () => {
    throw new Error(`M2_ANOMALY_REPORT=${JSON.stringify(chunk)}`);
  });
}
