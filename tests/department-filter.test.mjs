import test from 'node:test';
import assert from 'node:assert/strict';
import { offerings, filterOfferings, getDepartmentCode, getDepartmentCodes } from '../offerings.mjs';

test('department code is source-derived and normalized safely', () => {
  assert.equal(getDepartmentCode({ printedCourseCode: 'EKO1202' }), 'EKO');
  assert.equal(getDepartmentCode({ printedCourseCode: '  eko1202' }), 'EKO');
  assert.equal(getDepartmentCode({ printedCourseCode: 'İKT3306' }), 'İKT');
  assert.equal(getDepartmentCode({ printedCourseCode: '1202EKO' }), '');
  assert.equal(getDepartmentCode({}), '');
  assert.equal(getDepartmentCode(null), '');
});

test('department options are unique and Turkish-locale sorted', () => {
  assert.deepEqual(getDepartmentCodes([
    { printedCourseCode: 'İKT1001' },
    { printedCourseCode: 'EKO1202' },
    { printedCourseCode: 'eko2201' },
    { printedCourseCode: '' }
  ]), ['EKO', 'İKT']);
  const actual = getDepartmentCodes(offerings);
  assert.ok(actual.length > 1);
  assert.deepEqual(actual, [...new Set(actual)].sort((a,b) => a.localeCompare(b, 'tr-TR')));
  assert.equal(offerings.every(item => actual.includes(getDepartmentCode(item))), true);
});

test('department filter is exact, optional and conjunctive', () => {
  const departments = getDepartmentCodes(offerings);
  const selected = departments.at(-1);
  const byDepartment = filterOfferings(offerings, { department: selected });
  assert.ok(byDepartment.length > 0 && byDepartment.length < offerings.length);
  assert.ok(byDepartment.every(item => getDepartmentCode(item) === selected));
  assert.equal(filterOfferings(offerings, {}).length, offerings.length);
  const term = byDepartment[0].term;
  assert.ok(filterOfferings(offerings, { department: selected, term }).every(item => getDepartmentCode(item) === selected && item.term === term));
});
