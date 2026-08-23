import assert from 'node:assert/strict';
import test from 'node:test';
import { academicCatalog } from '../data/academic-catalog.mjs';

test('keeps the official AyID=33 course counts and unique identities', () => {
  assert.equal(academicCatalog.courses.length, 144);
  assert.equal(academicCatalog.curriculumCourses.length, 144);
  assert.equal(academicCatalog.curriculumCourses.filter(row => row.courseType === 'required').length, 41);
  assert.equal(academicCatalog.curriculumCourses.filter(row => row.courseType === 'elective').length, 103);
  assert.equal(new Set(academicCatalog.courses.map(row => row.id)).size, 144);
  assert.equal(new Set(academicCatalog.courses.map(row => row.sourceRecordKey)).size, 144);
  assert.equal(new Set(academicCatalog.curriculumCourses.map(row => row.id)).size, 144);
});

test('uses structural source fingerprints and course-based relation IDs', () => {
  const relations = new Map(academicCatalog.curriculumCourses.map(row => [row.courseId, row]));
  for (const course of academicCatalog.courses) {
    const relation = relations.get(course.id);
    assert.ok(relation);
    assert.equal(course.sourceRecordKey, JSON.stringify([
      'program-343',
      'ay33',
      relation.semester,
      relation.courseType,
      course.courseCode,
      course.sourceTitle
    ]));
    assert.equal(relation.id, `cc-${course.id}`);
  }
});

test('preserves and links the IKT3306 source typo exactly', () => {
  const course = academicCatalog.courses.find(row => row.courseCode === 'IKT3306' && row.sourceTitle === 'DOGAL KAYNAKLAR EKONOMİSİ');
  assert.ok(course);
  assert.ok(course.anomalyRefs.includes('anomaly-typo-ikt3306-dogal'));
  const anomaly = academicCatalog.anomalies.find(row => row.id === 'anomaly-typo-ikt3306-dogal');
  assert.ok(anomaly);
  assert.equal(anomaly.entityId, course.id);
  assert.equal(anomaly.entityType, 'Course');
  assert.equal(anomaly.type, 'typo-suspected');
  assert.equal(anomaly.status, 'open');
  assert.equal(anomaly.sourceValue, 'DOGAL KAYNAKLAR EKONOMİSİ');
});
