'use client';

import { motion } from 'framer-motion';
import DownloadCV from './DownloadCV';
import { FaLinkedin, FaGithub, FaGlobe, FaYoutube, FaStackOverflow, FaReddit, FaInstagram } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 opacity-90" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-purple-600/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="text-center max-w-4xl mx-auto relative z-10 w-full">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 leading-tight"
        >
          Hi, I&apos;m Furkan
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-gray-300 max-w-2xl mx-auto px-4 leading-relaxed"
        >
          Welcome to my portfolio! I&apos;m a full-stack developer specializing in cloud and AI integrations, creating innovative solutions that push the boundaries of technology.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6"
        >
          <DownloadCV />
        </motion.div>

        {/* Social Media Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 md:mt-12"
        >
          {/* Section Title */}
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-base sm:text-lg text-gray-400 mb-4 md:mb-6 font-medium tracking-wide"
          >
            Connect with me
          </motion.h3>

          {/* Social Media Grid */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 px-4">
            {/* LinkedIn Profile - Professional Network */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <motion.a
                href="https://www.linkedin.com/in/furkanaliakar/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block p-3 sm:p-4 bg-gradient-to-br from-[#0077B5] via-[#006699] to-[#004471] text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-rotate-3 min-w-[80px] sm:min-w-[100px]"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0077B5]/20 to-[#004471]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                
                {/* Icon and text */}
                <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <FaLinkedin className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">LinkedIn</span>
                </div>

                {/* Hover indicator */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </motion.div>

            {/* GitHub Profile - Code Repository */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <motion.a
                href="https://github.com/CotNeo"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block p-3 sm:p-4 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:rotate-3 min-w-[80px] sm:min-w-[100px]"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-600/20 to-black/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                
                {/* Icon and text */}
                <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <FaGithub className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">GitHub</span>
                </div>

                {/* Hover indicator */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </motion.div>

            {/* YouTube Profile - Content Platform */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <motion.a
                href="https://www.youtube.com/@cotneo_js"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block p-3 sm:p-4 bg-gradient-to-br from-[#FF0000] via-[#CC0000] to-[#990000] text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:rotate-3 min-w-[80px] sm:min-w-[100px]"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/20 to-[#990000]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                
                {/* Icon and text */}
                <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <FaYoutube className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">YouTube</span>
                </div>

                {/* Hover indicator */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </motion.div>

            {/* Instagram Profile - Social Media Platform */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <motion.a
                href="https://www.instagram.com/furkanaliakar/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block p-3 sm:p-4 bg-gradient-to-br from-[#E4405F] via-[#F56040] to-[#FCAF45] text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-rotate-3 min-w-[80px] sm:min-w-[100px]"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E4405F]/20 via-[#F56040]/20 to-[#FCAF45]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                
                {/* Icon and text */}
                <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <FaInstagram className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">Instagram</span>
                </div>

                {/* Hover indicator */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </motion.div>

            {/* Medium Profile - Blog Platform */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <motion.a
                href="https://medium.com/@furkanaliakar"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block p-3 sm:p-4 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-rotate-3 min-w-[80px] sm:min-w-[100px]"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-black/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                
                {/* Icon and text */}
                <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <FaGlobe className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">Medium</span>
                </div>

                {/* Hover indicator */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </motion.div>

            {/* freeCodeCamp Profile - Learning Platform */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <motion.a
                href="https://www.freecodecamp.org/cotneo"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block p-3 sm:p-4 bg-gradient-to-br from-[#0A0A23] via-[#006400] to-[#228B22] text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:rotate-3 min-w-[80px] sm:min-w-[100px]"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#006400]/20 to-[#228B22]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                
                {/* Icon and text */}
                <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <FaGlobe className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">freeCodeCamp</span>
                </div>

                {/* Hover indicator */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </motion.div>

            {/* CODERSPACE Profile - Learning Platform */}
            <motion.div
              whileHover={{ scale: 1.20, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <motion.a
                href="https://coderspace.io/portfolyo/furkan798/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block p-3 sm:p-4 bg-gradient-to-br from-[#29B2FE] via-[#1E90FF] to-[#0066CC] text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:rotate-3 min-w-[80px] sm:min-w-[100px]"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#29B2FE]/20 to-[#0066CC]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                
                {/* Icon and text */}
                <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <FaGlobe className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">CODERSPASE</span>
                </div>

                {/* Hover indicator */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </motion.div>

            {/* Stack Overflow Profile - Developer Community */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <motion.a
                href="https://stackoverflow.com/users/25318290/cotneo"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block p-3 sm:p-4 bg-gradient-to-br from-[#F48024] via-[#E7700D] to-[#BC5500] text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-rotate-3 min-w-[80px] sm:min-w-[100px]"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F48024]/20 to-[#BC5500]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                
                {/* Icon and text */}
                <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <FaStackOverflow className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">Stack Overflow</span>
                </div>

                {/* Hover indicator */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </motion.div>

            {/* Reddit Profile - Community Platform */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <motion.a
                href="https://www.reddit.com/user/Sweet-Vanilla-3541/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block p-3 sm:p-4 bg-gradient-to-br from-[#FF4500] via-[#FF5700] to-[#CC3700] text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:rotate-3 min-w-[80px] sm:min-w-[100px]"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF4500]/20 to-[#CC3700]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                
                {/* Icon and text */}
                <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <FaReddit className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">Reddit</span>
                </div>

                {/* Hover indicator */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </motion.div>

            {/* Freelancer Profile - Freelance Platform */}
            <motion.div
              whileHover={{ scale: 1.20, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <motion.a
                href="https://www.freelancer.com/u/furkanaliakar"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block p-3 sm:p-4 bg-gradient-to-br from-[#29B2FE] via-[#1E90FF] to-[#0066CC] text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:rotate-3 min-w-[80px] sm:min-w-[100px]"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#29B2FE]/20 to-[#0066CC]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                
                {/* Icon and text */}
                <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <FaGlobe className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">Freelancer</span>
                </div>

                {/* Hover indicator */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </motion.div>

            {/* Bionluk Profile - Turkish Freelance Platform */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <motion.a
                href="https://bionluk.com/furkanaliakar"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block p-3 sm:p-4 bg-gradient-to-br from-[#FF6B35] via-[#F7931E] to-[#E67E22] text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-rotate-3 min-w-[80px] sm:min-w-[100px]"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/20 to-[#E67E22]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                
                {/* Icon and text */}
                <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <FaGlobe className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">Bionluk</span>
                </div>

                {/* Hover indicator */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex justify-center mt-6 md:mt-8 space-x-2"
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 