# M3 · Bilgi mimarisi ve öğrenme şablonu

## Uygulanan kapsam

M3, Program ve Atlas keşif yollarını aynı kanonik öğrenme biriminde birleştirir.

- Program akışı: Program → sınıf → dönem → ders → konu → çalışma adımı.
- Atlas akışı: Atlas → kavram → ön koşullar → öğrenme adımı → ilişkili dersler.
- Atlas rotaları:
  - `#/atlas`
  - `#/atlas/kavram/:conceptId`
- İlk uygulanmış Atlas dilimi: `7` kavram ve bunlara bağlı `7` öğrenme birimi.

Bu dilim, uzun vadeli “Veriden Modele” Atlas vizyonunun tamamı değildir; kanonik katalogla bağlanmış ilk doğrulanabilir uygulama dilimidir.

## Öğrenme birimi sözleşmesi

Her kanonik öğrenme ekranı görünür olarak `8/8` bölüm sunar:

1. Öğrenme hedefi
2. Ön koşul
3. Kısa özgün anlatım
4. Çalışılmış örnek
5. Etkileşim veya statik görsel açıklama
6. Kontrol sorusu
7. Yaygın yanılgı
8. Özet ve kaynak

## Durum ve migration

- M3 anahtarı: `eko:m3:v1`
- Şema: `{ version: 1, lastUnitId }`
- Legacy `eko:last-topic` değeri güvenli biçimde taşınır.
- Ana uygulama reset'i onaylandığında M3 ve legacy anahtarları da temizlenir.

## Otomatik doğrulama kapsamı

- Exact Atlas route ayrıştırma; malformed URI ve encoded slash reddi.
- Öğrenme mimarisinde zorunlu alan, duplicate kimlik, referential integrity ve ön koşul döngüsü denetimi.
- Program ve Atlas yollarından hedef öğrenme birimine en fazla `3` anlamlı etkileşim.
- Son konuya ana sayfadan tek etkileşimle dönüş.
- Görünür `8/8` sözleşmesi.
- Reset sonrası exact storage anahtarları.
- Atlas focus yönetimi, bilinmeyen kavram için `404` ve `320 px` taşma kontrolü.

## Statü sınırı

Otomatik kalite kapıları M3 kodunun merge edilebilirliğini belirler. `Production-ready` statüsü ayrıdır: `5` gerçek katılımcıdan en az `4` kişinin ders/kavram bulma görevini başarıyla tamamlaması gerekir. Anonim test protokolü için `docs/m3-usability-test.md` dosyasına bakın.
