import { test, expect } from '@playwright/test';

test('brand logo loads and paints nontransparent pixels',async({page})=>{
  await page.goto('/#/program');
  const image=page.getByRole('link',{name:'EKO Rasathane ana sayfa'}).locator('img');
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute('src','./assets/eko-rasathane-logo.svg?v=a25cdf953c48');
  const rendering=await image.evaluate(async element=>{
    if(!element.complete)await new Promise((resolve,reject)=>{element.addEventListener('load',resolve,{once:true});element.addEventListener('error',reject,{once:true})});
    const canvas=document.createElement('canvas');canvas.width=element.naturalWidth;canvas.height=element.naturalHeight;
    const context=canvas.getContext('2d');context.drawImage(element,0,0);
    const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
    let opaquePixels=0;for(let index=3;index<pixels.length;index+=4)if(pixels[index]>0)opaquePixels++;
    const box=element.getBoundingClientRect();
    return{complete:element.complete,naturalWidth:element.naturalWidth,naturalHeight:element.naturalHeight,opaquePixels,width:box.width,height:box.height};
  });
  expect(rendering.complete).toBe(true);
  expect(rendering.naturalWidth).toBeGreaterThan(0);
  expect(rendering.naturalHeight).toBeGreaterThan(0);
  expect(rendering.opaquePixels).toBeGreaterThan(1000);
  expect(rendering.width).toBeGreaterThan(rendering.height*2.5);
});
