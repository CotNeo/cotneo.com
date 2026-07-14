# 10. Teknik Geliştirme Planı (cotneo.com)

## Bu güncellemede yapılanlar

- **İçerik mimarisi:** Tüm site içeriği `src/data/profile.ts` içinde tek dosyada.
  Deneyim, proje, beceri eklemek = sadece bu dosyayı düzenlemek. (MDX/CMS'e geçiş
  gerekmedikçe en düşük sürtünmeli çözüm — karar gerekçesi aşağıda.)
- **Tasarım sistemi:** "Engineering blueprint" teması — koyu mürekkep zemini (`#0a0e14`),
  tek teal vurgu (`#2dd4bf`), amber durum rengi, Inter + JetBrains Mono font eşleşmesi,
  ince hairline border'lı paneller, numaralı mono bölüm etiketleri (`01 / about`).
  Tailwind v4 `@theme` token'ları: `ink, panel, edge, mist, fog, accent, signal`.
- **Performans:** three.js galaksi arka planı (3.000 partikül, her frame CPU döngüsü)
  kaldırıldı; yerine sıfır çalışma maliyetli CSS grid + glow arka planı geldi.
  three, @react-three/*, recharts, date-fns bağımlılıkları silindi.
  First Load JS: **171 kB**. Bölümler `framer-motion` yerine IntersectionObserver +
  CSS transition ile bir kez reveal oluyor (`Reveal` bileşeni); `prefers-reduced-motion`
  destekleniyor.
- **Yeni bölümler:** Experience (zaman çizelgesi), Skills (seviye rozetli:
  Production / Project / Familiar / Learning), Contact. Projeler artık GitHub API'ye
  değil küratörlü veriye dayanıyor; GitHub istatistikleri ayrı bölümde canlı kalıyor.
- **SEO:** Yeni title/description/OG, JSON-LD Person schema, sadeleştirilmiş sitemap.
- **Chatbot:** Sistem prompt'ları ve fallback yanıtları yeni profille (Android/.NET/
  Oracle dahil) tamamen güncellendi — eski "MERN expert, 3+ years" iddiaları kaldırıldı.

## Veri modeli kararı: TS dosyası vs MDX vs CMS

| Seçenek | Ne zaman doğru |
|---|---|
| **`profile.ts` (şu an)** | Tek kişilik site, seyrek güncelleme, tip güvenliği bedava. ✅ |
| **MDX** | Case study sayfaları eklendiğinde — uzun biçimli içerik için geç. |
| **CMS (Sanity/Contentlayer)** | Ancak blog sıklaşırsa; şimdilik gereksiz karmaşıklık. |

**Öneri:** Case study'ler hazır olunca `content/case-studies/*.mdx` + `next-mdx-remote`
ya da Contentlayer ile `/projects/[slug]` rotaları ekle. O zamana kadar TS dosyası kalsın.

## Önerilen App Router yapısı (case study'ler eklendiğinde)

```
src/app/
  layout.tsx            # metadata + JSON-LD (mevcut)
  page.tsx              # tek sayfa portfolio (mevcut)
  projects/
    [slug]/page.tsx     # MDX case study sayfaları (gelecek)
  api/
    chat/route.ts       # AI asistan (mevcut)
    github/…            # GitHub istatistikleri (mevcut)
content/
  case-studies/*.mdx    # gelecek
src/data/profile.ts     # tüm site içeriği (mevcut)
src/components/…        # bölüm bileşenleri + ui/ (Reveal, SectionHeading)
```

## Yol haritası (öncelik sırasıyla)

1. **`public/cv.pdf`'i yenile** — `docs/02-cv-en.md` içeriğiyle. Sitedeki indirme
   butonu hâlâ eski PDF'i veriyor; şu an en görünür tutarsızlık bu.
2. **`public/og-image.jpg` üret** — 1200×630, yeni kimlikle (koyu zemin + teal).
   Layout'ta referans var ama dosya repo'da yok.
3. **Proje repo linkleri** — `profile.ts` içindeki `repo`/`demo` alanlarını doldur
   (şu an GitHub profiline düşüyor).
4. **Contact form** — şimdilik mailto yeterli. Form istersen: Server Action +
   [Resend](https://resend.com) + honeypot + rate limit; e-posta adresini env'e taşı.
5. **Analytics** — Vercel Analytics (`@vercel/analytics`) tek satırla; cookie'siz,
   GDPR dostu. Alternatif: Plausible.
6. **Blog / technical notes** — LinkedIn analizindeki Medium yazısı stratejisiyle
   birleştir: önce Medium'da yaz, site tarafında `/notes` altında MDX'e taşı.
   Barkod/ZPL yazısı arama trafiği için niş ve rakipsiz.
7. **Lighthouse hedefleri** — Performance ≥ 95 (three.js gittikten sonra ulaşılabilir),
   Accessibility ≥ 95, SEO 100. `npx lighthouse https://cotneo.com` ile doğrula.
8. **GitHub API dayanıklılığı** — `GITHUB_TOKEN` env'inin Vercel'de tanımlı olduğundan
   emin ol; değilse GithubStatus fallback uyarısı prod'da görünür.

## Güvenlik / gizlilik kontrol listesi (uygulandı)

- Şirket adı, gerçek endpoint, IP, token, müşteri verisi hiçbir içerikte yok.
- İş yeri sistem adları (NextMusteriApp vb.) yalnızca `docs/` içinde "yayınlama" notuyla
  geçiyor; sitede genel ifadeler kullanılıyor.
- E-posta yalnızca zaten herkese açık olan adres.
