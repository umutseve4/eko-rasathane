import {test, expect} from '@playwright/test';

const course = 'temel-ekonometri-1';
const unit = 'matematiksel-araclar';
const topicRoute = `#/ders/${course}/konu/${unit}`;

test('program ve Atlas yolları aynı kanonik öğrenme birimine en fazla 3 etkileşimde ulaşır', async ({page}) => {
  await page.goto('/#/');
  await page.getByRole('link', {name:/3\. Sınıf/i}).click();
  await page.getByRole('link', {name:/TEMEL EKONOMETRİ I/i}).click();
  await page.getByRole('link', {name:/Matematiksel araçlar/i}).click();
  await expect(page).toHaveURL(new RegExp(topicRoute));
  await expect(page.locator('[data-learning-unit-id="matematiksel-araclar"]')).toHaveAttribute('data-template-sections', '8');

  await page.goto('/#/');
  await page.getByRole('link', {name:'Atlas'}).first().click();
  await page.getByRole('link', {name:/Betimsel istatistik ve matematiksel araçlar/i}).click();
  await page.getByRole('link', {name:'Öğrenme adımını aç →'}).click();
  await expect(page).toHaveURL(new RegExp(topicRoute));
  await expect(page.locator('[data-learning-unit-id="matematiksel-araclar"]')).toHaveCount(1);
});

test('öğrenme ekranı kanonik 8/8 sözleşmesini görünür kılar', async ({page}) => {
  await page.goto(`/${topicRoute}`);
  const study = page.locator('[data-learning-unit-id="matematiksel-araclar"]');
  await expect(study).toHaveAttribute('data-template-sections', '8');
  for (const section of ['ÖĞRENME HEDEFİ', 'ÖN KOŞUL', 'ANA FİKİR', 'ÇÖZÜMLÜ ÖRNEK', 'GÖRSEL AÇIKLAMA', '60 SANİYELİK KONTROL', 'HATA RADARI', 'ÖZET VE KAYNAK']) {
    await expect(study.getByText(section, {exact:false}).first()).toBeVisible();
  }
  await expect(study.getByRole('link', {name:/BÜÜ TEMEL EKONOMETRİ I Ders Öğretim Planı/i})).toHaveAttribute('href', 'https://bilgipaketi.uludag.edu.tr/Ders/Index/1236601');
});

test('son çalışılan konu ana sayfadan tek etkileşimle açılır ve reset M3 durumunu temizler', async ({page}) => {
  await page.goto(`/${topicRoute}`);
  await page.goto('/#/');
  await page.getByRole('link', {name:/Son konuya dön/i}).click();
  await expect(page).toHaveURL(new RegExp(topicRoute));

  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', {name:'İlerlemeyi sıfırla'}).click();
  await expect.poll(() => page.evaluate(() => Object.keys(localStorage).sort())).toEqual(['eko:state:v2']);
});

test('Atlas rotaları odak, 404 ve 320 px yatay taşma sözleşmesini korur', async ({page}) => {
  await page.goto('/#/atlas');
  await expect(page.getByRole('heading', {level:1})).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await page.setViewportSize({width:320, height:800});
  await page.goto('/#/atlas/kavram/guven-araliklari');
  await expect(page.getByRole('heading', {level:1})).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await page.goto('/#/atlas/kavram/bilinmeyen');
  await expect(page.getByRole('heading', {name:'Bu kapı yok.'})).toBeFocused();
});
