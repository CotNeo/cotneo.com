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
- Role: Full Stack Developer
- Location: Turkey
- Education: Computer Engineering
- Languages: Turkish, English
- Personality: Passionate about technology, always learning, and enjoys solving complex problems
- Summary: A passionate Full Stack Developer specializing in MERN stack and modern web technologies

Skills:
- Frontend: React, Next.js, TypeScript, Tailwind CSS, React Bootstrap, Redux, Three.js
- Backend: Node.js, Express, JWT, bcrypt, multer
- Database: MongoDB, PostgreSQL, Mongoose
- Cloud: AWS, Vercel, Docker, Netlify, CI/CD Pipelines
- Testing: Jest, Cypress, Supertest
- Tools: Git, VS Code, Postman, Vite, npm

Projects:
1. Personal Portfolio
   - Description: A modern portfolio website with 3D animations and AI chatbot
   - Technologies: Next.js, TypeScript, Three.js, Tailwind CSS
   - Features: 3D Animations, AI Chat Assistant, Responsive Design, Dark Mode
   - Link: https://cotneo.com
   - Fun Fact: The 3D background was inspired by modern tech aesthetics

2. Full Stack Applications
   - Description: Various MERN stack applications with modern features
   - Technologies: React, Node.js, MongoDB, Express, GraphQL
   - Features: RESTful APIs, GraphQL Integration, Real-time Updates, Authentication
   - Link: https://github.com/CotNeo
   - Fun Fact: Some projects include AI-powered features

Experience:
- Current Role: Full Stack Developer
- Years of Experience: 3+
- Summary: 3+ years of experience in full-stack development, specializing in MERN stack and modern web technologies. Currently preparing for AWS Developer Associate certification.
- Highlights: Expertise in MERN Stack Development, Building Scalable & Performant Applications, Implementing Microservices Architecture, Web Performance Optimization, DevOps & Automation
- Fun Fact: Started as a self-taught developer and now working on complex enterprise applications

Interests:
- Web Development
- System Design
- Microservices
- AI-Driven Applications
- DevOps Automation
- Cloud Computing
- Web Performance
- Open Source
- Fun Fact: Particularly interested in the intersection of AI and web development

