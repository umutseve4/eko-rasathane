import { test, expect } from '@playwright/test';

test('brand logo loads and enlarges its painted footprint inside the clipping box',async({page})=>{
  await page.goto('/#/program');
  const brand=page.getByRole('link',{name:'EKO Rasathane ana sayfa'});
  const image=brand.locator('img');
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute('src','./assets/eko-rasathane-logo.svg?v=a25cdf953c48');
  await expect(image).toHaveAttribute('width','128');
  await expect(image).toHaveAttribute('height','128');
  const rendering=await image.evaluate(async element=>{
    if(!element.complete)await new Promise((resolve,reject)=>{element.addEventListener('load',resolve,{once:true});element.addEventListener('error',reject,{once:true})});
    const canvas=document.createElement('canvas');canvas.width=element.naturalWidth;canvas.height=element.naturalHeight;
    const context=canvas.getContext('2d');context.drawImage(element,0,0);
    const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
    let meaningfulPixels=0;for(let index=3;index<pixels.length;index+=4)if(pixels[index]>8)meaningfulPixels+=1;
    const box=element.getBoundingClientRect();
    const clip=element.parentElement.getBoundingClientRect();
    const brandStyle=getComputedStyle(element.parentElement);
    return{complete:element.complete,naturalWidth:element.naturalWidth,naturalHeight:element.naturalHeight,meaningfulPixels,width:box.width,height:box.height,clipWidth:clip.width,clipHeight:clip.height,overflow:brandStyle.overflow,backgroundSize:brandStyle.backgroundSize,backgroundPosition:brandStyle.backgroundPosition,backgroundImage:brandStyle.backgroundImage};
  });
  expect(rendering.complete).toBe(true);
  expect(rendering.naturalWidth).toBe(128);
  expect(rendering.naturalHeight).toBe(128);
  expect(rendering.meaningfulPixels).toBeGreaterThan(1000);
  expect(rendering.width).toBe(96);
  expect(rendering.height).toBe(96);
  expect(rendering.clipWidth).toBe(96);
  expect(rendering.clipHeight).toBe(96);
  expect(rendering.overflow).toBe('hidden');
  expect(rendering.backgroundSize).toBe('190% 190%');
  expect(rendering.backgroundPosition).toBe('50% 44.6%');
  expect(rendering.backgroundImage).toContain('eko-rasathane-logo.svg');
});

test('enlarged painted logo remains usable without overlap or horizontal overflow at 320px',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.goto('/#/program');
  const layout=await page.evaluate(()=>{
    const brand=document.querySelector('.brand').getBoundingClientRect();
    const logo=document.querySelector('.brand img').getBoundingClientRect();
    const actions=document.querySelector('.header-actions').getBoundingClientRect();
    const header=document.querySelector('.site-header').getBoundingClientRect();
    const style=getComputedStyle(document.querySelector('.brand'));
    return{brand:{left:brand.left,right:brand.right,width:brand.width,height:brand.height},logo:{width:logo.width,height:logo.height},actions:{left:actions.left,right:actions.right},headerHeight:header.height,backgroundSize:style.backgroundSize,scrollWidth:document.documentElement.scrollWidth,viewport:window.innerWidth};
  });
  expect(layout.brand.width).toBe(68);
  expect(layout.brand.height).toBe(68);
  expect(layout.logo.width).toBe(68);
  expect(layout.logo.height).toBe(68);
  expect(layout.headerHeight).toBe(86);
  expect(layout.backgroundSize).toBe('190% 190%');
  expect(layout.brand.right).toBeLessThanOrEqual(layout.actions.left);
  expect(layout.actions.right).toBeLessThanOrEqual(layout.viewport);
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewport);
});
