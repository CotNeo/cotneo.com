import { NextResponse } from 'next/server';

const FURKAN_INFO = {
  personal: {
    name: "Furkan",
    role: "Full Stack Developer",
    location: "Turkey",
    education: "Computer Engineering",
    languages: ["Turkish", "English"],
    summary: "A passionate Full Stack Developer specializing in MERN stack and modern web technologies"
  },
  skills: {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "React Bootstrap", "Redux", "Zustand", "Recoil"],
    backend: ["Node.js", "Express", "GraphQL", "RESTful APIs", "WebSockets"],
    database: ["MongoDB", "PostgreSQL", "Mongoose"],
    cloud: ["AWS", "Vercel", "Docker", "Netlify", "CI/CD Pipelines"],
    testing: ["Jest", "Cypress", "Supertest"],
    tools: ["Git", "VS Code", "Postman", "Vite", "Babel", "npm"]
  },
  projects: [
    {
      name: "Personal Portfolio",
      description: "A modern portfolio website with 3D animations and AI chatbot",
      technologies: ["Next.js", "TypeScript", "Three.js", "Tailwind CSS"],
      features: ["3D Animations", "AI Chat Assistant", "Responsive Design", "Dark Mode"],
      link: "https://cotneo.com"
    },
    {
      name: "Full Stack Applications",
      description: "Various MERN stack applications with modern features",
      technologies: ["React", "Node.js", "MongoDB", "Express", "GraphQL"],
      features: ["RESTful APIs", "GraphQL Integration", "Real-time Updates", "Authentication"],
      link: "https://github.com/CotNeo"
    }
  ],
  experience: {
    current: "Full Stack Developer",
    years: 3,
    summary: "3+ years of experience in full-stack development, specializing in MERN stack and modern web technologies. Currently preparing for AWS Developer Associate certification.",
    highlights: [
      "Expertise in MERN Stack Development",
      "Building Scalable & Performant Applications",
      "Implementing Microservices Architecture",
      "Web Performance Optimization",
      "DevOps & Automation"
    ],
    companies: [
      {
        name: "freelancer",
        role: "Full Stack Developer",
        period: "2021-present",
        achievements: [
          "Developed multiple full-stack applications",
          "Implemented modern state management solutions",
          "Optimized application performance",
          "Integrated AI-driven features"
        ]
      }
    ]
  },
  interests: [
    "Web Development",
    "System Design",
    "Microservices",
    "AI-Driven Applications",
    "DevOps Automation",
    "Cloud Computing",
    "Web Performance",
    "Open Source"
  ],
  certifications: [
    {
      name: "Full Stack Open Certificate",
      issuer: "University of Helsinki",
      link: "https://studies.cs.helsinki.fi/stats/api/certificate/fullstackopen/en/4122575dc0cda9c0d7ae61c0476a0d16"
    },
    {
      name: "Full Stack GraphQL Certificate",
      issuer: "University of Helsinki",
      link: "https://studies.cs.helsinki.fi/stats/api/certificate/fs-graphql/en/9a2e150918ec8fa50aaae6c6b5c1f93d"
    },
    {
      name: "AWS Developer Associate",
      status: "In Progress"
    }
  ]
};

const KEYWORDS = {
  personal: ["who", "background", "education", "language", "about", "where", "location", "tell", "what", "how", "when"],
  skills: ["skill", "technology", "tech", "stack", "frontend", "backend", "database", "cloud", "tool", "use", "work", "know", "can"],
  projects: ["project", "portfolio", "work", "built", "create", "develop", "application", "make", "done", "show", "demo"],
  experience: ["experience", "job", "work", "company", "achievement", "role", "position", "year", "career", "professional"],
  interests: ["interest", "passion", "hobby", "like", "enjoy", "focus", "love", "prefer", "favorite"]
};

