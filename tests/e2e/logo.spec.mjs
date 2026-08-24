import { test, expect } from '@playwright/test';

test('brand logo loads, paints nontransparent pixels, and uses the enlarged square box',async({page})=>{
  await page.goto('/#/program');
  const image=page.getByRole('link',{name:'EKO Rasathane ana sayfa'}).locator('img');
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute('src','./assets/eko-rasathane-logo.svg?v=a25cdf953c48');
  await expect(image).toHaveAttribute('width','128');
  await expect(image).toHaveAttribute('height','128');
  const rendering=await image.evaluate(async element=>{
    if(!element.complete)await new Promise((resolve,reject)=>{element.addEventListener('load',resolve,{once:true});element.addEventListener('error',reject,{once:true})});
    const canvas=document.createElement('canvas');canvas.width=element.naturalWidth;canvas.height=element.naturalHeight;
    const context=canvas.getContext('2d');context.drawImage(element,0,0);
    const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
    let opaquePixels=0;for(let index=3;index<pixels.length;index+=4)if(pixels[index]>0)opaquePixels+=1;
    const box=element.getBoundingClientRect();
    return{complete:element.complete,naturalWidth:element.naturalWidth,naturalHeight:element.naturalHeight,opaquePixels,width:box.width,height:box.height};
  });
  expect(rendering.complete).toBe(true);
  expect(rendering.naturalWidth).toBe(128);
  expect(rendering.naturalHeight).toBe(128);
  expect(rendering.opaquePixels).toBeGreaterThan(1000);
  expect(rendering.width).toBe(96);
  expect(rendering.height).toBe(96);
});

test('enlarged logo remains usable without overlap or horizontal overflow at 320px',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.goto('/#/program');
  const layout=await page.evaluate(()=>{
    const logo=document.querySelector('.brand img').getBoundingClientRect();
    const actions=document.querySelector('.header-actions').getBoundingClientRect();
    const header=document.querySelector('.site-header').getBoundingClientRect();
    return{logo:{left:logo.left,right:logo.right,width:logo.width,height:logo.height},actions:{left:actions.left,right:actions.right},headerHeight:header.height,scrollWidth:document.documentElement.scrollWidth,viewport:window.innerWidth};
  });
  expect(layout.logo.width).toBe(68);
  expect(layout.logo.height).toBe(68);
  expect(layout.headerHeight).toBe(86);
  expect(layout.logo.right).toBeLessThanOrEqual(layout.actions.left);
  expect(layout.actions.right).toBeLessThanOrEqual(layout.viewport);
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewport);
});
