import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { kv } from '@vercel/kv';

// KV bağlantı kontrolü
const isKvEnabled = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

// OpenAI istemcisi
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rate limiting için sabitler
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 saat
const MAX_REQUESTS_PER_HOUR = 100;

// Cache için sabitler
const CACHE_TTL = 60 * 60; // 1 saat

const SYSTEM_PROMPT = `You are Furkan's AI assistant, designed to have engaging and natural conversations about his professional background. While maintaining professionalism, you can be conversational, friendly, and occasionally add a touch of personality to your responses.

Key Guidelines:
1. Be conversational but professional
2. Use natural language and occasional humor when appropriate
3. Keep responses concise but informative
4. Show enthusiasm about Furkan's work and achievements
5. Be helpful and encouraging
6. Maintain context awareness in multi-turn conversations

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
- Frontend: React, Next.js, TypeScript, Tailwind CSS, React Bootstrap, Redux, Zustand, Recoil
- Backend: Node.js, Express, GraphQL, RESTful APIs, WebSockets
- Database: MongoDB, PostgreSQL, Mongoose
- Cloud: AWS, Vercel, Docker, Netlify, CI/CD Pipelines
- Testing: Jest, Cypress, Supertest
- Tools: Git, VS Code, Postman, Vite, Babel, npm

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

Response Style:
- Use a friendly, conversational tone
- Add relevant emojis occasionally (but not too many)
- Share interesting facts or anecdotes when relevant
- Be enthusiastic about technology and development
- Use analogies to explain complex concepts
- Show personality while maintaining professionalism
- Keep responses concise but engaging

Remember: While you can be creative and engaging, always stay within the context of Furkan's professional background and experience. If asked about topics outside this scope, politely redirect the conversation back to relevant topics.`;

// Fallback yanıtlar
const FALLBACK_RESPONSES = {
  skills: "Furkan is a Full Stack Developer with expertise in React, Node.js, and modern web technologies. He specializes in building scalable applications using the MERN stack.",
  projects: "Furkan has worked on various projects including a personal portfolio website with 3D animations and AI chatbot, as well as full-stack applications using MERN stack.",
  experience: "With 3+ years of experience, Furkan specializes in full-stack development, focusing on MERN stack and modern web technologies. He's currently preparing for AWS Developer Associate certification.",
  default: "I can tell you about Furkan's skills, projects, and experience. What would you like to know specifically?"
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
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('tech')) {
    return FALLBACK_RESPONSES.skills;
  }
  if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
    return FALLBACK_RESPONSES.projects;
  }
  if (lowerMessage.includes('experience') || lowerMessage.includes('job')) {
    return FALLBACK_RESPONSES.experience;
  }
  
  return FALLBACK_RESPONSES.default;
}

export async function POST(req: Request) {
  try {
    if (!req.body) {
      return NextResponse.json(
        { error: 'Request body is missing' },
        { status: 400 }
      );
    }

    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Rate limit kontrolü
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const isAllowed = await checkRateLimit(ip);
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Cache kontrolü
    const cachedResponse = await getCachedResponse(message);
    if (cachedResponse) {
      return NextResponse.json({ response: cachedResponse });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0].message.content;

      if (!response) {
        throw new Error('No response generated');
      }

      // Yanıtı cache'e kaydet
      await cacheResponse(message, response);

      return NextResponse.json({ response });
    } catch (error: any) {
      // OpenAI hatası durumunda fallback yanıt kullan
      const fallbackResponse = generateFallbackResponse(message);
      return NextResponse.json({ response: fallbackResponse });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 