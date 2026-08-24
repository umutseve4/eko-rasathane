export const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));

const emptyState=()=>({version:2,lastRoute:'#/',selectedGradeId:null,completedTopics:[],quizResults:{},notes:{},legacyStudio:null,recall:{index:0,schedule:{}},evidence:[],timer:null});
const objectOr=(value,fallback={})=>value&&typeof value==='object'&&!Array.isArray(value)?value:fallback;
const arrayOr=value=>Array.isArray(value)?value:[];
const recallOr=value=>{const r=objectOr(value,null);if(!r)return {index:0,schedule:{}};return {index:Number.isInteger(r.index)&&r.index>=0?r.index:0,schedule:objectOr(r.schedule)}};

export function parseRoute(hash=''){
 if(hash===''||hash==='#'||hash==='#/')return {name:'home'};
 if(!hash.startsWith('#/'))return {name:'notFound'};
 const raw=hash.slice(2);
 if(!raw||raw.includes('//')||raw.endsWith('/'))return {name:'notFound'};
 let p;
 try{p=raw.split('/').map(decodeURIComponent)}catch{return {name:'notFound'}}
 if(p.length===1&&p[0]==='program')return {name:'program'};
 if(p.length===2&&p[0]==='sinif'&&/^[1-4]$/.test(p[1]))return {name:'grade',gradeId:p[1]};
 if(p.length===4&&p[0]==='ders'&&p[1]&&p[2]==='konu'&&p[3])return {name:'topic',courseId:p[1],topicId:p[3]};
 if(p.length===2&&p[0]==='ders'&&p[1])return {name:'course',courseId:p[1]};
 return {name:'notFound'};
}
export const coursesForGrade=(courses,gradeId)=>courses.filter(c=>c.gradeId===gradeId).sort((a,b)=>a.term-b.term||a.name.localeCompare(b.name,'tr'));
export const groupByTerm=courses=>courses.reduce((a,c)=>((a[c.term]??=[]).push(c),a),{});
export const progressPercent=(done,total)=>total<=0?0:Math.round(clamp(done,0,total)/total*100);
export const courseProgress=(topicIds,completed)=>progressPercent(arrayOr(topicIds).filter(id=>arrayOr(completed).includes(id)).length,arrayOr(topicIds).length);

export function validateCatalog({grades=[],courses=[],topics=[]}){
 const errors=[];
 const duplicate=(items,label)=>{const seen=new Set();for(const item of items){if(!item?.id)errors.push(`${label}: missing id`);else if(seen.has(item.id))errors.push(`${label}: duplicate id ${item.id}`);else seen.add(item.id)}return seen};
 const gids=duplicate(grades,'grade'),cids=duplicate(courses,'course'),tids=duplicate(topics,'topic');
 void cids;
 for(const t of topics){if(!Number.isInteger(t.n)||t.n<1)errors.push(`${t.id}: invalid order`);if(!Array.isArray(t.options)||!Number.isInteger(t.answer)||t.answer<0||t.answer>=t.options.length)errors.push(`${t.id}: invalid quiz`)}
 for(const c of courses){
  if(!gids.has(c.gradeId))errors.push(`${c.id}: unknown grade`);
  if(!c.verified)errors.push(`${c.id}: unverified`);
  if(!Array.isArray(c.topicIds)||!c.topicIds.length)errors.push(`${c.id}: empty topics`);
  const seen=new Set();for(const id of arrayOr(c.topicIds)){if(seen.has(id))errors.push(`${c.id}: duplicate topic ${id}`);seen.add(id);if(!tids.has(id))errors.push(`${c.id}: unknown topic ${id}`)}
 }
 return errors;
}

export function migrateState(rawV1,rawV2,legacy={}){
 const base=emptyState(),v2=objectOr(rawV2,null);
 if(v2?.version===2)return {...base,...v2,version:2,lastRoute:typeof v2.lastRoute==='string'?v2.lastRoute:'#/',selectedGradeId:typeof v2.selectedGradeId==='string'?v2.selectedGradeId:null,completedTopics:arrayOr(v2.completedTopics),quizResults:objectOr(v2.quizResults),notes:objectOr(v2.notes),recall:recallOr(v2.recall),evidence:arrayOr(v2.evidence)};
 const v1=objectOr(rawV1),legacyNotes=objectOr(legacy.notes);
 return {...base,legacyStudio:v1.studio||legacy.studio||null,recall:recallOr(v1.recall||legacy.recall),evidence:arrayOr(v1.evidence).length?arrayOr(v1.evidence):arrayOr(legacy.evidence),timer:v1.timer||legacy.timer||null,notes:legacyNotes};
}