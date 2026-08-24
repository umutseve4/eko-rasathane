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

test('five filters persist independently from learning state', async ({ page }) => {
  await page.goto(programRoute);
  const learningBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('eko:state:v2')));
  await page.locator('select[name="term"]').selectOption('spring');
  await expect(page.locator('.program-card')).toHaveCount(83);
  await page.locator('select[name="educationType"]').selectOption('second');
  await page.locator('select[name="department"]').selectOption('EKO');
  await page.locator('select[name="semester"]').selectOption('2');
  await page.locator('select[name="weekday"]').selectOption('PAZARTESİ');

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('eko:timetable:v1')));
  expect(saved).toEqual({
    term: 'spring',
    educationType: 'second',
    department: 'EKO',
    semester: '2',
    weekday: 'PAZARTESİ'
  });
  const learningAfter = await page.evaluate(() => JSON.parse(localStorage.getItem('eko:state:v2')));
  for (const field of ['selectedGradeId', 'completedTopics', 'quizResults', 'notes', 'evidence']) {
    expect(learningAfter[field]).toEqual(learningBefore[field]);
  }

  await page.reload();
  await expect(page.locator('select[name="term"]')).toHaveValue('spring');
  await expect(page.locator('select[name="educationType"]')).toHaveValue('second');
  await expect(page.locator('select[name="department"]')).toHaveValue('EKO');
  await expect(page.locator('select[name="semester"]')).toHaveValue('2');
  await expect(page.locator('select[name="weekday"]')).toHaveValue('PAZARTESİ');
});

test('department options are source-derived and filtering stays exact', async ({ page }) => {
  await page.goto(programRoute);
  const department = page.locator('select[name="department"]');
  const options = await department.locator('option').allTextContents();
  expect(options[0]).toBe('Tümü');
  expect(options.length).toBeGreaterThan(2);
  const selected = options.at(-1);
  await department.selectOption({ label: selected });
  const cards = page.locator('.program-card');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(164);
  for (const code of await cards.locator('> div > b').allTextContents()) expect(code.startsWith(selected)).toBe(true);
  await expect(page.locator('select[name="department"]')).toBeFocused();
});

test('legacy four-field state defaults department to all', async ({ page }) => {
  await page.goto('/#/');
  await page.evaluate(() => localStorage.setItem('eko:timetable:v1', JSON.stringify({ term: 'fall', educationType: '', semester: '', weekday: '' })));
  await page.goto(programRoute);
  await expect(page.locator('select[name="department"]')).toHaveValue('');
  await expect(page.locator('.program-card')).toHaveCount(81);
});

test('brand uses the refreshed accessible logo', async ({ page }) => {
  await page.goto(programRoute);
  const brand = page.getByRole('link', { name: 'EKO Rasathane ana sayfa' });
  await expect(brand).toHaveCount(1);
  await expect(brand.locator('img')).toBeVisible();
  await expect(brand.locator('img')).toHaveAttribute('alt', '');
  await expect(brand.locator('img')).toHaveAttribute('src', './assets/eko-rasathane-logo.svg');
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

  const department = page.locator('select[name="department"]');
  const options = await department.locator('option').allTextContents();
  await department.focus();
  await department.selectOption({ label: options.at(-1) });
  await expect(page.locator('select[name="department"]')).toBeFocused();
  await expectNoHorizontalOverflow(page);
});