Certifications:
1. Full Stack Open Certificate (University of Helsinki)
2. Full Stack GraphQL Certificate (University of Helsinki)
3. AWS Developer Associate (In Progress)
- Fun Fact: The Full Stack Open course was completed with distinction`;

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
- Rol: Full Stack Developer
- Konum: Türkiye
- Eğitim: Bilgisayar Mühendisliği
- Diller: Türkçe, İngilizce
- Kişilik: Teknolojiye tutkulu, sürekli öğrenen ve karmaşık problemleri çözmeyi seven
- Özet: MERN stack ve modern web teknolojilerinde uzmanlaşmış tutkulu bir Full Stack Developer

Yetenekler:
- Frontend: React, Next.js, TypeScript, Tailwind CSS, React Bootstrap, Redux, Three.js
- Backend: Node.js, Express, JWT, bcrypt, multer
- Veritabanı: MongoDB, PostgreSQL, Mongoose
- Cloud: AWS, Vercel, Docker, Netlify, CI/CD Pipelines
- Test: Jest, Cypress, Supertest
- Araçlar: Git, VS Code, Postman, Vite, npm

Projeler:
1. Kişisel Portfolio
   - Açıklama: 3D animasyonlar ve AI chatbot içeren modern bir portfolio web sitesi
   - Teknolojiler: Next.js, TypeScript, Three.js, Tailwind CSS
   - Özellikler: 3D Animasyonlar, AI Chat Asistanı, Responsive Tasarım, Dark Mode
   - Link: https://cotneo.com
   - İlginç Bilgi: 3D arka plan modern teknoloji estetiğinden ilham alındı

2. Full Stack Uygulamalar
   - Açıklama: Modern özellikler içeren çeşitli MERN stack uygulamaları
   - Teknolojiler: React, Node.js, MongoDB, Express, GraphQL
   - Özellikler: RESTful API'ler, GraphQL Entegrasyonu, Gerçek Zamanlı Güncellemeler, Kimlik Doğrulama
   - Link: https://github.com/CotNeo
   - İlginç Bilgi: Bazı projeler AI destekli özellikler içeriyor

Deneyim:
- Mevcut Rol: Full Stack Developer
- Deneyim Yılı: 3+
- Özet: MERN stack ve modern web teknolojilerinde uzmanlaşmış, 3+ yıllık full-stack geliştirme deneyimi. Şu anda AWS Developer Associate sertifikası için hazırlanıyor.
- Öne Çıkanlar: MERN Stack Geliştirme Uzmanlığı, Ölçeklenebilir ve Performanslı Uygulamalar İnşa Etme, Mikroservis Mimarisi Uygulama, Web Performans Optimizasyonu, DevOps ve Otomasyon
- İlginç Bilgi: Kendi kendine öğrenen bir geliştirici olarak başladı ve şimdi karmaşık kurumsal uygulamalar üzerinde çalışıyor

İlgi Alanları:
- Web Geliştirme
- Sistem Tasarımı
- Mikroservisler
- AI Destekli Uygulamalar
- DevOps Otomasyonu
- Cloud Computing
- Web Performansı
- Açık Kaynak
- İlginç Bilgi: Özellikle AI ve web geliştirmenin kesişim noktasıyla ilgileniyor

Sertifikalar:
1. Full Stack Open Sertifikası (Helsinki Üniversitesi)
2. Full Stack GraphQL Sertifikası (Helsinki Üniversitesi)
3. AWS Developer Associate (Devam Ediyor)
- İlginç Bilgi: Full Stack Open kursu başarıyla tamamlandı`;

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
  skills: "Furkan is a Full Stack Developer with expertise in both frontend and backend technologies. On the frontend, he's skilled in React, Next.js, TypeScript, Tailwind CSS, and Three.js. For backend, he's proficient in Node.js, Express, and MongoDB. He specializes in building modern, scalable applications using the MERN stack.",
  projects: "Furkan has worked on several exciting projects! 🚀\n\n1. **Personal Portfolio** - A modern portfolio website (cotneo.com) featuring 3D animations using Three.js, an AI chatbot, and responsive design. Built with Next.js, TypeScript, and Tailwind CSS.\n\n2. **Full Stack Applications** - Various MERN stack applications with features like RESTful APIs, GraphQL integration, real-time updates, and authentication systems. You can check out his GitHub (github.com/CotNeo) for more details.\n\n3. **Cloud-Based Solutions** - Projects deployed on AWS, Vercel, and other cloud platforms with CI/CD pipelines.\n\nAll projects focus on modern web technologies, performance optimization, and creating engaging user experiences!",
  experience: "With 3+ years of experience, Furkan specializes in full-stack development, focusing on MERN stack and modern web technologies. He's currently preparing for AWS Developer Associate certification. His expertise includes building scalable applications, implementing microservices architecture, web performance optimization, and DevOps automation.",
  cloud: "Furkan has experience with various cloud technologies including AWS, Vercel, Docker, and Netlify. He's currently preparing for AWS Developer Associate certification and has worked on deploying and managing cloud-based applications with CI/CD pipelines.",
  nodejs: "Furkan has extensive experience with Node.js, using it for backend development in various projects. He's proficient in building RESTful APIs, implementing authentication systems, and working with Express.js framework.",
  threejs: "Furkan has experience with Three.js and 3D web development. He created the 3D background for his portfolio website using Three.js, showcasing his ability to create immersive web experiences. The 3D elements were inspired by modern tech aesthetics and demonstrate his skills in 3D graphics programming.",
  frontend: "Furkan has strong frontend development skills, specializing in React, Next.js, and TypeScript. He's experienced in building responsive, modern UIs using Tailwind CSS and has created interactive 3D web experiences using Three.js. His frontend work focuses on creating engaging user experiences with attention to performance and accessibility.",
  database: "Furkan works with both SQL and NoSQL databases. He has extensive experience with **MongoDB** (NoSQL) for document-based storage and **PostgreSQL** (SQL) for relational data. He uses Mongoose as an ODM for MongoDB and has experience with database design, query optimization, and data modeling. His database expertise includes working with complex data structures, implementing efficient queries, and ensuring data integrity in full-stack applications.",
  default: "I can tell you about Furkan's skills, projects, and experience. What would you like to know specifically?"
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
        ? "Furkan, 3+ yıllık deneyime sahip bir Full Stack Developer. MERN stack, modern web teknolojileri, cloud computing (AWS), DevOps ve 3D web geliştirme konularında bilgili. Şu anda AWS Developer Associate sertifikası için hazırlanıyor ve sürekli olarak yeni teknolojiler öğreniyor. Hem frontend hem de backend geliştirme konularında kapsamlı bilgiye sahip."
        : "Furkan is an experienced Full Stack Developer with 3+ years of experience. He's knowledgeable in MERN stack, modern web technologies, cloud computing (AWS), DevOps, and 3D web development. He's currently preparing for AWS Developer Associate certification and continuously learning new technologies. He has comprehensive knowledge in both frontend and backend development.",
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
        ? "Furkan, MERN stack ve modern web teknolojilerinde uzmanlaşmış bir Full Stack Developer. 3+ yıllık deneyime sahip ve şu anda AWS Developer Associate sertifikası için hazırlanıyor. Ölçeklenebilir uygulamalar geliştirme, mikroservis mimarisi uygulama, web performans optimizasyonu ve DevOps otomasyonu konularında uzman. React, Next.js, Node.js, MongoDB gibi teknolojilerle modern web uygulamaları geliştirebilir."
        : "Furkan is a Full Stack Developer specializing in MERN stack and modern web technologies. With 3+ years of experience, he's currently preparing for AWS Developer Associate certification. His expertise includes building scalable applications, implementing microservices architecture, web performance optimization, and DevOps automation. He can develop modern web applications using technologies like React, Next.js, Node.js, MongoDB.",
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
      response = "Furkan, hem frontend hem de backend teknolojilerinde uzman bir Full Stack Developer. Frontend'de React, Next.js, TypeScript, Tailwind CSS ve Three.js konularında yetenekli. Backend'de Node.js, Express ve MongoDB konularında deneyimli. Modern, ölçeklenebilir uygulamalar geliştirmek için MERN stack'i kullanıyor.";
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
      response = "Furkan'ın güçlü frontend geliştirme yetenekleri var, React, Next.js ve TypeScript konularında uzman. Tailwind CSS kullanarak responsive, modern UI'lar oluşturma deneyimine sahip ve Three.js ile interaktif 3D web deneyimleri yaratmış. Frontend çalışmaları performans ve erişilebilirliğe dikkat ederek etkileyici kullanıcı deneyimleri oluşturmaya odaklanıyor.";
    } else {
      response = FALLBACK_RESPONSES.frontend;
    }
    suggestions = CONTEXT_SUGGESTIONS.frontend;
  }
  // Database sorguları
  else if (lowerMessage.includes('database') || lowerMessage.includes('mongodb') || lowerMessage.includes('postgresql') || 
           lowerMessage.includes('sql') || lowerMessage.includes('nosql') || lowerMessage.includes('veritabanı')) {
    if (userLanguage === 'tr') {
      response = "Furkan hem SQL hem de NoSQL veritabanlarıyla çalışıyor. **MongoDB** (NoSQL) için doküman tabanlı depolama ve **PostgreSQL** (SQL) için ilişkisel veri konularında kapsamlı deneyime sahip. MongoDB için Mongoose'u ODM olarak kullanıyor ve veritabanı tasarımı, sorgu optimizasyonu ve veri modelleme konularında deneyimi var. Veritabanı uzmanlığı karmaşık veri yapılarıyla çalışmayı, verimli sorgular uygulamayı ve full-stack uygulamalarda veri bütünlüğünü sağlamayı içeriyor.";
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
      response = "3+ yıllık deneyime sahip Furkan, MERN stack ve modern web teknolojilerine odaklanarak full-stack geliştirme konusunda uzmanlaşmış. Şu anda AWS Developer Associate sertifikası için hazırlanıyor. Uzmanlığı ölçeklenebilir uygulamalar geliştirme, mikroservis mimarisi uygulama, web performans optimizasyonu ve DevOps otomasyonunu içeriyor.";
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
      response = "Furkan birkaç heyecan verici proje üzerinde çalıştı! 🚀\n\n1. **Kişisel Portfolio** - Three.js kullanarak 3D animasyonlar, AI chatbot ve responsive tasarım içeren modern bir portfolio web sitesi (cotneo.com). Next.js, TypeScript ve Tailwind CSS ile geliştirildi.\n\n2. **Full Stack Uygulamalar** - RESTful API'ler, GraphQL entegrasyonu, gerçek zamanlı güncellemeler ve kimlik doğrulama sistemleri gibi modern özelliklere sahip çeşitli MERN stack uygulamaları. Daha fazla detay için GitHub'ını (github.com/CotNeo) kontrol edebilirsin.\n\n3. **Cloud-Based Çözümler** - AWS, Vercel ve diğer cloud platformlarında CI/CD pipeline'ları ile dağıtılan projeler.\n\nTüm projeler modern web teknolojilerine, performans optimizasyonuna ve etkileyici kullanıcı deneyimleri yaratmaya odaklanıyor!";
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