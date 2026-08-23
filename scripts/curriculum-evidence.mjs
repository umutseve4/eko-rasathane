import fs from 'node:fs';
import { academicCatalog } from '../data/academic-catalog.mjs';

const fields = ['semester', 'courseType', 'courseCode', 'sourceTitle', 'theoryHours', 'practiceHours', 'labHours', 'ects'];
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

export function generateArtifacts() {
  const historical = parseCurriculumEvidence(fs.readFileSync('evidence/program-343-ay23.rows.tsv', 'utf8'));
  const current = parseCurriculumEvidence(fs.readFileSync('evidence/program-343-ay33.rows.tsv', 'utf8'));
  const diff = diffCurricula(historical, current);
  fs.writeFileSync('evidence/program-343-ay23-vs-ay33.diff.json', `${JSON.stringify(diff, null, 2)}\n`);
  fs.writeFileSync('evidence/program-343-ay23-vs-ay33.diff.md', renderDiffMarkdown(diff));
  return diff;
}

if (import.meta.url === `file://${process.argv[1]}`) console.log(JSON.stringify(generateArtifacts().counts));
