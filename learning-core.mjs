const asArray=value=>Array.isArray(value)?value:[];
const requiredText=['objective','narrative','workedExample','visualExplanation','checkQuestion','misconception','recap'];

export function parseLearningRoute(hash=''){
  if(hash==='#/atlas')return {name:'atlas'};
  if(!hash.startsWith('#/atlas/kavram/'))return null;
  const raw=hash.slice('#/atlas/kavram/'.length);
  if(!raw||raw.includes('/')||raw.includes('%2F')||raw.includes('%2f'))return null;
  try{return {name:'concept',conceptId:decodeURIComponent(raw)}}catch{return null}
}

export function validateLearningArchitecture({units=[],concepts=[],courseIds=[],topicIds=[]}){
  const errors=[],unitIds=new Set(),conceptIds=new Set(),knownCourses=new Set(courseIds),knownTopics=new Set(topicIds);
  for(const concept of concepts){
    if(!concept?.id)errors.push('concept: missing id');
    else if(conceptIds.has(concept.id))errors.push(`concept: duplicate id ${concept.id}`);
    else conceptIds.add(concept.id);
  }
  for(const unit of units){
    if(!unit?.id)errors.push('unit: missing id');
    else if(unitIds.has(unit.id))errors.push(`unit: duplicate id ${unit.id}`);
    else unitIds.add(unit.id);
    for(const field of requiredText)if(typeof unit?.[field]!=='string'||!unit[field].trim())errors.push(`${unit?.id||'unit'}: missing ${field}`);
    if(!knownTopics.has(unit?.topicId))errors.push(`${unit?.id||'unit'}: unknown topic ${unit?.topicId}`);
    if(!conceptIds.has(unit?.conceptId))errors.push(`${unit?.id||'unit'}: unknown concept ${unit?.conceptId}`);
    if(!asArray(unit?.sourceRefs).length)errors.push(`${unit?.id||'unit'}: missing sourceRefs`);
    if(!asArray(unit?.relatedCourseIds).length)errors.push(`${unit?.id||'unit'}: missing relatedCourseIds`);
    for(const id of asArray(unit?.relatedCourseIds))if(!knownCourses.has(id))errors.push(`${unit?.id||'unit'}: unknown course ${id}`);
  }
  for(const concept of concepts){
    if(!unitIds.has(concept.unitId))errors.push(`${concept.id}: unknown unit ${concept.unitId}`);
    for(const id of asArray(concept.prerequisiteIds))if(!conceptIds.has(id))errors.push(`${concept.id}: unknown prerequisite ${id}`);
  }
  const visiting=new Set(),visited=new Set(),byId=new Map(concepts.map(item=>[item.id,item]));
  function visit(id){if(visiting.has(id)){errors.push(`${id}: prerequisite cycle`);return}if(visited.has(id))return;visiting.add(id);for(const next of asArray(byId.get(id)?.prerequisiteIds))visit(next);visiting.delete(id);visited.add(id)}
  for(const id of conceptIds)visit(id);
  return errors;
}

export function migrateLearningState(raw,legacyLastTopic=null){
  const base={version:1,lastUnitId:null};
  if(raw&&typeof raw==='object'&&!Array.isArray(raw)&&raw.version===1)return {...base,lastUnitId:typeof raw.lastUnitId==='string'?raw.lastUnitId:null};
  return {...base,lastUnitId:typeof legacyLastTopic==='string'&&legacyLastTopic?legacyLastTopic:null};
}
