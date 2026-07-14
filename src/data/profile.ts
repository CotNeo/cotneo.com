/**
 * Single source of truth for all portfolio content.
 * Update this file to change site copy, experience, projects and skills.
 *
 * NOTE: Company names, employment dates and per-project repo/demo links are
 * intentionally generic or omitted where not publicly shareable.
 * See docs/10-missing-info.md for the list of placeholders to fill in.
 */

export const site = {
  name: 'Furkan Akar',
  title: 'Full-Stack & Mobile Software Developer',
  tagline: 'Building web, mobile and enterprise software that keeps real-world operations moving.',
  location: 'Istanbul, Türkiye',
  timezone: 'UTC+3',
  email: 'furkanaliakar@gmail.com',
  url: 'https://cotneo.com',
  availability: 'Open to remote and relocation-supported roles',
  intro:
    'I work across the full stack — React and Next.js on the web, native Android and React Native on mobile, .NET and Node.js on the backend, and Oracle PL/SQL underneath it all. Most of my day-to-day work ships to production in logistics operations: barcode scanning, label printing, shipment and invoicing flows used in the field every day.',
} as const;

export const socials = [
  { name: 'GitHub', href: 'https://github.com/CotNeo', id: 'github' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/furkanaliakar/', id: 'linkedin' },
  { name: 'Stack Overflow', href: 'https://stackoverflow.com/users/25318290/cotneo', id: 'stackoverflow' },
  { name: 'Medium', href: 'https://medium.com/@furkanaliakar', id: 'medium' },
  { name: 'freeCodeCamp', href: 'https://www.freecodecamp.org/cotneo', id: 'freecodecamp' },
  { name: 'Email', href: 'mailto:furkanaliakar@gmail.com', id: 'email' },
] as const;

export interface ExperienceEntry {
  role: string;
  org: string;
  period: string;
  summary: string;
  points: string[];
  stack: string[];
}

export const experience: ExperienceEntry[] = [
  {
    role: 'Operational Software / Mobile Software Specialist',
    org: 'Nationwide logistics company — Istanbul',
    period: 'Current',
    summary:
      'Developing and maintaining the mobile and backend software behind daily cargo operations: native Android apps on Zebra handheld terminals, .NET 8 Web APIs, and Oracle PL/SQL procedures powering shipment, invoicing and delivery-point workflows.',
    points: [
      'Build and maintain native Android (Java) applications used in the field on Zebra handheld terminals — barcode scanning, piece validation, and multi-piece shipment flows.',
      'Develop .NET 8 Web API services in C# that connect mobile clients to Oracle stored procedures and packages, including order-to-invoice and marketplace shipment flows (Amazon, Trendyol, N11-style platforms).',
      'Implement label and barcode printing over TCP sockets (port 9100) to Zebra printers using ZPL and EPL, including reject-label and reprint scenarios.',
      'Integrate external SOAP services for order and address lookups, and Bearer-token authentication with deep links between enterprise Android apps.',
      'Debug production issues end to end — Android logcat and network logs, API traces and Oracle error analysis — and resolve mismatches between procedures, endpoints and mobile screens.',
      'Write test-case matrices and UAT scenarios, document activity–endpoint–procedure mappings, and manage releases through Azure DevOps, APK release builds and .NET publish pipelines.',
    ],
    stack: ['Java', 'Android', 'React Native CLI', '.NET 8', 'C#', 'Oracle', 'PL/SQL', 'REST', 'SOAP', 'ZPL/EPL', 'Azure DevOps'],
  },
  {
    role: 'Risk & Security Systems Operations',
    org: 'Same logistics organization — earlier role',
    period: 'Earlier',
    summary:
      'Monitored and operated the physical security technology of a large logistics network — a fleet of roughly 1,300 CCTV and security devices — before moving into software development.',
    points: [
      'Tracked device health across ~1,300 cameras and security systems; performed IP changes, camera health checks and cloud video exports.',
      'Managed user and device authorization matrices and access permissions across the organization.',
      'Analyzed operational incidents and coordinated with technical teams to resolve them, working remote and shift-based on business-critical systems.',
    ],
    stack: ['CCTV systems', 'Device fleet management', 'Access management', 'Incident analysis'],
  },
  {
    role: 'Independent Projects & Freelance',
    org: 'Self-directed — web, SaaS and automation',
    period: 'Ongoing',
    summary:
      'Design, build and run my own products end to end: an AI-assisted CV builder, a document-grounded RAG chatbot, WhatsApp lead automation, and a live OpenCart e-commerce store I operate in production.',
    points: [
      'Ship full-stack products with Next.js, TypeScript, Node.js and MongoDB — from data model to deployment.',
      'Build AI features with the OpenAI API, retrieval-augmented generation, Qdrant vector search and local models via Ollama.',
      'Operate a live e-commerce site including product, order and payment flows, deployment and maintenance.',
    ],
    stack: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'OpenAI API', 'Qdrant', 'Docker', 'Nginx'],
  },
];

