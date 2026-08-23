# EKO Rasathane

> BUÜ Ekonometri öğrencileri için **kavram → model → kanıt → yorum** akışını görünür kılan yerel-öncelikli çalışma işletim sistemi.

Bu bir LMS, not deposu veya jenerik AI sohbet ekranı değildir. İlk dikey dilim; 8 dönemlik program pusulasını, odak oturumunu, ders stüdyosunu, geri çağırma kuyruğunu, katsayı tercümanını ve kanıt defterini tek bir etkileşimli deneyimde birleştirir.

## Neden farklı?
- **İlerleme süreden değil kanıttan gelir.** Her oturum bir yorum, çözüm veya Model Kartı bırakır.
- **Resmî kaynağa bağlıdır.** 240 AKTS, program yeterlilikleri ve program yapısı BUÜ Bilgi Paketi üzerinden kaynaklandırılır.
- **Etik geri dönüş döngüsü kurar.** Sonsuz akış, kayıp serisi ve manipülatif bildirim yoktur.
- **AI-first değildir.** Temel çalışma akışı model servisi olmadan tamamlanır.
- **Local-first.** Prototip not ve ilerlemeyi yalnızca tarayıcı `localStorage` alanında saklar.

## Canlı uygulama

https://umutseve4.github.io/eko-rasathane/

## Çalıştırma
Statik dosya sunucusuyla `index.html` açılabilir. Otomatik doğrulama:

```bash
npm test
npm run check
```

## Durum
| Seviye | Durum |
|---|---|
| Planlandı | M1–M4 |
| Uygulandı | M1 dikey dilim |
| Test edildi | Saf iş mantığı + statik sözleşme |
| Doğrulandı | PR #1 Node 22 CI: `test` başarılı — run `32639209341` ve `32639214399`; Pages smoke: HTTP + `EKO RASATHANE` imzası başarılı — run `32639468597` |
| Dağıtıldı | GitHub Pages: https://umutseve4.github.io/eko-rasathane/ — run `32639468597`, commit `4cdcc3bb0b90855ee3bd0cb39704ea0d97256a04` |
| Production-ready | Hayır — resmî katalog senkronu, tarayıcı/E2E kapsamı, pilot, güvenlik ve hukuk incelemesi gerekli |

Ayrıntılar: [ROADMAP.md](ROADMAP.md) · [SOURCES.md](SOURCES.md)

## Lisans
Kod MIT lisanslıdır. BUÜ adı, sayfaları ve üçüncü taraf eğitim içerikleri kendi hak sahiplerine aittir. Bu proje Bursa Uludağ Üniversitesinin resmî ürünü değildir.
