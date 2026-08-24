import { test, expect } from '@playwright/test';

const courseRoute = '/#/ders/temel-ekonometri-1';
const firstTopicRoute = `${courseRoute}/konu/matematiksel-araclar`;
const noteField = page => page.getByRole('textbox', { name: 'Bunu yarınki kendine anlat.' });

async function expectNoHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
}

async function openProgramPath(page) {
  await page.goto('/#/');
  await page.getByRole('link', { name: /3\. sınıf rotasını aç/i }).click();
}

test.beforeEach(async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.stack || error.message));
  await page.goto('/#/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect.poll(() => pageErrors.join('\n'), { message: 'Browser runtime errors' }).toBe('');
});

test('product home → class → course → topic flow persists quiz, note and progress', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bir ekonomik soruyu modele ve savunulabilir bir çıktıya dönüştür.');
  await openProgramPath(page);
  await expect(page).toHaveURL(/#\/sinif\/3$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('3. sınıf');
  await page.getByRole('link', { name: /EKO3103[\s\S]*TEMEL EKONOMETRİ I/ }).click();
  await expect(page.getByRole('heading', { level: 2, name: '7 duraklık hazırlık rotası' })).toBeVisible();
  await page.getByRole('link', { name: /Matematiksel araçlar/ }).click();
  await noteField(page).fill('Ortalama, toplamın gözlem sayısına bölünmesidir.');
  await page.getByRole('button', { name: 'B · 15' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Doğru.' })).toBeVisible();
  await page.getByRole('button', { name: 'Konuyu tamamla' }).click();
  await page.reload();
  await expect(noteField(page)).toHaveValue('Ortalama, toplamın gözlem sayısına bölünmesidir.');
  await expect(page.getByRole('button', { name: '✓ Tamamlandı' })).toBeVisible();
});

test('legacy production storage migrates without losing recall or JSON notes', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.removeItem('eko:state:v2');
    localStorage.setItem('eko:recall-index', JSON.stringify(3));
    localStorage.setItem('eko:recall-schedule', JSON.stringify({ 0: '2026-08-24', 3: '2026-08-27' }));
    localStorage.setItem('eko:studio-note-matematiksel-araclar', JSON.stringify('Eski not kaybolmamalı.'));
  });
  await page.reload();
  await page.goto(firstTopicRoute);
  await expect(noteField(page)).toHaveValue('Eski not kaybolmamalı.');
  const migrated = await page.evaluate(() => JSON.parse(localStorage.getItem('eko:state:v2')));
  expect(migrated.recall).toEqual({ index: 3, schedule: { 0: '2026-08-24', 3: '2026-08-27' } });
  expect(migrated.notes['matematiksel-araclar']).toBe('Eski not kaybolmamalı.');
});

test('malformed routes render the not-found view instead of canonicalizing', async ({ page }) => {
  for (const hash of ['#/sinif//3', '#/ders/temel-ekonometri-1/', '#/ders//temel-ekonometri-1', '#/ders/%E0%A4%A']) {
    await page.goto(`/${hash}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bu kapı yok.');
    expect(page.url()).toContain(hash);
  }
});

test('reset clears current, legacy and journey study data', async ({ page }) => {
  await page.goto(firstTopicRoute);
  await noteField(page).fill('Silinecek not');
  await page.getByRole('button', { name: 'Notu kaydet' }).click();
  await page.evaluate(() => {
    localStorage.setItem('eko:studio-note-old', JSON.stringify('legacy'));
    localStorage.setItem('eko:journey:v1', JSON.stringify({ step: 4 }));
  });
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'İlerlemeyi sıfırla' }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('eko:journey:v1'))).toBe(null);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('eko:state:v2')));
  expect(state.notes).toEqual({});
  expect(state.completedTopics).toEqual([]);
  expect(state.quizResults).toEqual({});
});

test('320 px viewport has no horizontal overflow on critical screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of ['/#/', '/#/basla', '/#/sinif/3', courseRoute, firstTopicRoute]) {
    await page.goto(route);
    await expectNoHorizontalOverflow(page);
  }
});

test('skip link focuses content without mutating the current route', async ({ page }) => {
  await page.goto(courseRoute);
  const currentHash = await page.evaluate(() => location.hash);
  const skipLink = page.locator('[data-skip]');
  await skipLink.focus();
  await skipLink.press('Enter');
  await expect(page.locator('#app')).toBeFocused();
  expect(await page.evaluate(() => location.hash)).toBe(currentHash);
});

test('reduced motion is honored and route headings receive focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await openProgramPath(page);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});
