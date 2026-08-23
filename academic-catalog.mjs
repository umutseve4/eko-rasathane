import { VERIFICATION_STATUSES } from './data/academic-catalog.mjs';

const arrays = ['sources', 'sourceSnapshots', 'institutions', 'programs', 'curricula', 'courses', 'curriculumCourses', 'anomalies'];
const sourcedCollections = ['institutions', 'programs', 'curricula', 'courses', 'curriculumCourses', 'anomalies'];
const anomalyTypes = new Set(['duplicate-code', 'title-conflict', 'ects-conflict', 'typo-suspected', 'source-mismatch', 'other']);
const anomalyStatuses = new Set(['open', 'confirmed', 'resolved', 'rejected']);
const courseTypes = new Set(['required', 'elective']);
const targetAudiences = new Set(['core', 'service', 'mixed', 'unknown']);
const nonNegativeCurriculumCourseFields = ['ects', 'theoryHours', 'practiceHours', 'labHours'];
const asArray = value => Array.isArray(value) ? value : [];
const key = (...parts) => JSON.stringify(parts);
const isNonNegativeFinite = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;

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
  if (curriculumId === null && curricula.length > 1) throw new Error(`Multiple curricula for program ${programId}; curriculumId is required`);
  const curriculum = curriculumId === null ? curricula[0] : curricula.find(item => item.id === curriculumId) ?? null;
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
    const semesterCountValid = Number.isInteger(curriculum.semesterCount) && curriculum.semesterCount >= 1;
    if (!semesterCountValid) errors.push(`curricula:${curriculum.id}: invalid semesterCount`);
    if (!Array.isArray(curriculum.semesterEctsPublished)) errors.push(`curricula:${curriculum.id}: invalid semesterEctsPublished`);
    else {
      if (semesterCountValid && curriculum.semesterEctsPublished.length !== curriculum.semesterCount) errors.push(`curricula:${curriculum.id}: semesterEctsPublished length must equal semesterCount`);
      for (const value of curriculum.semesterEctsPublished) if (!isNonNegativeFinite(value)) errors.push(`curricula:${curriculum.id}: invalid semesterEctsPublished value`);
    }
    if (!Array.isArray(curriculum.requirementGroups)) errors.push(`curricula:${curriculum.id}: invalid requirementGroups`);
    else {
      const groupIds = new Set();
      for (const group of curriculum.requirementGroups) {
        if (!group?.id) errors.push(`curricula:${curriculum.id}: requirementGroup missing id`);
        else if (groupIds.has(group.id)) errors.push(`curricula:${curriculum.id}: duplicate requirementGroup id ${group.id}`);
        else groupIds.add(group.id);
        if (!semesterCountValid || !Number.isInteger(group?.semester) || group.semester < 1 || group.semester > curriculum.semesterCount) errors.push(`curricula:${curriculum.id}: requirementGroup ${group?.id}: semester out of range`);
        if (!isNonNegativeFinite(group?.requiredEcts)) errors.push(`curricula:${curriculum.id}: requirementGroup ${group?.id}: invalid requiredEcts`);
        if (!Number.isInteger(group?.selectionCount) || group.selectionCount < 1) errors.push(`curricula:${curriculum.id}: requirementGroup ${group?.id}: invalid selectionCount`);
      }
    }
    for (const ref of asArray(curriculum.anomalyRefs)) if (!ids.anomalies.has(ref)) errors.push(`curricula:${curriculum.id}: unknown anomaly ${ref}`);
  }

  const curricula = new Map(asArray(catalog.curricula).map(item => [item.id, item]));
  for (const course of asArray(catalog.courses)) {
    if (!ids.institutions.has(course.institutionId)) errors.push(`courses:${course.id}: unknown institution ${course.institutionId}`);
    if (!course.sourceRecordKey) errors.push(`courses:${course.id}: missing sourceRecordKey`);
    for (const ref of asArray(course.anomalyRefs)) if (!ids.anomalies.has(ref)) errors.push(`courses:${course.id}: unknown anomaly ${ref}`);
  }

  const curriculumCourseNaturalKeys = new Map();
  for (const relation of asArray(catalog.curriculumCourses)) {
    const curriculum = curricula.get(relation.curriculumId);
    if (!curriculum) errors.push(`curriculumCourses:${relation.id}: unknown curriculum ${relation.curriculumId}`);
    if (!ids.courses.has(relation.courseId)) errors.push(`curriculumCourses:${relation.id}: unknown course ${relation.courseId}`);
    if (curriculum && (!Number.isInteger(relation.semester) || relation.semester < 1 || relation.semester > curriculum.semesterCount)) errors.push(`curriculumCourses:${relation.id}: semester out of range`);
    if (!courseTypes.has(relation.courseType)) errors.push(`curriculumCourses:${relation.id}: invalid courseType ${relation.courseType}`);
    if (!targetAudiences.has(relation.targetAudience)) errors.push(`curriculumCourses:${relation.id}: invalid targetAudience ${relation.targetAudience}`);
    if (relation.requirementGroup !== null && (typeof relation.requirementGroup !== 'string' || !relation.requirementGroup.trim())) errors.push(`curriculumCourses:${relation.id}: invalid requirementGroup`);
    for (const field of nonNegativeCurriculumCourseFields) {
      const value = relation[field];
      if (value !== null && !isNonNegativeFinite(value)) errors.push(`curriculumCourses:${relation.id}: invalid ${field}`);
    }
    const naturalKey = key(relation.curriculumId, relation.semester, relation.courseId, relation.requirementGroup);
    const existingRelationId = curriculumCourseNaturalKeys.get(naturalKey);
    if (existingRelationId && existingRelationId !== relation.id) errors.push(`curriculumCourses:${relation.id}: duplicate natural key ${naturalKey}`);
    else curriculumCourseNaturalKeys.set(naturalKey, relation.id);
  }

  for (const anomaly of asArray(catalog.anomalies)) {
    if (anomaly.entityType === 'Course' && !ids.courses.has(anomaly.entityId)) errors.push(`anomalies:${anomaly.id}: unknown course ${anomaly.entityId}`);
    if (anomaly.entityType === 'Curriculum' && !ids.curricula.has(anomaly.entityId)) errors.push(`anomalies:${anomaly.id}: unknown curriculum ${anomaly.entityId}`);
    if (!anomalyTypes.has(anomaly.type)) errors.push(`anomalies:${anomaly.id}: invalid type ${anomaly.type}`);
    if (!anomalyStatuses.has(anomaly.status)) errors.push(`anomalies:${anomaly.id}: invalid status ${anomaly.status}`);
  }

  const sourceRecords = new Map();
  for (const course of asArray(catalog.courses)) {
    for (const sourceRef of asArray(course.sourceRefs)) {
      const sourceId = snapshots.get(sourceRef)?.sourceId ?? sourceRef;
      const naturalKey = key(sourceId, course.sourceRecordKey);
      const existingCourseId = sourceRecords.get(naturalKey);
      if (existingCourseId && existingCourseId !== course.id) errors.push(`courses:${course.id}: duplicate source record ${naturalKey}`);
      else sourceRecords.set(naturalKey, course.id);
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
