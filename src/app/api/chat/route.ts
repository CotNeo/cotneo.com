import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { kv } from '@vercel/kv';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

interface ChatRequest {
  message: string;
  conversationId?: string;
  previousMessages?: { role: string; content: string }[];
}

// KV bağlantı kontrolü
const isKvEnabled = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

// OpenAI istemcisi - lazy initialization
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api.openai.com/v1',
    });
  }
  
  return openai;
}

// Rate limiting için sabitler
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 saat
const MAX_REQUESTS_PER_HOUR = 100;

// Cache için sabitler
const CACHE_TTL = 60 * 60; // 1 saat

// Context yönetimi için sabitler
const MAX_CONTEXT_LENGTH = 10; // Son 10 mesajı tut
const CONTEXT_WINDOW = 60 * 60 * 1000; // 1 saat

// Dil algılama fonksiyonu
function detectLanguage(text: string): 'tr' | 'en' {
  const lowerText = text.toLowerCase().trim();
  const turkishChars = /[çğıöşüÇĞIİÖŞÜ]/;
  const turkishWords = /\b(ve|ile|bir|bu|şu|o|ben|sen|biz|siz|onlar|var|yok|için|gibi|kadar|daha|en|çok|az|nasıl|ne|kim|nerede|neden|ne zaman|neler|yapabilir|yapabiliyor|yetenekleri|projeleri|deneyimi|hakkında|ulaşabilirim|ulaş|iletişim|bilgili|merhaba|selam|türkçe|turkce)\b/i;
  
  // Türkçe karakter veya kelime varsa Türkçe
  if (turkishChars.test(text) || turkishWords.test(lowerText)) {
    return 'tr';
  }
  return 'en';
}

const SYSTEM_PROMPT_EN = `You are Furkan's AI assistant, designed to have natural, conversational interactions just like ChatGPT. You should be friendly, helpful, and engaging while talking about Furkan's professional background.

CRITICAL RULES:
1. ONLY answer questions about Furkan Akar's professional background, skills, projects, experience, and related topics
2. If asked about anything else (weather, general knowledge, other people, unrelated topics), respond EXACTLY with: "I'm sorry, but Furkan only uses me to introduce himself. I'm an OpenAI integration. The repository is open source, you can check it out."
3. ALWAYS respond in the SAME LANGUAGE as the user's question:
   - If the user writes in Turkish, respond in Turkish
   - If the user writes in English, respond in English
   - If asked "can you speak Turkish?" or "türkçe konuşabilir misin?", confirm that you can speak Turkish
4. Be natural and conversational - talk like you're having a friendly chat
5. Be helpful and informative, but keep it engaging
6. Use emojis sparingly and only when they add value
7. Show genuine interest in helping the user learn about Furkan
8. Maintain context from previous messages in the conversation
9. Be friendly and approachable, like a helpful colleague
10. Answer questions directly and clearly, but feel free to add relevant details

Response Style:
- Be natural and conversational, like ChatGPT
- Answer questions directly and helpfully
- Add context and details when relevant
- Use a friendly, approachable tone
- Keep responses informative but not overwhelming
- Be concise when appropriate, detailed when needed
- Maintain a professional but friendly demeanor

About Furkan:
Personal:
- Name: Furkan Akar
- Role: Full-Stack & Mobile Software Developer
- Location: Istanbul, Türkiye
- Education: Computer Programming at Istanbul University AUZEF (ongoing); previously studied Mechanical Engineering at Istanbul University–Cerrahpaşa
- Languages: Turkish (native), English (B1–B2, reads technical docs and communicates in writing), French (beginner)
- Summary: A full-stack and mobile developer who works across modern web (React, Next.js, TypeScript, Node.js) and enterprise systems (.NET 8, native Android with Java, Oracle PL/SQL, barcode and printing hardware)

Current Role:
- Operational Software / Mobile Software Specialist at a nationwide logistics company in Istanbul
- Builds native Android (Java) apps that run on Zebra handheld terminals in the field
- Develops .NET 8 Web APIs in C# connecting mobile clients to Oracle stored procedures and packages
- Works on shipment, invoicing and delivery-point workflows, including marketplace orders (Amazon/Trendyol/N11-style platforms)
- Implements label and barcode printing to Zebra printers over TCP sockets (port 9100) using ZPL and EPL
- Integrates SOAP services, Bearer-token authentication and deep links between enterprise Android apps
- Debugs production issues end to end: Android logcat, network logs, API traces and Oracle error analysis
- Writes test-case matrices and UAT scenarios; uses Azure DevOps, APK release builds and .NET publish pipelines

Previous Role:
- Risk & security systems operations at the same logistics organization
- Monitored a fleet of roughly 1,300 CCTV and security devices, managed access authorizations, IP changes and incident analysis

Skills:
- Frontend: React 18/19, Next.js (App Router), TypeScript, Tailwind CSS, Redux Toolkit, React Hook Form, Zod
- Backend: Node.js, Express, .NET 8 Web API, C#, REST design, SOAP integrations, JWT/Bearer auth, GraphQL, Socket.io, FastAPI
- Mobile: Native Android (Java), React Native CLI, Expo, Retrofit, deep linking, APK release builds
- Databases: Oracle (PL/SQL, stored procedures, packages), MongoDB/Mongoose, MySQL, PostgreSQL
- Enterprise/hardware: Zebra handheld terminals and printers, ZPL/EPL, TCP socket printing, barcode workflows
- DevOps: Git, GitHub, GitHub Actions, Azure DevOps, Docker, Nginx, Linux/VPS, Vercel
- AI & automation: OpenAI API, RAG with Qdrant and embeddings, Ollama, Selenium, Puppeteer
- Testing: Jest, Supertest, Vitest, React Testing Library, test-case/UAT design

Projects:
1. CV Generator SaaS — a SaaS app for building professional CVs: templates, live preview, PDF export, auth and user data management (Next.js, TypeScript, Node.js, MongoDB)
2. RAG Chatbot — document-grounded AI chatbot using Qdrant vector search and all-MiniLM-L6-v2 embeddings
3. WhatsApp Lead Automation — lead tracking and messaging workflow automation with Selenium
4. Live OpenCart e-commerce store — running in production with real orders, self-managed deployment
5. 3D Globe — Cesium-based geospatial visualization in React
6. Also: Nutrition App, MERN task manager, HubX News, Meveddet SPA
- More at https://github.com/CotNeo

Career Goals:
- Working with international or global teams, remote or relocation-supported
- Growing in full-stack, backend, mobile or product engineering roles
- Currently learning AWS, system design and deeper .NET/cloud practice

Certifications:
1. Full Stack Open Certificate (University of Helsinki)
2. Full Stack GraphQL Certificate (University of Helsinki)
3. AWS certification (currently preparing)`;