export interface Project {
  name: string;
  kind: string;
  description: string;
  highlights: string[];
  stack: string[];
  repo?: string; // TODO: fill in per-project repo links (docs/10-missing-info.md)
  demo?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    name: 'CV Generator SaaS',
    kind: 'SaaS product',
    description:
      'A SaaS application where users build professional CVs: template system, form-driven editing, PDF generation, and per-user data management behind authentication.',
    highlights: ['Template system with live preview', 'PDF export pipeline', 'Auth and user data management'],
    stack: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    featured: true,
  },
  {
    name: 'RAG Chatbot',
    kind: 'AI application',
    description:
      'A document-grounded chatbot: ingests documents, embeds them with all-MiniLM-L6-v2 into Qdrant, and answers questions with retrieval-augmented generation over a backend API.',
    highlights: ['Document ingestion and chunking', 'Semantic search over Qdrant', 'LLM answers grounded in retrieved context'],
    stack: ['LLM', 'RAG', 'Qdrant', 'Embeddings', 'Node.js'],
    featured: true,
  },
  {
    name: 'WhatsApp Lead Automation',
    kind: 'Automation system',
    description:
      'An automation system for tracking potential customers and running messaging workflows over WhatsApp — scheduling, message templates and lead status tracking.',
    highlights: ['Browser automation with Selenium', 'Lead pipeline and scheduling', 'Message workflow engine'],
    stack: ['Selenium', 'Node.js', 'Automation'],
    featured: true,
  },
  {
    name: 'Live OpenCart E-commerce Store',
    kind: 'Production e-commerce',
    description:
      'A live e-commerce store I deploy and operate: product management, order and payment flows, and ongoing production maintenance on a self-managed server.',
    highlights: ['Real orders and payments in production', 'Self-managed deployment', 'Operational maintenance'],
    stack: ['OpenCart', 'PHP', 'MySQL', 'Linux', 'Nginx'],
    featured: true,
  },
  {
    name: '3D Globe',
    kind: 'Visualization',
    description:
      'A Cesium-based interactive 3D globe for geospatial visualization, integrated into a React app with attention to WebGL performance.',
    highlights: ['CesiumJS globe rendering', 'Geospatial data layers', 'React integration'],
    stack: ['Cesium', 'WebGL', 'React'],
    featured: false,
  },
  {
    name: 'Nutrition App',
    kind: 'Product app',
    description:
      'A nutrition and user-tracking application: tracking screens, form-heavy UX, API integration and authentication.',
    highlights: ['User tracking flows', 'Form-driven UX', 'Authenticated API'],
    stack: ['React', 'API integration', 'Auth'],
    featured: false,
  },
  {
    name: 'MERN Task Manager',
    kind: 'Full-stack app',
    description:
      'A task-management application built on the MERN stack — CRUD, authentication and a clean REST API — developed as a hiring case study for Playable Factory.',
    highlights: ['Full-stack MERN architecture', 'JWT authentication', 'REST API design'],
    stack: ['MongoDB', 'Express', 'React', 'Node.js'],
    featured: false,
  },
  {
    name: 'HubX News',
    kind: 'Mobile/web app',
    description:
      'A news application that lists and manages articles: API consumption, state management, list and detail screens.',
    highlights: ['List/detail navigation', 'State management', 'API consumption'],
    stack: ['React Native', 'REST API'],
    featured: false,
  },
  {
    name: 'Meveddet SPA',
    kind: 'Single-page app',
    description: 'A modern responsive single-page application with component-driven UI and API integration.',
    highlights: ['SPA architecture', 'Responsive component design'],
    stack: ['React', 'SPA'],
    featured: false,
  },
];

export type SkillLevel = 'Production' | 'Project' | 'Familiar' | 'Learning';

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillGroup {
  title: string;
  blurb: string;
  skills: Skill[];
}

export const skillLevels: Record<SkillLevel, string> = {
  Production: 'Used in production systems',
  Project: 'Used in complete projects',
  Familiar: 'Working knowledge',
  Learning: 'Currently learning',
};

