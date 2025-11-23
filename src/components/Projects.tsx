'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  topics: string[];
  stargazers_count: number;
  language: string;
  forks_count: number;
}

const Projects = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching repositories from API...');
        const response = await fetch('/api/github');
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.details || 'Failed to fetch repositories');
        }
        const data = await response.json();
        console.log('Received repositories:', data);
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error('Error in fetchRepos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load projects');
        setRepos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, []);

  console.log('Current repos state:', repos);
  console.log('Is loading:', isLoading);
  console.log('Error state:', error);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-400">
        <p className="text-lg font-semibold mb-2">Error</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  if (!repos || repos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
        <p className="text-lg font-semibold mb-2">No Projects Found</p>
        <p className="text-sm">No GitHub repositories are available at the moment.</p>
      </div>
    );
  }

  return (
    <section id="projects" className="relative py-20 scroll-mt-24 md:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 hover:scale-105 transition-transform duration-300">
            Projects
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full hover:w-32 transition-all duration-500"></div>
          <p className="mt-4 text-xl text-gray-300/90">
            Some of my recent work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repos.map((repo) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative group h-full"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              
              <div className="relative h-full bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                    {repo.name}
                  </h3>
                  <p className="text-gray-300/90 mb-4">
                    {repo.description || 'No description available'}
                  </p>
                  
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {repo.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-400/90 text-sm mb-4">
                    {repo.language && (
                      <span className="flex items-center group-hover:text-blue-400 transition-colors duration-300">
                        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 mr-2"></span>
                        {repo.language}
                      </span>
                    )}
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center group-hover:text-yellow-400 transition-colors duration-300">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center group-hover:text-purple-400 transition-colors duration-300">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        {repo.forks_count}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 text-sm font-medium text-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      View Code
                    </a>
                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 text-sm font-medium text-center rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects; 