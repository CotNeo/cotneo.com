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
    let response = '';

    // Check if the question is about Furkan
    const lowerMessage = message.toLowerCase();
    const isAboutFurkan = Object.values(KEYWORDS).some(category =>
      category.some(keyword => lowerMessage.includes(keyword))
    );

    if (!isAboutFurkan) {
      response = "I can only answer questions about Furkan. Please ask me something about his skills, projects, experience, or background.";
    } else {
      // Generate response based on the message content
      if (KEYWORDS.personal.some(keyword => lowerMessage.includes(keyword))) {
        response = `${FURKAN_INFO.personal.name} is a ${FURKAN_INFO.personal.role} based in ${FURKAN_INFO.personal.location}. ${FURKAN_INFO.experience.summary}`;
      } else if (KEYWORDS.skills.some(keyword => lowerMessage.includes(keyword))) {
        response = `Furkan is proficient in frontend technologies like ${FURKAN_INFO.skills.frontend.join(', ')}, backend technologies like ${FURKAN_INFO.skills.backend.join(', ')}, and cloud platforms like ${FURKAN_INFO.skills.cloud.join(', ')}.`;
      } else if (KEYWORDS.projects.some(keyword => lowerMessage.includes(keyword))) {
        const projectInfo = FURKAN_INFO.projects.map(p => 
          `${p.name}: ${p.description} (Built with ${p.technologies.join(', ')})`
        ).join('. ');
        response = `Here are some of Furkan's notable projects: ${projectInfo}`;
      } else if (KEYWORDS.experience.some(keyword => lowerMessage.includes(keyword))) {
        response = FURKAN_INFO.experience.summary;
      } else if (KEYWORDS.interests.some(keyword => lowerMessage.includes(keyword))) {
        response = `Furkan is passionate about ${FURKAN_INFO.interests.join(', ')}.`;
      } else {
        response = `I understand you're asking about Furkan. He's a ${FURKAN_INFO.personal.role} specializing in modern web development. Would you like to know more about his skills, projects, or experience?`;
      }
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 