import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const HEADING = /^(\d+)\.\s*Yarıyıl(?:\s+Seçmeli)?\s+Dersleri$/u;
const CODE = /^[A-ZÇĞİÖŞÜ]{2,}[0-9]{3,4}$/u;
const TYPES = new Map([['Zorunlu', 'required'], ['Seçmeli', 'elective']]);
const numeric = value => /^\d+(?:[.,]\d+)?$/u.test(value);
const number = value => Number(value.replace(',', '.'));
const DEFAULTS = {
  beforePath: 'evidence/program-343-ay23.rows.tsv',
  afterPath: 'evidence/program-343-ay33.rows.tsv',
  jsonPath: 'evidence/program-343-ay23-vs-ay33.diff.json',
  markdownPath: 'evidence/program-343-ay23-vs-ay33.diff.md'
};
const EXPECTED_COUNTS = { ay23: 122, ay33: 144, unchanged: 71, added: 73, removed: 51 };

export function parseCurriculumRows(text) {
  let semester = null;
  const rows = [];
  for (const rawLine of text.replace(/^\uFEFF/u, '').split(/\r?\n/u)) {
    const line = rawLine.trim();
    const heading = line.match(HEADING);
    if (heading) {
      semester = Number(heading[1]);
      continue;
    }
    const values = rawLine.split('\t').map(value => value.trim());
    if (semester === null || values.length !== 7) continue;
    const [code, title, T, U, L, AKTS, sourceType] = values;
    const type = TYPES.get(sourceType);
    if (!CODE.test(code) || !title || !type || ![T, U, L, AKTS].every(numeric)) continue;
    rows.push({ code, title, type, T: number(T), U: number(U), L: number(L), AKTS: number(AKTS), semester });
  }
  return rows;
}

const fields = ['semester', 'type', 'code', 'title', 'T', 'U', 'L', 'AKTS'];
const compare = (a, b) => {
  for (const field of fields) {
    const result = typeof a[field] === 'number' ? a[field] - b[field] : a[field].localeCompare(b[field], 'tr');
    if (result) return result;
  }
  return 0;
};
const key = row => JSON.stringify(fields.map(field => row[field]));
const counts = rows => {
  const result = new Map();
  for (const row of rows) result.set(key(row), (result.get(key(row)) ?? 0) + 1);
  return result;
};

export function createCurriculumDiff(beforeRows, afterRows) {
  const unmatchedAfter = counts(afterRows);
  const unchanged = [];
  const removed = [];
  for (const row of beforeRows) {
    const rowKey = key(row);
    const available = unmatchedAfter.get(rowKey) ?? 0;
    (available > 0 ? unchanged : removed).push(row);
    if (available > 0) unmatchedAfter.set(rowKey, available - 1);
  }
  const added = [];
  for (const row of afterRows) {
    const rowKey = key(row);
    const available = unmatchedAfter.get(rowKey) ?? 0;
    if (available > 0) {
      added.push(row);
      unmatchedAfter.set(rowKey, available - 1);
    }
  }
  unchanged.sort(compare);
  removed.sort(compare);
  added.sort(compare);
  const semesters = [...new Set([...beforeRows, ...afterRows].map(row => row.semester))].sort((a, b) => a - b);
  const bySemester = semesters.map(semester => ({
    semester,
    ay23: beforeRows.filter(row => row.semester === semester).length,
    ay33: afterRows.filter(row => row.semester === semester).length,
    unchanged: unchanged.filter(row => row.semester === semester).length,
    added: added.filter(row => row.semester === semester).length,
    removed: removed.filter(row => row.semester === semester).length
  }));
  return {
    schemaVersion: 1,
    methodology: 'Exact structural row multiset over semester,type,code,title,T,U,L,AKTS; edits are one removal plus one addition.',
    sources: { before: DEFAULTS.beforePath, after: DEFAULTS.afterPath },
    counts: { ay23: beforeRows.length, ay33: afterRows.length, unchanged: unchanged.length, added: added.length, removed: removed.length },
    bySemester,
    added,
    removed
  };
}

export function renderJson(diff) { return `${JSON.stringify(diff, null, 2)}\n`; }
export function renderMarkdown(diff) {
  const lines = [
    '# Program 343: AyID=23 → AyID=33 ders satırı farkı', '',
    '## Metodoloji', '', diff.methodology, '',
    'Yalnız TSV içindeki geçerli ders satırları karşılaştırılır. Yarıyıl başlıkları bağlam sağlar; tablo başlıkları, `Toplam`, program metni ve boş kodlu seçmeli yönlendirme satırları dışlanır.', '',
    '## Tam sayılar', '',
    '| AyID=23 | AyID=33 | Aynen korunan | Eklenen | Kaldırılan |',
    '|---:|---:|---:|---:|---:|',
    `| ${diff.counts.ay23} | ${diff.counts.ay33} | ${diff.counts.unchanged} | ${diff.counts.added} | ${diff.counts.removed} |`, '',
    '## Yarıyıl kırılımı', '',
    '| Yarıyıl | AyID=23 | AyID=33 | Aynen korunan | Eklenen | Kaldırılan |',
    '|---:|---:|---:|---:|---:|---:|',
    ...diff.bySemester.map(row => `| ${row.semester} | ${row.ay23} | ${row.ay33} | ${row.unchanged} | ${row.added} | ${row.removed} |`), '',
    '## Satır düzeyi fark', '',
    'Tam `added` ve `removed` kayıtları, sabit alan sırası ve stabil sıralamayla eşlik eden JSON artifact’ında yer alır.', ''
  ];
  return lines.join('\n');
}

export async function generateArtifacts({ beforePath, afterPath, jsonPath, markdownPath }) {
  const [beforeText, afterText] = await Promise.all([readFile(beforePath, 'utf8'), readFile(afterPath, 'utf8')]);
  const diff = createCurriculumDiff(parseCurriculumRows(beforeText), parseCurriculumRows(afterText));
  const json = renderJson(diff);
  const markdown = renderMarkdown(diff);
  if (jsonPath) await writeFile(jsonPath, json);
  if (markdownPath) await writeFile(markdownPath, markdown);
  return { diff, json, markdown };
}

export async function verifyArtifacts() {
  const generated = await generateArtifacts({ beforePath: DEFAULTS.beforePath, afterPath: DEFAULTS.afterPath });
  if (JSON.stringify(generated.diff.counts) !== JSON.stringify(EXPECTED_COUNTS)) {
    throw new Error(`Unexpected curriculum counts: ${JSON.stringify(generated.diff.counts)}`);
  }
  const [json, markdown] = await Promise.all([readFile(DEFAULTS.jsonPath, 'utf8'), readFile(DEFAULTS.markdownPath, 'utf8')]);
  if (json !== generated.json) throw new Error(`${DEFAULTS.jsonPath} is stale; run npm run evidence:generate`);
  if (markdown !== generated.markdown) throw new Error(`${DEFAULTS.markdownPath} is stale; run npm run evidence:generate`);
  return generated.diff.counts;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (process.argv.includes('--verify')) {
    console.log(JSON.stringify(await verifyArtifacts()));
  } else {
    await generateArtifacts({
      beforePath: process.argv[2] ?? DEFAULTS.beforePath,
      afterPath: process.argv[3] ?? DEFAULTS.afterPath,
      jsonPath: process.argv[4] ?? DEFAULTS.jsonPath,
      markdownPath: process.argv[5] ?? DEFAULTS.markdownPath
    });
  }
}
