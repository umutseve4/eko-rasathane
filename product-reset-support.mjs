const RESET_KEYS = [
  'eko:state:v2',
  'eko:state:v1',
  'eko:m3:v1',
  'eko:last-topic',
  'eko:journey:v1',
  'eko:studio-step',
  'eko:studio-completed',
  'eko:recall-index',
  'eko:recall-schedule',
  'eko:evidence',
  'eko:timer'
];

function clearProductState() {
  for (const key of RESET_KEYS) localStorage.removeItem(key);
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key?.startsWith('eko:studio-note-')) localStorage.removeItem(key);
  }
}

function installResetController() {
  const current = document.querySelector('#reset-progress');
  if (!current) return;
  const replacement = current.cloneNode(true);
  current.replaceWith(replacement);
  replacement.addEventListener('click', () => {
    if (!confirm('Tüm ilerleme, test ve notları sıfırlamak istiyor musun?')) return;
    clearProductState();
    location.hash = '#/';
    location.reload();
  });
}

function installModelCardFocus() {
  document.addEventListener('submit', event => {
    if (!event.target.matches('.model-card-form')) return;
    queueMicrotask(() => {
      const output = document.querySelector('.model-card-output');
      if (!output || output.hidden) return;
      output.tabIndex = -1;
      output.focus();
    });
  });
}

addEventListener('DOMContentLoaded', () => {
  installResetController();
  installModelCardFocus();
});
