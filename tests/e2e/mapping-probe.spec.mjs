import { test } from '@playwright/test';
import { offerings, offeringSummary } from '../../offerings.mjs';

test('REPORT_M2_MAPPING_DISTRIBUTION', () => {
  const anomalies = offerings
    .filter((offering) => offering.anomalyRefs.length > 0)
    .map(({ id, printedCourseCode, sourceTitle, mappingStatus, anomalyRefs, mappingEvidence }) => ({
      id,
      printedCourseCode,
      sourceTitle,
      mappingStatus,
      anomalyRefs,
      reason: mappingEvidence.reason
    }));
  throw new Error(`M2_MAPPING_REPORT=${JSON.stringify({
    counts: {
      mapped: offeringSummary.mapped,
      'mapped-with-anomaly': offeringSummary['mapped-with-anomaly'],
      ambiguous: offeringSummary.ambiguous,
      unmatched: offeringSummary.unmatched
    },
    anomalies
  })}`);
});
