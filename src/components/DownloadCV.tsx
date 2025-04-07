'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaLinkedin, FaEnvelope, FaQrcode, FaEye } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

const DownloadCV = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [qrLoading, setQrLoading] = useState<boolean>(false);

  const handleDownload = async () => {
    setIsLoading(true);
    setProgress(0);
    try {
      const response = await fetch('/cv.pdf');
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body?.getReader();
      const chunks = [];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          chunks.push(value);
          loaded += value.length;
          setProgress(Math.round((loaded / total) * 100));
        }
      }

      const blob = new Blob(chunks, { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'furkan_akar_cv.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('CV downloaded successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Failed to download CV. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleShare = (platform: 'linkedin' | 'email') => {
    const cvUrl = window.location.origin + '/cv.pdf';
    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cvUrl)}`, '_blank');
    } else {
      window.location.href = `mailto:?subject=Furkan Akar's CV&body=Check out my CV: ${cvUrl}`;
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev + 25 : prev - 25;
      return Math.min(Math.max(newZoom, 50), 200);
    });
  };

  const handleQRDownload = () => {
    setQrLoading(true);
    try {
      // QR kodunu PNG olarak indir
      const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
      if (canvas) {
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'furkan_akar_cv_qr.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        toast.success('QR Code downloaded successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center space-y-4">
        {/* Main download button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setShowInfo(true)}
          onHoverEnd={() => setShowInfo(false)}
          onClick={handleDownload}
          disabled={isLoading}
          className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold 
                   shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center space-x-2 overflow-hidden group"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 
                        group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
          
          {/* Button content */}
          <div className="relative z-10 flex items-center space-x-2">
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Downloading... {progress}%</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download CV</span>
              </>
            )}
          </div>

          {/* Progress bar */}
          {isLoading && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute bottom-0 left-0 h-1 bg-white/30"
            />
          )}
        </motion.button>

        {/* Action buttons */}
        <div className="flex space-x-2">
          {/* Preview button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreview(true)}
            className="px-3 py-1 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
          >
            <FaEye className="inline-block mr-1" />
            Preview
          </motion.button>

          {/* QR button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowQR(!showQR)}
            className="px-3 py-1 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
          >
            <FaQrcode className="inline-block mr-1" />
            QR
          </motion.button>
        </div>

        {/* Social sharing buttons */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare('linkedin')}
            className="px-3 py-1 bg-[#0077B5] text-white rounded-lg text-sm hover:bg-[#006699] transition-colors"
          >
            <FaLinkedin className="inline-block mr-1" />
            Share
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare('email')}
            className="px-3 py-1 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
          >
            <FaEnvelope className="inline-block mr-1" />
            Email
          </motion.button>
        </div>

        {/* Preview modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowPreview(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white p-4 rounded-lg w-[90vw] h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">CV Preview</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleZoom('out')}
                      className="px-2 py-1 bg-gray-200 rounded"
                      disabled={zoomLevel <= 50}
                    >
                      -
                    </button>
                    <span className="px-2 py-1">{zoomLevel}%</span>
                    <button
                      onClick={() => handleZoom('in')}
                      className="px-2 py-1 bg-gray-200 rounded"
                      disabled={zoomLevel >= 200}
                    >
                      +
                    </button>
                  </div>
                </div>
                <iframe
                  src="/cv.pdf#toolbar=0&navpanes=0"
                  className="flex-1 w-full"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code modal */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowQR(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white p-6 rounded-lg flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-semibold mb-4">Scan to Download CV</h2>
                
                <div className="relative">
                  {qrLoading ? (
                    <div className="w-48 h-48 flex items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : (
                    <QRCodeSVG
                      id="qr-canvas"
                      value={`${window.location.origin}/cv.pdf`}
                      size={192}
                      level="H"
                      includeMargin={true}
                      imageSettings={{
                        src: '/favicon.ico',
                        height: 40,
                        width: 40,
                        excavate: true,
                      }}
                    />
                  )}
                </div>

                <p className="mt-4 text-gray-600 text-center max-w-xs">
                  Scan this QR code with your phone to download my CV
                </p>

                <div className="mt-4 flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleQRDownload}
                    disabled={qrLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    Download QR Code
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File info tooltip */}
      <AnimatePresence>
        {showInfo && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 
                     bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg
                     whitespace-nowrap"
          >
            PDF Format • ~2MB
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DownloadCV; 