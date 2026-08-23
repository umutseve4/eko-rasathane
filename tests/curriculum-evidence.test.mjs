import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { academicCatalog } from '../data/academic-catalog.mjs';
import { buildArtifacts, parseCurriculumEvidence, reconcileFixture, diffCurricula, renderDiffMarkdown, verifyArtifacts } from '../scripts/curriculum-evidence.mjs';

const current = parseCurriculumEvidence(fs.readFileSync('evidence/program-343-ay33.rows.tsv', 'utf8'));
const historical = parseCurriculumEvidence(fs.readFileSync('evidence/program-343-ay23.rows.tsv', 'utf8'));

test('all 144 AyID=33 fixture rows exactly match committed source evidence', () => {
  const result = reconcileFixture(current, academicCatalog);
  assert.deepEqual(result, { evidenceCount: 144, fixtureCount: 144, missingFromFixture: [], extraInFixture: [] });
});

test('parser excludes program text, totals and elective placeholders', () => {
  const counts = current.reduce((result, row) => ({ ...result, [row.courseType]: (result[row.courseType] ?? 0) + 1 }), {});
  assert.deepEqual(counts, { required: 41, elective: 103 });
  assert.ok(current.every(row => row.courseCode && !row.sourceTitle.includes('Seçmeli dersler için tıklayınız')));
});

test('historical diff artifacts are exactly reproducible', () => {
  const diff = diffCurricula(historical, current);
  assert.deepEqual(JSON.parse(fs.readFileSync('evidence/program-343-ay23-vs-ay33.diff.json', 'utf8')), diff);
  assert.equal(fs.readFileSync('evidence/program-343-ay23-vs-ay33.diff.md', 'utf8'), renderDiffMarkdown(diff));
  assert.deepEqual(diff.counts, { historicalRows: 122, currentRows: 144, unchangedRows: 71, addedRows: 73, removedRows: 51 });
});

test('independent artifact builds are byte-identical and verify without writes', () => {
  const before = [
    fs.readFileSync('evidence/program-343-ay23-vs-ay33.diff.json', 'utf8'),
    fs.readFileSync('evidence/program-343-ay23-vs-ay33.diff.md', 'utf8')
  ];
  const first = buildArtifacts();
  const second = buildArtifacts();
  assert.equal(first.json, second.json);
  assert.equal(first.markdown, second.markdown);
  verifyArtifacts();
  assert.deepEqual([
    fs.readFileSync('evidence/program-343-ay23-vs-ay33.diff.json', 'utf8'),
    fs.readFileSync('evidence/program-343-ay23-vs-ay33.diff.md', 'utf8')
  ], before);
});