function generateContextAwareResponse(message: string, info: any): string {
  try {
    const lowerMessage = message.toLowerCase();
    let responses: string[] = [];
    let context: string[] = [];

    // Improved context gathering
    if (lowerMessage.includes("example") || lowerMessage.includes("specific") || lowerMessage.includes("like")) {
      context.push("specific");
    }
    if (lowerMessage.includes("detail") || lowerMessage.includes("more") || lowerMessage.includes("tell") || lowerMessage.includes("explain")) {
      context.push("detailed");
    }
    if (lowerMessage.includes("latest") || lowerMessage.includes("recent") || lowerMessage.includes("current") || lowerMessage.includes("now")) {
      context.push("recent");
    }

    // Check for general questions
    if (lowerMessage.includes("hi") || lowerMessage.includes("hello") || lowerMessage.includes("hey")) {
      responses.push("Hello! I'm here to tell you about Furkan. What would you like to know?");
      return responses.join(" ");
    }

    // More flexible keyword matching
    const matchedCategories = Object.entries(KEYWORDS).filter(([_, keywords]) =>
      keywords.some(keyword => lowerMessage.includes(keyword))
    ).map(([category]) => category);

    // If no exact matches, try to infer the category from the question
    if (matchedCategories.length === 0) {
      if (lowerMessage.includes("do") || lowerMessage.includes("can") || lowerMessage.includes("what")) {
        matchedCategories.push("skills");
      }
      if (lowerMessage.includes("made") || lowerMessage.includes("created")) {
        matchedCategories.push("projects");
      }
      if (lowerMessage.includes("worked") || lowerMessage.includes("doing")) {
        matchedCategories.push("experience");
      }
    }

    // Generate responses for each matched category
    matchedCategories.forEach(category => {
      switch (category) {
        case "personal":
          if (context.includes("detailed")) {
            responses.push(`${info.personal.name} is a ${info.personal.role} based in ${info.personal.location}. With a background in ${info.personal.education}, he is ${info.personal.summary}. He is fluent in ${info.personal.languages.join(" and ")}.`);
          } else {
            responses.push(`${info.personal.name} is a ${info.personal.role} based in ${info.personal.location}.`);
          }
          break;

        case "skills":
          if (lowerMessage.includes("frontend")) {
            const frontendSkills = info.skills.frontend;
            responses.push(context.includes("detailed")
              ? `In frontend development, Furkan specializes in ${frontendSkills.slice(0, -1).join(", ")} and ${frontendSkills.slice(-1)}. He has extensive experience building responsive and performant web applications using these technologies.`
              : `Frontend skills include ${frontendSkills.join(", ")}.`);
          } else if (lowerMessage.includes("backend")) {
            const backendSkills = info.skills.backend;
            responses.push(context.includes("detailed")
              ? `For backend development, Furkan works with ${backendSkills.join(", ")}. He has built scalable APIs and microservices using these technologies.`
              : `Backend technologies include ${backendSkills.join(", ")}.`);
          } else if (lowerMessage.includes("database")) {
            responses.push(`Furkan has experience with databases like ${info.skills.database.join(", ")}.`);
          } else if (lowerMessage.includes("cloud")) {
            responses.push(`In cloud technologies, Furkan works with ${info.skills.cloud.join(", ")}.`);
          } else {
            responses.push(context.includes("detailed")
              ? `Furkan's technical expertise spans frontend (${info.skills.frontend.join(", ")}), backend (${info.skills.backend.join(", ")}), databases (${info.skills.database.join(", ")}), and cloud platforms (${info.skills.cloud.join(", ")}).`
              : `Technical skills include frontend and backend development, database management, and cloud technologies.`);
          }
          break;

        case "projects":
          const relevantProjects = info.projects.filter((p: any) => 
            lowerMessage.includes(p.name.toLowerCase()) || 
            p.technologies.some((tech: string) => lowerMessage.includes(tech.toLowerCase()))
          );

          if (relevantProjects.length > 0) {
            relevantProjects.forEach((project: any) => {
              if (context.includes("detailed")) {
                responses.push(`${project.name}: ${project.description}. Built using ${project.technologies.join(", ")}. Key features include ${project.features.join(", ")}. You can check it out at ${project.link}`);
              } else {
                responses.push(`${project.name}: ${project.description}. Built with ${project.technologies.join(", ")}.`);
              }
            });
          } else if (context.includes("recent")) {
            const latestProject = info.projects[0];
            responses.push(`Most recent project: ${latestProject.name} - ${latestProject.description}`);
          } else {
            responses.push(`Notable projects include: ${info.projects.map((p: any) => p.name).join(", ")}.`);
          }
          break;

        case "experience":
          if (context.includes("detailed")) {
            responses.push(info.experience.summary);
            responses.push(`Current role: ${info.experience.current}`);
            responses.push(`Key achievements: ${info.experience.highlights.join(", ")}`);
          } else if (context.includes("specific")) {
            const company = info.experience.companies[0];
            responses.push(`At ${company.name}, as ${company.role}, key achievements include: ${company.achievements.join(", ")}`);
          } else {
            responses.push(info.experience.summary);
          }
          break;

        case "interests":
          if (lowerMessage.includes("tech")) {
            const techInterests = info.interests.filter((interest: string) => 
              interest.toLowerCase().includes("development") || 
              interest.toLowerCase().includes("tech") ||
              interest.toLowerCase().includes("ai")
            );
            responses.push(`In the tech world, Furkan is particularly interested in ${techInterests.join(", ")}.`);
          } else {
            responses.push(`Furkan is passionate about ${info.interests.join(", ")}.`);
          }
          break;
      }
    });

    // Enhanced fallback response
    if (responses.length === 0) {
      const generalInfo = [
        `Furkan is a ${info.personal.role} with ${info.experience.years}+ years of experience.`,
        `He specializes in ${info.skills.frontend.slice(0, 3).join(", ")} for frontend development.`,
        `You can ask about his skills, projects, experience, or interests.`
      ];
      responses.push(generalInfo.join(" "));
    }

    return responses.join(" ");
  } catch (error) {
    console.error('Error in generateContextAwareResponse:', error);
    throw new Error('Failed to generate response');
  }
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

    // Check if the question is about Furkan
    const lowerMessage = message.toLowerCase();
    const isAboutFurkan = Object.values(KEYWORDS).some(category =>
      category.some(keyword => lowerMessage.includes(keyword))
    );

    let response: string;
    
    if (!isAboutFurkan) {
      response = "I can only answer questions about Furkan. Please ask me something about his skills, projects, experience, or background. For example, you can ask about his technical skills, recent projects, or work experience.";
    } else {
      try {
        response = generateContextAwareResponse(message, FURKAN_INFO);
      } catch (error) {
        console.error('Error generating response:', error);
        return NextResponse.json(
          { error: 'Failed to generate response' },
          { status: 500 }
        );
      }
    }

    if (!response) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 