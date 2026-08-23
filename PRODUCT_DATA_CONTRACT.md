# EKO Rasathane — Ürün ve veri sözleşmesi

**Durum:** M0 verified — sözleşme kilitli  
**Kapsam:** Şema ve davranış sözleşmesi; uygulama veya tasarım üretimi değildir.

## 1. Tasarım ilkeleri

1. **Kavram önce gelir:** ders ve müfredatlar Atlas kavramlarına rota sağlar; kavram kimliği ders koduna bağlı değildir.
2. **Kaynak kaybolmaz:** resmî değer aynen saklanır; normalleştirilmiş gösterim ayrı alandır.
3. **Bağlam kimliğin parçasıdır:** `courseCode` tek başına benzersiz anahtar değildir.
4. **Kanonik kayıt ve dönemsel açılma ayrıdır:** AKTS/müfredat bilgisi `CurriculumCourse`, gün/saat/derslik `Offering` üzerindedir.
5. **Belirsizlik görünürdür:** anomali veya çelişki sessizce düzeltilmez.
6. **İlerleme kanıta dayanır:** süre veya tıklama tek başına yetkinlik değildir.
7. **Yerel-öncelikli ve taşınabilir:** kullanıcı durumu sürümlü, sıfırlanabilir ve dışa aktarılabilir olmalıdır.

## 2. Kimlik stratejisi

Her nesnenin kalıcı, anlamdan bağımsız dahili `id` alanı vardır. İnsanların gördüğü kodlar değişebilir ve anahtar olarak kullanılmaz.

Önerilen doğal tekillik kuralları:

- `Institution`: `countryCode + institutionSlug`
- `Program`: `institutionId + programCode`
- `Curriculum`: `programId + version`
- `Course`: dahili `id`; kaynak bağlamında `sourceId + sourceRecordKey`
- `CurriculumCourse`: `curriculumId + semester + courseId + requirementGroup`
- `Offering`: `courseId + programId + academicYear + term + section`
- `Concept`: dahili `id` + kalıcı `slug`
- `LearningUnit`: `conceptId + contentVersion + locale`

## 3. Temel varlıklar

### 3.1 Institution

| Alan | Tür | Kural |
|---|---|---|
| `id` | string | Kalıcı dahili kimlik |
| `name` | string | Resmî kurum adı |
| `countryCode` | string | ISO 3166-1 alpha-2 |
| `institutionSlug` | string | URL/dizin gösterimi |
| `verificationStatus` | enum | Doğrulama sözlüğüne uyar |

### 3.2 Program

| Alan | Tür | Kural |
|---|---|---|
| `id` | string | Kalıcı dahili kimlik |
| `institutionId` | ref | `Institution.id` |
| `programCode` | string/null | Kaynakta varsa |
| `sourceTitle` | string | Kaynaktaki özgün başlık |
| `canonicalTitle` | string | Arayüzde normalleştirilmiş başlık |
| `degreeLevel` | enum | bachelor/master/doctorate/other |
| `totalEcts` | number/null | Kaynakta doğrulanmışsa |
| `disciplineTags` | string[] | econometrics/statistics/operations-research vb. |

### 3.3 Curriculum

| Alan | Tür | Kural |
|---|---|---|
| `id` | string | Kalıcı dahili kimlik |
| `programId` | ref | `Program.id` |
| `version` | string | Müfredat sürümü/akademik yıl etiketi |
| `validFrom` / `validTo` | date/null | Geçerlilik aralığı |
| `semesterCount` | integer | BUÜ ilk kümede `8` |
| `sourceRefs` | ref[] | Kaynak snapshot'ları |
| `verificationStatus` | enum | Kayıt düzeyinde durum |

### 3.4 Course

Dersin kurumlar üstü eşdeğer olduğu varsayılmaz. Eşdeğerlik ileride ayrı, kanıt gerektiren bir ilişki olur.

| Alan | Tür | Kural |
|---|---|---|
| `id` | string | Kalıcı dahili kimlik |
| `institutionId` | ref | Kaynak kurumu |
| `courseCode` | string | Kaynak kodu; tek başına benzersiz değil |
| `sourceTitle` | string | Kaynaktaki değer aynen |
| `canonicalTitle` | string | Sessiz düzeltme yapmadan gösterim adı |
| `language` | string/null | Kaynakta varsa |
| `sourceRefs` | ref[] | En az bir kaynak |
| `verificationStatus` | enum | Kayıt düzeyinde durum |
| `anomalyRefs` | ref[] | Açık anomaliler |

### 3.5 CurriculumCourse

| Alan | Tür | Kural |
|---|---|---|
| `id` | string | Kalıcı dahili kimlik |
| `curriculumId` / `courseId` | ref | İlişki uçları |
| `semester` | integer | `1..semesterCount` |
| `courseType` | enum | required/elective |
| `requirementGroup` | string/null | Seçmeli havuz veya grup |
| `ects` | number/null | Bu müfredat bağlamındaki AKTS |
| `theoryHours` | number/null | Haftalık T |
| `practiceHours` | number/null | Haftalık U |
| `labHours` | number/null | Haftalık L |
| `targetAudience` | enum | core/service/mixed/unknown |
| `verificationStatus` | enum | İlişki düzeyinde durum |

