import { test, expect } from '@playwright/test';

const liveProgram='https://umutseve4.github.io/eko-rasathane/#/program';
const logoPath='./assets/eko-rasathane-logo.svg?v=a25cdf953c48';
const departments=[
  ['','Tümü'],
  ['CAL','Çalışma Ekonomisi ve Endüstri İlişkileri'],
  ['EKO','Ekonometri'],
  ['IKT','İktisat'],
  ['ISL','İşletme'],
  ['MLY','Maliye'],
  ['KAM','Siyaset Bilimi ve Kamu Yönetimi'],
  ['ULU','Uluslararası İlişkiler']
];

async function logoRendering(page){
  const image=page.getByRole('link',{name:'EKO Rasathane ana sayfa'}).locator('img');
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute('src',logoPath);
  return image.evaluate(async element=>{
    if(!element.complete)await new Promise((resolve,reject)=>{element.addEventListener('load',resolve,{once:true});element.addEventListener('error',reject,{once:true})});
    const canvas=document.createElement('canvas');canvas.width=element.naturalWidth;canvas.height=element.naturalHeight;
    const context=canvas.getContext('2d');context.drawImage(element,0,0);
    const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
    let opaquePixels=0;for(let index=3;index<pixels.length;index+=4)if(pixels[index]>0)opaquePixels+=1;
    const box=element.getBoundingClientRect();
    return{complete:element.complete,naturalWidth:element.naturalWidth,naturalHeight:element.naturalHeight,opaquePixels,width:box.width,height:box.height};
  });
}

function expectPaintedHorizontalLogo(rendering){
  expect(rendering.complete).toBe(true);
  expect(rendering.naturalWidth).toBeGreaterThan(0);
  expect(rendering.naturalHeight).toBeGreaterThan(0);
  expect(rendering.opaquePixels).toBeGreaterThan(1000);
  expect(rendering.width).toBeGreaterThan(rendering.height*2.5);
}

test('deployed exact-logo program contract holds on desktop and 320 px mobile',async({page})=>{
  await page.setViewportSize({width:1280,height:900});
  await page.goto(liveProgram,{waitUntil:'networkidle'});
  const assetResponse=await page.request.get('https://umutseve4.github.io/eko-rasathane/assets/eko-rasathane-logo.svg?v=a25cdf953c48');
  expect(assetResponse.ok()).toBe(true);
  expectPaintedHorizontalLogo(await logoRendering(page));
  await expect(page.locator('.program-total')).toContainText('164');
  await expect(page.locator('.program-card')).toHaveCount(164);
  const options=await page.locator('select[name="department"] option').evaluateAll(nodes=>nodes.map(node=>[node.value,node.textContent]));
  expect(options).toEqual(departments);
  expect(await page.locator('body').innerText()).not.toContain('β');

  await page.setViewportSize({width:320,height:800});
  await page.reload({waitUntil:'networkidle'});
  expectPaintedHorizontalLogo(await logoRendering(page));
  const dimensions=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,content:document.documentElement.scrollWidth}));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  await expect(page.locator('.program-total')).toContainText('164');
});
