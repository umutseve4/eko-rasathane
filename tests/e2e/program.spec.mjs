import { test, expect } from '@playwright/test';

const programRoute = '/#/program';
const departments = [
  ['CAL','Çalışma Ekonomisi ve Endüstri İlişkileri'],
  ['EKO','Ekonometri'],
  ['IKT','İktisat'],
  ['ISL','İşletme'],
  ['MLY','Maliye'],
  ['KAM','Siyaset Bilimi ve Kamu Yönetimi'],
  ['ULU','Uluslararası İlişkiler']
];
async function clearState(page){await page.goto('/#/');await page.evaluate(()=>localStorage.removeItem('eko:timetable:v1'))}
async function expectNoHorizontalOverflow(page){const dimensions=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,content:document.documentElement.scrollWidth}));expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport)}
test.beforeEach(async({page})=>{await clearState(page)});

test('program navigation decodes the authoritative fixture and renders provenance',async({page})=>{
  await page.getByRole('link',{name:'Program'}).first().click();
  await expect(page).toHaveURL(/#\/program$/);
  await expect(page.getByRole('heading',{level:1})).toHaveText('Akademik program');
  await expect(page.locator('.program-total')).toContainText('164');
  await expect(page.getByLabel('Program özeti')).toContainText('108 I. öğretim');
  await expect(page.getByLabel('Program özeti')).toContainText('56 II. öğretim');
  await expect(page.getByLabel('Program özeti')).toContainText('83 bahar · 81 güz');
  await expect(page.locator('.program-card')).toHaveCount(164);
  const firstCard=page.locator('.program-card').first();await firstCard.getByText('Kaynak kaydını göster').click();
  await expect(firstCard.locator('details p').first()).not.toBeEmpty();
  await expect(firstCard.locator('.mapping')).toContainText(/^Eşleme: (mapped|mapped-with-anomaly|ambiguous|unmatched)$/);
  await expect(firstCard.getByRole('link',{name:/Resmî PDF/})).toHaveAttribute('href',/^https:\/\/uludag\.edu\.tr\//);
  await expect(page.locator('.program-sources').getByRole('link')).toHaveCount(2);
});

test('department selector uses complete labels, raw values and exact filtering',async({page})=>{
  await page.goto(programRoute);const select=page.locator('select[name="department"]');
  const options=await select.locator('option').evaluateAll(nodes=>nodes.map(node=>[node.value,node.textContent]));
  expect(options).toEqual([['','Tümü'],...departments]);
  expect(options.flat()).not.toContain('TUD');expect(options.flat()).not.toContain('YAD');
  await select.selectOption('MLY');await expect(page.locator('.program-card')).toHaveCount(16);
  for(const code of await page.locator('.program-card > div > b').allTextContents())expect(code.startsWith('MLY')).toBe(true);
  await expect(page.locator('select[name="department"]')).toBeFocused();
});

test('five filters persist raw department code independently from learning state',async({page})=>{
  await page.goto(programRoute);const learningBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem('eko:state:v2')));
  await page.locator('select[name="term"]').selectOption('spring');await expect(page.locator('.program-card')).toHaveCount(83);
  await page.locator('select[name="educationType"]').selectOption('second');
  await page.locator('select[name="department"]').selectOption('EKO');
  await page.locator('select[name="semester"]').selectOption('2');
  await page.locator('select[name="weekday"]').selectOption('PAZARTESİ');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('eko:timetable:v1')))).toEqual({term:'spring',educationType:'second',department:'EKO',semester:'2',weekday:'PAZARTESİ'});
  const learningAfter=await page.evaluate(()=>JSON.parse(localStorage.getItem('eko:state:v2')));for(const field of ['selectedGradeId','completedTopics','quizResults','notes','evidence'])expect(learningAfter[field]).toEqual(learningBefore[field]);
  await page.reload();await expect(page.locator('select[name="department"]')).toHaveValue('EKO');
});

test('legacy and stale department state safely fall back to all',async({page})=>{
  await page.goto('/#/');
  await page.evaluate(()=>localStorage.setItem('eko:timetable:v1',JSON.stringify({term:'fall',educationType:'',semester:'',weekday:''})));
  await page.goto(programRoute);await expect(page.locator('select[name="department"]')).toHaveValue('');await expect(page.locator('.program-card')).toHaveCount(81);
  await page.evaluate(()=>localStorage.setItem('eko:timetable:v1',JSON.stringify({term:'',educationType:'',department:'TUD',semester:'',weekday:''})));
  await page.reload();await expect(page.locator('select[name="department"]')).toHaveValue('');await expect(page.locator('.program-card')).toHaveCount(164);
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('eko:timetable:v1')).department)).toBe('');
});

test('brand uses the refreshed accessible horizontal logo',async({page})=>{
  await page.goto(programRoute);const brand=page.getByRole('link',{name:'EKO Rasathane ana sayfa'}),image=brand.locator('img');
  await expect(brand).toHaveCount(1);await expect(image).toBeVisible();await expect(image).toHaveAttribute('alt','');await expect(image).toHaveAttribute('src','./assets/eko-rasathane-logo.svg?v=a25cdf953c48');
  const box=await image.boundingBox();expect(box.width).toBeGreaterThan(box.height*2.5);
});

test('program route is strict and malformed variants stay not-found',async({page})=>{for(const hash of ['#/program/','#/program/foo','#/program%2Ffoo']){await page.goto(`/${hash}`);await expect(page.getByRole('heading',{level:1})).toHaveText('Bu kapı yok.');expect(page.url()).toContain(hash)}});

test('program view is keyboard-focused, reduced-motion safe and 320 px wide',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:320,height:800});await page.goto(programRoute);
  await expect(page.getByRole('heading',{level:1})).toBeFocused();await expectNoHorizontalOverflow(page);
  const department=page.locator('select[name="department"]');await department.focus();await department.selectOption('ULU');await expect(page.locator('select[name="department"]')).toBeFocused();await expectNoHorizontalOverflow(page);
});
