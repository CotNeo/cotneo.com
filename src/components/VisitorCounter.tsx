'use client';

import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subHours } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface VisitorData {
  timestamp: string;
  count: number;
  visitorId?: string;
}

interface ApiResponse {
  currentCount: number;
  history: VisitorData[];
  activeVisitors: number;
  error?: string;
  requiresConsent?: boolean;
}

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '12h' | '6h'>('24h');
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isNewVisitor, setIsNewVisitor] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasShown = localStorage.getItem('hasShownWelcome') === 'true';
      setHasShownWelcome(hasShown);
    }
  }, []);

  const fetchVisitorData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/visitors');
      if (!response.ok) {
        throw new Error('Failed to fetch visitor data');
      }
      
      const data = await response.json();
      
      if (!data || !data.visitors) {
        throw new Error('Invalid data received from server');
      }

      setVisitorData(data.visitors);
      setVisitorCount(data.totalVisitors || 0);
      setActiveVisitors(data.activeVisitors || 0);
      setLastUpdate(new Date());
      setLastFetchTime(Date.now());
      
      // Check if this is a new visitor
      const visitorId = localStorage.getItem('visitorId');
      if (!visitorId) {
        setIsNewVisitor(true);
        localStorage.setItem('visitorId', data.visitorId);
      }
    } catch (err) {
      console.error('Error fetching visitor data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch visitor data');
      setVisitorCount(0);
      setActiveVisitors(0);
      setVisitorData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConsent = useCallback(async (accepted: boolean) => {
    try {
      setConsentGiven(accepted);
      setShowConsentBanner(false);
      
      if (accepted) {
        localStorage.setItem('consentGiven', 'true');
        await fetchVisitorData();
      } else {
        localStorage.setItem('consentGiven', 'false');
        setVisitorCount(0);
        setActiveVisitors(0);
        setVisitorData([]);
      }
    } catch (err) {
      console.error('Error handling consent:', err);
      setError('Failed to process your consent. Please try again.');
    }
  }, [fetchVisitorData]);

  useEffect(() => {
    const checkConsent = () => {
      if (typeof window !== 'undefined') {
        const consent = localStorage.getItem('consentGiven');
        if (consent === 'true') {
          setConsentGiven(true);
          fetchVisitorData();
        } else if (consent === null) {
          setShowConsentBanner(true);
        }
      }
    };

    checkConsent();
  }, [fetchVisitorData]);

  const getFilteredData = () => {
    const hours = timeRange === '24h' ? 24 : timeRange === '12h' ? 12 : 6;
    const cutoffTime = subHours(new Date(), hours);
    
    return visitorData
      .filter((item: VisitorData) => new Date(item.timestamp) > cutoffTime)
      .map((item: VisitorData) => ({
        ...item,
        timestamp: format(new Date(item.timestamp), 'HH:mm')
      }));
  };

  const calculatePeakToday = () => {
    if (!visitorData || visitorData.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayData = visitorData.filter(item => 
      new Date(item.timestamp) >= today
    );
    
    if (todayData.length === 0) return visitorCount;
    
    return Math.max(...todayData.map(item => item.count));
  };

  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-80">
      <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-80 text-red-400">
      <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className="text-xl font-semibold mb-2">Error Loading Data</p>
      <p className="text-sm text-gray-400">{error}</p>
      <button
        onClick={fetchVisitorData}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-80 text-gray-400">
      <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className="text-xl font-semibold mb-2">No Data Available</p>
      <p className="text-sm">Start tracking your visitors to see statistics</p>
    </div>
  );

  const renderChart = () => {
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
      return renderEmptyState();
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="timestamp" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickLine={{ stroke: '#374151' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickLine={{ stroke: '#374151' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              color: '#F3F4F6'
            }}
            labelStyle={{ color: '#9CA3AF' }}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6, fill: '#60A5FA' }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {showConsentBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm p-6 z-50 border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Cookie Preferences</h3>
                <p className="text-gray-300 text-sm">
                  We use cookies to track visitor statistics and improve your experience on our site. 
                  This helps us understand how visitors interact with our content and make improvements.
                </p>
                <div className="mt-2 text-xs text-gray-400">
                  <p className="mb-1">By clicking "Accept All", you agree to our use of cookies for analytics purposes.</p>
                  <p className="text-yellow-400">
                    If you decline, we won't be able to track your visit or show you visitor statistics. 
                    You can still browse the site, but your visit won't be counted in our analytics.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleConsent(false)}
                  className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleConsent(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Visitor Statistics
            </h3>
            <p className="text-gray-400 text-sm">Real-time visitor tracking and analytics</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            {['24h', '12h', '6h'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as '24h' | '12h' | '6h')}
                className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm mb-1">Total Visitors</div>
            <div className="text-3xl font-bold text-blue-400">
              {isLoading ? (
                <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin"></div>
              ) : (
                visitorCount
              )}
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm mb-1">Active Now</div>
            <div className="text-3xl font-bold text-green-400">
              {isLoading ? '-' : activeVisitors}
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm mb-1">Peak Today</div>
            <div className="text-3xl font-bold text-purple-400">
              {isLoading ? '-' : calculatePeakToday()}
            </div>
          </div>
        </div>

        <div className="h-80 bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
          {isLoading ? renderLoadingState() : error ? renderErrorState() : renderChart()}
        </div>

        <div className="mt-4 text-right">
          <span className="text-gray-400 text-sm">
            Last updated: {format(lastUpdate, 'HH:mm:ss')}
          </span>
        </div>
      </div>
    </>
  );
};

export default VisitorCounter; 