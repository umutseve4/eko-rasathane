import test from 'node:test';
import assert from 'node:assert/strict';
import { academicCatalog } from '../data/academic-catalog.mjs';
import { listPrograms, semesterCatalog, validateAcademicCatalog } from '../academic-catalog.mjs';

const clone = value => structuredClone(value);

test('M2 fixture satisfies referential, source and anomaly integrity', () => {
  assert.deepEqual(validateAcademicCatalog(academicCatalog), []);
});

test('EKO3101 core context stays separate from conflicted EKO3103 fixture', () => {
  const semester = semesterCatalog(academicCatalog, 'prog-buu-ekonometri-lisans', 5);
  assert.equal(semester.entries.length, 1);
  assert.equal(semester.entries[0].course.courseCode, 'EKO3101');
  assert.equal(semester.entries[0].targetAudience, 'core');
  const serviceFixture = academicCatalog.courses.find(course => course.courseCode === 'EKO3103');
  assert.equal(serviceFixture.verificationStatus, 'conflicted');
  assert.deepEqual(serviceFixture.anomalyRefs, ['anomaly-buu-eko3103-ects']);
  assert.notEqual(semester.entries[0].course.id, serviceFixture.id);
});

test('program discovery is data-driven when another institution and program are added', () => {
  const catalog = clone(academicCatalog);
  catalog.institutions.push({
    id: 'inst-fixture', name: 'Fixture Üniversitesi', countryCode: 'TR', institutionSlug: 'fixture-universitesi',
    sourceRefs: ['snap-buu-program-2026-08-23'], verificationStatus: 'unverified'
  });
  catalog.programs.push({
    id: 'prog-fixture', institutionId: 'inst-fixture', programCode: null, sourceTitle: 'Fixture Programı',
    canonicalTitle: 'Fixture Programı', degreeLevel: 'bachelor', totalEcts: null, disciplineTags: [],
    sourceRefs: ['snap-buu-program-2026-08-23'], verificationStatus: 'unverified'
  });
  assert.deepEqual(listPrograms(catalog).map(program => program.id), ['prog-buu-ekonometri-lisans', 'prog-fixture']);
  assert.equal(listPrograms(catalog, 'inst-fixture')[0].institution.id, 'inst-fixture');
});

test('validator rejects broken references, missing provenance and out-of-range semesters', () => {
  const catalog = clone(academicCatalog);
  catalog.programs[0].institutionId = 'missing';
  catalog.courses[0].sourceRefs = [];
  catalog.curriculumCourses[0].semester = 9;
  const errors = validateAcademicCatalog(catalog);
  assert.ok(errors.some(error => error.includes('unknown institution missing')));
  assert.ok(errors.some(error => error.includes('missing sourceRefs')));
  assert.ok(errors.some(error => error.includes('semester out of range')));
});

test('validator rejects duplicate course codes without explicit anomalies', () => {
  const catalog = clone(academicCatalog);
  catalog.courses.push({
    ...catalog.courses[0],
    id: 'course-buu-eko3101-duplicate',
    sourceRecordKey: 'program-343:EKO3101:duplicate'
  });
  const errors = validateAcademicCatalog(catalog);
  assert.ok(errors.some(error => error.includes('duplicate courseCode without anomaly')));
});

test('validator rejects duplicate source records and boolean verification flags', () => {
  const catalog = clone(academicCatalog);
  catalog.courses[1].sourceRefs = [...catalog.courses[0].sourceRefs];
  catalog.courses[1].sourceRecordKey = catalog.courses[0].sourceRecordKey;
  catalog.courses[1].verified = true;
  const errors = validateAcademicCatalog(catalog);
  assert.ok(errors.some(error => error.includes('duplicate source record')));
  assert.ok(errors.some(error => error.includes('boolean verified is forbidden')));
});
