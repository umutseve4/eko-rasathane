import { test, expect } from '@playwright/test';

async function noOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/#/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('ilk temas ürün vaadini, üç yolu ve başlangıcı açıklar', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bir ekonomik soruyu modele ve savunulabilir bir çıktıya dönüştür.');
  for (const text of ['Programımı takip et', 'Bir kavram öğren', 'Model dene ve araştır']) {
    await expect(page.getByRole('heading', { name: text })).toBeVisible();
  }
  await expect(page.getByRole('link', { name: /Örnek yolculuğu başlat/ })).toBeVisible();
});

test('beş aşama progressive disclosure ile ilerler ve laboratuvar yorumu değişir', async ({ page }) => {
  await page.getByRole('link', { name: /Örnek yolculuğu başlat/ }).click();
  await expect(page.locator('[data-journey-step="1"]')).toBeVisible();
  await expect(page.getByText('Y = f(X) + u')).toHaveCount(0);
  await page.getByRole('button', { name: /Devam et/ }).click();
  await expect(page.getByText('Y = f(X) + u')).toBeVisible();
  await page.getByRole('button', { name: /Devam et/ }).click();
  await page.getByLabel('Model dışında hangi etki kalsın?').selectOption('Eğitim');
  await page.getByLabel(/Bu etkinin önemi/).fill('5');
  await expect(page.getByText(/Eğitim modelin dışında ve etkisi yüksek/)).toBeVisible();
});

test('kontrol geri bildirimi ve Mini Model Card üretimi kalıcıdır', async ({ page }) => {
  await page.goto('/#/basla');
  for (let i = 0; i < 3; i += 1) await page.getByRole('button', { name: /Devam et/ }).click();
  await page.getByLabel(/Sınanabilir bir sadeleştirme/).check();
  await page.getByRole('button', { name: 'Yanıtı kontrol et' }).click();
  await expect(page.locator('.quiz-result')).toContainText('Doğru.');
  await page.getByRole('button', { name: /Devam et/ }).click();
  await page.getByLabel('Modelin sınırlılığı').fill('Beklentiler gözlenmediği için gelir etkisi yanlı olabilir.');
  await page.getByRole('button', { name: 'Model Card’ı oluştur' }).click();
  const card = page.locator('.model-card-output');
  await expect(card.getByRole('heading', { name: 'Mini Model Card', exact: true })).toBeVisible();
  await expect(card).toBeFocused();
  await page.reload();
  const persistedCard = page.locator('.model-card-output');
  await expect(persistedCard.getByRole('heading', { name: 'Mini Model Card', exact: true })).toBeVisible();
  await expect(persistedCard).toContainText('Beklentiler gözlenmediği için gelir etkisi yanlı olabilir.');
});

test('odak, 320 px ve reset sözleşmesi korunur', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#/basla');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await noOverflow(page);
  await page.evaluate(() => {
    localStorage.setItem('eko:state:v2', '{"notes":{"x":"y"}}');
    localStorage.setItem('eko:m3:v1', '{"lastUnitId":"modelleme-kavramlari"}');
    localStorage.setItem('eko:last-topic', 'modelleme-kavramlari');
    localStorage.setItem('eko:journey:v1', '{"step":4}');
  });
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'İlerlemeyi sıfırla' }).click();
  await page.waitForLoadState('domcontentloaded');
  await expect.poll(() => page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('eko:state:v2') || '{}');
    return [
      JSON.stringify(state.notes || {}),
      localStorage.getItem('eko:m3:v1'),
      localStorage.getItem('eko:last-topic'),
      localStorage.getItem('eko:journey:v1')
    ];
  })).toEqual(['{}', null, null, null]);
});