Bu ilişki EKO3101 ve EKO3103 gibi benzer alan derslerinin hangi programda çekirdek veya servis dersi olduğunu açıkça taşır.

### 3.6 Concept

| Alan | Tür | Kural |
|---|---|---|
| `id` / `slug` | string | Kurum ve ders kodundan bağımsız |
| `canonicalTitle` | string | Kavram adı |
| `disciplineTags` | string[] | Alan sınıflandırması |
| `prerequisiteConceptIds` | ref[] | Döngüsüz ön koşul grafiği |
| `relatedConceptIds` | ref[] | Yönlü veya türlenmiş ilişki |
| `learningOutcomeIds` | ref[] | Ölçülebilir çıktılar |

### 3.7 LearningUnit

| Alan | Tür | Kural |
|---|---|---|
| `id` / `conceptId` | ref | Kavram bağlantısı |
| `locale` | string | Örn. `tr-TR` |
| `contentVersion` | string | Sürümlü içerik |
| `objective` | string | Ölçülebilir hedef |
| `prerequisites` | ref[] | Gerekli kavram/birimler |
| `explanation` | content | Özgün kısa anlatım |
| `workedExample` | content | Çalışılmış örnek |
| `interactionId` | ref/null | Laboratuvar bağlantısı |
| `checkItems` | ref[] | Kontrol soruları |
| `misconceptions` | content[] | Yaygın yanılgılar |
| `sourceRefs` | ref[] | Kavramsal kaynaklar |
| `reviewStatus` | enum | draft/editorial-review/expert-review/approved |

### 3.8 CourseConceptMap

| Alan | Tür | Kural |
|---|---|---|
| `courseId` / `conceptId` | ref | Ders-Atlas bağlantısı |
| `curriculumId` | ref/null | Eşleme müfredata özgüyse |
| `coverage` | enum | introduced/practiced/mastered |
| `order` | number/null | Önerilen rota sırası |
| `sourceRefs` | ref[] | Haftalık plan/öğrenme çıktısı kanıtı |
| `verificationStatus` | enum | Eşleme düzeyinde durum |

### 3.9 Offering

| Alan | Tür | Kural |
|---|---|---|
| `id` | string | Dönemsel kayıt |
| `courseId` / `programId` | ref | Ders ve hedef program |
| `academicYear` | string | Örn. `2025-2026` |
| `term` | enum | fall/spring/summer |
| `section` | string/null | Şube |
| `instructor` | string/null | Kaynakta gösterildiği biçimde |
| `meetings` | object[] | `day`, `startTime`, `endTime`, `room` |
| `sourceRefs` | ref[] | Ders programı snapshot'ı |
| `verificationStatus` | enum | Dönemsel kayıt durumu |

### 3.10 Source ve SourceSnapshot

| Alan | Tür | Kural |
|---|---|---|
| `id` | string | Kaynak kimliği |
| `authority` | string | Yayımlayan kurum |
| `title` / `url` | string | Resmî başlık ve kararlı URL |
| `sourceRole` | enum | program-package/course-package/schedule/department/platform-content |
| `retrievedAt` | datetime | Erişim zamanı |
| `retrievalPrecision` | enum/null | exact/date; saat kesinliği bilinmiyorsa date |
| `academicYear` | string/null | Kaynağın dönemi |
| `snapshotHash` | string/null | İçerik snapshot özeti |
| `licenseOrUseNote` | string | Kullanım/telif notu |

### 3.11 Anomaly

| Alan | Tür | Kural |
|---|---|---|
| `id` | string | Kalıcı kimlik |
| `entityType` / `entityId` | string/ref | Etkilenen kayıt |
| `type` | enum | duplicate-code/title-conflict/ects-conflict/typo-suspected/source-mismatch/other |
| `sourceValue` | any | Özgün değer |
| `normalizedValue` | any/null | Öneri; kaynak yerine geçmez |
| `status` | enum | open/confirmed/resolved/rejected |
| `resolutionNote` | string/null | İnsan incelemesi |
| `sourceRefs` | ref[] | Kanıt |

İlk anomali adayları: `EKO2004`, `IKT3306`, `EKO4305`, `EKO3310` ve `EKO4115`. Bunlar M2'de resmî kayıtlarla doğrulanmadan otomatik düzeltilmez.

## 4. Doğrulama statüsü

Tüm kaynaklı kayıtlarda:

- `unverified`: aktarıldı, henüz karşılaştırılmadı.
- `source-verified`: belirtilen kaynakla bire bir karşılaştırıldı.
- `cross-verified`: ikinci bağımsız/resmî kaynakla karşılaştırıldı.
- `conflicted`: resmî kaynaklar çelişiyor.
- `deprecated`: daha yeni sürüm nedeniyle kullanım dışı; silinmez.

