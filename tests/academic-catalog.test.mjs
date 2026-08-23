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

test('semester catalog requires a curriculum id when a program has multiple curricula', () => {
  const catalog = clone(academicCatalog);
  const originalCurriculum = catalog.curricula.find(item => item.programId === 'prog-buu-ekonometri-lisans');
  catalog.curricula.push({ ...originalCurriculum, id: 'curr-buu-ekonometri-lisans-second' });

  assert.throws(
    () => semesterCatalog(catalog, 'prog-buu-ekonometri-lisans', 5),
    new Error('Multiple curricula for program prog-buu-ekonometri-lisans; curriculumId is required')
  );
  const semester = semesterCatalog(catalog, 'prog-buu-ekonometri-lisans', 5, originalCurriculum.id);
  assert.deepEqual(semester.curriculum, originalCurriculum);
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
  delete catalog.courses[0].verificationStatus;
  catalog.curriculumCourses[0].semester = 9;
  const errors = validateAcademicCatalog(catalog);
  assert.ok(errors.some(error => error.includes('unknown institution missing')));
  assert.ok(errors.some(error => error.includes('missing sourceRefs')));
  assert.ok(errors.some(error => error.includes('missing verification status')));
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

test('validator allows one course source record across snapshots from the same source', () => {
  const catalog = clone(academicCatalog);
  catalog.sourceSnapshots.push({
    id: 'snap-buu-program-second', sourceId: 'src-buu-program-package', retrievedAt: '2026-08-23T01:00:00Z',
    academicYear: null, snapshotHash: null
  });
  catalog.courses[0].sourceRefs.push('snap-buu-program-second');

  const errors = validateAcademicCatalog(catalog);
  assert.ok(!errors.some(error => error.includes('duplicate source record')));
});

test('validator rejects the same source natural key on different courses', () => {
  const catalog = clone(academicCatalog);
  catalog.sourceSnapshots.push({
    id: 'snap-buu-program-second', sourceId: 'src-buu-program-package', retrievedAt: '2026-08-23T01:00:00Z',
    academicYear: null, snapshotHash: null
  });
  catalog.courses[1].sourceRefs = ['snap-buu-program-second'];
  catalog.courses[1].sourceRecordKey = catalog.courses[0].sourceRecordKey;

  const errors = validateAcademicCatalog(catalog);
  assert.ok(errors.some(error => error.includes('duplicate source record')));
});

test('validator rejects invalid anomaly type and status', () => {
  const catalog = clone(academicCatalog);
  catalog.anomalies[0].type = 'invalid-type';
  catalog.anomalies[0].status = 'invalid-status';

  const errors = validateAcademicCatalog(catalog);
  assert.ok(errors.some(error => error.includes('invalid type invalid-type')));
  assert.ok(errors.some(error => error.includes('invalid status invalid-status')));
});

test('validator rejects duplicate CurriculumCourse natural keys', () => {
  const catalog = clone(academicCatalog);
  catalog.curriculumCourses.push({
    ...catalog.curriculumCourses[0],
    id: 'cc-buu-current-s5-eko3101-core-duplicate'
  });

  const errors = validateAcademicCatalog(catalog);
  assert.ok(errors.some(error => error.includes('duplicate natural key curr-buu-ekonometri-current::5::course-buu-eko3101::core')));
});

test('validator rejects invalid CurriculumCourse enums and requirement groups', () => {
  const catalog = clone(academicCatalog);
  catalog.curriculumCourses[0].courseType = 'mandatory';
  catalog.curriculumCourses[0].targetAudience = 'everyone';
  catalog.curriculumCourses[0].requirementGroup = '   ';

  const errors = validateAcademicCatalog(catalog);
  assert.ok(errors.some(error => error.includes('invalid courseType mandatory')));
  assert.ok(errors.some(error => error.includes('invalid targetAudience everyone')));
  assert.ok(errors.some(error => error.includes('invalid requirementGroup')));
});

test('validator rejects negative and non-finite CurriculumCourse measurements', () => {
  const catalog = clone(academicCatalog);
  catalog.curriculumCourses[0].ects = -1;
  catalog.curriculumCourses[0].theoryHours = Number.NaN;
  catalog.curriculumCourses[0].practiceHours = Number.POSITIVE_INFINITY;
  catalog.curriculumCourses[0].labHours = '0';

  const errors = validateAcademicCatalog(catalog);
  for (const field of ['ects', 'theoryHours', 'practiceHours', 'labHours']) {
    assert.ok(errors.some(error => error.includes(`invalid ${field}`)));
  }
});

test('validator accepts zero, positive and null CurriculumCourse measurements', () => {
  const catalog = clone(academicCatalog);
  catalog.curriculumCourses[0].ects = 5;
  catalog.curriculumCourses[0].theoryHours = 3;
  catalog.curriculumCourses[0].practiceHours = 0;
  catalog.curriculumCourses[0].labHours = null;

  assert.deepEqual(validateAcademicCatalog(catalog), []);
});
