# EKO Rasathane — Kanıt kapılı roadmap

Bu roadmap `planned`, `implemented`, `tested`, `verified`, `deployed` ve `production-ready` statülerini birbirine karıştırmaz.

## M0 · Ürün ve veri sözleşmesi — in review

**Amaç:** EKO Rasathane'yi tek ders/kurum prototipinden ekonometri camiası için kurumdan bağımsız bir ekosisteme bağlayan sözleşmeyi kilitlemek.

Teslimatlar:
- Ekonometri çekirdek, servis dersleri ikinci halka hedef kitle tanımı.
- Atlas, Program Haritaları, Ekonometri Laboratuvarı ve Araştırma Masası ürün katmanları.
- Ders kodu bağımsız `Veriden Modele` ilk kavram rotası.
- EKO3101/EKO3103 program bağlamı ayrımı.
- Kaynak, doğrulama, anomali ve offering modeli.
- Node Resonance, Araştırma Bütçesi ve yetkinlik sinyalleri için davranış sözleşmesi.

Kabul kapısı:
- README, roadmap, kaynak sicili ve veri sözleşmesi aynı kapsamı ifade eder.
- BUÜ yalnız ilk doğrulama alanı; EKO3103 yalnız örnek fixture olarak tanımlanır.
- Gamification temel içeriği kilitlemez ve yalnız anlamlı etkinliği ödüllendirir.
- Umut'un ürün sözleşmesi onayı alınır.

## M1 · Mevcut kalite borcu — partially verified

Implemented/tested:
- Course-first dikey dilim.
- Unit/statik CI tabanı.
- Chromium Playwright kalite kapısı: kritik navigasyon, quiz/not/ilerleme kalıcılığı, legacy migration, 404, reset, 320 px overflow, skip-link/focus ve reduced-motion.

Açık doğrulama:
- Güncel `main` CI sonucunun post-merge kanıtı.
- GitHub Pages deployed SHA kanıtı ve canlı içerik imzası.
- Testlerin ders kimliğinden bağımsız fixture yapısına hazırlanması.

Kabul kapısı:
- Kritik rotalar `%100` geçer.
- `320 px` yatay taşma `0`dır.
- Klavye akışı ve reduced-motion işlev paritesi doğrulanır.
- Canlı commit kesin olarak bilinir.

## M2 · Kanonik katalog ve Atlas omurgası — planned

Teslimatlar:
- 8 yarıyıllık BUÜ Ekonometri katalog aktarımı.
- Zorunlu/seçmeli kayıtlarıyla sürümlü müfredat modeli.
- Kurum + program + müfredat + dahili ders kimliği.
- `sourceTitle` ve `canonicalTitle` ayrımı.
- Kaynak snapshot/hash, erişim tarihi, doğrulama statüsü ve anomali sicili.
- EKO3101/EKO3103 bağlam ayrımı.
- `Veriden Modele` kavram düğümleri ve ders-kavram eşlemeleri.
- Gün/saat/derslik için kanonik dersten ayrı offering katmanı.

Kabul kapısı:
- Yeni kurum/program eklemek navigasyon kodunu değiştirmez.
- Her görünen kayıt kaynak ve doğrulama statüsü taşır.
- Aynı ders kodunun farklı bağlamları veri kaybı olmadan tutulur.
- Duplicate-code, referential-integrity ve kaynak bütünlüğü testleri geçer.
- Belirsiz kayıtlar verified gösterilmez.

## M3 · Bilgi mimarisi ve öğrenme şablonu — planned

Akışlar:
- Program → sınıf → dönem → ders → konu → çalışma adımı.
- Atlas → kavram → ön koşullar → öğrenme adımı → ilişkili dersler.

Her öğrenme birimi:
- öğrenme hedefi,
- ön koşul,
- kısa özgün anlatım,
- çalışılmış örnek,
- etkileşim veya statik görsel açıklama,
- kontrol sorusu,
- yaygın yanılgı,
- özet ve kaynak.

