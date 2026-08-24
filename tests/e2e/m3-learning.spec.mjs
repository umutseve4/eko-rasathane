import { test, expect } from '@playwright/test';

const course = 'temel-ekonometri-1';
const unit = 'matematiksel-araclar';
const topicRoute = `#/ders/${course}/konu/${unit}`;

test('Program and Atlas preserve access to the same canonical learning unit', async ({ page }) => {
  await page.goto('/#/');
  await page.getByRole('link', { name: /3\. sınıf rotasını aç/i }).click();
  await page.getByRole('link', { name: /TEMEL EKONOMETRİ I/i }).click();
  await page.getByRole('link', { name: /Matematiksel araçlar/i }).click();
  await expect(page).toHaveURL(new RegExp(topicRoute));
  await expect(page.locator('[data-learning-unit-id="matematiksel-araclar"]')).toHaveCount(1);

  await page.goto('/#/');
  await page.getByRole('link', { name: /Kavram haritasını aç/i }).click();
  await page.getByRole('link', { name: /Betimsel istatistik ve matematiksel araçlar/i }).click();
  await page.getByRole('link', { name: /Ders içeriğini aç/i }).click();
  await expect(page).toHaveURL(new RegExp(topicRoute));
});

test('product reset exposes one stage at a time instead of the old 8-section wall', async ({ page }) => {
  await page.goto('/#/basla');
  await expect(page.locator('[data-journey-step="1"]')).toBeVisible();
  await expect(page.getByText('Y = f(X) + u')).toHaveCount(0);
  await page.getByRole('button', { name: /Devam et/ }).click();
  await expect(page.getByText('Y = f(X) + u')).toBeVisible();
  await expect(page.locator('.stage-panel')).toHaveCount(1);
});

test('last topic remains reachable and reset removes M3 and journey state', async ({ page }) => {
  await page.goto(`/${topicRoute}`);
  await page.goto('/#/');
  await expect(page.getByRole('link', { name: /Yolculuğa|Örnek yolculuğu/ })).toBeVisible();
  await page.evaluate(() => localStorage.setItem('eko:journey:v1', JSON.stringify({ step: 4 })));
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'İlerlemeyi sıfırla' }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('eko:journey:v1'))).toBe(null);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('eko:m3:v1'))).toBe(null);
});

test('Atlas routes preserve focus, 404 handling and 320 px overflow contract', async ({ page }) => {
  await page.goto('/#/atlas');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#/atlas/kavram/guven-araliklari');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.goto('/#/atlas/kavram/bilinmeyen');
  await expect(page.getByRole('heading', { name: 'Bu kapı yok.' })).toBeFocused();
});
