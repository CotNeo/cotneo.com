'use client';

import { useEffect, useState } from 'react';

interface GithubStats {
  totalRepositories: number;
}

const GithubStatus = () => {
  const [stats, setStats] = useState<GithubStats>({
    totalRepositories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('github');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  useEffect(() => {
    const fetchGithubStats = async () => {
      try {
        const userResponse = await fetch('https://api.github.com/users/cotneo');
        const userData = await userResponse.json();
        
        setStats({
          totalRepositories: userData.public_repos,
        });
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubStats();
  }, []);

  return (
    <section id="github" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}>
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 hover:scale-105 transition-transform duration-300">
            GitHub Overview
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full transition-all duration-500 hover:w-32"></div>
          <p className="mt-4 text-xl text-gray-300/90">
            My GitHub activity and contributions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Stats Card */}
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}>
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              
              {/* Card content */}
              <div className="relative bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <h3 className="ml-3 text-lg font-medium text-white group-hover:text-blue-400 transition-colors duration-300">
                      Public Repositories
                    </h3>
                  </div>
                  <div className="text-2xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                    {loading ? (
                      <div className="w-8 h-8 relative">
                        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      stats.totalRepositories
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Most Used Languages */}
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`} style={{ transitionDelay: '200ms' }}>
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              
              {/* Card content */}
              <div className="relative bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 p-6">
                <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors duration-300 mb-4">
                  Most Used Languages
                </h3>
                <iframe 
                  src={`https://github-readme-stats.vercel.app/api/top-langs/?username=cotneo&layout=compact&hide_border=true&theme=transparent&text_color=ffffff&title_color=60a5fa&bg_color=00000000`}
                  width="100%"
                  height="200"
                  frameBorder="0"
                  className="mx-auto"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className={`text-center mt-12 transform transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`} style={{ transitionDelay: '400ms' }}>
          <a
            href="https://github.com/cotneo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] font-medium"
          >
            View GitHub Profile
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default GithubStatus; 