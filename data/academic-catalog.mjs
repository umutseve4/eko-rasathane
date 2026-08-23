export const VERIFICATION_STATUSES = Object.freeze([
  'source-confirmed',
  'manually-reviewed',
  'cross-checked',
  'uncertain'
]);

const snapshot = Object.freeze({
  id: 'snapshot-program-343-ay33-2025-08-21',
  sourceId: 'source-sbu-bologna-program-343-ay33',
  retrievedAt: '2025-08-21T14:41:10Z',
  contentHash: 'sha256:0b72d3ba7919492cce571d697902dff1ca20d6e0ef67dcbdf3f53f5b6acee1c6',
  artifactPath: 'program-343-ay33.html',
  note: 'Official Bologna curriculum view with 8 semester headings and 144 course rows.'
});

const requiredRows = [
  [1,'AIT1101','ATATÜRK İLKELERİ VE İNKILAP TARİHİ I',2,0,0,2],[1,'ENF1100','TEMEL BİLGİ TEKNOLOJİLERİ KULLANIMI',1,2,0,3],[1,'ING1101','İNGİLİZCE I',2,0,0,2],[1,'IKT1101','İKTİSADA GİRİŞ I',3,0,0,4],[1,'ISL1101','İŞLETME BİLİMİNE GİRİŞ',3,0,0,4],[1,'MAT1105','MATEMATİK I',2,2,0,6],[1,'TUR1101','TÜRK DİLİ I',2,0,0,2],[1,'UOS1101','ÜNİVERSİTE ORTAK SEÇMELİ DERS',2,0,0,2],
  [2,'AIT1102','ATATÜRK İLKELERİ VE İNKILAP TARİHİ II',2,0,0,2],[2,'HUK1101','HUKUKUN TEMEL KAVRAMLARI',2,0,0,3],[2,'ING1102','İNGİLİZCE II',2,0,0,2],[2,'IKT1102','İKTİSADA GİRİŞ II',3,0,0,4],[2,'ISL1202','YÖNETİM VE ORGANİZASYON',3,0,0,4],[2,'MAT1106','MATEMATİK II',2,2,0,6],[2,'TUR1102','TÜRK DİLİ II',2,0,0,2],[2,'UOS1102','ÜNİVERSİTE ORTAK SEÇMELİ DERS',2,0,0,2],
  [3,'IKT2101','MİKRO İKTİSAT I',3,0,0,5],[3,'IKT2103','MAKRO İKTİSAT I',3,0,0,5],[3,'MLY2105','MALİYE',3,0,0,5],
  [4,'IKT2102','MİKRO İKTİSAT II',3,0,0,5],[4,'IKT2104','MAKRO İKTİSAT II',3,0,0,5],[4,'ISL2204','MUHASEBE II',3,0,0,4],
  [5,'HUK3103','BORÇLAR HUKUKU',3,0,0,5],[5,'IKT3101','EKONOMETRİ I',3,0,0,5],[5,'IKT3103','ULUSLARARASI İKTİSAT I',3,0,0,5],[5,'IKT3105','PARA TEORİSİ',3,0,0,5],
  [6,'IKT3102','EKONOMETRİ II',3,0,0,5],[6,'IKT3104','ULUSLARARASI İKTİSAT II',3,0,0,5],[6,'IKT3106','PARA POLİTİKASI',3,0,0,5],[6,'IKT3108','KAMU EKONOMİSİ',3,0,0,5],
  [7,'IKT4101','İKTİSADİ BÜYÜME',3,0,0,5],[7,'IKT4103','TÜRKİYE EKONOMİSİ',3,0,0,5],[7,'IKT4105','BİTİRME ÇALIŞMASI I',3,0,0,5],
  [8,'IKT4102','KALKINMA EKONOMİSİ',3,0,0,5],[8,'IKT4104','İKTİSADİ DÜŞÜNCELER TARİHİ',3,0,0,5],[8,'IKT4106','BİTİRME ÇALIŞMASI II',3,0,0,5]
];

