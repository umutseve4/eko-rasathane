# Resmî kaynak sicili

EKO Rasathane resmî içeriği yeniden yayımlamak yerine kaynağa bağlanır; yalnız gerekli olgusal program metadatasını kullanır. Bursa Uludağ Üniversitesi (BUÜ) verisi ürün kapsamı değil, ilk doğrulama veri kümesidir.

## Kaynak rolleri

| Rol | Kanonik kullanım | Kullanılmayacağı alan |
|---|---|---|
| Program Bilgi Paketi | Müfredat sürümü, ders kodu/adı/türü, yarıyıl, T/U/L ve AKTS | Güncel gün/saat/derslik varsayımı |
| Ders Bilgi Paketi | Haftalık kapsam, öğrenme çıktıları, iş yükü, ön koşul | Programdaki bütün derslerin varlığı |
| Ders programı | Akademik yıl/dönem, şube, gün, saat, derslik, öğretim elemanı | Kalıcı müfredat ve kanonik AKTS |
| Bölüm/fakülte sayfası | Duyuru ve resmî bağlantı keşfi | Tek başına kanonik ders kaydı |

## 2025-2026 kanonik müfredat kaynağı

| Alan | Değer |
|---|---|
| Resmî kaynak | [BUÜ Ekonometri Program Bilgi Paketi](https://bilgipaketi.uludag.edu.tr/Programlar/Detay/343?AyID=33) |
| Sürüm parametresi | `AyID=33` |
| Akademik yıl | `2025-2026` |
| Erişim zamanı | `2026-08-23T19:03:28Z` |
| HTTP sonucu | `200` |
| Snapshot boyutu | `108070` bayt |
| Resmî HTML SHA-256 | `0b72d3ba7919492cce571d697902dff1ca20d6e0ef67dcbdf3f53f5b6acee1c6` |
| Aktarılan kapsam | `8` yarıyıl, `41` zorunlu ders satırı, `103` seçmeli aday satırı, toplam `144` ilişki |

Ham HTML araştırma dalında tutulur; ürün dalında yalnız olgusal fixture, provenance ve yeniden üretilebilir normalize kanıt tutulur.

## Taşınabilir kanıt dosyaları

| Dosya | Rol |
|---|---|
| `evidence/program-343-ay33.rows.tsv` | AyID=33 resmî HTML tablosundan normalize edilmiş satır snapshot'ı |
| `evidence/program-343-ay23.rows.tsv` | AyID=23 tarihsel karşılaştırma snapshot'ı |
| `evidence/hashes.sha256` | Resmî HTML ve araştırma çıktılarının SHA-256 sicili |
| `evidence/program-343-ay23-vs-ay33.diff.json` | Makinece okunabilir tarihsel fark |
| `evidence/program-343-ay23-vs-ay33.diff.md` | Aynı farkın insan-okur özeti ve metodolojisi |

TSV ayrıştırıcısı aktif yarıyılı “N. Yarıyıl Dersleri” / “N. Yarıyıl Seçmeli Dersleri” başlıklarından izler; yalnız yedi alanlı, kodu dolu ve türü `Zorunlu` veya `Seçmeli` olan satırları ders kabul eder. Böylece program yeterlilik metni, tablo başlıkları, `Toplam`, dipnot ve boş kodlu seçmeli yönlendirme satırları dışarıda kalır. Fixture eşleştirmesi yarıyıl, kod, kaynak başlığı, tür, T, U, L ve AKTS alanlarının tamamında yapılır.

### Yeniden üretme ve doğrulama

- `npm run evidence:generate` AyID=23 → AyID=33 JSON ve Markdown farklarını deterministik olarak yeniden üretir.
- `npm run evidence:verify` dosya yazmadan AyID=33 evidence/fixture uzlaşmasını ve committed fark artifact'larını byte-for-byte doğrular.
- Beklenen AyID=33 uzlaşması: evidence `144`, fixture `144`, missing `0`, extra `0`.
- Beklenen AyID=23 → AyID=33 farkı: historical `122`, current `144`, unchanged `71`, added `73`, removed `51`.

AyID=23 → AyID=33 tarihsel farkı exact structural row multiset yöntemiyle üretilir; belirsiz yeniden adlandırma veya kod değişikliği eşleşmeleri türetilmez. AyID=23 snapshot'ında `122`, AyID=33 snapshot'ında `144` ders satırı vardır; `71` satır aynen korunmuş, `73` satır eklenmiş ve `51` satır kaldırılmıştır. Değişen bir satır bir kaldırma ve bir ekleme olarak raporlanır.

## Seçmeli yük kuralı

3–8. yarıyılların her birinde resmî tabloda `10 AKTS` seçmeli yük bulunur. Her aday ders `5 AKTS` olduğundan her grupta `2` ders seçilir. “Seçmeli dersler için tıklayınız” satırları ders değildir; sahte `Course` üretilmemiştir.

## Doğrulanmış kaynak anomalileri

- Program metadata'sı `240 AKTS` bildirir; yayımlanan yarıyıl toplamları `31 + 7×30 = 241 AKTS` eder. İki değer de korunmuş, `ects-conflict` anomalisi açılmıştır.
- `EKO2004`, `IKT3306` ve `EKO4305` aynı kodla farklı başlıklarda yayımlanmıştır; kayıtlar birleştirilmemiş ve `duplicate-code` anomalileriyle ilişkilendirilmiştir.
- `EKO3310` için `PYHTON UYGULAMALARI`, `EKO4115` için `ÖNRAPORLAMA TEKNİKLERİ` ve `IKT3306` için `DOGAL KAYNAKLAR EKONOMİSİ` kaynak yazımları aynen korunmuş ve `typo-suspected` olarak işaretlenmiştir.

## Bölüm seçici sözlüğü

Bölüm adları [BUÜ İktisadi ve İdari Bilimler Fakültesi](https://uludag.edu.tr/iibf) bölüm envanteriyle, kodlar ise `2025-2026` ders programındaki basılı ders kodlarıyla eşleştirilir. Bu sözlük yalnız sunum katmanıdır; `printedCourseCode`, `sourceTitle` veya diğer kaynak alanlarını değiştirmez.

| Ham kod | Gösterilen tam ad | Kayıt |
|---|---|---:|
| `CAL` | Çalışma Ekonomisi ve Endüstri İlişkileri | `18` |
| `EKO` | Ekonometri | `64` |
| `IKT` | İktisat | `33` |
| `ISL` | İşletme | `21` |
| `MLY` | Maliye | `16` |
| `KAM` | Siyaset Bilimi ve Kamu Yönetimi | `1` |
| `ULU` | Uluslararası İlişkiler | `3` |

Basılı kod envanterindeki `TUD` (`2` kayıt) ve `YAD` (`6` kayıt) doğrulanmış fakülte bölümü değildir. Bu `8` kayıt yalnız bölüm seçicisinden çıkarılır; fixture'da ve “Tümü” görünümünde aynen kalır. Böylece seçici yalnız `7` doğrulanmış bölüm sunarken toplam `164` kayıt korunur.

## Tarihsel ve keşif kaynakları

| Kaynak | Dönem | Durum |
|---|---|---|
| [BUÜ Program Bilgi Paketi `AyID=23`](https://bilgipaketi.uludag.edu.tr/Programlar/Detay/343?AyID=23) | `2015-2016` | Tarihsel snapshot; current fixture değildir; HTML SHA-256 `6b1fc3315767a7a2d6fb9c2d44d9418c922a4bdf796910aa4b89d92817856e39` |
| [İİBF Eğitim Planı](https://uludag.edu.tr/iibf/default/konu/1403) | Bağlantı hedefi `AyID=23` | Güncel başlık altında eski sürüme yönlendirdiği için current kanıtı olarak kullanılmaz |
| [Ekonometri Bölümü](https://uludag.edu.tr/ekonometri) | Dönemsel | Schedule keşfi; katalog kaynağı değildir |

## İçerik ve erişim ilkesi

- Üniversite ile resmî bağlılık iddia edilmez.
- Telifli slayt, kitap, sınav veya çözüm anahtarı depolanmaz.
- Kaynak değişiklikleri snapshot hash + insan incelemesiyle sürümlenir.
- Kaynaktaki yazım sessizce düzeltilmez; `sourceTitle` aynen korunur.
- UKEY/UNİSİS parolaları istenmez; izinsiz erişim yapılmaz.