const SYSTEM_PROMPT_TR = `Sen Furkan'ın AI asistanısın, ChatGPT gibi doğal ve samimi konuşmalar yapmak için tasarlandın. Furkan'ın profesyonel geçmişi hakkında konuşurken dostane, yardımcı ve ilgi çekici olmalısın.

KRİTİK KURALLAR:
1. SADECE Furkan Akar'ın profesyonel geçmişi, yetenekleri, projeleri, deneyimi ve ilgili konular hakkında soruları yanıtla
2. Başka bir şey sorulursa (hava durumu, genel bilgi, başka insanlar, ilgisiz konular), TAM OLARAK şunu söyle: "Üzgünüm, Furkan beni sadece kendini tanıtmak için kullanıyor. Bir OpenAI entegrasyonuyum. Repo open source, inceleyebilirsin."
3. HER ZAMAN kullanıcının sorduğu DİLDE yanıt ver:
   - Kullanıcı Türkçe yazarsa, Türkçe yanıt ver
   - Kullanıcı İngilizce yazarsa, İngilizce yanıt ver
   - "Türkçe konuşabilir misin?" veya "can you speak Turkish?" sorulursa, Türkçe konuşabildiğini onayla
4. Doğal ve samimi ol - arkadaşça sohbet ediyormuş gibi konuş
5. Yardımcı ve bilgilendirici ol, ama ilgi çekici kal
6. Emojileri sadece gerektiğinde ve değer kattığında kullan
7. Kullanıcının Furkan hakkında bilgi edinmesine yardımcı olmaya gerçekten ilgi göster
8. Konuşmadaki önceki mesajların bağlamını koru
9. Dostane ve yaklaşılabilir ol, yardımcı bir meslektaş gibi
10. Sorulara doğrudan ve net yanıt ver, ama ilgili detaylar eklemekten çekinme

Yanıt Tarzı:
- Doğal ve samimi ol, ChatGPT gibi
- Sorulara doğrudan ve yardımcı şekilde yanıt ver
- İlgili olduğunda bağlam ve detaylar ekle
- Dostane, yaklaşılabilir bir ton kullan
- Yanıtları bilgilendirici tut ama bunaltıcı olma
- Uygun olduğunda kısa, gerektiğinde detaylı ol
- Profesyonel ama dostane bir tavır sergile
- Kişisel dokunuşlar ve benzersiz bakış açıları ekle
- Tonu samimi ve konuşkan tut
- Etkileyici bir soru veya ilginç bir gerçekle bitir

Furkan Hakkında:
Kişisel:
- İsim: Furkan Akar
- Rol: Full-Stack & Mobil Yazılım Geliştirici
- Konum: İstanbul, Türkiye
- Eğitim: İstanbul Üniversitesi AUZEF Bilgisayar Programcılığı (devam ediyor); öncesinde İstanbul Üniversitesi-Cerrahpaşa Makine Mühendisliği
- Diller: Türkçe (ana dil), İngilizce (B1–B2, teknik doküman okur ve yazılı iletişim kurar), Fransızca (başlangıç)
- Özet: Modern web (React, Next.js, TypeScript, Node.js) ile kurumsal sistemler (.NET 8, Java ile native Android, Oracle PL/SQL, barkod ve yazıcı donanımları) arasında çalışan bir full-stack ve mobil geliştirici

Mevcut Rol:
- İstanbul'da ulusal çapta bir lojistik firmasında Operasyonel Yazılımlar / Mobil Yazılım Uzmanı
- Sahada Zebra el terminallerinde çalışan native Android (Java) uygulamaları geliştiriyor
- Mobil istemcileri Oracle stored procedure ve package'lara bağlayan .NET 8 Web API servisleri (C#) yazıyor
- Sipariş, fatura ve teslimat noktası akışları üzerinde çalışıyor; Amazon/Trendyol/N11 benzeri platform siparişleri dahil
- Zebra yazıcılara TCP soket (9100 portu) üzerinden ZPL ve EPL ile etiket/barkod baskısı geliştiriyor
- SOAP servis entegrasyonları, Bearer token kimlik doğrulama ve kurumsal Android uygulamaları arası deep link entegrasyonları yapıyor
- Üretim hatalarını uçtan uca ayıklıyor: Android logcat, network logları, API izleri ve Oracle hata analizi
- Test case matrisleri ve UAT senaryoları yazıyor; Azure DevOps, APK release build ve .NET publish süreçlerini yönetiyor

Önceki Rol:
- Aynı lojistik organizasyonunda risk ve güvenlik sistemleri operasyonları
- Yaklaşık 1.300 CCTV ve güvenlik cihazından oluşan filoyu izledi; yetkilendirme, IP değişiklikleri ve olay analizi yaptı

Yetenekler:
- Frontend: React 18/19, Next.js (App Router), TypeScript, Tailwind CSS, Redux Toolkit, React Hook Form, Zod
- Backend: Node.js, Express, .NET 8 Web API, C#, REST tasarımı, SOAP entegrasyonları, JWT/Bearer auth, GraphQL, Socket.io, FastAPI
- Mobil: Native Android (Java), React Native CLI, Expo, Retrofit, deep linking, APK release build
- Veritabanları: Oracle (PL/SQL, stored procedure, package), MongoDB/Mongoose, MySQL, PostgreSQL
- Kurumsal/donanım: Zebra el terminalleri ve yazıcıları, ZPL/EPL, TCP soket baskı, barkod iş akışları
- DevOps: Git, GitHub, GitHub Actions, Azure DevOps, Docker, Nginx, Linux/VPS, Vercel
- AI ve otomasyon: OpenAI API, Qdrant ve embedding ile RAG, Ollama, Selenium, Puppeteer
- Test: Jest, Supertest, Vitest, React Testing Library, test case/UAT tasarımı

Projeler:
1. CV Generator SaaS — profesyonel CV hazırlama SaaS uygulaması: şablonlar, canlı önizleme, PDF üretimi, auth ve kullanıcı verisi yönetimi (Next.js, TypeScript, Node.js, MongoDB)
2. RAG Chatbot — Qdrant vektör arama ve all-MiniLM-L6-v2 embedding kullanan doküman tabanlı AI chatbot
3. WhatsApp Lead Automation — Selenium ile müşteri adayı takibi ve mesajlaşma otomasyonu
4. Canlı OpenCart e-ticaret sitesi — üretimde gerçek siparişlerle çalışan, kendi yönettiği sunucuda
5. 3D Globe — React içinde Cesium tabanlı jeouzamsal görselleştirme
6. Ayrıca: Nutrition App, MERN görev yöneticisi, HubX News, Meveddet SPA
- Daha fazlası: https://github.com/CotNeo

Kariyer Hedefleri:
- Uluslararası veya global ekiplerle remote ya da relocation destekli çalışmak
- Full-stack, backend, mobil veya product engineering rollerinde ilerlemek
- Şu anda AWS, sistem tasarımı ve daha derin .NET/cloud pratiği öğreniyor

Sertifikalar:
1. Full Stack Open Sertifikası (Helsinki Üniversitesi)
2. Full Stack GraphQL Sertifikası (Helsinki Üniversitesi)
3. AWS sertifikasyonu (hazırlanıyor)`;