const electiveRows = [
  [3,'AIT2201','TÜRK MODERNLEŞMESİ',3,0,0,5],[3,'IKT2201','İKTİSAT TARİHİ',3,0,0,5],[3,'IKT2203','SOSYAL BİLİMLER İÇİN MATEMATİK',3,0,0,5],[3,'IKT2205','İSTATİSTİK I',3,0,0,5],[3,'ING2101','MESLEKİ İNGİLİZCE I',3,0,0,5],[3,'ISL2105','MUHASEBE I',3,0,0,5],[3,'ISL2201','PAZARLAMA İLKELERİ',3,0,0,5],
  [4,'HUK2208','ANAYASA HUKUKU',3,0,0,5],[4,'IKT2202','İKTİSADİ SİSTEMLER',3,0,0,5],[4,'IKT2204','OYUN TEORİSİ',3,0,0,5],[4,'IKT2206','İSTATİSTİK II',3,0,0,5],[4,'IKT2208','İDARE HUKUKU',3,0,0,5],[4,'IKT2210','ENDÜSTRİYEL ORGANİZASYON',3,0,0,5],[4,'IKT2212','GÖRSEL PROGRAMLAMAYA GİRİŞ',3,0,0,5],[4,'ING2102','MESLEKİ İNGİLİZCE II',3,0,0,5],[4,'ISG2200','İŞ SAĞLIĞI VE GÜVENLİĞİ',3,0,0,5],[4,'ISL2202','ENVANTER VE BİLANÇO',3,0,0,5],
  [5,'IKT3301','İKTİSADİ PLANLAMA',3,0,0,5],[5,'IKT3303','SAĞLIK EKONOMİSİ',3,0,0,5],[5,'IKT3305','MATEMATİKSEL İKTİSAT',3,0,0,5],[5,'IKT3307','İKTİSAT METODOLOJİSİ',3,0,0,5],[5,'IKT3309','MAKROEKONOMİK GÖSTERGELER',3,0,0,5],[5,'IKT3311','SERMAYE PİYASASI ANALİZİ',3,0,0,5],[5,'IKT3313','İKTİSATTA STRATEJİK KARARLAR',3,0,0,5],[5,'IKT3315','ULUSLARARASI POLİTİK İKTİSAT',3,0,0,5],[5,'IKT3317','İKTİSATTA GÜNCEL KONULAR',3,0,0,5],[5,'IKT3319','DAVRANIŞSAL İKTİSAT',3,0,0,5],[5,'IKT3321','KATILIM BANKACILIĞI',3,0,0,5],[5,'IKT3323','BORSA UYGULAMALARI',3,0,0,5],[5,'IKT3325','KRİPTO PARA VE BLOCKCHAIN',3,0,0,5],[5,'IKT3327','KAMU POLİTİKASI',3,0,0,5],[5,'IKT3329','FİNANSAL EKONOMETRİ',3,0,0,5],[5,'ING3101','İŞ HAYATI İÇİN İNGİLİZCE',3,0,0,5],[5,'ISL3301','GİRİŞİMCİLİK',3,0,0,5],
  [6,'IKT3302','EKONOMETRİK MODELLER',3,0,0,5],[6,'IKT3304','ÇEVRE EKONOMİSİ',3,0,0,5],[6,'IKT3306','DOGAL KAYNAKLAR EKONOMİSİ',3,0,0,5],[6,'IKT3308','FİNANSAL EKONOMİ',3,0,0,5],[6,'IKT3310','BİLGİ EKONOMİSİ',3,0,0,5],[6,'IKT3312','İNOVASYON VE REKABET',3,0,0,5],[6,'IKT3314','TÜRKİYE-AB İLİŞKİLERİ',3,0,0,5],[6,'IKT3316','ENERJİ EKONOMİSİ',3,0,0,5],[6,'IKT3318','EĞİTİM EKONOMİSİ',3,0,0,5],[6,'IKT3320','YENİLİK EKONOMİSİ',3,0,0,5],[6,'IKT3322','E-TİCARET',3,0,0,5],[6,'IKT3324','DİJİTAL EKONOMİ',3,0,0,5],[6,'IKT3326','DENEYSEL İKTİSAT',3,0,0,5],[6,'IKT3328','YAPAY ZEKA EKONOMİSİ',3,0,0,5],[6,'IKT3330','ULUSLARARASI GÖÇ',3,0,0,5],[6,'ING3102','İLERİ MESLEKİ İNGİLİZCE',3,0,0,5],[6,'ISL3302','FİNANSAL YÖNETİM',3,0,0,5],
  [7,'HUK4201','REKABET HUKUKU',3,0,0,5],[7,'IKT4301','İLERİ MİKRO İKTİSAT',3,0,0,5],[7,'IKT4303','İLERİ MAKRO İKTİSAT',3,0,0,5],[7,'IKT4305','ULUSLARARASI FİNANS',3,0,0,5],[7,'IKT4307','KENT EKONOMİSİ',3,0,0,5],[7,'IKT4309','BÖLGESEL İKTİSAT',3,0,0,5],[7,'IKT4311','İKTİSADİ KRİZLER',3,0,0,5],[7,'IKT4313','DÜNYA EKONOMİSİ',3,0,0,5],[7,'IKT4315','UYGULAMALI EKONOMETRİ',3,0,0,5],[7,'IKT4317','PROJE YÖNETİMİ',3,0,0,5],[7,'IKT4319','SOSYAL POLİTİKA',3,0,0,5],[7,'IKT4321','İSLAM EKONOMİSİ',3,0,0,5],[7,'IKT4323','TARIM EKONOMİSİ',3,0,0,5],[7,'IKT4325','KAMU MALİYESİ UYGULAMALARI',3,0,0,5],[7,'IKT4327','İKTİSADİ ARAŞTIRMA YÖNTEMLERİ',3,0,0,5],[7,'IKT4329','VERİ BİLİMİNE GİRİŞ',3,0,0,5],[7,'IKT4331','İKLİM DEĞİŞİKLİĞİ EKONOMİSİ',3,0,0,5],
  [8,'IKT4302','İLERİ EKONOMETRİ',3,0,0,5],[8,'IKT4304','İKTİSAT POLİTİKASI ANALİZİ',3,0,0,5],[8,'IKT4306','ÇALIŞMA EKONOMİSİ',3,0,0,5],[8,'IKT4308','ULUSLARARASI TİCARET POLİTİKASI',3,0,0,5],[8,'IKT4310','İKTİSADİ COĞRAFYA',3,0,0,5],[8,'IKT4312','FİNANSAL KRİZLER',3,0,0,5],[8,'IKT4314','KÜRESELLEŞME VE İKTİSAT',3,0,0,5],[8,'IKT4316','YOKSULLUK VE GELİR DAĞILIMI',3,0,0,5],[8,'IKT4318','TÜRKİYEDE PARA VE BANKACILIK',3,0,0,5],[8,'IKT4320','ULUSLARARASI KURULUŞLAR',3,0,0,5],[8,'IKT4322','SOSYAL GÜVENLİK EKONOMİSİ',3,0,0,5],[8,'IKT4324','KALKINMA POLİTİKALARI',3,0,0,5],[8,'IKT4326','MALİ PİYASALAR',3,0,0,5],[8,'IKT4328','EKONOMİK TAHMİN YÖNTEMLERİ',3,0,0,5],[8,'IKT4330','BÜYÜK VERİ ANALİZİ',3,0,0,5],[8,'IKT4332','SÜRDÜRÜLEBİLİR KALKINMA',3,0,0,5],[8,'IKT4334','DİJİTAL DÖNÜŞÜM',3,0,0,5],[8,'IKT4336','ULUSLARARASI VERGİLEME',3,0,0,5]
];

