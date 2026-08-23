import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { academicCatalog } from '../data/academic-catalog.mjs';
import { createCurriculumDiff, parseCurriculumRows, generateArtifacts, verifyArtifacts } from '../scripts/curriculum-evidence.mjs';

const evidence = path => new URL(`../evidence/${path}`, import.meta.url);
const rowKey = row => JSON.stringify([row.semester, row.type, row.code, row.title, row.T, row.U, row.L, row.AKTS]);

test('parser extracts only course rows and excludes headings, placeholders, totals and program text', () => {
  const input = `Program yeterlilik metni\n1. Yarıyıl Dersleri\nDersin Kodu\tDersin Adı\tT\tU\tL\tAKTS\tTürü\nEKO1001\tMATEMATİK I\t3\t0\t0\t5\tZorunlu\nToplam\t\t20\t0\t0\t30\t\n3. Yarıyıl Seçmeli Dersleri\n\tSeçmeli dersler için tıklayınız. [href=#]\t0\t0\t0\t10\tSeçmeli\nEKO2003\tOFİS PROGRAMLARI\t3\t0\t0\t5\tSeçmeli\nT1: Teori\tU2: Uygulama\tL3: Laboratuvar\n`;
  assert.deepEqual(parseCurriculumRows(input), [
    { code: 'EKO1001', title: 'MATEMATİK I', type: 'required', T: 3, U: 0, L: 0, AKTS: 5, semester: 1 },
    { code: 'EKO2003', title: 'OFİS PROGRAMLARI', type: 'elective', T: 3, U: 0, L: 0, AKTS: 5, semester: 3 }
  ]);
});

test('AyID=33 evidence matches all 144 fixture relations in every source field', async () => {
  const rows = parseCurriculumRows(await readFile(evidence('program-343-ay33.rows.tsv'), 'utf8'));
  const courses = new Map(academicCatalog.courses.map(course => [course.id, course]));
  const fixture = academicCatalog.curriculumCourses.map(relation => {
    const course = courses.get(relation.courseId);
    return { code: course.courseCode, title: course.sourceTitle, type: relation.courseType, T: relation.theoryHours, U: relation.practiceHours, L: relation.labHours, AKTS: relation.ects, semester: relation.semester };
  });
  assert.equal(rows.length, 144);
  assert.deepEqual(rows.map(rowKey).sort(), fixture.map(rowKey).sort());
});

test('multiset diff preserves duplicate row multiplicity', () => {
  const row = { code: 'EKO1001', title: 'MATEMATİK I', type: 'required', T: 3, U: 0, L: 0, AKTS: 5, semester: 1 };
  const diff = createCurriculumDiff([row, row], [row]);
  assert.deepEqual(diff.counts, { ay23: 2, ay33: 1, unchanged: 1, added: 0, removed: 1 });
  assert.equal(diff.removed.length, 1);
});

test('committed diff artifacts are deterministic byte-for-byte regenerations', async () => {
  const generated = await generateArtifacts({ beforePath: evidence('program-343-ay23.rows.tsv'), afterPath: evidence('program-343-ay33.rows.tsv') });
  assert.deepEqual(generated.diff.counts, { ay23: 122, ay33: 144, unchanged: 71, added: 73, removed: 51 });
  assert.equal(generated.json, await readFile(evidence('program-343-ay23-vs-ay33.diff.json'), 'utf8'));
  assert.equal(generated.markdown, await readFile(evidence('program-343-ay23-vs-ay33.diff.md'), 'utf8'));
  assert.deepEqual(await verifyArtifacts(), generated.diff.counts);
});