`verified: true/false` kullanılmaz; hangi doğrulama seviyesinin sağlandığı açıkça belirtilir.

## 5. Stateful ilerleme ve gamification modeli

### 5.1 ProgressEvent

İlerleme türetilmiş değerlerden değil, append-only olaylardan hesaplanır.

| Alan | Tür | Kural |
|---|---|---|
| `id` | string | Tekil/idempotent olay kimliği |
| `occurredAt` | datetime | UTC zaman |
| `localDate` / `timeZone` | string | Günlük seri hesabı için |
| `actorId` | string | Yerel anonim kullanıcı kimliği olabilir |
| `eventType` | enum | learning-check/retrieval-practice/lab-observation/evidence-entry/model-card |
| `subjectId` | ref | Kavram, birim veya çalışma |
| `evidence` | object | Sonuç, deneme, gözlem veya artifact referansı |
| `schemaVersion` | integer | Migration için |

### 5.2 NodeResonanceState

- Seri, yerel takvim gününde en az bir **nitelikli ProgressEvent** ile ilerler.
- Sayfa görüntüleme, scroll veya boş oturum nitelikli olay değildir.
- `currentStreak`, `longestStreak`, `lastQualifiedLocalDate` ve düğüm bazlı tekrar zamanı tutulur.
- Saat dilimi değişiklikleri seriyi yapay biçimde çoğaltamaz.
- Seri kaybı öğrenme içeriğini kilitlemez veya kullanıcıyı utandıran dil üretmez.

### 5.3 ResearchBudgetState

| Alan | Açıklama |
|---|---|
| `capacity` | Mevcut oturum/rota için üst sınır |
| `available` | Görsel işlem gücü bakiyesi |
| `spentByAttempt` | Deneme kimliğine göre tüketim defteri |
| `recoveredByEvidence` | Açıklama, hata analizi veya başarılı tekrar ile geri kazanım |
| `updatedAt` / `schemaVersion` | Deterministik hesap ve migration |

Kurallar:
- Yanlış cevap bütçeyi azaltabilir; açıklamayı okuma + geri çağırma veya hata analizi bütçeyi geri kazandırabilir.
- Aynı deneme iki kez tüketim oluşturmaz.
- Bütçe `0` iken temel içerik, statik alternatif, notlar, kaynaklar ve dışa aktarma açık kalır.
- Bu bir öğrenme geri bildirimi metaforudur; ücret, gerçek kota veya sosyal sıralama değildir.

### 5.4 CompetencyEvidence ve CompetencyState

İki başlangıç boyutu:

- `dataEngineering`: veri kaynağı/provenance, doğrulama, dönüştürme, tekrar üretilebilirlik.
- `statisticalSharpness`: varsayım, tahmin, belirsizlik, diagnostik ve yorumlama.

Her değişim bir `CompetencyEvidence` kaydına dayanır: `rubricId`, `dimension`, `level`, `artifactRef`, `awardedAt`, `explanation`. Arayüz barı bu kanıtlardan türetilir; gizli puan veya yalnız geçirilen süre kullanılmaz.

## 6. Veri bütünlüğü kapıları

M2 uygulamasında en az şu kontroller zorunludur:

1. Referans verilen her `institutionId`, `programId`, `curriculumId`, `courseId` ve `conceptId` vardır.
2. Aynı kaynak kaydı iki dahili derse sessizce bölünmez.
3. Duplicate `courseCode` kayıtları bağlam ve anomali olmadan reddedilir.
4. `sourceTitle` normalizasyon sırasında değişmez.
5. `semester`, müfredatın `semesterCount` aralığındadır.
6. Offering toplantı saatleri geçerli ve `endTime > startTime`dır.
7. Kaynaklı her görünür kayıt en az bir `sourceRef` taşır.
8. `conflicted` kayıtlar arayüzde verified gösterilmez.
9. Atlas ön koşul grafiğinde döngü yoktur.
10. Progress event kimlikleri idempotenttir; tekrar işleme sonucu değiştirmez.

## 7. M0 onay kapısı

Bu belge onaylandığında M2'ye geçiş için aşağıdakiler kilitlenmiş sayılır:

- kurumdan bağımsız Atlas omurgası,
- BUÜ'nün ilk doğrulama alanı olması,
- EKO3101/EKO3103 bağlam ayrımı,
- kanonik ve dönemsel veri ayrımı,
- kaynak/anomali/doğrulama modeli,
- cezalandırıcı olmayan stateful ilerleme ilkeleri,
- `Veriden Modele` ilk rota yönü.

Şema alanlarında uygulama sırasında zorunlu teknik değişiklik gerekirse bu belge sessizce değiştirilmez; migration notu ve karar kaydıyla güncellenir.