// Hata mesajları
const ERROR_MESSAGES = {
  RATE_LIMIT: 'You have reached the maximum number of requests. Please try again later.',
  INVALID_REQUEST: 'Invalid request. Please provide a valid message.',
  API_ERROR: 'Sorry, I encountered an error. Please try again.',
  CONTEXT_ERROR: 'Sorry, I had trouble remembering our conversation. Let me start fresh.',
};

// Context yönetimi
async function getChatContext(ip: string, conversationId: string): Promise<OpenAI.ChatCompletionMessageParam[]> {
  if (!isKvEnabled) return [];
  
  try {
    const key = `chat_context:${ip}:${conversationId}`;
    const context = await kv.get<ChatMessage[]>(key) || [];
    
    // Eski mesajları temizle
    const now = Date.now();
    const recentContext = context.filter((msg: ChatMessage) => 
      msg.timestamp && now - msg.timestamp < CONTEXT_WINDOW
    );
    
    // Son MAX_CONTEXT_LENGTH mesajı al
    return recentContext.slice(-MAX_CONTEXT_LENGTH).map(({ role, content }: ChatMessage) => ({ 
      role, 
      content 
    })) as OpenAI.ChatCompletionMessageParam[];
  } catch {
    return [];
  }
}

async function updateChatContext(ip: string, conversationId: string, message: ChatMessage) {
  if (!isKvEnabled) return;
  
  try {
    const key = `chat_context:${ip}:${conversationId}`;
    const context = await kv.get<ChatMessage[]>(key) || [];
    
    context.push({
      ...message,
      timestamp: Date.now()
    });
    
    // Son MAX_CONTEXT_LENGTH mesajı tut
    const recentContext = context.slice(-MAX_CONTEXT_LENGTH);
    await kv.set(key, recentContext, { ex: CONTEXT_WINDOW / 1000 });
  } catch {
    // Context güncelleme hatası durumunda sessizce devam et
  }
}

