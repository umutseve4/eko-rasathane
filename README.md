<h1 align="center">Eko Rasathane</h1>

<p align="center">
  Ekonometri müfredatını ders listesi olarak değil, gezilebilir bir harita olarak gösteren araç.<br>
  Resmî ders kayıtlarını alır, hangi dersin hangi kavrama bağlandığını çizer,<br>
  ve "bu dönem ne öğreneceğim" sorusuna tıklanabilir bir rota ile cevap verir.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ders%20kayd%C4%B1-164-FF4D4F?style=flat-square" alt="164 kayıt">
  <img src="https://img.shields.io/badge/atlas%20kavram%C4%B1-7-FF4D4F?style=flat-square" alt="7 kavram">
  <img src="https://img.shields.io/badge/kullan%C4%B1labilirlik%20kap%C4%B1s%C4%B1-4%2F5-FF4D4F?style=flat-square" alt="4/5 kapı">
</p>

---

## 30 saniyede ne oluyor?

```bash
git clone https://github.com/umutseve4/eko-rasathane && cd eko-rasathane
npm run verify
```

`verify` veri bütünlüğünü ve şablon tutarlılığını doğrular. Ardından statik dosyaları
herhangi bir sunucuyla açabilirsin:

```bash
python3 -m http.server 8080
```

## Rotalar

Arayüz hash rotalarıyla çalışır; her rota doğrudan paylaşılabilir bir adrestir.

| Rota | Ne açar |
|---|---|
| `#/` | Giriş — hedef seçimi |
| `#/basla` | Örnek yolculuk (adım adım) |
| `#/program` | Ekonometri lisans ders planının tamamı |
| `#/sinif/:id` | Tek bir sınıfın rotası, örn. `#/sinif/3` |
| `#/ders/:id` | Tek bir ders, örn. `#/ders/temel-ekonometri-1` |
| `#/ders/:id/konu/:konu` | Dersin tek bir konusu |
| `#/atlas` | Kavram haritası |

Tanınmayan veya kanonik olmayan rotalar (`#/sinif//3`, `#/sinif/9`, `#/program/foo`)
sessizce düzeltilmez; "bulunamadı" görünümüne düşer ve bu davranış testlidir.

## Ne veriyor?

| Bölüm | İçerik |
|---|---|
| **Program** | Ekonometri lisans planının tamamı; dönem, kredi ve AKTS ile birlikte |
| **Atlas** | 7 konu ↔ 7 kavram eşlemesi; her kavram için 8/8 doldurulmuş öğrenme şablonu |
| **Rota** | "Veriden Modele" zinciri — hangi dersin hangisinin önünü açtığı |
| **Durum dili** | Her modül 6 kademeli olgunluk etiketiyle işaretli: Planned → Draft → Wired → Verified → Hardened → Production-ready |

## Veri dürüstlüğü

- Kaynakta **164 EKO ders kaydı** var: **108** I. öğretim, **56** II. öğretim.
- **8 adet TUD/YAD kaydı** ayıklanmadı; "Tümü" görünümünde bilinçli olarak korunuyor — kaynağı sessizce budamak veriyi yalanlamak olurdu.
- Bazı derslerde **5/6 AKTS** çelişkisi var. Bu bir hata değil, **kaynağın anomalisi**; düzeltilmeden, olduğu gibi taşınıyor.
- Veri birleştirmesinin referans commit'i: `a02c711721f8d11be5064e701c854ab34ba01714`.

## Gizlilik ilkesi

- UKEY/UNİSİS gibi kapalı sistemlere **scraping yapılmaz**.
- Telifli ders materyali **kopyalanmaz**; yalnızca kamuya açık ders planı verisi kullanılır.
- Kullanıcı durumu tarayıcıda `localStorage` içinde kalır; sunucuya hiçbir şey gitmez.

## Sınırlar

- **Bu proje production-ready değil.** Kullanılabilirlik kapısı henüz geçilmedi: **5 katılımcının 4'ünün** görevi yardımsız tamamlaması gerekiyor. Bu ölçüm yapılana kadar proje "Verified" üstüne çıkmaz.
- Ders planı verisi bir dönemin anlık görüntüsüdür; resmî Bilgi Paketi güncellenirse burada otomatik güncellenmez.
- Atlas eşlemeleri editöryel yorumdur, resmî bir öğrenme çıktısı listesi değildir.
- Resmî danışmanlık, muafiyet veya kayıt kararı yerine geçmez; bağlayıcı kaynak üniversitenin kendi sistemidir.

---

MIT — ayrıntı için [LICENSE](LICENSE).
