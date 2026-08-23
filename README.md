# EKO Rasathane β

BUÜ Ekonometri öğrencileri için **sınıf → ders → konu → çalışma adımı** akışına sahip bağımsız çalışma platformu.

## Durum

- Eski sürüm: deployed ve imza doğrulaması yapılmıştı.
- Bu dal: course-first yeniden tasarım; PR/CI/Pages kanıtı tamamlanana kadar **implemented** sayılmaz.
- Ürün henüz browser E2E, gerçek öğrenci pilotu ve içerik uzmanı incelemesinden geçmediği için **production-ready değildir**.

## Sabit ürün sözleşmesi

1. Öğrenci 1–4 arasından sınıfını seçer.
2. Aynı ekranda dönemlere göre dersleri görür.
3. Dersi açar; konu rotası, aktif hatırlama, not ve ilerleme araçlarını kullanır.

GitHub Pages uyumu için hash route kullanılır: `#/`, `#/sinif/:id`, `#/ders/:id`, `#/ders/:id/konu/:id`.

## İlk tam dikey dilim

**3. sınıf → EKO3103 TEMEL EKONOMETRİ I → 7 duraklık hazırlık rotası.** Bu rota resmî ilk yedi öğretim haftasından türetilmiştir; garanti vize kapsamı değildir. BUÜ kayıtlarındaki `5 / 6 AKTS` çelişkisi arayüzde açıkça gösterilir, tek bir değermiş gibi düzeltilmez.

## Yerel doğrulama

```bash
npm run verify
```

## Kaynak politikası

- Program ve ders kimliği: BUÜ resmî program/ders bilgi paketi.
- Açıklamalar, örnekler ve sorular: projeye özgü içerik.
- Telifli kitap, slayt, sınav veya cevap anahtarı kopyalanmaz.
- Doğrulanmamış sınıf katalogları, sayfayı dolu göstermek için uydurulmaz.

## Gizlilik

İlerleme, quiz ve notlar yalnızca tarayıcının `localStorage` alanında tutulur. UKEY/UNİSİS kimlik bilgisi istenmez.

## Kaynaklar

- [BUÜ Ekonometri Program Bilgi Paketi](https://bilgipaketi.uludag.edu.tr/Programlar/Detay/343?AyID=23)
- [BUÜ Ekonometri Bölümü](https://uludag.edu.tr/ekonometri)
- [BUÜ İİBF Eğitim Planı](https://uludag.edu.tr/iibf/default/konu/1403)

## Lisans

MIT