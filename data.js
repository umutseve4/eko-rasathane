export const semesters = [
  { id: 1, title: 'Temel zemin', note: 'İktisat, hukuk, işletme ve nicel düşünme' },
  { id: 2, title: 'Dilin kurulması', note: 'Matematik, istatistik ve ekonomik yorum' },
  { id: 3, title: 'Ölçmeye geçiş', note: 'Olasılık, çıkarım ve model mantığı' },
  { id: 4, title: 'Sistem bakışı', note: 'Optimizasyon, veri ve karar' },
  { id: 5, title: 'Model kurma', note: 'Temel ekonometrik tahmin ve sınama' },
  { id: 6, title: 'Diagnostik', note: 'Varsayım ihlalleri ve güvenilir çıkarım' },
  { id: 7, title: 'Uzmanlaşma', note: 'Finansal ekonometri ve seçmeli yollar' },
  { id: 8, title: 'Kanıt üretme', note: 'İleri analiz, araştırma ve portföy' }
];

export const studioSteps = [
  ['01', 'Soru', 'Bu model hangi ekonomik sorunu cevaplayacak?'],
  ['02', 'Sezgi', 'İşaret ve ilişkiyi formülden önce tahmin et.'],
  ['03', 'Gösterim', 'Değişkenleri, birimleri ve varsayımları tanımla.'],
  ['04', 'Hesap', 'Küçük örneği elle çöz; araç sonucunu körlemesine kabul etme.'],
  ['05', 'Diagnostik', 'Artıklar ve varsayım ihlalleri ne söylüyor?'],
  ['06', 'Yorum', 'Büyüklük, yön, belirsizlik ve sınırı birlikte yaz.'],
  ['07', 'Kanıt', 'Yeniden üretilebilir bir Model Kartı bırak.']
];

export const recallCards = [
  { q: 'SEKK tahmincisinin yansızlığı için kritik dışsallık varsayımı nedir?', a: 'Açıklayıcı değişkenler veriliyken hata teriminin koşullu beklenen değeri sıfır olmalıdır: E(u|X)=0.' },
  { q: 'Yüksek R² neden tek başına iyi model kanıtı değildir?', a: 'Nedensellik, doğru belirtim, dışsallık veya tahmin geçerliliğini garanti etmez; diagnostik ve bağlam gerekir.' },
  { q: 'Bir katsayıyı savunulabilir biçimde yorumlarken dört parça nedir?', a: 'Birim, yön, büyüklük ve ceteris paribus koşulu; ayrıca belirsizlik ve nedensellik sınırı belirtilir.' }
];

export const officialSources = [
  { label: 'BUÜ Ekonometri Program Bilgi Paketi', url: 'https://bilgipaketi.uludag.edu.tr/Programlar/Detay/343?AyID=23', meta: '240 AKTS · program yeterlilikleri · mezuniyet koşulları' },
  { label: 'İİBF Eğitim Planı ve Ders İçerikleri', url: 'https://uludag.edu.tr/iibf/default/konu/1403', meta: 'Ekonometri eğitim planı · ders içerikleri' },
  { label: 'Ekonometri Bölümü', url: 'https://uludag.edu.tr/ekonometri', meta: 'Duyurular · ders ve sınav programları' },
  { label: 'BUÜ ana öğrenci bağlantıları', url: 'https://uludag.edu.tr/', meta: 'Akademik takvim · UNİSİS · UKEY · kütüphane' }
];