// Fallback yanıtlar
const FALLBACK_RESPONSES = {
  skills: "Furkan is a Full-Stack & Mobile Software Developer who works across two worlds: modern web (React, Next.js, TypeScript, Node.js) and enterprise systems (.NET 8, C#, native Android with Java, Oracle PL/SQL). In his day job he builds logistics software — Android apps on Zebra handheld terminals, .NET APIs and Oracle procedures — and on his own time he ships web products and AI-powered tools.",
  projects: "Furkan has built a range of projects:\n\n1. **CV Generator SaaS** — a SaaS app for building professional CVs with templates, PDF export and authentication (Next.js, TypeScript, Node.js, MongoDB).\n\n2. **RAG Chatbot** — a document-grounded AI chatbot using Qdrant vector search and embeddings.\n\n3. **WhatsApp Lead Automation** — lead tracking and messaging workflows automated with Selenium.\n\n4. **Live OpenCart e-commerce store** — running in production with real orders.\n\n5. **3D Globe** — Cesium-based geospatial visualization in React.\n\nMore on his GitHub: github.com/CotNeo",
  experience: "Furkan currently works as an Operational Software / Mobile Software Specialist at a nationwide logistics company in Istanbul. He builds native Android (Java) apps for Zebra handheld terminals, .NET 8 Web APIs in C#, and Oracle PL/SQL integrations that power shipment, invoicing and barcode workflows in production. Before that, he operated the security technology of the same network — a fleet of ~1,300 CCTV and access devices. He also builds his own web and AI products with Next.js, TypeScript and Node.js.",
  cloud: "Furkan deploys to Vercel, self-managed Linux/Nginx VPS servers, and uses Docker and GitHub Actions in his projects. At work he uses Azure DevOps for repositories and release pipelines. He's currently learning AWS and preparing for AWS certification.",
  nodejs: "Furkan uses Node.js and Express for backend development in his own products — REST APIs, authentication, MongoDB integrations. At work his backend stack is .NET 8 Web API with C# talking to Oracle stored procedures, so he's comfortable in both ecosystems.",
  threejs: "Furkan has worked with 3D and geospatial visualization on the web — including a Cesium-based 3D globe project with WebGL performance tuning and React integration.",
  frontend: "Furkan builds frontends with React 18/19, Next.js (App Router), TypeScript and Tailwind CSS. He's experienced with Redux Toolkit, React Hook Form and Zod for form-heavy product UIs, and pays attention to responsive design, accessibility and performance.",
  database: "Furkan works with both relational and document databases. In production he works with **Oracle Database** — PL/SQL, stored procedures and packages behind enterprise APIs — plus MySQL. In his own projects he uses **MongoDB** with Mongoose and has experience with PostgreSQL and TypeORM. He's used to debugging data issues across the API–procedure boundary.",
  default: "I can tell you about Furkan's skills, projects, and experience — from React and .NET to Android and Oracle. What would you like to know?"
};

// Suggestion mesajları
const SUGGESTION_MESSAGES = [
  "Would you like to know more about my frontend skills?",
  "I can tell you about my backend development experience.",
  "Want to learn about my cloud expertise?",
  "I can share details about my 3D development projects.",
  "Would you like to know more about my full-stack experience?",
  "I can tell you about my latest projects and technologies.",
  "Want to learn about my MERN stack expertise?",
  "I can share details about my AWS and cloud certifications."
];

// Context-aware suggestions
const CONTEXT_SUGGESTIONS = {
  skills: [
    "Would you like to know more about my frontend skills?",
    "I can tell you about my backend development experience.",
    "Want to learn about my cloud expertise?"
  ],
  projects: [
    "Would you like to know more about my 3D development projects?",
    "I can tell you about my full-stack applications.",
    "Want to learn about my latest technologies?"
  ],
  experience: [
    "Would you like to know more about my MERN stack expertise?",
    "I can tell you about my AWS and cloud certifications.",
    "Want to learn about my development journey?"
  ],
  cloud: [
    "Would you like to know more about my AWS experience?",
    "I can tell you about my cloud deployment projects.",
    "Want to learn about my DevOps skills?"
  ],
  nodejs: [
    "Would you like to know more about my API development?",
    "I can tell you about my backend architecture experience.",
    "Want to learn about my database expertise?"
  ],
  frontend: [
    "Would you like to know more about my React projects?",
    "I can tell you about my 3D development experience.",
    "Want to learn about my UI/UX skills?"
  ],
  threejs: [
    "Would you like to know more about my 3D animations?",
    "I can tell you about my interactive web experiences.",
    "Want to learn about my creative coding projects?"
  ],
  database: [
    "Would you like to know more about my MongoDB experience?",
    "I can tell you about my PostgreSQL projects.",
    "Want to learn about my database design skills?"
  ]
};

