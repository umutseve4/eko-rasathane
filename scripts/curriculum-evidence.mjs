import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const HEADING = /^(\d+)\.\s*Yarıyıl(?:\s+Seçmeli)?\s+Dersleri$/u;
const CODE = /^[A-ZÇĞİÖŞÜ]{2,}[0-9]{3,4}$/u;
const TYPES = new Map([['Zorunlu', 'required'], ['Seçmeli', 'elective']]);
const numeric = value => /^\d+(?:[.,]\d+)?$/u.test(value);
const number = value => Number(value.replace(',', '.'));

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
    const fields = rawLine.split('\t').map(value => value.trim());
    if (semester === null || fields.length !== 7) continue;
    const [code, title, T, U, L, AKTS, sourceType] = fields;
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

export function createCurriculumDiff(beforeRows, afterRows) {
  const before = new Map(beforeRows.map(row => [key(row), row]));
  const after = new Map(afterRows.map(row => [key(row), row]));
  const unchanged = beforeRows.filter(row => after.has(key(row))).sort(compare);
  const removed = beforeRows.filter(row => !after.has(key(row))).sort(compare);
  const added = afterRows.filter(row => !before.has(key(row))).sort(compare);
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
    sources: { before: 'evidence/program-343-ay23.rows.tsv', after: 'evidence/program-343-ay33.rows.tsv' },
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

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await generateArtifacts({
    beforePath: process.argv[2] ?? 'evidence/program-343-ay23.rows.tsv',
    afterPath: process.argv[3] ?? 'evidence/program-343-ay33.rows.tsv',
    jsonPath: process.argv[4] ?? 'evidence/program-343-ay23-vs-ay33.diff.json',
    markdownPath: process.argv[5] ?? 'evidence/program-343-ay23-vs-ay33.diff.md'
  });
}