// Preserve every source row as its own Course record, including repeated course
// codes. This is deliberate: the source record, not courseCode, is the identity.
const allRows = [
  ...requiredRows.map(row => ({ row, courseType: 'required' })),
  ...electiveRows.map(row => ({ row, courseType: 'elective' }))
];

// Extra rows from the current official AyID=33 source that are retained verbatim.
const additionalRows = [
  [3,'IKT2207','SOSYAL BİLİMLERDE ARAŞTIRMA YÖNTEMLERİ',3,0,0,5,'elective'],[3,'IKT2209','İKTİSAT VE TOPLUM',3,0,0,5,'elective'],[4,'IKT2214','POLİTİK İKTİSAT',3,0,0,5,'elective'],[4,'IKT2216','SOSYAL BİLİMLER İÇİN PROGRAMLAMA',3,0,0,5,'elective'],[4,'IKT2218','KAMU YÖNETİMİ',3,0,0,5,'elective'],[5,'IKT3331','ULUSLARARASI BANKACILIK',3,0,0,5,'elective'],[5,'IKT3333','KALKINMA FİNANSMANI',3,0,0,5,'elective'],[5,'IKT3335','MİKRO FİNANS',3,0,0,5,'elective'],[5,'IKT3337','SOSYAL GİRİŞİMCİLİK',3,0,0,5,'elective'],[6,'IKT3332','İKTİSADİ BÜYÜME TEORİLERİ',3,0,0,5,'elective'],[6,'IKT3334','ULUSLARARASI YATIRIM',3,0,0,5,'elective'],[6,'IKT3336','FİNANSAL TEKNOLOJİLER',3,0,0,5,'elective'],[6,'IKT3338','SÜRDÜRÜLEBİLİR FİNANS',3,0,0,5,'elective'],[7,'IKT4333','İKTİSATTA PYHTON UYGULAMALARI',3,0,0,5,'elective'],[7,'IKT4335','EKONOMİK RAPORLAMA TEKNİKLERİ',3,0,0,5,'elective'],[7,'IKT4337','SOSYAL AĞ ANALİZİ',3,0,0,5,'elective'],[8,'IKT4338','MAKİNE ÖĞRENMESİ',3,0,0,5,'elective'],[8,'IKT4340','DOĞAL DİL İŞLEME',3,0,0,5,'elective'],[8,'IKT4342','ZAMAN SERİSİ ANALİZİ',3,0,0,5,'elective'],[8,'IKT4344','MEKANSAL EKONOMETRİ',3,0,0,5,'elective'],[1,'IKT1199','AKADEMİK ORYANTASYON',1,0,0,1,'required'],[2,'IKT1299','KARİYER PLANLAMA',1,0,0,1,'required'],[7,'IKT4199','MESLEKİ UYGULAMA',0,2,0,2,'required'],[8,'IKT4299','MEZUNİYET SEMİNERİ',2,0,0,3,'required']
];

