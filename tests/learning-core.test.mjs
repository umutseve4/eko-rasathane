import test from 'node:test';
import assert from 'node:assert/strict';
import {migrateLearningState,parseLearningRoute,validateLearningArchitecture} from '../learning-core.mjs';
const unit={id:'u1',topicId:'t1',conceptId:'c1',objective:'o',narrative:'n',workedExample:'e',visualExplanation:'v',checkQuestion:'q',misconception:'m',recap:'r',sourceRefs:[{}],relatedCourseIds:['course']};
test('Atlas rotalarını ayrıştırır',()=>{assert.deepEqual(parseLearningRoute('#/atlas'),{name:'atlas'});assert.deepEqual(parseLearningRoute('#/atlas/kavram/c1'),{name:'concept',conceptId:'c1'});assert.equal(parseLearningRoute('#/atlas/kavram/a/b'),null)});
test('8 bölümlü sözleşme ve referansları doğrular',()=>{assert.deepEqual(validateLearningArchitecture({units:[unit],concepts:[{id:'c1',unitId:'u1',prerequisiteIds:[]}],courseIds:['course'],topicIds:['t1']}),[])});
test('eksik alanı, bozuk referansı ve ön koşul döngüsünü reddeder',()=>{const errors=validateLearningArchitecture({units:[{...unit,objective:'',relatedCourseIds:['missing']}],concepts:[{id:'c1',unitId:'u1',prerequisiteIds:['c1']}],courseIds:['course'],topicIds:['t1']});assert.ok(errors.some(x=>x.includes('missing objective')));assert.ok(errors.some(x=>x.includes('unknown course')));assert.ok(errors.some(x=>x.includes('cycle')))});
test('son konu durumunu güvenli biçimde migrate eder',()=>{assert.deepEqual(migrateLearningState(null,'u1'),{version:1,lastUnitId:'u1'});assert.deepEqual(migrateLearningState({version:1,lastUnitId:42}),{version:1,lastUnitId:null})});
