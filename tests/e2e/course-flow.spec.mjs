import { test, expect } from '@playwright/test';

const courseRoute = '/#/ders/temel-ekonometri-1';
const firstTopicRoute = `${courseRoute}/konu/matematiksel-araclar`;

async function expectNoHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/#/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('class → course → topic flow persists quiz, note and progress', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kaçıncı sınıfsın?');
  await page.getByRole('link', { name: /3\. sınıf/ }).click();
  await expect(page).toHaveURL(/#\/sinif\/3$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('3. sınıf');

  await page.getByRole('link', { name: /EKO3103[\s\S]*TEMEL EKONOMETRİ I/ }).click();
  await expect(page).toHaveURL(/#\/ders\/temel-ekonometri-1$/);
  await expect(page.getByRole('heading', { level: 2, name: '7 duraklık hazırlık rotası' })).toBeVisible();

  await page.getByRole('link', { name: /Matematiksel araçlar/ }).click();
  await expect(page).toHaveURL(/konu\/matematiksel-araclar$/);
  await page.getByRole('textbox', { name: 'Bunu yarınki kendine anlat.' }).fill('Ortalama, toplamın gözlem sayısına bölünmesidir.');
  await page.getByRole('button', { name: 'B · 15' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Doğru.' })).toBeVisible();
  await page.getByRole('button', { name: 'Konuyu tamamla' }).click();
  await expect(page.getByRole('button', { name: '✓ Tamamlandı' })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Bunu yarınki kendine anlat.' })).toHaveValue('Ortalama, toplamın gözlem sayısına bölünmesidir.');
  await expect(page.getByRole('button', { name: '✓ Tamamlandı' })).toBeVisible();
  await page.goto(courseRoute);
  await expect(page.getByText('%14 tamamlandı').first()).toBeVisible();
});

test('legacy production storage migrates without losing recall or JSON notes', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('eko:state:v2');
    localStorage.setItem('eko:recall-index', JSON.stringify(3));
    localStorage.setItem('eko:recall-schedule', JSON.stringify({ 0: '2026-08-24', 3: '2026-08-27' }));
    localStorage.setItem('eko:studio-note-matematiksel-araclar', JSON.stringify('Eski not kaybolmamalı.'));
  });
  await page.goto(firstTopicRoute);

  await expect(page.getByRole('textbox', { name: 'Bunu yarınki kendine anlat.' })).toHaveValue('Eski not kaybolmamalı.');
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

test('reset clears current and legacy study data', async ({ page }) => {
  await page.goto(firstTopicRoute);
  await page.getByRole('textbox', { name: 'Bunu yarınki kendine anlat.' }).fill('Silinecek not');
  await page.getByRole('button', { name: 'Notu kaydet' }).click();
  await page.evaluate(() => localStorage.setItem('eko:studio-note-old', JSON.stringify('legacy')));
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'İlerlemeyi sıfırla' }).click();

  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toEqual(['eko:state:v2']);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('eko:state:v2')));
  expect(state.notes).toEqual({});
  expect(state.completedTopics).toEqual([]);
  expect(state.quizResults).toEqual({});
});

test('320 px viewport has no horizontal overflow on critical screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#/');
  await expectNoHorizontalOverflow(page);
  await page.goto('/#/sinif/3');
  await expectNoHorizontalOverflow(page);
  await page.goto(courseRoute);
  await expectNoHorizontalOverflow(page);
  await page.goto(firstTopicRoute);
  await expectNoHorizontalOverflow(page);
});

test('reduced motion is honored and route headings receive focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  const animation = await page.locator('.orbit').evaluate(element => getComputedStyle(element, '::before').animationName);
  expect(animation).toBe('none');

  await page.getByRole('link', { name: /3\. sınıf/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});
