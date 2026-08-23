import assert from 'node:assert/strict';
import test from 'node:test';
import { validateAcademicCatalog } from '../academic-catalog.mjs';
import { academicCatalog } from '../data/academic-catalog.mjs';

const clone = () => structuredClone(academicCatalog);
const expectError = (catalog, pattern) => assert.match(validateAcademicCatalog(catalog).join('\n'), pattern);

function sourcedRecord(catalog) {
  return catalog.curriculumCourses[0];
}

test('rejects missing provenance and verification status', () => {
  const missingRefs = clone();
  sourcedRecord(missingRefs).sourceRefs = [];
  expectError(missingRefs, /missing sourceRefs/);

  const missingStatus = clone();
  delete sourcedRecord(missingStatus).verificationStatus;
  expectError(missingStatus, /missing verification status/);
});

test('rejects semesters below and above curriculum bounds', () => {
  const low = clone();
  low.curriculumCourses[0].semester = 0;
  expectError(low, /semester out of range/);

  const high = clone();
  high.curriculumCourses[0].semester = high.curricula[0].semesterCount + 1;
  expectError(high, /semester out of range/);
});

test('rejects invalid anomaly type and status', () => {
  const invalidType = clone();
  invalidType.anomalies[0].type = 'spelling';
  expectError(invalidType, /invalid type spelling/);

  const invalidStatus = clone();
  invalidStatus.anomalies[0].status = 'pending';
  expectError(invalidStatus, /invalid status pending/);
});

test('rejects invalid course enums and requirementGroup', () => {
  const invalidCourseType = clone();
  invalidCourseType.curriculumCourses[0].courseType = 'mandatory';
  expectError(invalidCourseType, /invalid courseType mandatory/);

  const invalidAudience = clone();
  invalidAudience.curriculumCourses[0].targetAudience = 'department';
  expectError(invalidAudience, /invalid targetAudience department/);

  for (const value of ['', '   ', 42]) {
    const catalog = clone();
    catalog.curriculumCourses[0].requirementGroup = value;
    expectError(catalog, /invalid requirementGroup/);
  }
});

test('rejects NaN, Infinity, negative and string measurements', () => {
  for (const [field, value] of [['ects', NaN], ['theoryHours', Infinity], ['practiceHours', -1], ['labHours', '0']]) {
    const catalog = clone();
    catalog.curriculumCourses[0][field] = value;
    expectError(catalog, new RegExp(`invalid ${field}`));
  }
});

test('rejects duplicate source records', () => {
  const catalog = clone();
  catalog.courses[1].sourceRecordKey = catalog.courses[0].sourceRecordKey;
  catalog.courses[1].sourceRefs = [...catalog.courses[0].sourceRefs];
  expectError(catalog, /duplicate source record/);
});

test('rejects duplicate course codes that have no duplicate-code anomalies', () => {
  const catalog = clone();
  catalog.courses[1].courseCode = catalog.courses[0].courseCode;
  expectError(catalog, /duplicate courseCode without anomaly/);
});

test('validates semesterEctsPublished shape and values', () => {
  const notArray = clone();
  notArray.curricula[0].semesterEctsPublished = null;
  expectError(notArray, /invalid semesterEctsPublished/);

  const wrongLength = clone();
  wrongLength.curricula[0].semesterEctsPublished.pop();
  expectError(wrongLength, /semesterEctsPublished length must equal semesterCount/);

  for (const value of [NaN, Infinity, -1, '30']) {
    const catalog = clone();
    catalog.curricula[0].semesterEctsPublished[0] = value;
    expectError(catalog, /invalid semesterEctsPublished value/);
  }
});

test('validates requirementGroups IDs, semesters, ECTS and selection counts', () => {
  const notArray = clone();
  notArray.curricula[0].requirementGroups = null;
  expectError(notArray, /invalid requirementGroups/);

  const duplicate = clone();
  duplicate.curricula[0].requirementGroups.push({ ...duplicate.curricula[0].requirementGroups[0] });
  expectError(duplicate, /duplicate requirementGroup id/);

  for (const semester of [0, 9, 1.5]) {
    const catalog = clone();
    catalog.curricula[0].requirementGroups[0].semester = semester;
    expectError(catalog, /semester out of range/);
  }
  for (const requiredEcts of [NaN, Infinity, -1, '6']) {
    const catalog = clone();
    catalog.curricula[0].requirementGroups[0].requiredEcts = requiredEcts;
    expectError(catalog, /invalid requiredEcts/);
  }
  for (const selectionCount of [0, -1, 1.5, '1']) {
    const catalog = clone();
    catalog.curricula[0].requirementGroups[0].selectionCount = selectionCount;
    expectError(catalog, /invalid selectionCount/);
  }
});

test('validates curriculum anomaly references and Curriculum anomaly entities', () => {
  const unknownRef = clone();
  unknownRef.curricula[0].anomalyRefs = ['anomaly-does-not-exist'];
  expectError(unknownRef, /unknown anomaly anomaly-does-not-exist/);

  const unknownEntity = clone();
  unknownEntity.anomalies.push({
    id: 'anomaly-bad-curriculum',
    entityType: 'Curriculum',
    entityId: 'curriculum-does-not-exist',
    type: 'other',
    status: 'open',
    note: 'test',
    sourceRefs: [unknownEntity.sourceSnapshots[0].id],
    verificationStatus: 'source-confirmed'
  });
  expectError(unknownEntity, /unknown curriculum curriculum-does-not-exist/);
});