export const skillGroups: SkillGroup[] = [
  {
    title: 'Core Languages',
    blurb: 'The languages I write every week.',
    skills: [
      { name: 'TypeScript', level: 'Production' },
      { name: 'JavaScript', level: 'Production' },
      { name: 'Java', level: 'Production' },
      { name: 'C#', level: 'Production' },
      { name: 'SQL / PL/SQL', level: 'Production' },
      { name: 'Python', level: 'Project' },
    ],
  },
  {
    title: 'Web Frontend',
    blurb: 'Modern React apps with a focus on clean component architecture.',
    skills: [
      { name: 'React 18/19', level: 'Production' },
      { name: 'Next.js (App Router)', level: 'Production' },
      { name: 'Tailwind CSS', level: 'Production' },
      { name: 'Redux Toolkit', level: 'Project' },
      { name: 'React Hook Form + Zod', level: 'Project' },
      { name: 'Material UI / Bootstrap', level: 'Project' },
    ],
  },
  {
    title: 'Backend & APIs',
    blurb: 'REST-first services in .NET and Node.js.',
    skills: [
      { name: '.NET 8 Web API', level: 'Production' },
      { name: 'Node.js / Express', level: 'Production' },
      { name: 'REST API design', level: 'Production' },
      { name: 'Auth (JWT / Bearer)', level: 'Production' },
      { name: 'SOAP integrations', level: 'Production' },
      { name: 'GraphQL', level: 'Project' },
      { name: 'NestJS', level: 'Familiar' },
      { name: 'FastAPI', level: 'Project' },
      { name: 'Socket.io', level: 'Project' },
    ],
  },
  {
    title: 'Mobile',
    blurb: 'Native Android in the field, React Native for product work.',
    skills: [
      { name: 'Native Android (Java)', level: 'Production' },
      { name: 'React Native CLI', level: 'Production' },
      { name: 'Retrofit / HTTP clients', level: 'Production' },
      { name: 'Deep linking', level: 'Production' },
      { name: 'APK release builds / ADB', level: 'Production' },
      { name: 'Expo', level: 'Project' },
    ],
  },
  {
    title: 'Databases',
    blurb: 'Relational modelling and document stores.',
    skills: [
      { name: 'Oracle Database', level: 'Production' },
      { name: 'Stored procedures & packages', level: 'Production' },
      { name: 'MongoDB / Mongoose', level: 'Project' },
      { name: 'MySQL', level: 'Production' },
      { name: 'PostgreSQL', level: 'Project' },
      { name: 'TypeORM', level: 'Project' },
    ],
  },
  {
    title: 'Enterprise & Hardware Integrations',
    blurb: 'Where software meets the warehouse floor.',
    skills: [
      { name: 'Zebra handheld terminals', level: 'Production' },
      { name: 'Zebra printers (ZPL / EPL)', level: 'Production' },
      { name: 'TCP socket printing (port 9100)', level: 'Production' },
      { name: 'Barcode scanning workflows', level: 'Production' },
      { name: 'Cross-app auth integrations', level: 'Production' },
    ],
  },
  {
    title: 'DevOps & Deployment',
    blurb: 'Shipping and keeping things alive.',
    skills: [
      { name: 'Git / GitHub / Azure DevOps', level: 'Production' },
      { name: 'Vercel', level: 'Production' },
      { name: 'Linux / Nginx / VPS', level: 'Production' },
      { name: 'Docker / Compose', level: 'Project' },
      { name: 'GitHub Actions', level: 'Project' },
      { name: 'AWS', level: 'Learning' },
    ],
  },
  {
    title: 'Testing & Quality',
    blurb: 'Automated where it pays off, disciplined manual UAT where it matters.',
    skills: [
      { name: 'Test-case & UAT design', level: 'Production' },
      { name: 'Production debugging & log analysis', level: 'Production' },
      { name: 'Jest / Supertest', level: 'Project' },
      { name: 'Vitest / React Testing Library', level: 'Project' },
    ],
  },
  {
    title: 'AI & Automation',
    blurb: 'Practical AI features, not demos.',
    skills: [
      { name: 'OpenAI API / LLM integration', level: 'Project' },
      { name: 'RAG / Qdrant / embeddings', level: 'Project' },
      { name: 'Ollama / local models', level: 'Project' },
      { name: 'Selenium / Puppeteer', level: 'Project' },
      { name: 'Whisper / TTS', level: 'Familiar' },
    ],
  },
];

export const education = [
  {
    school: 'Istanbul University AUZEF',
    program: 'Computer Programming',
    status: 'Ongoing',
  },
  {
    school: 'Istanbul University–Cerrahpaşa',
    program: 'Mechanical Engineering',
    status: 'Attended through third year',
  },
];

export const certificates = [
  {
    name: 'Full Stack Open',
    issuer: 'University of Helsinki',
    href: 'https://studies.cs.helsinki.fi/stats/api/certificate/fullstackopen/en/4122575dc0cda9c0d7ae61c0476a0d16',
  },
  {
    name: 'Full Stack GraphQL',
    issuer: 'University of Helsinki',
    href: 'https://studies.cs.helsinki.fi/stats/api/certificate/fs-graphql/en/9a2e150918ec8fa50aaae6c6b5c1f93d',
  },
];

export const languages = [
  { name: 'Turkish', level: 'Native' },
  { name: 'English', level: 'B1–B2 · reads technical docs, written communication' },
  { name: 'French', level: 'Beginner' },
];

export const currentFocus = [
  'AWS and cloud architecture',
  'System design for distributed services',
  'Deeper .NET and CI/CD practice',
];