// Rate limiting kontrolü
async function checkRateLimit(ip: string): Promise<boolean> {
  if (!isKvEnabled) return true;
  
  try {
    const key = `rate_limit:${ip}`;
    const current = await kv.get<number>(key) || 0;
    
    if (current >= MAX_REQUESTS_PER_HOUR) {
      return false;
    }
    
    await kv.set(key, current + 1, { ex: RATE_LIMIT_WINDOW / 1000 });
    return true;
  } catch {
    return true; // KV hatası durumunda rate limit'i devre dışı bırak
  }
}

// Cache kontrolü
async function getCachedResponse(message: string): Promise<string | null> {
  if (!isKvEnabled) return null;
  
  try {
    const key = `chat_cache:${message}`;
    return await kv.get<string>(key);
  } catch {
    return null;
  }
}

// Cache'e kaydet
async function cacheResponse(message: string, response: string): Promise<void> {
  if (!isKvEnabled) return;
  
  try {
    const key = `chat_cache:${message}`;
    await kv.set(key, response, { ex: CACHE_TTL });
  } catch {
    // Cache hatası durumunda sessizce devam et
  }
}

// Konu dışı soru kontrolü
function isOffTopic(message: string): boolean {
  const lowerMessage = message.toLowerCase().trim();
  
  // Özel durumlar - bunlar konu içinde sayılmalı
  const specialCases = [
    'türkçe konuşabilir misin', 'turkce konusabilir misin', 'can you speak turkish',
    'türkçe konuş', 'turkce konus', 'speak turkish',
    'what is he do', 'what does he do', 'what he do', 'ne yapıyor', 'ne iş yapıyor',
    'what is he', 'what does he', 'kimdir', 'kim', 'who is he'
  ];
  
  if (specialCases.some(case_ => lowerMessage.includes(case_))) {
    return false;
  }
  
  const offTopicKeywords = [
    // Genel bilgi (İngilizce) - ama Furkan ile ilgili değilse
    'what is the', 'who is the', 'where is the', 'when is the',
    'what are the', 'who are the', 'where are the',
    // Hava durumu
    'weather', 'temperature', 'rain', 'snow', 'sunny', 'cloudy',
    'hava durumu', 'sıcaklık', 'yağmur', 'kar',
    // Tarih/saat
    'what time is it', 'what date is it', 'what day is it', 'current time',
    'saat kaç', 'tarih ne', 'bugün ne günü',
    // Genel sorular
    'capital of', 'population of', 'president of', 'prime minister',
    'başkent', 'nüfus', 'cumhurbaşkanı', 'başbakan',
    // Diğer kişiler
    'elon musk', 'steve jobs', 'bill gates', 'mark zuckerberg',
    // Matematik/fizik
    'calculate', 'solve', 'equation', 'formula',
    'hesapla', 'çöz', 'denklem',
    // Genel bilgi
    'history of', 'meaning of', 'definition of',
    'tarihi', 'anlamı', 'tanımı'
  ];
  
  // Furkan ile ilgili kelimeler varsa konu içinde say
  const furkanKeywords = [
    'furkan', 'your', 'you', 'yourself', 'sen', 'senin', 'sizin', 
    'onun', 'his', 'he', 'him', 'ne yapıyor', 'ne iş yapıyor',
    'what he', 'what does he', 'what is he', 'kimdir', 'kim'
  ];
  const hasFurkanContext = furkanKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Eğer Furkan ile ilgili bir bağlam varsa, konu içinde say
  if (hasFurkanContext) {
    return false;
  }
  
  // Off-topic keyword kontrolü
  return offTopicKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Fallback yanıt oluştur
function generateFallbackResponse(message: string, userLanguage: 'tr' | 'en' = 'en'): { response: string; suggestions: string[] } {
  const lowerMessage = message.toLowerCase().trim();
  
  // Selamlama (öncelikli) - typo'ları da yakala
  const turkishGreetings = /^(merhaba|merhbaa|merhabaa|selam|selamlar)$/i;
  const englishGreetings = /^(hey|hi|hello|hey there|hi there)$/i;
  
  if (turkishGreetings.test(lowerMessage)) {
    return {
      response: "Merhaba! 👋 Ben Furkan'ın AI asistanıyım. Yetenekleri, projeleri, deneyimi ve daha fazlası hakkında bilgi verebilirim. Ne öğrenmek istersin?",
      suggestions: SUGGESTION_MESSAGES
    };
  } else if (englishGreetings.test(lowerMessage)) {
    return {
      response: "Hi! 👋 I'm Furkan's AI assistant. I can tell you all about his skills, projects, experience, and more. What would you like to know?",
      suggestions: SUGGESTION_MESSAGES
    };
  }
  
  // Türkçe konuşma/cevap soruları
  if (lowerMessage.includes('türkçe konuş') || lowerMessage.includes('turkce konus') || 
      lowerMessage.includes('speak turkish') || lowerMessage.includes('türkçe konuşabilir') ||
      lowerMessage.includes('türkçe cevap') || lowerMessage.includes('turkce cevap') ||
      lowerMessage.includes('türkçe yanıt') || lowerMessage.includes('turkce yanit') ||
      lowerMessage.includes('türkçe konuşabilir misin') || lowerMessage.includes('türkçe cevap ver')) {
    if (userLanguage === 'tr') {
      return {
        response: "Evet, tabii ki! Türkçe konuşabilirim ve Türkçe cevap verebilirim. Furkan hakkında ne öğrenmek istersin?",
        suggestions: SUGGESTION_MESSAGES
      };
    } else {
      return {
        response: "Yes, of course! I can speak Turkish and respond in Turkish. What would you like to know about Furkan?",
        suggestions: SUGGESTION_MESSAGES
      };
    }
  }
  
  // İletişim bilgileri
  if (lowerMessage.includes('ulaş') || lowerMessage.includes('iletişim') || 
      lowerMessage.includes('contact') || lowerMessage.includes('reach') ||
      lowerMessage.includes('nasıl ulaş') || lowerMessage.includes('how to contact') ||
      lowerMessage.includes('email') || lowerMessage.includes('e-posta')) {
    return {
      response: userLanguage === 'tr'
        ? "Furkan'a ulaşmak için:\n\n📧 **E-posta**: Portfolio sitesindeki iletişim formunu kullanabilirsiniz\n💼 **LinkedIn**: linkedin.com/in/furkanaliakar\n🐙 **GitHub**: github.com/CotNeo\n🌐 **Portfolio**: cotneo.com\n\nAyrıca portfolio sitesindeki sosyal medya linklerinden de ulaşabilirsiniz!"
        : "To reach Furkan:\n\n📧 **Email**: You can use the contact form on his portfolio website\n💼 **LinkedIn**: linkedin.com/in/furkanaliakar\n🐙 **GitHub**: github.com/CotNeo\n🌐 **Portfolio**: cotneo.com\n\nYou can also reach him through the social media links on his portfolio site!",
      suggestions: SUGGESTION_MESSAGES
    };
  }
  
  // "Ne kadar bilgili?" gibi sorular
  if (lowerMessage.includes('ne kadar bilgili') || lowerMessage.includes('ne kadar deneyimli') ||
      lowerMessage.includes('how experienced') || lowerMessage.includes('how knowledgeable') ||
      lowerMessage.includes('bilgili') || lowerMessage.includes('deneyimli')) {
    return {
      response: userLanguage === 'tr'
        ? "Furkan, hem modern web hem de kurumsal sistemlerde çalışan bir Full-Stack & Mobil Yazılım Geliştirici. Lojistik sektöründe üretimde çalışan Android uygulamaları, .NET 8 API'leri ve Oracle PL/SQL entegrasyonları geliştiriyor; kendi projelerinde React, Next.js, TypeScript ve Node.js kullanıyor. Şu anda AWS ve sistem tasarımı öğreniyor."
        : "Furkan is a Full-Stack & Mobile Software Developer working across modern web and enterprise systems. At his day job he builds production Android apps, .NET 8 APIs and Oracle PL/SQL integrations for logistics operations; in his own projects he works with React, Next.js, TypeScript and Node.js. He's currently learning AWS and system design.",
      suggestions: CONTEXT_SUGGESTIONS.experience
    };
  }
  
  // "What is he do?" veya "Ne yapıyor?" veya "Neler yapabilir?" gibi sorular
  if (lowerMessage.includes('what is he do') || lowerMessage.includes('what does he do') || 
      lowerMessage.includes('what he do') || lowerMessage.includes('ne yapıyor') || 
      lowerMessage.includes('ne iş yapıyor') || lowerMessage.includes('what is he') ||
      lowerMessage.includes('neler yapabilir') || lowerMessage.includes('ne yapabilir') ||
      lowerMessage.includes('yapabilir') || lowerMessage.includes('yapabiliyor')) {
    return {
      response: userLanguage === 'tr' 
        ? "Furkan, İstanbul'da bir lojistik firmasında Operasyonel Yazılımlar / Mobil Yazılım Uzmanı olarak çalışıyor. Zebra el terminallerinde çalışan native Android (Java) uygulamaları, .NET 8 Web API'leri ve Oracle PL/SQL entegrasyonları geliştiriyor — sipariş, fatura ve barkod akışları her gün sahada kullanılıyor. Kendi projelerinde React, Next.js, TypeScript, Node.js ve AI entegrasyonlarıyla ürünler geliştiriyor."
        : "Furkan works as an Operational Software / Mobile Software Specialist at a logistics company in Istanbul. He builds native Android (Java) apps for Zebra handheld terminals, .NET 8 Web APIs and Oracle PL/SQL integrations — shipment, invoicing and barcode flows used in the field every day. On his own time he builds products with React, Next.js, TypeScript, Node.js and AI integrations.",
      suggestions: CONTEXT_SUGGESTIONS.experience
    };
  }
  
  // Konu dışı soru kontrolü
  if (isOffTopic(message)) {
    if (userLanguage === 'tr') {
      return {
        response: "Üzgünüm, Furkan beni sadece kendini tanıtmak için kullanıyor. Bir OpenAI entegrasyonuyum. Repo open source, inceleyebilirsin.",
        suggestions: SUGGESTION_MESSAGES
      };
    } else {
      return {
        response: "I'm sorry, but Furkan only uses me to introduce himself. I'm an OpenAI integration. The repository is open source, you can check it out.",
        suggestions: SUGGESTION_MESSAGES
      };
    }
  }
  
  // Default response'u dil'e göre ayarla
  let response = userLanguage === 'tr' 
    ? "Furkan'ın yetenekleri, projeleri ve deneyimi hakkında bilgi verebilirim. Ne öğrenmek istersin?"
    : FALLBACK_RESPONSES.default;
  let suggestions = SUGGESTION_MESSAGES;
  
  // Skills / Yetenekler / Neler yapabilir (öncelikli kontrol)
  if (lowerMessage.includes('neler yapabilir') || lowerMessage.includes('ne yapabilir') ||
      lowerMessage.includes('yapabilir') || lowerMessage.includes('yapabiliyor') ||
      lowerMessage === 'yetenekleri' || lowerMessage === 'yetenekler' ||
      lowerMessage.includes('skill') || lowerMessage.includes('tech') || 
      lowerMessage.includes('technology') || lowerMessage.includes('yetenek')) {
    if (userLanguage === 'tr') {
      response = "Furkan iki dünyada birden çalışıyor: modern web (React, Next.js, TypeScript, Node.js) ve kurumsal sistemler (.NET 8, C#, Java ile native Android, Oracle PL/SQL). İş yerinde lojistik yazılımları geliştiriyor — Zebra el terminallerinde Android uygulamaları, .NET API'leri ve Oracle prosedürleri. Kendi zamanında web ürünleri ve AI destekli araçlar geliştiriyor.";
    } else {
      response = FALLBACK_RESPONSES.skills;
    }
    suggestions = CONTEXT_SUGGESTIONS.skills;
  }
  // Frontend (öncelikli - "your frontend" gibi sorular için)
  else if (lowerMessage.includes('frontend') || lowerMessage.includes('react') || 
           lowerMessage.includes('ui') || lowerMessage.includes('interface') ||
           lowerMessage.includes('frontend development') || lowerMessage.includes('frontend skills')) {
    if (userLanguage === 'tr') {
      response = "Furkan frontend tarafında React 18/19, Next.js (App Router), TypeScript ve Tailwind CSS kullanıyor. Form ağırlıklı ürün arayüzleri için Redux Toolkit, React Hook Form ve Zod deneyimi var; responsive tasarım, erişilebilirlik ve performansa önem veriyor.";
    } else {
      response = FALLBACK_RESPONSES.frontend;
    }
    suggestions = CONTEXT_SUGGESTIONS.frontend;
  }
  // Database sorguları
  else if (lowerMessage.includes('database') || lowerMessage.includes('mongodb') || lowerMessage.includes('postgresql') || 
           lowerMessage.includes('sql') || lowerMessage.includes('nosql') || lowerMessage.includes('veritabanı')) {
    if (userLanguage === 'tr') {
      response = "Furkan hem ilişkisel hem doküman veritabanlarıyla çalışıyor. Üretim ortamında **Oracle Database** kullanıyor — kurumsal API'lerin arkasında PL/SQL, stored procedure ve package'lar — ayrıca MySQL ile canlı bir e-ticaret sitesi işletiyor. Kendi projelerinde **MongoDB** (Mongoose ile) kullanıyor; PostgreSQL ve TypeORM deneyimi de var. API–prosedür sınırındaki veri hatalarını ayıklamaya alışkın.";
    } else {
      response = FALLBACK_RESPONSES.database;
    }
    suggestions = CONTEXT_SUGGESTIONS.database;
  }
  // Professional background / experience
  else if (lowerMessage.includes('professional background') || lowerMessage.includes('background') || 
           lowerMessage.includes('career') || lowerMessage.includes('professional') ||
           lowerMessage.includes('experience') || lowerMessage.includes('job') || 
           lowerMessage.includes('work history') || lowerMessage.includes('deneyim')) {
    if (userLanguage === 'tr') {
      response = "Furkan şu anda İstanbul'da bir lojistik firmasında Operasyonel Yazılımlar / Mobil Yazılım Uzmanı. Sahada kullanılan Android (Java) uygulamaları, .NET 8 Web API'leri ve Oracle PL/SQL entegrasyonları geliştiriyor. Öncesinde aynı organizasyonda ~1.300 cihazlık güvenlik sistemi filosunun operasyonunu yürüttü. Kendi projelerinde Next.js, TypeScript ve Node.js ile web ve AI ürünleri geliştiriyor.";
    } else {
      response = FALLBACK_RESPONSES.experience;
    }
    suggestions = CONTEXT_SUGGESTIONS.experience;
  }
  // Projects
  else if (lowerMessage === 'projeleri' || lowerMessage === 'projeler' ||
           lowerMessage.includes('project') || lowerMessage.includes('work on') || 
           lowerMessage.includes('built') || lowerMessage.includes('proje')) {
    if (userLanguage === 'tr') {
      response = "Furkan'ın öne çıkan projeleri:\n\n1. **CV Generator SaaS** — şablonlar, PDF üretimi ve auth içeren profesyonel CV hazırlama uygulaması (Next.js, TypeScript, Node.js, MongoDB).\n\n2. **RAG Chatbot** — Qdrant vektör arama ve embedding kullanan doküman tabanlı AI chatbot.\n\n3. **WhatsApp Lead Automation** — Selenium ile müşteri adayı takibi ve mesajlaşma otomasyonu.\n\n4. **Canlı OpenCart e-ticaret sitesi** — üretimde gerçek siparişlerle çalışıyor.\n\n5. **3D Globe** — React içinde Cesium tabanlı jeouzamsal görselleştirme.\n\nDaha fazlası GitHub'ında: github.com/CotNeo";
    } else {
      response = FALLBACK_RESPONSES.projects;
    }
    suggestions = CONTEXT_SUGGESTIONS.projects;
  }
  // Cloud
  else if (lowerMessage.includes('cloud') || lowerMessage.includes('aws') || 
           lowerMessage.includes('vercel') || lowerMessage.includes('deployment')) {
    response = FALLBACK_RESPONSES.cloud;
    suggestions = CONTEXT_SUGGESTIONS.cloud;
  }
  // Node.js / Backend
  else if (lowerMessage.includes('node') || lowerMessage.includes('backend') || 
           lowerMessage.includes('api') || lowerMessage.includes('server')) {
    response = FALLBACK_RESPONSES.nodejs;
    suggestions = CONTEXT_SUGGESTIONS.nodejs;
  }
  // 3D / Three.js
  else if (lowerMessage.includes('3d') || lowerMessage.includes('three') || 
           lowerMessage.includes('animation') || lowerMessage.includes('graphics')) {
    response = FALLBACK_RESPONSES.threejs;
    suggestions = CONTEXT_SUGGESTIONS.threejs;
  }

  return { response, suggestions };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as ChatRequest;
    const { message, conversationId = 'default', previousMessages = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_REQUEST },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Rate limit kontrolü
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const isAllowed = await checkRateLimit(ip);
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.RATE_LIMIT },
        { status: 429 }
      );
    }

    // Cache kontrolü
    const cachedResponse = await getCachedResponse(message);
    if (cachedResponse) {
      return NextResponse.json({ 
        response: cachedResponse,
        suggestions: SUGGESTION_MESSAGES
      });
    }

    // Dil algılama (önceden yapılmalı)
    const userLanguage = detectLanguage(message);
    
    // OpenAI client kontrolü
    const client = getOpenAIClient();
    
    if (!client) {
      // OpenAI API key yoksa fallback response dön
      console.warn('[ChatBot] OPENAI_API_KEY is not set, using fallback response');
      const { response: fallbackResponse, suggestions } = generateFallbackResponse(message, userLanguage);
      return NextResponse.json(
        { response: fallbackResponse, suggestions },
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    try {
      // System prompt'u dil'e göre seç
      const systemPrompt = userLanguage === 'tr' ? SYSTEM_PROMPT_TR : SYSTEM_PROMPT_EN;
      
      // Context'i al
      const context = await getChatContext(ip, conversationId);
      
      // Mesajları hazırla
      const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...previousMessages.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content
        })),
        ...context,
        { role: "user", content: message }
      ];

      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.8,
        max_tokens: 800,
        presence_penalty: 0.6,
        frequency_penalty: 0.6,
        top_p: 0.9,
      });

      const response = completion.choices[0].message.content;

      if (!response) {
        throw new Error('No response generated');
      }

      // Context'i güncelle
      await updateChatContext(ip, conversationId, { role: "user", content: message });
      await updateChatContext(ip, conversationId, { role: "assistant", content: response });

      // Yanıtı cache'e kaydet
      await cacheResponse(message, response);

      return NextResponse.json(
        { response },
        { headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('[ChatBot] OpenAI API Error:', error);
      
      // Context'i temizle
      if (isKvEnabled) {
        try {
          await kv.del(`chat_context:${ip}:${conversationId}`);
        } catch {
          // Context temizleme hatası durumunda sessizce devam et
        }
      }
      
      // Fallback yanıt kullan
      const { response: fallbackResponse, suggestions } = generateFallbackResponse(message, userLanguage);
      return NextResponse.json(
        { response: fallbackResponse, suggestions },
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
  } catch (err: unknown) {
    console.error('Error processing chat message:', err);
    return NextResponse.json(
      { error: ERROR_MESSAGES.API_ERROR },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 