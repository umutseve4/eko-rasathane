import test from 'node:test';
import assert from 'node:assert/strict';
import { offerings, offeringSummary, validateOfferings, filterOfferings, findOverlaps, MAPPING_STATUSES } from '../offerings.mjs';

test('official EKO scope remains complete', () => assert.deepEqual(
  { total: offeringSummary.total, spring: offeringSummary.spring, fall: offeringSummary.fall, first: offeringSummary.first, second: offeringSummary.second },
  { total: 164, spring: 83, fall: 81, first: 108, second: 56 }
));

test('reconciliation distribution remains exact', () => assert.deepEqual(
  {
    mapped: offeringSummary.mapped,
    'mapped-with-anomaly': offeringSummary['mapped-with-anomaly'],
    ambiguous: offeringSummary.ambiguous,
    unmatched: offeringSummary.unmatched
  },
  { mapped: 129, 'mapped-with-anomaly': 15, ambiguous: 0, unmatched: 20 }
));

test('anomaly ledger remains complete and explicit', () => {
  const projection = offerings
    .filter((offering) => offering.anomalyRefs.length > 0)
    .map((offering) => [offering.id, offering.mappingStatus, offering.anomalyRefs, offering.mappingEvidence.reason]);
  assert.deepEqual(projection, [
    ['offering-2025-2026-spring-2025-2026-spring-10-feb-049', 'mapped-with-anomaly', ['offering-printed-code-mismatch', 'anomaly-duplicate-course-buu-ay33-s6-elective-ikt3306-1'], 'title-semester-type-with-printed-code-mismatch'],
    ['offering-2025-2026-spring-2025-2026-spring-10-feb-050', 'mapped-with-anomaly', ['offering-printed-code-mismatch', 'anomaly-duplicate-course-buu-ay33-s6-elective-ikt3306-1'], 'title-semester-type-with-printed-code-mismatch'],
    ['offering-2025-2026-spring-2025-2026-spring-10-feb-226', 'mapped-with-anomaly', ['offering-printed-code-mismatch'], 'title-semester-type-with-printed-code-mismatch'],
    ['offering-2025-2026-spring-2025-2026-spring-10-feb-380', 'mapped-with-anomaly', ['offering-printed-code-mismatch'], 'title-semester-type-with-printed-code-mismatch'],
    ['offering-2025-2026-spring-2025-2026-spring-10-feb-381', 'mapped-with-anomaly', ['offering-printed-code-mismatch'], 'title-semester-type-with-printed-code-mismatch'],
    ['offering-2025-2026-spring-2025-2026-spring-10-feb-391', 'mapped-with-anomaly', ['anomaly-duplicate-course-buu-ay33-s4-required-eko2004-1'], 'code-title-semester-type'],
    ['offering-2025-2026-fall-2025-2026-fall-19-sep-011', 'mapped-with-anomaly', ['offering-printed-code-mismatch'], 'title-semester-type-with-printed-code-mismatch'],
    ['offering-2025-2026-fall-2025-2026-fall-19-sep-112', 'mapped-with-anomaly', ['offering-printed-code-mismatch'], 'title-semester-type-with-printed-code-mismatch'],
    ['offering-2025-2026-fall-2025-2026-fall-19-sep-113', 'mapped-with-anomaly', ['offering-printed-code-mismatch'], 'title-semester-type-with-printed-code-mismatch'],
    ['offering-2025-2026-fall-2025-2026-fall-19-sep-369', 'mapped-with-anomaly', ['offering-printed-code-mismatch'], 'title-semester-type-with-printed-code-mismatch'],
    ['offering-2025-2026-fall-2025-2026-fall-19-sep-370', 'mapped-with-anomaly', ['offering-printed-code-mismatch'], 'title-semester-type-with-printed-code-mismatch'],
    ['offering-2025-2026-fall-2025-2026-fall-19-sep-415', 'mapped-with-anomaly', ['anomaly-duplicate-course-buu-ay33-s7-required-eko4305-1'], 'code-title-semester-type'],
    ['offering-2025-2026-fall-2025-2026-fall-19-sep-416', 'mapped-with-anomaly', ['anomaly-duplicate-course-buu-ay33-s7-required-eko4305-1'], 'code-title-semester-type'],
    ['offering-2025-2026-fall-2025-2026-fall-19-sep-417', 'mapped-with-anomaly', ['anomaly-duplicate-course-buu-ay33-s7-required-eko4305-1'], 'code-title-semester-type'],
    ['offering-2025-2026-fall-2025-2026-fall-19-sep-418', 'mapped-with-anomaly', ['anomaly-duplicate-course-buu-ay33-s7-required-eko4305-1'], 'code-title-semester-type']
  ]);
});

test('ids, provenance, mappings and references validate', () => assert.deepEqual(validateOfferings(), []));
test('every offering has an explicit reconciliation outcome', () => {
  assert.equal(offerings.length, 164);
  assert.ok(offerings.every((offering) => MAPPING_STATUSES.includes(offering.mappingStatus) && offering.mappingEvidence?.reason));
});
test('printed source values are never overwritten', () => {
  for (const offering of offerings) {
    assert.equal(offering.mappingEvidence.printedCode, offering.printedCourseCode);
    assert.equal(offering.mappingEvidence.printedTitle, offering.sourceTitle);
  }
});
test('EKO1202 Mathematics II mismatch stays visible', () => {
  const rows = offerings.filter((offering) => offering.printedCourseCode === 'EKO1202' && offering.sourceTitle.toLocaleUpperCase('tr-TR') === 'MATEMATİK II');
  assert.ok(rows.length > 0);
  assert.ok(rows.every((offering) => offering.mappingStatus === 'mapped-with-anomaly' && offering.anomalyRefs.includes('offering-printed-code-mismatch')));
});
test('filters and overlap analysis are deterministic', () => {
  assert.equal(filterOfferings(offerings, { term: 'spring' }).length, 83);
  assert.deepEqual(findOverlaps(offerings), findOverlaps(offerings));
});
