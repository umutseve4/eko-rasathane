import test from 'node:test';
import assert from 'node:assert/strict';
import { academicCatalog } from '../data/academic-catalog.mjs';
import { listPrograms, semesterCatalog, validateAcademicCatalog } from '../academic-catalog.mjs';

const clone = value => structuredClone(value);
const curriculumId = 'curr-buu-ekonometri-2025-2026';
const snapshotId = 'snap-buu-program-ay33-2026-08-23';

test('2025-2026 fixture satisfies referential, source and anomaly integrity', () => {
  assert.deepEqual(validateAcademicCatalog(academicCatalog), []);
});

test('current curriculum contains all 8 semesters and all 144 source course rows', () => {
  const expected = {
    1: [9, 0], 2: [8, 0], 3: [4, 12], 4: [4, 11],
    5: [4, 17], 6: [4, 21], 7: [4, 23], 8: [4, 19]
  };
  assert.equal(academicCatalog.courses.length, 144);
  assert.equal(academicCatalog.curriculumCourses.length, 144);
  for (const [semester, [required, elective]] of Object.entries(expected)) {
    const entries = semesterCatalog(academicCatalog, 'prog-buu-ekonometri-lisans', Number(semester), curriculumId).entries;
    assert.equal(entries.filter(item => item.courseType === 'required').length, required);
    assert.equal(entries.filter(item => item.courseType === 'elective').length, elective);
  }
});

test('required and elective semantics preserve source load without fake placeholder courses', () => {
  const curriculum = academicCatalog.curricula[0];
  assert.deepEqual(curriculum.semesterEctsPublished, [31, 30, 30, 30, 30, 30, 30, 30]);
  assert.equal(curriculum.semesterEctsPublished.reduce((sum, value) => sum + value, 0), 241);
  assert.equal(academicCatalog.programs[0].totalEcts, 240);
  assert.deepEqual(curriculum.requirementGroups.map(group => [group.semester, group.requiredEcts, group.selectionCount]), [
    [3, 10, 2], [4, 10, 2], [5, 10, 2], [6, 10, 2], [7, 10, 2], [8, 10, 2]
  ]);
  for (const relation of academicCatalog.curriculumCourses) {
    if (relation.courseType === 'required') assert.equal(relation.requirementGroup, null);
    else assert.equal(relation.requirementGroup, `elective-s${relation.semester}`);
  }
  assert.ok(!academicCatalog.courses.some(course => course.sourceTitle.includes('Seçmeli dersler için tıklayınız')));
  assert.ok(academicCatalog.anomalies.some(anomaly => anomaly.id === 'anomaly-curriculum-ay33-total-ects' && anomaly.type === 'ects-conflict'));
});

test('duplicate source codes and suspected typos remain explicit and uncorrected', () => {
  for (const code of ['EKO2004', 'IKT3306', 'EKO4305']) {
    const courses = academicCatalog.courses.filter(course => course.courseCode === code);
    assert.equal(courses.length, 2);
    assert.ok(courses.every(course => course.anomalyRefs.some(id => id.startsWith('anomaly-duplicate-'))));
  }
  assert.equal(academicCatalog.courses.find(course => course.courseCode === 'EKO3310').sourceTitle, 'PYHTON UYGULAMALARI');
  assert.equal(academicCatalog.courses.find(course => course.courseCode === 'EKO4115').sourceTitle, 'ÖNRAPORLAMA TEKNİKLERİ');
});

test('all imported records carry exact snapshot provenance', () => {
  const snapshot = academicCatalog.sourceSnapshots[0];
  assert.equal(snapshot.retrievedAt, '2026-08-23T19:03:28Z');
  assert.equal(snapshot.snapshotHash, 'sha256:0b72d3ba7919492cce571d697902dff1ca20d6e0ef67dcbdf3f53f5b6acee1c6');
  for (const collection of ['institutions', 'programs', 'curricula', 'courses', 'curriculumCourses', 'anomalies']) {
    assert.ok(academicCatalog[collection].every(record => record.sourceRefs.includes(snapshotId)));
  }
  assert.equal(new Set(academicCatalog.courses.map(course => course.sourceRecordKey)).size, 144);
});

test('program discovery and explicit curriculum selection remain data-driven', () => {
  assert.deepEqual(listPrograms(academicCatalog).map(program => program.id), ['prog-buu-ekonometri-lisans']);
  const catalog = clone(academicCatalog);
  catalog.curricula.push({ ...catalog.curricula[0], id: 'curr-second' });
  assert.throws(() => semesterCatalog(catalog, 'prog-buu-ekonometri-lisans', 5), /curriculumId is required/);
  assert.equal(semesterCatalog(catalog, 'prog-buu-ekonometri-lisans', 5, curriculumId).entries.length, 21);
});

test('validator rejects broken references, duplicate natural keys and invalid measurements', () => {
  const catalog = clone(academicCatalog);
  catalog.programs[0].institutionId = 'missing';
  catalog.curriculumCourses.push({ ...catalog.curriculumCourses[0], id: 'duplicate-relation' });
  catalog.curriculumCourses[0].ects = -1;
  const errors = validateAcademicCatalog(catalog);
  assert.ok(errors.some(error => error.includes('unknown institution missing')));
  assert.ok(errors.some(error => error.includes('duplicate natural key')));
  assert.ok(errors.some(error => error.includes('invalid ects')));
});

test('validator keeps compound keys distinct when values contain delimiters', () => {
  const catalog = clone(academicCatalog);
  const base = catalog.curriculumCourses[0];
  catalog.courses.push(
    { ...catalog.courses[0], id: 'course::pool', courseCode: 'COLLISION-A', sourceRecordKey: 'collision-a', anomalyRefs: [] },
    { ...catalog.courses[0], id: 'course', courseCode: 'COLLISION-B', sourceRecordKey: 'collision-b', anomalyRefs: [] }
  );
  catalog.curricula[0].requirementGroups = [
    { id: 'x', semester: base.semester, selectionCount: 1, requiredEcts: base.ects },
    { id: 'pool::x', semester: base.semester, selectionCount: 1, requiredEcts: base.ects }
  ];
  catalog.curriculumCourses = [
    { ...base, id: 'cc-collision-a', courseId: 'course::pool', courseType: 'elective', requirementGroup: 'x' },
    { ...base, id: 'cc-collision-b', courseId: 'course', courseType: 'elective', requirementGroup: 'pool::x' }
  ];
  assert.deepEqual(validateAcademicCatalog(catalog), []);
});
