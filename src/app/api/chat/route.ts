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

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

// OpenAI istemcisi
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1', // Ensure we're using the correct API endpoint
});

// Rate limiting için sabitler
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 saat
const MAX_REQUESTS_PER_HOUR = 100;

// Cache için sabitler
const CACHE_TTL = 60 * 60; // 1 saat

// Context yönetimi için sabitler
const MAX_CONTEXT_LENGTH = 10; // Son 10 mesajı tut
const CONTEXT_WINDOW = 60 * 60 * 1000; // 1 saat

const SYSTEM_PROMPT = `You are Furkan's AI assistant, designed to have engaging, creative, and natural conversations about his professional background. You should be enthusiastic, creative, and add personality to your responses while maintaining professionalism.

Key Guidelines:
1. Be creative and engaging in your responses
2. Use analogies and metaphors to explain complex concepts
3. Add relevant emojis and occasional humor when appropriate
4. Show genuine enthusiasm about Furkan's work and achievements
5. Use storytelling techniques to make responses more interesting
6. Maintain context awareness in multi-turn conversations
7. Be conversational and friendly while staying professional
8. Use creative examples and real-world applications
9. Add interesting facts and anecdotes when relevant
10. Keep responses concise but engaging

Response Style:
- Start with an engaging hook or interesting fact
- Use creative analogies to explain technical concepts
- Add relevant emojis (but not too many) to make responses more engaging
- Share interesting anecdotes or examples
- Use storytelling techniques to make responses more memorable
- Be enthusiastic and passionate about technology
- Use creative comparisons to make complex topics more relatable
- Add personal touches and unique perspectives
- Keep the tone friendly and conversational
- End with an engaging question or interesting fact

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
- Backend: Node.js, Express, JWT, bcrypt, multer, 
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
- Fun Fact: The Full Stack Open course was completed with distinction

Remember: While you can be creative and engaging, always stay within the context of Furkan's professional background and experience. If asked about topics outside this scope, politely redirect the conversation back to relevant topics.`;

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
  projects: "Furkan has worked on various projects including a personal portfolio website with 3D animations and AI chatbot, as well as full-stack applications using MERN stack.",
  experience: "With 3+ years of experience, Furkan specializes in full-stack development, focusing on MERN stack and modern web technologies. He's currently preparing for AWS Developer Associate certification.",
  cloud: "Furkan has experience with various cloud technologies including AWS, Vercel, Docker, and Netlify. He's currently preparing for AWS Developer Associate certification and has worked on deploying and managing cloud-based applications.",
  nodejs: "Furkan has extensive experience with Node.js, using it for backend development in various projects. He's proficient in building RESTful APIs, implementing authentication systems, and working with Express.js framework.",
  threejs: "Furkan has experience with Three.js and 3D web development. He created the 3D background for his portfolio website using Three.js, showcasing his ability to create immersive web experiences. The 3D elements were inspired by modern tech aesthetics and demonstrate his skills in 3D graphics programming.",
  frontend: "Furkan has strong frontend development skills, specializing in React, Next.js, and TypeScript. He's experienced in building responsive, modern UIs using Tailwind CSS and has created interactive 3D web experiences using Three.js. His frontend work focuses on creating engaging user experiences with attention to performance and accessibility.",
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

// Fallback yanıt oluştur
function generateFallbackResponse(message: string): { response: string; suggestions: string[] } {
  const lowerMessage = message.toLowerCase();
  let response = FALLBACK_RESPONSES.default;
  let suggestions = SUGGESTION_MESSAGES;

  if (lowerMessage.includes('skill') || lowerMessage.includes('tech')) {
    response = FALLBACK_RESPONSES.skills;
    suggestions = CONTEXT_SUGGESTIONS.skills;
  } else if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
    response = FALLBACK_RESPONSES.projects;
    suggestions = CONTEXT_SUGGESTIONS.projects;
  } else if (lowerMessage.includes('experience') || lowerMessage.includes('job')) {
    response = FALLBACK_RESPONSES.experience;
    suggestions = CONTEXT_SUGGESTIONS.experience;
  } else if (lowerMessage.includes('cloud') || lowerMessage.includes('aws')) {
    response = FALLBACK_RESPONSES.cloud;
    suggestions = CONTEXT_SUGGESTIONS.cloud;
  } else if (lowerMessage.includes('node') || lowerMessage.includes('backend')) {
    response = FALLBACK_RESPONSES.nodejs;
    suggestions = CONTEXT_SUGGESTIONS.nodejs;
  } else if (lowerMessage.includes('3d') || lowerMessage.includes('three') || lowerMessage.includes('animation')) {
    response = FALLBACK_RESPONSES.threejs;
    suggestions = CONTEXT_SUGGESTIONS.threejs;
  } else if (lowerMessage.includes('frontend') || lowerMessage.includes('react') || lowerMessage.includes('ui')) {
    response = FALLBACK_RESPONSES.frontend;
    suggestions = CONTEXT_SUGGESTIONS.frontend;
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

    try {
      // Context'i al
      const context = await getChatContext(ip, conversationId);
      
      // Mesajları hazırla
      const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...previousMessages.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content
        })),
        ...context,
        { role: "user", content: message }
      ];

      const completion = await openai.chat.completions.create({
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
      console.error('OpenAI API Error:', error);
      
      // Context'i temizle
      if (isKvEnabled) {
        try {
          await kv.del(`chat_context:${ip}:${conversationId}`);
        } catch {
          // Context temizleme hatası durumunda sessizce devam et
        }
      }
      
      // Fallback yanıt kullan
      const { response: fallbackResponse, suggestions } = generateFallbackResponse(message);
      return NextResponse.json(
        { response: fallbackResponse, suggestions },
        { headers: { 'Content-Type': 'application/json' } }
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