# 9. Proje Case Study'leri

> Format: her projede aynı 11 başlık. `⚠️ EKSİK` işaretli alanlar senden bilgi bekliyor —
> uydurmadım. Doldurduktan sonra bu içerikler sitede ayrı case study sayfalarına
> (bkz. `10-technical-plan.md`) taşınabilir.

---

## Case Study 1 — CV Generator SaaS

**Project overview.** A SaaS application where users create professional CVs from
structured input: choose a template, fill guided forms, preview live, export to PDF.

**Problem.** Writing a well-structured CV is a formatting problem as much as a content
problem. Most people fight with word processors; the goal was a guided flow that
produces a consistently formatted document every time.

**My role.** Sole developer — product design, data model, frontend, backend, deployment.

**Technical approach.** Form-driven editing with live preview; CV data stored as
structured JSON per user; server-side PDF generation from the same data that powers the
preview, so output always matches.

**Architecture.** ⚠️ EKSİK — doğrulanacak: Next.js tek uygulama mı, ayrı API mi?
PDF üretimi hangi kütüphaneyle (Puppeteer? react-pdf?)? Hangi veritabanı ve auth çözümü?

**Key features.** Template system · live preview · PDF export · authentication ·
per-user CV data management.

**Challenges.** Keeping preview and PDF output pixel-consistent; modelling CV sections
flexibly (repeatable blocks: experience, education, skills).

**Decisions and trade-offs.** ⚠️ EKSİK — örn. neden şablon başına ayrı bileşen /
tek şema; PDF'i client'ta değil server'da üretme gerekçesi.

**Technologies.** Next.js, TypeScript, Node.js, MongoDB, Tailwind CSS. ⚠️ Doğrula/ekle.

**What I learned.** ⚠️ EKSİK — 2–3 cümle, senin ağzından.

**Future improvements.** ⚠️ EKSİK — örn. yeni şablonlar, ödeme entegrasyonu, AI önerileri.

---

## Case Study 2 — RAG Chatbot

**Project overview.** A chatbot that answers questions from a private document set
instead of general model knowledge — retrieval-augmented generation end to end.

**Problem.** LLMs answer confidently but not from your documents. The goal: grounded
answers with the source material doing the talking.

**My role.** Sole developer — ingestion pipeline, vector store, API, chat UI.

**Technical approach.** Documents are chunked and embedded with all-MiniLM-L6-v2;
vectors stored in Qdrant; at query time the question is embedded, top-k chunks are
retrieved by semantic similarity, and the LLM answers using the retrieved context.

**Architecture.** Ingestion pipeline → Qdrant vector store → retrieval API → chat
interface. ⚠️ EKSİK — LLM tarafı: OpenAI mi, Ollama/DeepSeek mi, ikisi de mi?
Chunking stratejisi (boyut/overlap)?

**Key features.** Document ingestion · semantic search · grounded answers · chat UI.

**Challenges.** Chunking quality vs. retrieval precision; handling questions with no
relevant context (answer honestly instead of hallucinating).

**Decisions and trade-offs.** all-MiniLM-L6-v2: small, fast, free to run locally —
traded some retrieval quality for zero embedding cost. Qdrant over pgvector for
purpose-built vector search and simple Docker deployment. ⚠️ Doğrula.

**Technologies.** Qdrant, all-MiniLM-L6-v2, Node.js. ⚠️ LLM/framework detayını ekle.

**What I learned.** ⚠️ EKSİK.

**Future improvements.** ⚠️ EKSİK — örn. reranking, hybrid search, kaynak gösterimi.

---

## Case Study 3 — WhatsApp Lead Automation

**Project overview.** An automation system that tracks potential customers and runs
messaging workflows over WhatsApp — scheduling, templates, lead status.

**Problem.** Manual lead follow-up over WhatsApp doesn't scale and messages slip
through. The goal: consistent, trackable follow-up without manual repetition.

**My role.** Sole developer.

**Technical approach.** Browser automation with Selenium drives WhatsApp Web; a backend
service manages lead state, message templates and scheduling.

**Architecture.** ⚠️ EKSİK — lead verisi nerede tutuluyor, scheduling nasıl
(cron? queue?), oturum yönetimi nasıl kalıcı kılınıyor?

**Key features.** Lead pipeline · scheduled messaging · workflow templates · status tracking.

**Challenges.** Keeping browser automation stable across WhatsApp Web UI changes;
pacing messages responsibly.

**Decisions and trade-offs.** ⚠️ EKSİK — resmi API yerine Selenium tercihi (maliyet?
erişim?) ve bunun sınırları.

**Technologies.** Selenium, Node.js. ⚠️ Doğrula/ekle.

**What I learned / Future improvements.** ⚠️ EKSİK.

---

## Case Study 4 — Live OpenCart E-commerce Store

**Project overview.** A production e-commerce store — real products, real orders, real
customers — that I deploy and operate myself.

**Problem.** Not a technical showcase but an operating business system: uptime, payment
flows and order management have to work every day.

**My role.** Deployment, customization, and ongoing production operation.

**Technical approach / Architecture.** OpenCart on a self-managed Linux server.
⚠️ EKSİK — hangi hosting, SSL/Nginx kurulumu, tema/eklenti özelleştirmeleri,
ödeme sağlayıcısı (adını yazmadan türü yeterli).

**Key features.** Product management · order and payment flows · production maintenance.

**Challenges.** ⚠️ EKSİK — yaşanmış bir prod problemi anlatmak bu case study'yi
diğerlerinden daha inandırıcı yapar (ör. SSL zinciri, performans, yedekleme).

**What I learned.** Operating software is different from writing it — monitoring,
backups and boring reliability work are the product. ⚠️ Kendi cümlenle doğrula.

---

## Case Study 5 — 3D Globe (Cesium)

**Project overview.** An interactive 3D globe for geospatial visualization, integrated
into a React application.

**Problem.** Rendering geospatial data on a 3D globe in the browser without killing
performance.

**My role.** Sole developer.

**Technical approach.** CesiumJS for globe rendering and geospatial primitives; React
for the surrounding UI; attention to WebGL performance (entity count, level of detail).

**Architecture / Key features / Challenges.** ⚠️ EKSİK — hangi veri kaynağı
görselleştirildi, hangi etkileşimler var (seçim, kamera uçuşu, katmanlar)?

**Technologies.** Cesium, WebGL, React.

**What I learned / Future improvements.** ⚠️ EKSİK.

---

## Not — iş yeri projeleri (NextMusteriApp, NextTeslimatNoktasi.WebApi)

Bu sistemler **case study olarak yayınlanmamalı** (şirket içi). Sitede ve CV'de yalnızca
genel ifadelerle anlatıldı (yaptık). Mülakatta sözlü anlatım için en güçlü üç hikâye:

1. Siparişten fatura akışı: Android ekranı → .NET endpoint → Oracle prosedür eşleştirmesi.
2. TCP 9100 üzerinden ZPL/EPL baskı ve hatalı barkod (reject) senaryoları.
3. Uçtan uca prod hata ayıklama: logcat + API izi + Oracle hatasının tek olayda birleşmesi.
