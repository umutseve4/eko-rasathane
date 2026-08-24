import test from 'node:test';
import assert from 'node:assert/strict';
import { DEPARTMENT_OPTIONS, offerings, filterOfferings, getDepartmentCode, getDepartmentCodes, getDepartmentOptions } from '../offerings.mjs';

const expected = [
  { code: 'CAL', name: 'Çalışma Ekonomisi ve Endüstri İlişkileri', count: 18 },
  { code: 'EKO', name: 'Ekonometri', count: 64 },
  { code: 'IKT', name: 'İktisat', count: 33 },
  { code: 'ISL', name: 'İşletme', count: 21 },
  { code: 'MLY', name: 'Maliye', count: 16 },
  { code: 'KAM', name: 'Siyaset Bilimi ve Kamu Yönetimi', count: 1 },
  { code: 'ULU', name: 'Uluslararası İlişkiler', count: 3 }
];

test('department code is source-derived and normalized safely', () => {
  assert.equal(getDepartmentCode({ printedCourseCode: 'EKO1202' }), 'EKO');
  assert.equal(getDepartmentCode({ printedCourseCode: '  eko1202' }), 'EKO');
  assert.equal(getDepartmentCode({ printedCourseCode: 'İKT3306' }), 'İKT');
  assert.equal(getDepartmentCode({ printedCourseCode: '1202EKO' }), '');
  assert.equal(getDepartmentCode({}), '');
  assert.equal(getDepartmentCode(null), '');
});

test('selector exposes exactly seven verified departments with full Turkish names', () => {
  assert.deepEqual(DEPARTMENT_OPTIONS, expected.map(({code,name})=>({code,name})));
  assert.deepEqual(getDepartmentOptions(offerings), expected.map(({code,name})=>({code,name})));
  assert.deepEqual(getDepartmentCodes(offerings), expected.map(({code})=>code));
  const names=getDepartmentOptions(offerings).map(({name})=>name);
  assert.deepEqual(names,[...names].sort((a,b)=>a.localeCompare(b,'tr-TR')));
  assert.equal(getDepartmentCodes(offerings).includes('TUD'),false);
  assert.equal(getDepartmentCodes(offerings).includes('YAD'),false);
});

test('department filtering stays exact while all source records remain intact', () => {
  assert.equal(offerings.length,164);
  for(const {code,count} of expected){const matches=filterOfferings(offerings,{department:code});assert.equal(matches.length,count);assert.ok(matches.every(item=>getDepartmentCode(item)===code))}
  assert.equal(filterOfferings(offerings,{}).length,164);
  assert.equal(filterOfferings(offerings,{department:'TUD'}).length,2);
  assert.equal(filterOfferings(offerings,{department:'YAD'}).length,6);
  assert.equal(offerings.every(item=>item.printedCourseCode&&item.sourceTitle),true);
});
