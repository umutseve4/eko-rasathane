export const VERIFICATION_STATUSES = Object.freeze([
  'unverified',
  'source-verified',
  'cross-verified',
  'conflicted',
  'deprecated'
]);

export const academicCatalog = Object.freeze({
  sources: [
    {
      id: 'src-buu-program-package',
      authority: 'Bursa Uludağ Üniversitesi',
      title: 'Ekonometri Program Bilgi Paketi',
      url: 'https://bilgipaketi.uludag.edu.tr/Programlar/Detay/343?AyID=23',
      sourceRole: 'program-package',
      licenseOrUseNote: 'Resmî kayıt yalnız provenance ve doğrulama amacıyla referanslanır.'
    },
    {
      id: 'src-buu-eko3103-course-package',
      authority: 'Bursa Uludağ Üniversitesi',
      title: 'TEMEL EKONOMETRİ I Ders Öğretim Planı',
      url: 'https://bilgipaketi.uludag.edu.tr/Ders/Index/1236601',
      sourceRole: 'course-package',
      licenseOrUseNote: 'Resmî kayıt yalnız provenance ve doğrulama amacıyla referanslanır.'
    }
  ],
  sourceSnapshots: [
    {
      id: 'snap-buu-program-2026-08-23',
      sourceId: 'src-buu-program-package',
      retrievedAt: '2026-08-23T00:00:00Z',
      retrievalPrecision: 'date',
      academicYear: null,
      snapshotHash: null
    },
    {
      id: 'snap-buu-eko3103-2026-08-23',
      sourceId: 'src-buu-eko3103-course-package',
      retrievedAt: '2026-08-23T00:00:00Z',
      retrievalPrecision: 'date',
      academicYear: null,
      snapshotHash: null
    }
  ],
  institutions: [
    {
      id: 'inst-buu',
      name: 'Bursa Uludağ Üniversitesi',
      countryCode: 'TR',
      institutionSlug: 'bursa-uludag-universitesi',
      sourceRefs: ['snap-buu-program-2026-08-23'],
      verificationStatus: 'source-verified'
    }
  ],
  programs: [
    {
      id: 'prog-buu-ekonometri-lisans',
      institutionId: 'inst-buu',
      programCode: '343',
      sourceTitle: 'Ekonometri',
      canonicalTitle: 'Ekonometri Lisans Programı',
      degreeLevel: 'bachelor',
      totalEcts: 240,
      disciplineTags: ['econometrics', 'statistics'],
      sourceRefs: ['snap-buu-program-2026-08-23'],
      verificationStatus: 'source-verified'
    }
  ],
  curricula: [
    {
      id: 'curr-buu-ekonometri-current',
      programId: 'prog-buu-ekonometri-lisans',
      version: 'current-source-snapshot-2026-08-23',
      validFrom: null,
      validTo: null,
      semesterCount: 8,
      sourceRefs: ['snap-buu-program-2026-08-23'],
      verificationStatus: 'unverified'
    }
  ],
  courses: [
    {
      id: 'course-buu-eko3101',
      institutionId: 'inst-buu',
      courseCode: 'EKO3101',
      sourceRecordKey: 'program-343:EKO3101',
      sourceTitle: 'EKO3101',
      canonicalTitle: 'Ekonometri çekirdek dersi (başlık doğrulama bekliyor)',
      language: null,
      sourceRefs: ['snap-buu-program-2026-08-23'],
      verificationStatus: 'unverified',
      anomalyRefs: []
    },
    {
      id: 'course-buu-eko3103',
      institutionId: 'inst-buu',
      courseCode: 'EKO3103',
      sourceRecordKey: 'course-package:1236601',
      sourceTitle: 'TEMEL EKONOMETRİ I',
      canonicalTitle: 'Temel Ekonometri I',
      language: 'tr-TR',
      sourceRefs: ['snap-buu-eko3103-2026-08-23'],
      verificationStatus: 'conflicted',
      anomalyRefs: ['anomaly-buu-eko3103-ects']
    }
  ],
  curriculumCourses: [
    {
      id: 'cc-buu-current-s5-eko3101-core',
      curriculumId: 'curr-buu-ekonometri-current',
      courseId: 'course-buu-eko3101',
      semester: 5,
      courseType: 'required',
      requirementGroup: 'core',
      ects: null,
      theoryHours: null,
      practiceHours: null,
      labHours: null,
      targetAudience: 'core',
      sourceRefs: ['snap-buu-program-2026-08-23'],
      verificationStatus: 'unverified'
    }
  ],
  anomalies: [
    {
      id: 'anomaly-buu-eko3103-ects',
      entityType: 'Course',
      entityId: 'course-buu-eko3103',
      type: 'ects-conflict',
      sourceValue: [5, 6],
      normalizedValue: null,
      status: 'open',
      resolutionNote: null,
      sourceRefs: ['snap-buu-eko3103-2026-08-23'],
      verificationStatus: 'conflicted'
    }
  ]
});
