export const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
export function parseRoute(hash=''){
 const p=(hash.replace(/^#\/?/,'').split('/').filter(Boolean));
 if(!p.length)return {name:'home'};
 if(p[0]==='sinif'&&/^[1-4]$/.test(p[1]))return {name:'grade',gradeId:p[1]};
 if(p[0]==='ders'&&p[1]&&p[2]==='konu'&&p[3])return {name:'topic',courseId:p[1],topicId:p[3]};
 if(p[0]==='ders'&&p[1])return {name:'course',courseId:p[1]};
 return {name:'notFound'};
}
export const coursesForGrade=(courses,gradeId)=>courses.filter(c=>c.gradeId===gradeId).sort((a,b)=>a.term-b.term||a.name.localeCompare(b.name,'tr'));
export const groupByTerm=courses=>courses.reduce((a,c)=>((a[c.term]??=[]).push(c),a),{});
export const progressPercent=(done,total)=>total<=0?0:Math.round(clamp(done,0,total)/total*100);
export const courseProgress=(topicIds,completed)=>progressPercent(topicIds.filter(id=>completed.includes(id)).length,topicIds.length);
export function validateCatalog({grades,courses,topics}){
 const errors=[]; const gids=new Set(grades.map(x=>x.id)); const tids=new Set(topics.map(x=>x.id));
 for(const c of courses){if(!gids.has(c.gradeId))errors.push(`${c.id}: unknown grade`); if(!c.verified)errors.push(`${c.id}: unverified`); for(const id of c.topicIds||[])if(!tids.has(id))errors.push(`${c.id}: unknown topic ${id}`)}
 return errors;
}
export function migrateState(rawV1,rawV2){
 if(rawV2&&rawV2.version===2)return rawV2;
 return {version:2,lastRoute:'#/',selectedGradeId:null,completedTopics:[],quizResults:{},notes:{},legacyStudio:rawV1?.studio||null,recall:rawV1?.recall||[],evidence:rawV1?.evidence||[],timer:rawV1?.timer||null};
}