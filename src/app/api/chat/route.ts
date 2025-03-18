import { NextResponse } from 'next/server';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

// Detailed information about Furkan
const FURKAN_INFO = {
  personal: {
    name: "Furkan Akar",
    role: "Full Stack Developer",
    location: "Turkey",
    education: "Computer Engineering",
    languages: ["Turkish", "English (B2 Level)"],
    achievements: [
      "Completed Full Stack Open course with excellence",
      "Strong problem-solving skills",
      "Quick learner with adaptable mindset"
    ]
  },
  skills: {
    frontend: ["Next.js", "React", "TypeScript", "Three.js", "TailwindCSS", "Material-UI"],
    backend: ["Node.js", "Python", "FastAPI", "GraphQL", "RESTful APIs"],
    database: ["MongoDB", "PostgreSQL"],
    cloud: ["AWS", "Vercel", "Docker"],
    tools: ["Git", "VS Code", "Postman"],
    softSkills: [
      "Excellent English communication (B2 Level)",
      "Team collaboration",
      "Problem-solving",
      "Fast learning ability"
    ]
  },
  projects: [
    {
      name: "Personal Portfolio",
      description: "Modern and sophisticated web portfolio showcasing professional work and skills",
      technologies: ["Next.js", "Three.js", "TailwindCSS"],
      features: ["3D animations", "Responsive design", "Modern UI/UX", "Performance optimized"]
    },
    {
      name: "AI Chat Assistant",
      description: "Advanced chatbot using cutting-edge AI technology",
      technologies: ["Next.js", "TypeScript", "Hugging Face API"],
      features: ["Context-aware responses", "Natural language processing", "User-friendly interface"]
    }
  ],
  interests: [
    "Modern Web Development",
    "3D Graphics and Animations",
    "Artificial Intelligence",
    "Cloud Computing",
    "Open Source Development",
    "Emerging Technologies"
  ],
  experience: {
    summary: "Talented Full Stack Developer with a strong foundation in modern web technologies and a proven track record of building sophisticated applications. Completed the prestigious Full Stack Open course, demonstrating expertise in full-stack development. Excellent English communication skills (B2 level) enabling effective collaboration in international environments.",
    highlights: [
      "Expert in modern frontend development",
      "Strong backend architecture skills",
      "Full Stack Open course graduate",
      "Cloud deployment expertise",
      "Advanced English proficiency"
    ]
  }
};

// Keywords and related information
const KEYWORDS = {
  personal: ["who", "background", "education", "where", "live", "from", "about you", "furkan"],
  skills: ["skill", "technology", "tech stack", "framework", "language", "tool", "can you", "work with"],
  projects: ["project", "portfolio", "work", "built", "create", "develop", "made"],
  experience: ["experience", "work", "professional", "career", "job"],
  interests: ["interest", "hobby", "passion", "like", "enjoy"]
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const lowerMessage = message.toLowerCase();

    // Check if the message is about Furkan
    if (!isQuestionAboutFurkan(lowerMessage)) {
      return NextResponse.json({
        response: "I'm Furkan's AI assistant, and I can only answer questions about Furkan. Could you please ask something about him, his skills, projects, or experience?"
      });
    }

    // Determine the category of the question and generate response
    const response = generateResponse(lowerMessage);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      response: "I apologize, but I'm having trouble processing your request. I can tell you about Furkan's skills, projects, or experience. What would you like to know?"
    });
  }
}

function isQuestionAboutFurkan(message: string): boolean {
  // Filter out irrelevant topics
  const irrelevantTopics = [
    "weather", "news", "politics", "sports", "movie", "music", "food",
    "what is", "how to", "tell me about", "explain", "define",
    "can you help", "i need", "please assist"
  ];

  // If the message contains any of these topics and doesn't contain "furkan",
  // it's probably not about Furkan
  if (irrelevantTopics.some(topic => message.includes(topic)) && !message.includes("furkan")) {
    return false;
  }

  // Check all keyword categories
  return Object.values(KEYWORDS).some(category =>
    category.some(keyword => message.includes(keyword))
  );
}

function generateResponse(message: string): string {
  let response = "";

  // Personal info and background
  if (KEYWORDS.personal.some(keyword => message.includes(keyword))) {
    response = `Furkan is a talented ${FURKAN_INFO.personal.role} based in ${FURKAN_INFO.personal.location}. With a background in ${FURKAN_INFO.personal.education}, he has completed the prestigious Full Stack Open course and possesses excellent English communication skills (B2 level). ${FURKAN_INFO.experience.summary}`;
  }

  // Skills
  if (KEYWORDS.skills.some(keyword => message.includes(keyword))) {
    if (message.includes("frontend") || message.includes("front-end") || message.includes("front end")) {
      response = `In frontend development, Furkan is highly proficient with ${FURKAN_INFO.skills.frontend.join(', ')}. He has demonstrated his expertise through various projects and the Full Stack Open course.`;
    } else if (message.includes("backend") || message.includes("back-end") || message.includes("back end")) {
      response = `For backend development, Furkan expertly works with ${FURKAN_INFO.skills.backend.join(', ')}, building robust and scalable solutions.`;
    } else {
      response = `Furkan is an accomplished Full Stack Developer with expertise in frontend technologies like ${FURKAN_INFO.skills.frontend.slice(0, 3).join(', ')}, backend technologies like ${FURKAN_INFO.skills.backend.slice(0, 2).join(', ')}, and cloud platforms like ${FURKAN_INFO.skills.cloud.join(', ')}. His B2 level English proficiency enables effective communication in international development environments.`;
    }
  }

  // Projeler
  if (KEYWORDS.projects.some(keyword => message.includes(keyword))) {
    const projects = FURKAN_INFO.projects.map(p => 
      `${p.name}: ${p.description} (Built with ${p.technologies.join(', ')})`
    ).join('. ');
    response = `Here are some of Furkan's notable projects: ${projects}`;
  }

  // Deneyim
  if (KEYWORDS.experience.some(keyword => message.includes(keyword))) {
    response = `${FURKAN_INFO.experience.summary}. His key areas of expertise include ${FURKAN_INFO.experience.highlights.join(', ')}.`;
  }

  // İlgi alanları
  if (KEYWORDS.interests.some(keyword => message.includes(keyword))) {
    response = `Furkan is passionate about ${FURKAN_INFO.interests.join(', ')}. He particularly enjoys working with modern web technologies and exploring new developments in these fields.`;
  }

  // Eğer hiçbir kategori eşleşmediyse
  if (!response) {
    response = `I understand you're asking about Furkan. He's a ${FURKAN_INFO.personal.role} specializing in modern web development. Would you like to know more about his skills, projects, or experience?`;
  }

  return response;
} 