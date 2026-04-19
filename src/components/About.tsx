'use client';
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect } from 'react';
import Image from 'next/image';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('about');
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
    <section id="about" className="relative py-20 scroll-mt-24 md:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 hover:scale-105 transition-transform duration-300">
            About Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full transition-all duration-500 hover:w-32"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className={`relative w-full max-w-md mx-auto transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
          >
            {/* Outer glow — motion-safe avoids constant repaints for reduced-motion users */}
            <div
              className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-xl motion-safe:animate-pulse"
              aria-hidden
            />

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotate-3 opacity-90 transition-transform duration-500 group-hover:rotate-6" />
              <div className="relative rounded-2xl bg-gray-900/90 p-2 transition-transform duration-500 group-hover:scale-[0.99]">
                <div className="relative overflow-hidden rounded-xl bg-gray-950">
                  {/* Intrinsic width/height avoids fill + aspect-ratio clipping the portrait */}
                  <Image
                    src="/images/profile-optimized.webp"
                    alt="Professional headshot"
                    width={800}
                    height={1200}
                    sizes="(max-width: 768px) min(100vw - 2rem, 28rem), 448px"
                    quality={85}
                    className="h-auto w-full object-contain object-top"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`space-y-6 transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <p className="text-gray-300/90 mb-4">
              I am a full-stack developer with expertise in modern web technologies. Let us build something amazing together!
            </p>
            <p className="text-lg text-gray-100 leading-relaxed hover:text-blue-300 transition-colors duration-300">
            I am a passionate full-stack developer with expertise in cloud and AI integrations, constantly pushing the boundaries of innovation. 
            My focus is on building scalable and efficient solutions 
            that enhance user experience and streamline complex workflows.
            </p>
            <p className="text-lg text-gray-100 leading-relaxed hover:text-purple-300 transition-colors duration-300">
            With a strong foundation in Next.js, TypeScript, and backend technologies, I specialize in developing high-performance applications that leverage modern frameworks and architectures.
             My goal is to create seamless digital experiences through clean code and best practices.
            </p>
            <p className="text-lg text-gray-100 leading-relaxed hover:text-indigo-300 transition-colors duration-300">
            Beyond coding, I am always eager to learn and experiment with emerging technologies. Whether it's optimizing backend services or enhancing UI/UX, I thrive on challenges that push me to grow as a developer and problem solver.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 