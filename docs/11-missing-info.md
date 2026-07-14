# 11. Eksik Bilgiler ve Nihai İyileştirme Önerileri

## Senden beklenen bilgiler (önem sırasıyla)

### Kritik — CV gönderilmeden önce şart

1. **Şirket adı ve çalışma tarihleri** (her iki rol için ay/yıl). CV ve LinkedIn'de
   `[Company name]` / `[dates]` yer tutucuları bekliyor. Şirket adını CV'de yazmak
   istemiyorsan "a nationwide logistics company (name available on request)" formülü
   kullanılabilir — ama LinkedIn'de şirket sayfası bağlamak recruiter güveni için önemli.
2. **Yeni `cv.pdf`** — sitedeki indirme butonu hâlâ eski PDF'i sunuyor.
   `docs/02-cv-en.md` içeriğinden üret, `public/cv.pdf`'i değiştir.
3. **Proje repo ve demo linkleri** — CV Generator SaaS, RAG Chatbot, WhatsApp Automation,
   3D Globe, Nutrition App, HubX News, Meveddet SPA için. `src/data/profile.ts` içindeki
   `repo`/`demo` alanlarına ve README'deki `[repo-link]`'lere işlenecek.
   OpenCart sitesinin URL'ini paylaşmak isteyip istemediğini de belirt.

### Önemli — içerik kalitesini yükseltir

4. **Case study boşlukları** — `docs/09-case-studies.md` içindeki ⚠️ EKSİK alanlar
   (mimari detaylar, karar gerekçeleri, "what I learned" cümleleri).
5. **Sertifika tarihleri** — Full Stack Open ve GraphQL hangi yıl tamamlandı?
6. **Eğitim tarihleri** — AUZEF başlangıç yılı; Makine Müh. yılları.
7. **Hedef ülkeler** — relocation için öncelik (ör. Almanya/Hollanda/İskandinavya?).
   LinkedIn Open-to-Work lokasyonlarına girilecek.
8. **Hedef pozisyon önceliği** — full-stack mi mobile mı öncelikli? Başvuru stratejisini
   ve LinkedIn skill sıralamasını etkiler.

### Karar bekleyen tercihler

9. **Referanslar** — CV'ye "References available on request" bile genelde yazılmıyor;
   önerim CV'de hiç yer vermemek. Onaylıyor musun?
10. **Profesyonel fotoğraf** — sitede mevcut fotoğraf kullanılıyor. Uluslararası CV'lerde
    (özellikle ABD/İngiltere) fotoğraf **koyma**; Almanya'da opsiyonel. Sitede kalması doğru.
11. **Askerlik durumu** — uluslararası CV'de belirtme (sorulmaz, beklenmez). Türkiye içi
    başvurularda tecil/muafiyet durumunu `03-cv-tr.md`'ye ekleyebilirim — durumunu bildir.
12. **Telefon numarası** — hiçbir dokümana koymadım (web'de yayınlanmamalı). CV'nin
    gönderilen kopyalarına eklemek istersen kendin ekle.
13. **YouTube/Instagram/Reddit** — profesyonel yüzeyden çıkarıldı. Geri istersen söyle.

## Nihai iyileştirme önerileri

### CV için

- PDF'i tek kolon, standart fontla üret (ATS). Canva benzeri çok kolonlu şablonlardan kaçın.
- Başvurduğun ilana göre Core Competencies satırını hafifçe uyarla (mobile ilanına
  Android'i, backend ilanına .NET/Oracle'ı öne al) — kalanını değiştirme.
- İngilizce CV'de adres yazma; "Istanbul, Türkiye" yeterli.

### Portfolio için

- En yüksek getirili içerik: **"Printing labels over TCP port 9100: ZPL from Android"**
  tarzı bir teknik yazı. Bu konuda yazan çok az kişi var; profilinin ayırt edici
  noktasını arama motorlarında görünür kılar.
- Case study'ler tamamlandığında ana sayfadaki proje kartlarını `/projects/[slug]`
  sayfalarına bağla.
- GitHub'da sabitlenmiş (pinned) 6 repoyu featured projelerle eşleştir; her birine
  1-2 cümlelik düzgün description ve topics ekle — recruiter'lar önce oraya bakıyor.

### LinkedIn için

- Profil URL'in zaten temiz (`furkanaliakar`) — değiştirme.
- Featured bölümüne cotneo.com + 2 repo + (yazınca) Medium yazısı.
- İş değişikliği aramasını işverenden gizlemek için Open-to-Work görünürlüğünü
  "Recruiters only" yap.

### Süreç için

- Başvurularda İngilizce yazılı iletişim örneği biriktir (temiz PR açıklamaları,
  README'ler) — İngilizce konuşma gelişene kadar en güçlü kanıtın bunlar.
- AWS sertifikasyonuna tarih taahhüt etme (eski sitede "Q3 2025" yazıyordu ve geçmişti);
  tamamlanınca ekle.
