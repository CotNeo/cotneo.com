'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Technology {
  name: string;
  icon: string;
}

interface TechnologiesType {
  Frontend: Technology[];
  'Mobile Frontend': Technology[];
  Backend: Technology[];
  'Development & Testing': Technology[];
  'Cloud & DevOps': Technology[];
}

interface Category {
  name: string;
  color: string;
  gradientBg: string;
}

const technologies: TechnologiesType = {
  Frontend: [
    { name: 'JavaScript', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg' },
    { name: 'React', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg' },
    { name: 'Next.js', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg' },
    { name: 'Three.js', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/threejs/threejs-original.svg' },
    { name: 'Redux', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg' },
    { name: 'TypeScript', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg' },
    { name: 'HTML5', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg' },
    { name: 'CSS3', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg' },
    { name: 'Tailwind', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'React Bootstrap', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/reactbootstrap/reactbootstrap-original.svg' },
    { name: 'React Router', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/reactrouter/reactrouter-original.svg' },
    { name: 'Axios', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/axios/axios-plain-wordmark.svg' },
  ],
  'Mobile Frontend': [
    { name: 'React Native', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg' },
    { name: 'Expo', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/expo/expo-original-wordmark.svg' },
    { name: 'TypeScript', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg' },
    { name: 'NativeWind', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'React Navigation', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg' },
    { name: 'React Native Paper', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/materialui/materialui-original.svg' },
  ],
  Backend: [
    { name: 'Node.js', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg' },
    { name: 'Python', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg' },
    { name: 'FastAPI', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg' },
    { name: 'Express', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg' },
    { name: 'MongoDB', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg' },
    { name: 'PostgreSQL', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg' },
    { name: 'GraphQL', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/graphql/graphql-plain.svg' },
    { name: 'Socket.IO', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/socketio/socketio-original.svg' },
    { name: 'Mongoose', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mongoose/mongoose-original.svg' },
  ],
  'Development & Testing': [
    { name: 'Git', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg' },
    { name: 'NPM', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/npm/npm-original-wordmark.svg' },
    { name: 'Jest', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/jest/jest-plain.svg' },
    { name: 'Postman', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postman/postman-original.svg' },
    { name: 'Vite', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg' },
    { name: 'Babel', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/babel/babel-original.svg' },
  ],
  'Cloud & DevOps': [
    { name: 'AWS', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
    { name: 'Docker', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg' },
    { name: 'Vercel', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original-wordmark.svg' },
    { name: 'Heroku', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/heroku/heroku-original-wordmark.svg' },
    { name: 'Netlify', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/netlify/netlify-original-wordmark.svg' },
    { name: 'Nginx', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nginx/nginx-original.svg' },
  ],
};

const categories: Category[] = [
  { 
    name: 'Frontend', 
    color: 'from-blue-400 to-blue-600',
    gradientBg: 'from-blue-500/10 to-blue-600/10'
  },
  { 
    name: 'Mobile Frontend', 
    color: 'from-pink-400 to-pink-600',
    gradientBg: 'from-pink-500/10 to-pink-600/10'
  },
  { 
    name: 'Backend', 
    color: 'from-purple-400 to-purple-600',
    gradientBg: 'from-purple-500/10 to-purple-600/10'
  },
  { 
    name: 'Development & Testing', 
    color: 'from-green-400 to-green-600',
    gradientBg: 'from-green-500/10 to-green-600/10'
  },
  { 
    name: 'Cloud & DevOps', 
    color: 'from-orange-400 to-orange-600',
    gradientBg: 'from-orange-500/10 to-orange-600/10'
  },
];

const TechStack = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('tech-stack');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <section id="tech-stack" className="relative py-12 sm:py-16 md:py-20 scroll-mt-24 md:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 hover:scale-105 transition-transform duration-300">
            Tech Stack
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full transition-all duration-500 hover:w-24 sm:hover:w-32"></div>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-300/90">
            Technologies I work with
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category, categoryIndex) => (
            <div
              key={category.name}
              className={`transform transition-all duration-1000 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
              style={{
                transitionDelay: `${categoryIndex * 150}ms`
              }}
            >
              <div className="relative group h-full">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl blur-lg group-hover:blur-xl sm:group-hover:blur-2xl transition-all duration-500"></div>
                
                {/* Card content */}
                <div className={`relative bg-gradient-to-r ${category.gradientBg} border border-gray-700/50 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col`}>
                  {/* Category Header */}
                  <div className={`p-3 sm:p-4 bg-gradient-to-r ${category.color} bg-opacity-10 border-b border-gray-700/30`}>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white truncate">
                      {category.name}
                    </h3>
                  </div>
                  
                  {/* Technologies Grid */}
                  <div className="p-4 sm:p-5 md:p-6 flex-1">
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                      {technologies[category.name as keyof TechnologiesType].map((tech, techIndex) => (
                        <div
                          key={tech.name}
                          className="flex flex-col items-center space-y-1.5 sm:space-y-2 group/tech"
                          style={{
                            animation: isVisible ? `fadeIn 0.5s ease-out forwards ${categoryIndex * 150 + techIndex * 80}ms` : 'none'
                          }}
                        >
                          {/* Icon Container */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg bg-gray-800/50 group-hover/tech:bg-gray-700/50 transform group-hover/tech:scale-110 transition-all duration-300 shadow-md">
                            <Image
                              src={tech.icon}
                              alt={tech.name}
                              width={48}
                              height={48}
                              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain transition-all duration-300 group-hover:scale-110 filter brightness-110"
                            />
                          </div>
                          {/* Technology Name */}
                          <span className="text-xs sm:text-sm text-gray-300/90 group-hover/tech:text-white transition-colors duration-300 text-center leading-tight px-1">
                            {tech.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Animation Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default TechStack; 