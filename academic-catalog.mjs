import { VERIFICATION_STATUSES } from './data/academic-catalog.mjs';

const arrays = ['sources', 'sourceSnapshots', 'institutions', 'programs', 'curricula', 'courses', 'curriculumCourses', 'anomalies'];
const sourcedCollections = ['institutions', 'programs', 'curricula', 'courses', 'curriculumCourses', 'anomalies'];
const asArray = value => Array.isArray(value) ? value : [];
const key = (...parts) => parts.join('::');

export function listPrograms(catalog, institutionId = null) {
  const institutions = new Map(asArray(catalog.institutions).map(item => [item.id, item]));
  return asArray(catalog.programs)
    .filter(program => !institutionId || program.institutionId === institutionId)
    .map(program => ({ ...program, institution: institutions.get(program.institutionId) ?? null }))
    .sort((a, b) => a.canonicalTitle.localeCompare(b.canonicalTitle, 'tr'));
}

export function semesterCatalog(catalog, programId, semester, curriculumId = null) {
  const curricula = asArray(catalog.curricula).filter(item => item.programId === programId);
  if (!curricula.length) return null;
  if (curriculumId === null && curricula.length > 1) {
    throw new Error(`Multiple curricula for program ${programId}; curriculumId is required`);
  }
  const curriculum = curriculumId === null
    ? curricula[0]
    : curricula.find(item => item.id === curriculumId) ?? null;
  if (!curriculum) return null;
  const courses = new Map(asArray(catalog.courses).map(item => [item.id, item]));
  const entries = asArray(catalog.curriculumCourses)
    .filter(item => item.curriculumId === curriculum.id && item.semester === semester)
    .map(item => ({ ...item, course: courses.get(item.courseId) ?? null }))
    .sort((a, b) => (a.course?.courseCode ?? '').localeCompare(b.course?.courseCode ?? '', 'tr'));
  return { curriculum, semester, entries };
}

export function validateAcademicCatalog(catalog) {
  const errors = [];
  const ids = {};
  const statusSet = new Set(VERIFICATION_STATUSES);

  for (const collection of arrays) {
    ids[collection] = new Set();
    for (const record of asArray(catalog[collection])) {
      if (!record?.id) errors.push(`${collection}: missing id`);
      else if (ids[collection].has(record.id)) errors.push(`${collection}: duplicate id ${record.id}`);
      else ids[collection].add(record.id);
      if (Object.hasOwn(record ?? {}, 'verified')) errors.push(`${collection}:${record?.id}: boolean verified is forbidden`);
    }
  }

  const snapshotIds = ids.sourceSnapshots;
  const snapshots = new Map(asArray(catalog.sourceSnapshots).map(item => [item.id, item]));
  for (const collection of sourcedCollections) {
    for (const record of asArray(catalog[collection])) {
      if (!asArray(record.sourceRefs).length) errors.push(`${collection}:${record.id}: missing sourceRefs`);
      for (const ref of asArray(record.sourceRefs)) if (!snapshotIds.has(ref)) errors.push(`${collection}:${record.id}: unknown sourceRef ${ref}`);
      if (!record.verificationStatus) errors.push(`${collection}:${record.id}: missing verification status`);
      else if (!statusSet.has(record.verificationStatus)) errors.push(`${collection}:${record.id}: invalid verification status`);
    }
  }

  for (const snapshot of asArray(catalog.sourceSnapshots)) {
    if (!ids.sources.has(snapshot.sourceId)) errors.push(`sourceSnapshots:${snapshot.id}: unknown source ${snapshot.sourceId}`);
  }
  for (const program of asArray(catalog.programs)) {
    if (!ids.institutions.has(program.institutionId)) errors.push(`programs:${program.id}: unknown institution ${program.institutionId}`);
  }
  for (const curriculum of asArray(catalog.curricula)) {
    if (!ids.programs.has(curriculum.programId)) errors.push(`curricula:${curriculum.id}: unknown program ${curriculum.programId}`);
    if (!Number.isInteger(curriculum.semesterCount) || curriculum.semesterCount < 1) errors.push(`curricula:${curriculum.id}: invalid semesterCount`);
  }
  const curricula = new Map(asArray(catalog.curricula).map(item => [item.id, item]));
  for (const course of asArray(catalog.courses)) {
    if (!ids.institutions.has(course.institutionId)) errors.push(`courses:${course.id}: unknown institution ${course.institutionId}`);
    if (!course.sourceRecordKey) errors.push(`courses:${course.id}: missing sourceRecordKey`);
    for (const ref of asArray(course.anomalyRefs)) if (!ids.anomalies.has(ref)) errors.push(`courses:${course.id}: unknown anomaly ${ref}`);
  }
  for (const relation of asArray(catalog.curriculumCourses)) {
    const curriculum = curricula.get(relation.curriculumId);
    if (!curriculum) errors.push(`curriculumCourses:${relation.id}: unknown curriculum ${relation.curriculumId}`);
    if (!ids.courses.has(relation.courseId)) errors.push(`curriculumCourses:${relation.id}: unknown course ${relation.courseId}`);
    if (curriculum && (!Number.isInteger(relation.semester) || relation.semester < 1 || relation.semester > curriculum.semesterCount)) errors.push(`curriculumCourses:${relation.id}: semester out of range`);
  }
  for (const anomaly of asArray(catalog.anomalies)) {
    if (anomaly.entityType === 'Course' && !ids.courses.has(anomaly.entityId)) errors.push(`anomalies:${anomaly.id}: unknown course ${anomaly.entityId}`);
  }

  const sourceRecords = new Set();
  for (const course of asArray(catalog.courses)) {
    for (const sourceRef of asArray(course.sourceRefs)) {
      const sourceId = snapshots.get(sourceRef)?.sourceId ?? sourceRef;
      const naturalKey = key(sourceId, course.sourceRecordKey);
      if (sourceRecords.has(naturalKey)) errors.push(`courses:${course.id}: duplicate source record ${naturalKey}`);
      sourceRecords.add(naturalKey);
    }
  }

  const byInstitutionAndCode = new Map();
  for (const course of asArray(catalog.courses)) {
    const naturalKey = key(course.institutionId, course.courseCode);
    const group = byInstitutionAndCode.get(naturalKey) ?? [];
    group.push(course);
    byInstitutionAndCode.set(naturalKey, group);
  }
  for (const [naturalKey, duplicates] of byInstitutionAndCode) {
    if (duplicates.length < 2) continue;
    const covered = duplicates.every(course => asArray(catalog.anomalies).some(anomaly => anomaly.entityId === course.id && anomaly.type === 'duplicate-code'));
    if (!covered) errors.push(`courses: duplicate courseCode without anomaly ${naturalKey}`);
  }

  return errors;
}
