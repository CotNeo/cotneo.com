'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaQrcode, FaDownload } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

/**
 * Secondary CTA: downloads the CV with progress feedback,
 * plus a QR modal for grabbing the CV on a phone.
 */
const DownloadCV = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQR, setShowQR] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    setProgress(0);
    try {
      const response = await fetch('/cv.pdf');
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.length;
          if (total) setProgress(Math.round((loaded / total) * 100));
        }
      }

      const blob = new Blob(chunks as BlobPart[], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'furkan_akar_cv.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('CV downloaded', { position: 'top-right', autoClose: 2500, theme: 'dark' });
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Download failed — please try again.', {
        position: 'top-right',
        autoClose: 2500,
        theme: 'dark',
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="relative px-5 py-3 rounded-md border border-edge text-fog font-semibold text-sm
                   hover:border-accent/50 hover:text-white transition-colors duration-200
                   disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          <FaDownload className="w-3.5 h-3.5" />
          {isLoading ? `Downloading… ${progress}%` : 'Download CV'}
        </span>
        {isLoading && (
          <span
            className="absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        )}
      </button>

      <button
        onClick={() => setShowQR(true)}
        aria-label="Show QR code for CV"
        title="Scan QR to open CV on your phone"
        className="p-3 rounded-md border border-edge text-mist hover:text-accent hover:border-accent/50 transition-colors duration-200"
      >
        <FaQrcode className="w-4 h-4" />
      </button>

      {showQR && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setShowQR(false)}
          role="dialog"
          aria-modal="true"
          aria-label="CV QR code"
        >
          <div
            className="panel p-8 flex flex-col items-center max-w-xs w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="section-label mb-4">cv.pdf</p>
            <div className="bg-white p-3 rounded-lg">
              <QRCodeSVG value="https://cotneo.com/cv.pdf" size={180} level="H" />
            </div>
            <p className="mt-4 text-sm text-mist text-center">
              Scan with your phone to open the CV.
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="mt-5 text-sm text-accent hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadCV;
