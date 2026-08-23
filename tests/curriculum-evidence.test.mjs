import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { academicCatalog } from '../data/academic-catalog.mjs';
import { parseCurriculumEvidence, reconcileFixture, diffCurricula, renderDiffMarkdown } from '../scripts/curriculum-evidence.mjs';

const current = parseCurriculumEvidence(fs.readFileSync('evidence/program-343-ay33.rows.tsv', 'utf8'));
const historical = parseCurriculumEvidence(fs.readFileSync('evidence/program-343-ay23.rows.tsv', 'utf8'));

test('parser extracts only real course rows and excludes headings, text and placeholders', () => {
  const sample = [
    'Program 343 curriculum',
    '1. Yarıyıl Dersleri',
    'Ders Kodu\tDers Adı\tDers Türü\tT\tU\tL\tAKTS',
    'EKO1001\tİKTİSADA GİRİŞ I\tZorunlu\t3\t0\t0\t5',
    '\tSeçmeli dersler için tıklayınız\tSeçmeli\t0\t0\t0\t0',
    'Toplam\t\t\t3\t0\t0\t5',
    '1. Yarıyıl Seçmeli Dersleri',
    'EKO1003\tKARİYER PLANLAMA\tSeçmeli\t1\t0\t0\t1',
    'Program metni\tDers değildir\tSeçmeli\tX\t0\t0\t5',
    'Dipnot: Bu satır ders değildir.'
  ].join('\n');
  assert.deepEqual(parseCurriculumEvidence(sample), [
    { semester: 1, courseType: 'required', courseCode: 'EKO1001', sourceTitle: 'İKTİSADA GİRİŞ I', theoryHours: 3, practiceHours: 0, labHours: 0, ects: 5 },
    { semester: 1, courseType: 'elective', courseCode: 'EKO1003', sourceTitle: 'KARİYER PLANLAMA', theoryHours: 1, practiceHours: 0, labHours: 0, ects: 1 }
  ]);
});

test('all 144 AyID=33 fixture rows exactly match evidence in all eight fields', () => {
  assert.deepEqual(reconcileFixture(current, academicCatalog), {
    evidenceCount: 144,
    fixtureCount: 144,
    missingFromFixture: [],
    extraInFixture: []
  });
});

test('real evidence contains only the 41 required and 103 elective course rows', () => {
  const counts = current.reduce((result, row) => ({ ...result, [row.courseType]: (result[row.courseType] ?? 0) + 1 }), {});
  assert.deepEqual(counts, { required: 41, elective: 103 });
  assert.ok(current.every(row => row.courseCode && !row.sourceTitle.includes('Seçmeli dersler için tıklayınız')));
});

test('historical diff artifacts regenerate byte-for-byte with exact counts', () => {
  const diff = diffCurricula(historical, current);
  const json = `${JSON.stringify(diff, null, 2)}\n`;
  assert.equal(fs.readFileSync('evidence/program-343-ay23-vs-ay33.diff.json', 'utf8'), json);
  assert.equal(fs.readFileSync('evidence/program-343-ay23-vs-ay33.diff.md', 'utf8'), renderDiffMarkdown(diff));
  assert.deepEqual(diff.counts, { historicalRows: 122, currentRows: 144, unchangedRows: 71, addedRows: 73, removedRows: 51 });
});
