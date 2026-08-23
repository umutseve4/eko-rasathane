export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value)));
}

export function interpretCoefficient({ beta, xUnit = 'birim', yUnit = 'birim' }) {
  const b = Number(beta);
  if (!Number.isFinite(b)) return 'Geçerli bir katsayı gir.';
  const direction = b === 0 ? 'değişim beklenmez' : b > 0 ? 'artış beklenir' : 'azalış beklenir';
  const magnitude = Math.abs(b).toLocaleString('tr-TR', { maximumFractionDigits: 4 });
  return `Diğer değişkenler sabitken X’teki 1 ${xUnit} artışla Y’de ortalama ${magnitude} ${yUnit} ${direction}. Bu, nedensellik değil koşullu bir ilişkidir.`;
}

export function nextRecallDate(confidence, from = new Date()) {
  const days = { again: 1, hard: 3, good: 7, easy: 14 }[confidence] ?? 1;
  const date = new Date(from);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function progressPercent(completed, total) {
  if (total <= 0) return 0;
  return Math.round(clamp(completed, 0, total) / total * 100);
}

export function minutesToClock(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}
