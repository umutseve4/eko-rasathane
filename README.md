# EKO Rasathane

EKO Rasathane, **ekonometri camiası için yaşayan bir öğrenme, uygulama ve araştırma ekosistemi** olmayı hedefler. Bir ders notu sitesi değildir.

İlk doğrulama alanı Bursa Uludağ Üniversitesi (BUÜ) Ekonometri programıdır. Ürün modeli tek üniversiteye, sınıfa veya ders koduna bağlı değildir; BUÜ verisi kurumdan bağımsız mimarinin ilk gerçek veri kümesidir.

## Ürün vaadi

Kullanıcı üç yoldan ilerleyebilir:

1. **Programımı takip et:** kurum, program, müfredat, dönem ve ders rotası.
2. **Bir kavramı öğren:** ders kodundan bağımsız Atlas kavram ağı.
3. **Bir modeli dene veya araştır:** etkileşimli laboratuvar ve kanıt odaklı araştırma masası.

## Hedef kitle

- Çekirdek: ekonometri öğrencileri, öğretim elemanları, mezunlar ve araştırmacılar.
- İkinci halka: iktisat, istatistik, veri analizi ve ilgili programlarda ekonometri/istatistik servis dersi alanlar.
- İlk doğrulama alanı: BUÜ Ekonometri lisans programı.

## Ürün katmanları

### Atlas

Kurumdan ve ders kodundan bağımsız kavram ağı. İlk çapraz rota **Veriden Modele** olacaktır:

`betimsel istatistik → olasılık ve çıkarım → doğrusal cebir → basit regresyon → çoklu regresyon → varsayımlar ve diagnostik → tahmin ve belirsizlik → nedensellik sınırları → zaman serilerine geçiş`

### Program Haritaları

Üniversite, program, müfredat sürümü, yarıyıl, zorunlu/seçmeli ders ve AKTS görünümü. BUÜ Bologna Bilgi Paketi kanonik program kaynağıdır; ders programlarındaki gün/saat/derslik verisi ayrı dönemsel açılma kaydıdır.

### Ekonometri Laboratuvarı

Parametreleri değiştirerek matematiksel ve istatistiksel ilişkileri görünür kılan erişilebilir demonstratörler. WebGL zorunlu değildir; temel işlev statik alternatif ve klavye ile kullanılabilir kalmalıdır.

### Araştırma Masası

Hipotez, veri kaynağı, model seçimi, varsayım kontrolleri, sonuçlar ve sınırlılıklar üzerinden kanıt üretimi; ileride dışa aktarılabilir Model Card/analiz raporu.

## Kilitli ürün kararları

| Karar | Sözleşme |
|---|---|
| Hedef kitle | Ekonometri çekirdek; servis dersleri ikinci halka |
| İlk içerik rotası | Ders kodu bağımsız **Veriden Modele** Atlas rotası |
| EKO3101 / EKO3103 | Ayrı program bağlamları ve kaynaklarıyla etiketlenir; hiçbirinin üzerine bütün ürün kurulmaz |
| Görsel yön | Akademik Rasathane + Editoryal Dijital Kampüs; etkileşimlerde Ekonometri Laboratuvarı |
| Hareket | Orta yoğunluk; yalnız hiyerarşi veya matematiksel ilişkiyi açıklayan hareket |
| Program özelliği | Kanonik Bologna kataloğu + ayrı offering katmanında gün/saat/derslik |

## İlerleme ve retention sözleşmesi

Gamification akademik davranışı destekler; puan avcılığına veya cezalandırıcı içerik kilidine dönüşmez.

- **Node Resonance:** anlamlı günlük öğrenme/araştırma etkinliğinin sürekliliği. Sadece sayfa açmak seri üretmez.
- **Araştırma Bütçesi:** deneme, hata analizi ve tekrar döngüsünü görünür kılan geri kazanılabilir işlem gücü metaforu. Bütçenin bitmesi temel içeriği, erişilebilirliği veya veri dışa aktarmayı engellemez.
- **Yetkinlik sinyalleri:** puan yerine **Veri Mühendisliği** ve **İstatistiksel Keskinlik** barları. Barlar süreye değil doğrulanabilir görevlere, tekrar başarısına ve üretilen kanıta dayanır.
- İlerleme durumu yerel ve açıklanabilir olmalı; kullanıcı sıfırlayabilmeli ve dışa aktarabilmelidir.

## Tasarım ve hareket politikası

- Karanlık SaaS estetiği hedef değil, bilimsel okunabilirliği destekleyen bir yüzey dilidir.
- Neon, glass ve bento ölçülü araçlardır; ürün kimliğinin yerine geçmez.
- Standart cursor, görünür focus, klavye akışı ve `prefers-reduced-motion` zorunludur.
- Hareket uygulaması mevcut teknolojiyle uyumlu seçilir. Framer Motion ancak uygulama mimarisi React tabanlıysa değerlendirilir; sırf animasyon için framework göçü yapılmaz.
- WebGL kapalıyken temel işlev kaybı hedefi `%0`dır.

