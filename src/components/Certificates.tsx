'use client';

import { useEffect, useState } from 'react';

const Certificates = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('certificates');
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
    <section id="certificates" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}>
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 hover:scale-105 transition-transform duration-300">
            Certificates
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full transition-all duration-500 hover:w-32"></div>
          <p className="mt-4 text-xl text-gray-300/90">
            My certifications and ongoing certification journey
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Current Certificates */}
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}>
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              
              {/* Card content */}
              <div className="relative bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 p-8">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 mb-6">
                  Current Certificates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Stack Open Certificate */}
                  <a
                    href="https://studies.cs.helsinki.fi/stats/api/certificate/fullstackopen/en/4122575dc0cda9c0d7ae61c0476a0d16"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group/card bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-6 rounded-lg hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white group-hover/card:text-blue-400 transition-colors duration-300">Full Stack Open</h4>
                        <p className="text-sm text-gray-400 group-hover/card:text-gray-300">University of Helsinki</p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </a>

                  {/* Full Stack GraphQL Certificate */}
                  <a
                    href="https://studies.cs.helsinki.fi/stats/api/certificate/fs-graphql/en/9a2e150918ec8fa50aaae6c6b5c1f93d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group/card bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-6 rounded-lg hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1.5l-8 4v13l8 4 8-4v-13l-8-4zm-.5 17.57l-5.5-2.75v-8.61l5.5 2.75v8.61zm1-9.89l-5.5-2.75 5.5-2.75 5.5 2.75-5.5 2.75zm6.5 7.14l-5.5 2.75v-8.61l5.5-2.75v8.61z"/>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white group-hover/card:text-purple-400 transition-colors duration-300">Full Stack GraphQL</h4>
                        <p className="text-sm text-gray-400 group-hover/card:text-gray-300">University of Helsinki</p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Certification Goals */}
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`} style={{ transitionDelay: '200ms' }}>
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              
              {/* Card content */}
              <div className="relative bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 p-8">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 mb-6">
                  Certification Goals
                </h3>
                <div className="relative group/goal bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-6 rounded-lg hover:from-yellow-500/10 hover:to-orange-500/10 transition-all duration-300">
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center p-4">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311-.064.048-.16.08-.304.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.359.056.535.096.168.048.328.096.48.144.152.048.28.096.375.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.385.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-white group-hover/goal:text-yellow-400 transition-colors duration-300">
                        AWS Certified Developer - Associate
                      </h4>
                      <p className="text-sm text-gray-400 group-hover/goal:text-gray-300 mt-1">Currently preparing for certification</p>
                      <div className="mt-4">
                        <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="absolute top-0 left-0 h-full w-3/4 bg-gradient-to-r from-yellow-500 to-orange-600 animate-pulse"></div>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Estimated completion: Q3 2025</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;