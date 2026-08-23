import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { academicCatalog } from '../data/academic-catalog.mjs';
import { createCurriculumDiff, parseCurriculumEvidence, reconcileFixture, renderDiffMarkdown, renderJson, verifyArtifacts } from '../scripts/curriculum-evidence.mjs';

const evidencePath = name => new URL(`../evidence/${name}`, import.meta.url);

test('parser extracts only course rows and accounts for headings, placeholders and non-course text', () => {
  const input = `Program yeterlilik metni\n1. Yarıyıl Dersleri\nDersin Kodu\tDersin Adı\tTürü\tT\tU\tL\tAKTS\nEKO1001\tMATEMATİK I\tZorunlu\t3\t0\t0\t5\nToplam\t\t\t20\t0\t0\t30\n3. Yarıyıl Seçmeli Dersleri\n\tSeçmeli dersler için tıklayınız. [href=#]\tSeçmeli\t0\t0\t0\t10\nEKO2003\tOFİS PROGRAMLARI\tSeçmeli\t3\t0\t0\t5\nT1: Teori\tU2: Uygulama\tL3: Laboratuvar\n`;
  assert.deepEqual(parseCurriculumEvidence(input), [
    { semester: 1, courseType: 'required', courseCode: 'EKO1001', sourceTitle: 'MATEMATİK I', theoryHours: 3, practiceHours: 0, labHours: 0, ects: 5 },
    { semester: 3, courseType: 'elective', courseCode: 'EKO2003', sourceTitle: 'OFİS PROGRAMLARI', theoryHours: 3, practiceHours: 0, labHours: 0, ects: 5 }
  ]);
});

test('all 144 AyID=33 fixture rows match evidence for semester/type/code/title/T/U/L/AKTS', () => {
  const rows = parseCurriculumEvidence(fs.readFileSync(evidencePath('program-343-ay33.rows.tsv'), 'utf8'));
  const result = reconcileFixture(rows, academicCatalog);
  assert.equal(result.evidenceCount, 144);
  assert.equal(result.fixtureCount, 144);
  assert.deepEqual(result.missingFromFixture, []);
  assert.deepEqual(result.extraInFixture, []);
});

test('multiset diff preserves duplicate row cardinality', () => {
  const row = { semester: 1, courseType: 'required', courseCode: 'EKO1001', sourceTitle: 'MATEMATİK I', theoryHours: 3, practiceHours: 0, labHours: 0, ects: 5 };
  const diff = createCurriculumDiff([row, row], [row]);
  assert.deepEqual(diff.counts, { historicalRows: 2, currentRows: 1, unchangedRows: 1, addedRows: 0, removedRows: 1 });
  assert.equal(diff.removed.length, 1);
});

test('committed diff artifacts are exact deterministic regenerations', () => {
  const historical = parseCurriculumEvidence(fs.readFileSync(evidencePath('program-343-ay23.rows.tsv'), 'utf8'));
  const current = parseCurriculumEvidence(fs.readFileSync(evidencePath('program-343-ay33.rows.tsv'), 'utf8'));
  const diff = createCurriculumDiff(historical, current);
  assert.deepEqual(diff.counts, { historicalRows: 122, currentRows: 144, unchangedRows: 71, addedRows: 73, removedRows: 51 });
  assert.equal(renderJson(diff), fs.readFileSync(evidencePath('program-343-ay23-vs-ay33.diff.json'), 'utf8'));
  assert.equal(renderDiffMarkdown(diff), fs.readFileSync(evidencePath('program-343-ay23-vs-ay33.diff.md'), 'utf8'));
  assert.deepEqual(verifyArtifacts(), diff.counts);
});