## Mevcut dikey dilim

**3. sınıf → EKO3103 TEMEL EKONOMETRİ I → 7 konuluk hazırlık rotası**, teknik ve pedagojik bir örnek/fixture'dır; ürün kapsamı değildir. BUÜ kayıtlarındaki `5 / 6 AKTS` çelişkisi kaynak anomalisi olarak korunur, sessizce düzeltilmez.

GitHub Pages uyumu için mevcut prototip hash route kullanır: `#/`, `#/program`, `#/sinif/:id`, `#/ders/:id`, `#/ders/:id/konu/:id`, `#/atlas`, `#/atlas/kavram/:conceptId`.

### M3 Atlas ve öğrenme şablonu

M3'te ilk `7` konu, ilk `7` Atlas kavramıyla aynı kanonik öğrenme birimlerine bağlandı. Program ve Atlas akışları görünür `8/8` öğrenme şablonunda yakınsar; ana sayfa son çalışılan konuya dönüş kısayolu sunar.

Bu dilim, uzun vadeli **Veriden Modele** Atlas vizyonunun tamamı değildir. Uygulama ve otomatik kalite kapıları exact merge SHA `a02c711721f8d11be5064e701c854ab34ba01714` üzerinde verified ve deployed durumundadır. `5` gerçek katılımcının en az `4`'ünün ders/kavram bulma görevini tamamlaması gereken kullanılabilirlik kapısı açık olduğundan ürün production-ready değildir.

Teknik kapsam ve doğrulama ayrıntıları için [`docs/m3-information-architecture.md`](docs/m3-information-architecture.md) ve [`docs/m3-usability-test.md`](docs/m3-usability-test.md) dosyalarına bakın.

## Durum dili

- **Planned:** kabul edilmiş, henüz uygulanmamış.
- **Implemented:** kod veya içerik üretilmiş.
- **Tested:** otomatik ya da manuel testten geçmiş.
- **Verified:** kabul ölçütü bağımsız kanıtla doğrulanmış.
- **Deployed:** belirli commit'in canlıya çıktığı kanıtlanmış.
- **Production-ready:** güvenlik, içerik, erişilebilirlik, performans ve gerçek kullanıcı doğrulaması tamamlanmış.

M3'ün ilk `7` kavramlık dikey dilimi implemented, tested, verified ve deployed durumundadır. Kapsamlı Atlas, 8 yarıyıllık kanonik katalog, retention sistemi ve araştırma akışı hâlâ planned durumundadır. `5` gerçek katılımcı kapısı tamamlanmadığı için ürün production-ready değildir.

## Veri ve kaynak sözleşmesi

Ayrıntılı şema, kimlik, kaynak izlenebilirliği, doğrulama statüleri ve gamification durum modeli için [`PRODUCT_DATA_CONTRACT.md`](PRODUCT_DATA_CONTRACT.md) dosyasına bakın. Resmî kaynak rolleri [`SOURCES.md`](SOURCES.md) içinde tutulur.

## Yerel doğrulama

```bash
npm run verify
```

## Gizlilik ve içerik ilkesi

- UKEY/UNİSİS kimlik bilgisi istenmez ve izinsiz scraping yapılmaz.
- Telifli kitap, slayt, sınav veya cevap anahtarı kopyalanmaz.
- Özgün anlatım, örnek, quiz ve demonstratörler platform içeriğidir.
- İlerleme, quiz ve notlar mevcut prototipte yalnız tarayıcının `localStorage` alanında tutulur.

## Lisans

MIT

## Akademik program (M2)

`#/program`, resmî 2025–2026 güz ve bahar programlarından çıkarılan `164` EKO kaydını (`108` I. öğretim, `56` II. öğretim) gösterir. Basılı alanlar değiştirilmez; kanonik katalogla uzlaştırma sonucu her kayıtta açıkça saklanır.

Bölüm filtresi ham basılı ders kodunu kararlı değer olarak kullanır ve kullanıcıya doğrulanmış tam adlarını gösterir: Çalışma Ekonomisi ve Endüstri İlişkileri, Ekonometri, İktisat, İşletme, Maliye, Siyaset Bilimi ve Kamu Yönetimi ve Uluslararası İlişkiler. `TUD` ve `YAD` gerçek fakülte bölümü olarak doğrulanmadığı için yalnız seçici seçeneklerinden çıkarılır; ilgili `8` kaynak kaydı silinmez ve “Tümü” görünümünde korunur.
