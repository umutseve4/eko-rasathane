import fs from 'node:fs';
import { academicCatalog } from '../data/academic-catalog.mjs';

const fields = ['semester', 'courseType', 'courseCode', 'sourceTitle', 'theoryHours', 'practiceHours', 'labHours', 'ects'];
const historicalPath = 'evidence/program-343-ay23.rows.tsv';
const currentPath = 'evidence/program-343-ay33.rows.tsv';
const jsonPath = 'evidence/program-343-ay23-vs-ay33.diff.json';
const markdownPath = 'evidence/program-343-ay23-vs-ay33.diff.md';
const expectedReconciliation = { evidenceCount: 144, fixtureCount: 144, missingFromFixture: [], extraInFixture: [] };
const expectedDiffCounts = { historicalRows: 122, currentRows: 144, unchangedRows: 71, addedRows: 73, removedRows: 51 };

export const rowKey = row => JSON.stringify(fields.map(field => row[field]));

export function parseCurriculumEvidence(text) {
  const rows = [];
  let semester = null;
  let sectionType = null;
  for (const sourceLine of text.replace(/\r/g, '').split('\n')) {
    const line = sourceLine.trim();
    const heading = line.match(/^(\d+)\. Yarıyıl( Seçmeli)? Dersleri$/);
    if (heading) {
      semester = Number(heading[1]);
      sectionType = heading[2] ? 'elective' : 'required';
      continue;
    }
    const cells = sourceLine.split('\t');
    if (!semester || cells.length !== 7 || !cells[0] || !['Zorunlu', 'Seçmeli'].includes(cells[2])) continue;
    const [courseCode, sourceTitle, sourceType, theory, practice, lab, ects] = cells;
    const courseType = sourceType === 'Zorunlu' ? 'required' : 'elective';
    if (courseType !== sectionType) throw new Error(`Section/type mismatch: ${sourceLine}`);
    const numeric = [theory, practice, lab, ects].map(Number);
    if (numeric.some(value => !Number.isFinite(value) || value < 0)) throw new Error(`Invalid numeric evidence row: ${sourceLine}`);
    rows.push({ semester, courseType, courseCode, sourceTitle, theoryHours: numeric[0], practiceHours: numeric[1], labHours: numeric[2], ects: numeric[3] });
  }
  return rows;
}

export function fixtureRows(catalog = academicCatalog) {
  const courses = new Map(catalog.courses.map(course => [course.id, course]));
  return catalog.curriculumCourses.map(relation => {
    const course = courses.get(relation.courseId);
    return {
      semester: relation.semester,
      courseType: relation.courseType,
      courseCode: course?.courseCode,
      sourceTitle: course?.sourceTitle,
      theoryHours: relation.theoryHours,
      practiceHours: relation.practiceHours,
      labHours: relation.labHours,
      ects: relation.ects
    };
  });
}

function multiset(rows) {
  const result = new Map();
  for (const row of rows) {
    const key = rowKey(row);
    const entry = result.get(key) ?? { row, count: 0 };
    entry.count += 1;
    result.set(key, entry);
  }
  return result;
}

function subtract(left, right) {
  const result = [];
  for (const [key, entry] of left) {
    const count = Math.max(0, entry.count - (right.get(key)?.count ?? 0));
    for (let index = 0; index < count; index += 1) result.push(entry.row);
  }
  return result.sort((a, b) => rowKey(a).localeCompare(rowKey(b), 'en'));
}

export function reconcileFixture(evidenceRows, catalog = academicCatalog) {
  const actual = fixtureRows(catalog);
  const evidence = multiset(evidenceRows);
  const fixture = multiset(actual);
  return {
    evidenceCount: evidenceRows.length,
    fixtureCount: actual.length,
    missingFromFixture: subtract(evidence, fixture),
    extraInFixture: subtract(fixture, evidence)
  };
}

export function diffCurricula(historicalRows, currentRows) {
  const historical = multiset(historicalRows);
  const current = multiset(currentRows);
  const added = subtract(current, historical);
  const removed = subtract(historical, current);
  return {
    schemaVersion: 1,
    source: { from: 'AyID=23', to: 'AyID=33' },
    methodology: 'Parse only seven-field course rows under semester headings; ignore program text, headers, totals, footnotes and blank-code elective placeholders. Compare exact structural row multisets (semester, type, code, title, T, U, L, AKTS) without inferred matches.',
    counts: {
      historicalRows: historicalRows.length,
      currentRows: currentRows.length,
      unchangedRows: historicalRows.length - removed.length,
      addedRows: added.length,
      removedRows: removed.length
    },
    added,
    removed
  };
}

export function renderDiffMarkdown(diff) {
  const lines = [
    '# Curriculum diff: AyID=23 → AyID=33', '',
    '## Methodology', '', diff.methodology, '',
    '## Counts', '',
    `- Historical rows: **${diff.counts.historicalRows}**`,
    `- Current rows: **${diff.counts.currentRows}**`,
    `- Exact unchanged rows: **${diff.counts.unchangedRows}**`,
    `- Added rows: **${diff.counts.addedRows}**`,
    `- Removed rows: **${diff.counts.removedRows}**`, ''
  ];
  for (const [title, rows] of [['Added rows', diff.added], ['Removed rows', diff.removed]]) {
    lines.push(`## ${title}`, '', '| Semester | Type | Code | Source title | T/U/L | AKTS |', '|---:|---|---|---|---|---:|');
    for (const row of rows) lines.push(`| ${row.semester} | ${row.courseType} | ${row.courseCode} | ${row.sourceTitle.replace(/\|/g, '\\|')} | ${row.theoryHours}/${row.practiceHours}/${row.labHours} | ${row.ects} |`);
    if (!rows.length) lines.push('| — | — | — | — | — | — |');
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

export function buildArtifacts() {
  const historical = parseCurriculumEvidence(fs.readFileSync(historicalPath, 'utf8'));
  const current = parseCurriculumEvidence(fs.readFileSync(currentPath, 'utf8'));
  const reconciliation = reconcileFixture(current);
  const diff = diffCurricula(historical, current);
  return {
    reconciliation,
    diff,
    json: `${JSON.stringify(diff, null, 2)}\n`,
    markdown: renderDiffMarkdown(diff)
  };
}

export function generateArtifacts() {
  const artifacts = buildArtifacts();
  fs.writeFileSync(jsonPath, artifacts.json);
  fs.writeFileSync(markdownPath, artifacts.markdown);
  return artifacts.diff;
}

function exactEqual(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export function verifyArtifacts() {
  const artifacts = buildArtifacts();
  if (!exactEqual(artifacts.reconciliation, expectedReconciliation)) {
    throw new Error(`Fixture reconciliation mismatch: ${JSON.stringify(artifacts.reconciliation)}`);
  }
  if (!exactEqual(artifacts.diff.counts, expectedDiffCounts)) {
    throw new Error(`Historical diff counts mismatch: ${JSON.stringify(artifacts.diff.counts)}`);
  }
  if (fs.readFileSync(jsonPath, 'utf8') !== artifacts.json) throw new Error(`${jsonPath} is stale; run npm run evidence:generate`);
  if (fs.readFileSync(markdownPath, 'utf8') !== artifacts.markdown) throw new Error(`${markdownPath} is stale; run npm run evidence:generate`);
  return { reconciliation: artifacts.reconciliation, counts: artifacts.diff.counts };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const verify = process.argv.slice(2).includes('--verify');
  console.log(JSON.stringify(verify ? verifyArtifacts() : generateArtifacts().counts));
}
