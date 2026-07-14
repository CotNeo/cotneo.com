# 8. SEO İçeriği

> Durum: Aşağıdakilerin tamamı `src/app/layout.tsx` içinde **uygulandı**.
> Bu doküman referans ve gelecekteki değişiklikler için.

## Page title (İngilizce — uygulandı)

> Furkan Akar | Full-Stack & Mobile Software Developer

## Meta description (uygulandı)

> Full-Stack & Mobile Software Developer in Istanbul. React, Next.js, TypeScript,
> Node.js, .NET 8, native Android and Oracle PL/SQL — building web, mobile and
> enterprise software for real-world logistics operations.

## Open Graph

- **og:title:** Furkan Akar | Full-Stack & Mobile Software Developer
- **og:description:** Web, mobile and enterprise software for real-world operations —
  React, Next.js, Node.js, .NET 8, native Android and Oracle PL/SQL.
- **og:image:** `/og-image.jpg` → ⚠️ 1200×630 yeni bir görsel üretilmeli
  (koyu zemin + isim + unvan + teal vurgu; sitedeki terminal kartı estetiği kullanılabilir).

## Türkçe SEO başlıkları (ileride TR sayfası eklenirse)

- Title: `Furkan Akar | Full-Stack & Mobil Yazılım Geliştirici`
- Description: `İstanbul merkezli Full-Stack & Mobil Yazılım Geliştirici. React, Next.js,
  TypeScript, Node.js, .NET 8, native Android ve Oracle PL/SQL ile web, mobil ve kurumsal
  lojistik yazılımları.`

## Anahtar kelimeler (uygulandı — doldurma yok, doğal kapsam)

Full-Stack Developer, Mobile Developer, React Developer, Next.js Developer, TypeScript
Developer, Node.js Developer, .NET Developer, Android Developer, React Native Developer,
Oracle PL/SQL, Enterprise Software Developer, Logistics Software, Software Developer
Turkey, Furkan Akar

## JSON-LD Person schema (uygulandı — layout.tsx)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Furkan Akar",
  "url": "https://cotneo.com",
  "jobTitle": "Full-Stack & Mobile Software Developer",
  "email": "mailto:furkanaliakar@gmail.com",
  "address": { "@type": "PostalAddress", "addressLocality": "Istanbul", "addressCountry": "TR" },
  "sameAs": [
    "https://github.com/CotNeo",
    "https://www.linkedin.com/in/furkanaliakar/",
    "https://stackoverflow.com/users/25318290/cotneo",
    "https://medium.com/@furkanaliakar"
  ],
  "knowsAbout": ["React", "Next.js", "TypeScript", "Node.js", ".NET", "C#", "Java",
    "Android", "React Native", "Oracle Database", "PL/SQL", "Enterprise Integrations",
    "Logistics Software"],
  "knowsLanguage": ["tr", "en"]
}
```

## Project schema önerisi (case study sayfaları eklenirse)

Her case study sayfasına `SoftwareApplication` yerine daha isabetli olan
`CreativeWork` + `SoftwareSourceCode` kombinasyonu:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "CV Generator SaaS",
  "description": "SaaS application for building professional CVs…",
  "programmingLanguage": ["TypeScript"],
  "codeRepository": "[repo-link]",
  "author": { "@type": "Person", "name": "Furkan Akar", "url": "https://cotneo.com" }
}
```

## Diğer yapılanlar

- `sitemap.xml` tek URL'e sadeleştirildi (hash fragment'ler sitemap'e girmez).
- `robots.txt` mevcut haliyle uygun (API disallow + sitemap).
- Google Search Console doğrulama kodu `verification.google` alanından kaldırıldı —
  gerçek kod alınınca `layout.tsx`'e eklenmeli.
