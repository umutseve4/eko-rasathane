# Resmî kaynak sicili

EKO Rasathane resmî içeriği yeniden yayımlamak yerine kaynağa bağlanır; yalnız gerekli olgusal program metadatasını ve kaynağı belirtilmiş kısa alıntıları kullanır. BUÜ kaynakları ürün kapsamı değil, ilk doğrulama veri kümesidir.

## Kaynak rolleri

| Rol | Kanonik kullanım | Kullanılmayacağı alan |
|---|---|---|
| Program Bilgi Paketi | Müfredat sürümü, ders kodu/adı/türü, yarıyıl, AKTS, program yeterlilikleri | Güncel gün/saat/derslik varsayımı |
| Ders Bilgi Paketi | Haftalık kapsam, öğrenme çıktıları, iş yükü, ön koşul | Programdaki bütün derslerin varlığı |
| Ders programı | Akademik yıl/dönem, hedef program, şube, gün, saat, derslik, öğretim elemanı | Kalıcı müfredat ve kanonik AKTS |
| Bölüm/fakülte sayfası | Duyuru ve resmî bağlantı keşfi | Tek başına kanonik ders kaydı |
| Platform içeriği | Özgün anlatım, örnek, quiz ve demonstratör | Resmî kurum içeriği gibi sunum |

## İlk kaynak kümesi

| Kaynak | Rol | Kapsam | Erişim tarihi | Doğrulama notu |
|---|---|---|---|---|
| [BUÜ Ekonometri Program Bilgi Paketi](https://bilgipaketi.uludag.edu.tr/Programlar/Detay/343?AyID=23) | Program Bilgi Paketi | `240 AKTS`, mezuniyet koşulları, `12` program yeterliliği, 8 yarıyıllık ders planı | 2026-08-23 | M2 kanonik katalog girdisi; satır düzeyi karşılaştırma henüz planned |
| [İİBF Eğitim Planı](https://uludag.edu.tr/iibf/default/konu/1403) | Fakülte/eğitim planı | Ekonometri eğitim planı ve ders içerikleri girişleri | 2026-08-23 | İkincil resmî karşılaştırma kaynağı |
| [Ekonometri Bölümü](https://uludag.edu.tr/ekonometri) | Bölüm sayfası | Bölüm duyuruları, ders ve sınav programları | 2026-08-23 | Dönemsel schedule keşfi |
| [BUÜ ana sayfası](https://uludag.edu.tr/) | Kurum bağlantı dizini | Akademik takvim, UNİSİS, UKEY ve kütüphane bağlantıları | 2026-08-23 | Katalog kaynağı değildir |

## Provenance zorunluluğu

Her snapshot için ileride şu metadata tutulacaktır:

- resmî başlık ve kararlı URL,
- yayımlayan kurum,
- kaynak rolü,
- akademik yıl/dönem,
- erişim zamanı,
- içerik hash'i,
- insan inceleme durumu,
- varsa çelişki/anomali bağlantıları.

## Bilinen anomali adayları

`EKO2004`, `IKT3306`, `EKO4305`, `EKO3310` ve `EKO4115` kayıtları M2 sırasında kaynak satırı düzeyinde incelenecektir. Kaynak yazımı `sourceTitle`/`sourceValue` olarak korunur; doğrulanmamış düzeltme kanonik gerçek gibi yayımlanmaz.

## İçerik ve erişim ilkesi

- Üniversite ile resmî bağlılık iddia edilmez.
- Telifli slayt, kitap, sınav veya çözüm anahtarı izinsiz depolanmaz.
- Kaynak değişiklikleri snapshot hash + insan onayıyla sürümlenir.
- UKEY/UNİSİS parolaları istenmez; izinsiz scraping yapılmaz.
