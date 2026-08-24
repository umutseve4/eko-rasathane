import { test, expect } from '@playwright/test';

const programRoute = '/#/program';

async function clearState(page) {
  await page.goto('/#/');
  await page.evaluate(() => localStorage.removeItem('eko:timetable:v1'));
}

async function expectNoHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
}

test.beforeEach(async ({ page }) => {
  await clearState(page);
});

test('program navigation decodes the authoritative fixture and renders provenance', async ({ page }) => {
  await page.getByRole('link', { name: 'Program' }).first().click();
  await expect(page).toHaveURL(/#\/program$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Akademik program');
  await expect(page.locator('.program-total')).toContainText('164');
  await expect(page.getByLabel('Program özeti')).toContainText('108 I. öğretim');
  await expect(page.getByLabel('Program özeti')).toContainText('56 II. öğretim');
  await expect(page.getByLabel('Program özeti')).toContainText('83 bahar · 81 güz');
  await expect(page.locator('.program-card')).toHaveCount(164);

  const firstCard = page.locator('.program-card').first();
  await firstCard.getByText('Kaynak kaydını göster').click();
  await expect(firstCard.locator('details p').first()).not.toBeEmpty();
  await expect(firstCard.locator('.mapping')).toContainText(/^Eşleme: (mapped|mapped-with-anomaly|ambiguous|unmatched)$/);
  await expect(firstCard.getByRole('link', { name: /Resmî PDF/ })).toHaveAttribute('href', /^https:\/\/uludag\.edu\.tr\//);
  await expect(page.locator('.program-sources').getByRole('link')).toHaveCount(2);
});

test('four filters persist independently from learning state', async ({ page }) => {
  await page.goto(programRoute);
  await page.locator('select[name="term"]').selectOption('spring');
  await expect(page.locator('.program-card')).toHaveCount(83);
  await page.locator('select[name="educationType"]').selectOption('second');
  await page.locator('select[name="semester"]').selectOption('2');
  await page.locator('select[name="weekday"]').selectOption('PAZARTESİ');

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('eko:timetable:v1')));
  expect(saved).toEqual({
    term: 'spring',
    educationType: 'second',
    semester: '2',
    weekday: 'PAZARTESİ'
  });
  expect(await page.evaluate(() => localStorage.getItem('eko:state:v2'))).toBeNull();

  await page.reload();
  await expect(page.locator('select[name="term"]')).toHaveValue('spring');
  await expect(page.locator('select[name="educationType"]')).toHaveValue('second');
  await expect(page.locator('select[name="semester"]')).toHaveValue('2');
  await expect(page.locator('select[name="weekday"]')).toHaveValue('PAZARTESİ');
});

test('program route is strict and malformed variants stay not-found', async ({ page }) => {
  for (const hash of ['#/program/', '#/program/foo', '#/program%2Ffoo']) {
    await page.goto(`/${hash}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bu kapı yok.');
    expect(page.url()).toContain(hash);
  }
});

test('program view is keyboard-focused, reduced-motion safe and 320 px wide', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(programRoute);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expectNoHorizontalOverflow(page);

  const term = page.locator('select[name="term"]');
  await term.focus();
  await term.selectOption('fall');
  await expect(page.locator('.program-card')).toHaveCount(81);
  await expect(page.locator('select[name="term"]')).toBeFocused();
  await expectNoHorizontalOverflow(page);
});
