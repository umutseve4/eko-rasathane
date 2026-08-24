import test from 'node:test';import assert from 'node:assert/strict';
import {offerings,offeringSummary,validateOfferings,filterOfferings,findOverlaps,MAPPING_STATUSES} from '../offerings.mjs';
test('official EKO scope remains complete',()=>assert.deepEqual({total:offeringSummary.total,spring:offeringSummary.spring,fall:offeringSummary.fall,first:offeringSummary.first,second:offeringSummary.second},{total:164,spring:83,fall:81,first:108,second:56}));
test('ids, provenance, mappings and references validate',()=>assert.deepEqual(validateOfferings(),[]));
test('every offering has an explicit reconciliation outcome',()=>{assert.equal(offerings.length,164);assert.ok(offerings.every(x=>MAPPING_STATUSES.includes(x.mappingStatus)&&x.mappingEvidence?.reason))});
test('printed source values are never overwritten',()=>{for(const x of offerings){assert.equal(x.mappingEvidence.printedCode,x.printedCourseCode);assert.equal(x.mappingEvidence.printedTitle,x.sourceTitle)}});
test('EKO1202 Mathematics II mismatch stays visible',()=>{const rows=offerings.filter(x=>x.printedCourseCode==='EKO1202'&&x.sourceTitle.toLocaleUpperCase('tr-TR')==='MATEMATİK II');assert.ok(rows.length>0);assert.ok(rows.every(x=>x.mappingStatus==='mapped-with-anomaly'&&x.anomalyRefs.includes('offering-printed-code-mismatch')))});
test('filters and overlap analysis are deterministic',()=>{assert.equal(filterOfferings(offerings,{term:'spring'}).length,83);assert.deepEqual(findOverlaps(offerings),findOverlaps(offerings))});
