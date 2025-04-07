'use client';

import DownloadCV from './DownloadCV';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Hi , I am Furkan 
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
        Welcome to my application! I am a full-stack developer 
        specializing in cloud and AI integrations, creating innovative solutions. 
        </p>
        <div className="flex justify-center space-x-4">
          <DownloadCV />
        </div>
      </div>
    </section>
  );
};

export default Hero; 