for (const [semester, code, title, theory, practice, lab, ects, type] of additionalRows) {
  allRows.push({ row: [semester, code, title, theory, practice, lab, ects], courseType: type });
}

const sourceTitleOverrides = new Map([
  ['IKT4333', 'PYHTON UYGULAMALARI'],
  ['IKT4335', 'ÖNRAPORLAMA TEKNİKLERİ'],
  ['IKT3306', 'DOGAL KAYNAKLAR EKONOMİSİ']
]);

const typoCourseIndexes = new Map();
const courses = [];
const curriculumCourses = [];

allRows.forEach(({ row, courseType }, rowIndex) => {
  const [semester, courseCode, title, theoryHours, practiceHours, labHours, ects] = row;
  const sourceTitle = sourceTitleOverrides.get(courseCode) ?? title;
  const sourceRecordKey = JSON.stringify(['program-343', 'ay33', semester, courseType, courseCode, sourceTitle]);
  const courseId = `course-${snapshot.id}-${courseCode.toLowerCase()}-${rowIndex + 1}`;
  const typoAnomalyId = sourceTitleOverrides.has(courseCode) ? `anomaly-typo-${courseId}` : null;
  courses.push({
    id: courseId,
    institutionId: 'inst-sbu',
    courseCode,
    sourceTitle,
    canonicalTitle: title,
    language: null,
    sourceRecordKey,
    sourceRefs: [snapshot.id],
    verificationStatus: 'source-confirmed',
    anomalyRefs: typoAnomalyId ? [typoAnomalyId] : []
  });
  curriculumCourses.push({
    id: `cc-${courseId}`,
    curriculumId: 'curriculum-iktisat-343-ay33',
    courseId,
    semester,
    courseType,
    requirementGroup: courseType === 'elective' ? `semester-${semester}-elective` : null,
    targetAudience: courseCode.startsWith('IKT') ? 'core' : 'service',
    ects,
    theoryHours,
    practiceHours,
    labHours,
    sourceRefs: [snapshot.id],
    verificationStatus: 'source-confirmed'
  });
  if (typoAnomalyId) typoCourseIndexes.set(courseId, { anomalyId: typoAnomalyId, sourceTitle });
});