Kabul kapısı:
- Ana sayfadan hedef konuya en fazla `3` anlamlı etkileşim.
- Son çalışılan konuya en fazla `2` etkileşim.
- `5` kişilik görev testinde ders/kavram bulma başarısı en az `%80`.

## M4 · Tasarım sistemi — planned

Yön:
- Navigasyon: Akademik Rasathane.
- Okuma: Editoryal Dijital Kampüs.
- Etkileşim: Ekonometri Laboratuvarı.

Teslimatlar:
- Tipografi, renk ve boşluk tokenları.
- Grid, yüzey ve durum sistemi.
- Focus/hover/active, yükleniyor/boş/hata/kilitli/tamamlandı durumları.
- Ana/keşif, program/Atlas ve ders/konu ekran prototipleri.

Kabul kapısı:
- Metin kontrastı en az `4.5:1`.
- Kritik otomatik erişilebilirlik ihlali `0`.
- `320–1440 px` arasında yatay taşma `0`.
- Üç temel ekran görsel incelemeden geçer.

## M5 · Stateful ilerleme ve retention — planned

Teslimatlar:
- Node Resonance anlamlı etkinlik kuralı ve seri durumu.
- Araştırma Bütçesi kazanım, tüketim ve geri kazanım kuralları.
- Veri Mühendisliği / İstatistiksel Keskinlik yetkinlik kanıtları.
- Durum sürümleme, migration, sıfırlama ve dışa aktarma.

Kabul kapısı:
- Yalnız sayfa açmak ilerleme üretmez.
- Bütçe `0` olduğunda temel içerik ve erişilebilirlik işlevleri kullanılabilir kalır.
- Aynı olayın iki kez işlenmesi ilerlemeyi iki kez artırmaz.
- Saat dilimi ve gün sınırı davranışı test edilir.
- Kullanıcı her barın neden değiştiğini görebilir.

## M6 · Motion ve ilk pedagojik laboratuvar — planned

İlk laboratuvar: regresyon ve aykırı gözlem.

Kabul kapısı:
- Her hareketin belgelenmiş UX veya öğrenme amacı vardır.
- Reduced-motion modunda dekoratif otomatik hareket `0`dır.
- Navigasyon animasyon beklemez.
- Statik ve klavye ile kullanılabilir alternatif vardır.
- `5` kullanıcıdan en az `4`ü gözlenen etkiyi doğru açıklar.

## M7 · Araştırma Masası — planned

Teslimatlar:
- Hipotez, veri kaynağı, model seçimi, varsayım kontrolleri, sonuç ve sınırlılık kaydı.
- Gizlilik güvenli Model Card/analiz raporu dışa aktarma.

Kabul kapısı:
- Eksik kaynak veya sınırlılık beyanı olan çalışma tamamlanmış gösterilmez.
- Dışa aktarılan rapor yeniden üretim için gerekli provenance alanlarını taşır.

## M8 · Performans, güvenlik ve görsel doğrulama — planned

Kabul kapısı:
- Mobil p75 LCP `≤2.5 saniye`.
- Mobil p75 INP `≤200 ms`.
- CLS `≤0.1`.
- Kritik rotalar Chrome, Firefox ve WebKit'te `%100` geçer.
- İlk rota JavaScript bütçesi `≤75 KB gzip`.
- Toplam başlangıç aktarımı `≤500 KB`.

## M9 · Kapalı pilot — planned

Kapsam: `15–25` öğrenci; ardından öğretim elemanı/içerik uzmanı incelemesi.

Kabul kapısı:
- İlk ders/kavram açma başarısı `≥%90`.
- Medyan ilk hedef bulma süresi `≤30 saniye`.
- Quiz/not görevi başarısı `≥%90`.
- İlk Model Card oluşturma `≥%60`.
- Medyan ilk Model Card süresi `<20 dakika`.

## Açıkça kapsam dışı

Yetkilendirilene kadar: UKEY kimlik bilgisi saklama/scraping, not çekme, izinsiz ders materyali, kamuya açık not liderlik tablosu, proctoring, herkese açık yükleme pazarı ve amaçsız genel AI sohbeti.
