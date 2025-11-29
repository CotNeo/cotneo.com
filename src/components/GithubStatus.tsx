'use client';

import { useEffect, useState } from 'react';

interface GithubStats {
  user: {
    username: string;
    name: string | null;
    bio: string | null;
    avatar: string;
    publicRepos: number;
    followers: number;
    following: number;
    createdAt: string;
  };
  repositories: {
    total: number;
    totalStars: number;
    totalForks: number;
  };
  languages: LanguageStats[];
}

interface LanguageStats {
  name: string;
  bytes: number;
  percentage: number;
}

const GithubStatus = () => {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    /**
     * Fetches comprehensive GitHub statistics from the API route.
     * Includes user stats, repository stats, and language statistics.
     */
    const fetchGithubStats = async () => {
      try {
        console.log("[GithubStatus] Fetching GitHub stats started");
        setLoading(true);
        setError(null);

        const response = await fetch('/api/github/stats');
        
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 429) {
            setError('Rate limit exceeded. Please try again later.');
            console.error("[GithubStatus] Rate limit exceeded", errorData);
          } else {
            setError(errorData.message || 'Failed to fetch GitHub statistics');
            console.error("[GithubStatus] API error", errorData);
          }
          return;
        }

        const data = await response.json();
        setStats(data);
        
        // Log warning if cached/fallback data is being used
        if (data._cached || data._message) {
          console.warn("[GithubStatus] Using cached/fallback data:", data._message);
          if (data.languages && data.languages.length > 0) {
            console.warn("[GithubStatus] Languages data:", data.languages.map((l: LanguageStats) => `${l.name}: ${l.percentage.toFixed(1)}%`));
          }
        } else {
          console.log("[GithubStatus] GitHub stats fetched successfully", data);
          if (data.languages && data.languages.length > 0) {
            console.log("[GithubStatus] Languages:", data.languages.map((l: LanguageStats) => `${l.name}: ${l.percentage.toFixed(1)}%`));
          }
        }
      } catch (error) {
        console.error("[GithubStatus] Error fetching GitHub stats", error);
        setError('An error occurred while fetching GitHub statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchGithubStats();
  }, []);

  return (
    <section id="github" className="relative py-20 scroll-mt-24 md:scroll-mt-24">
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
          {stats && (stats as any)._cached && (
            <div className="mt-4 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-400">
              <p className="font-medium mb-1">⚠️ {(stats as any)._message || 'Showing cached/fallback data'}</p>
              {(stats as any)._message?.includes('Invalid') || (stats as any)._message?.includes('token') ? (
                <p className="text-xs text-yellow-300/80 mt-1">
                  Create a token at{' '}
                  <a 
                    href="https://github.com/settings/tokens" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-yellow-200"
                  >
                    github.com/settings/tokens
                  </a>
                  {' '}with 'public_repo' scope
                </p>
              ) : null}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Public Repositories Card */}
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <h3 className="ml-3 text-sm font-medium text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                      Repositories
                    </h3>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                    {loading ? (
                      <div className="w-8 h-8 relative">
                        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
                      </div>
                    ) : stats ? (
                      stats.user.publicRepos
                    ) : (
                      '—'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Stars Card */}
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`} style={{ transitionDelay: '100ms' }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <h3 className="ml-3 text-sm font-medium text-gray-400 group-hover:text-yellow-400 transition-colors duration-300">
                      Total Stars
                    </h3>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                    {loading ? (
                      <div className="w-8 h-8 relative">
                        <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-yellow-600 rounded-full animate-spin"></div>
                      </div>
                    ) : stats ? (
                      stats.repositories.totalStars.toLocaleString()
                    ) : (
                      '—'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Forks Card */}
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`} style={{ transitionDelay: '200ms' }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h3 className="ml-3 text-sm font-medium text-gray-400 group-hover:text-purple-400 transition-colors duration-300">
                      Total Forks
                    </h3>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                    {loading ? (
                      <div className="w-8 h-8 relative">
                        <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-purple-600 rounded-full animate-spin"></div>
                      </div>
                    ) : stats ? (
                      stats.repositories.totalForks.toLocaleString()
                    ) : (
                      '—'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Followers Card */}
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`} style={{ transitionDelay: '300ms' }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <h3 className="ml-3 text-sm font-medium text-gray-400 group-hover:text-green-400 transition-colors duration-300">
                      Followers
                    </h3>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                    {loading ? (
                      <div className="w-8 h-8 relative">
                        <div className="absolute inset-0 border-4 border-green-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-green-600 rounded-full animate-spin"></div>
                      </div>
                    ) : stats ? (
                      stats.user.followers.toLocaleString()
                    ) : (
                      '—'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Most Used Languages - Full Width */}
        <div className={`transform transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`} style={{ transitionDelay: '400ms' }}>
          <div className="relative group mt-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

            <div className="relative bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 p-6">
              <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors duration-300 mb-4">
                Most Used Languages
              </h3>
              {error ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <svg className="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-gray-400 text-sm mb-2">{error}</p>
                  <a
                    href="https://github.com/cotneo?tab=repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-blue-400 hover:text-blue-300 text-sm transition-colors duration-300"
                  >
                    View repositories on GitHub →
                  </a>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 relative">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : stats && stats.languages.length > 0 ? (
                <div className="space-y-3">
                  {stats.languages.map((lang, index) => {
                    // Generate gradient colors based on position
                    const colors = [
                      'from-blue-400 to-blue-600',
                      'from-purple-400 to-purple-600',
                      'from-pink-400 to-pink-600',
                      'from-cyan-400 to-cyan-600',
                      'from-green-400 to-green-600',
                      'from-yellow-400 to-yellow-600',
                      'from-orange-400 to-orange-600',
                      'from-red-400 to-red-600'
                    ];
                    const colorClass = colors[index % colors.length];

                    return (
                      <div key={lang.name} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300 font-medium">{lang.name}</span>
                          <span className="text-gray-400">{lang.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-1000 ease-out`}
                            style={{
                              width: `${lang.percentage}%`,
                              transitionDelay: `${index * 100}ms`
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-gray-400 text-sm">No language data available</p>
                </div>
              )}
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