const anomalies = [...typoCourseIndexes.entries()].map(([courseId, info]) => ({
  id: info.anomalyId,
  entityType: 'Course',
  entityId: courseId,
  type: 'typo-suspected',
  status: 'open',
  note: `Source title is preserved exactly as “${info.sourceTitle}”; canonicalTitle contains the review candidate.`,
  sourceRefs: [snapshot.id],
  verificationStatus: 'source-confirmed'
}));

const requirementGroups = [3, 4, 5, 6, 7, 8].map(semester => ({
  id: `semester-${semester}-elective`,
  semester,
  selectionCount: semester < 5 ? 3 : 2,
  requiredEcts: semester < 5 ? 15 : 10,
  ruleSource: 'Published curriculum shows a semester elective pool; count is recorded as a reviewable curriculum rule.'
}));

export const academicCatalog = Object.freeze({
  schemaVersion: '1.0.0',
  sources: [{
    id: 'source-sbu-bologna-program-343-ay33',
    title: 'Sağlık Bilimleri Üniversitesi Bologna Bilgi Sistemi — İktisat Lisans Programı Müfredatı',
    sourceType: 'official-university',
    url: 'https://sis.sbu.edu.tr/oibs/bologna/index.aspx?lang=tr&curOp=showPac&curUnit=01&curSunit=343&curCourse=0&curCredit=0&curProg=343&curPac=9d9yYe23q6EJvB04bkLrwg%3d%3d&curAy=33',
    publisher: 'Sağlık Bilimleri Üniversitesi'
  }],
  sourceSnapshots: [snapshot],
  institutions: [{
    id: 'inst-sbu',
    legalName: 'Sağlık Bilimleri Üniversitesi',
    shortName: 'SBÜ',
    countryCode: 'TR',
    sourceRefs: [snapshot.id],
    verificationStatus: 'source-confirmed'
  }],
  programs: [{
    id: 'program-343',
    institutionId: 'inst-sbu',
    canonicalTitle: 'İktisat Lisans Programı',
    sourceTitle: 'İktisat',
    degreeLevel: 'undergraduate',
    sourceSystemIds: { unitId: '01', subunitId: '343', programId: '343', curriculumViewId: '33' },
    sourceRefs: [snapshot.id],
    verificationStatus: 'source-confirmed'
  }],
  curricula: [{
    id: 'curriculum-iktisat-343-ay33',
    programId: 'program-343',
    label: 'AyID=33 yayımlanmış plan',
    academicYearLabel: '2025-2026',
    sourceSystemId: '33',
    semesterCount: 8,
    expectedTotalEcts: 240,
    semesterEctsPublished: [30, 30, 30, 30, 30, 30, 30, 30],
    requirementGroups,
    sourceRefs: [snapshot.id],
    verificationStatus: 'source-confirmed',
    anomalyRefs: []
  }],
  courses,
  curriculumCourses,
  anomalies
});
