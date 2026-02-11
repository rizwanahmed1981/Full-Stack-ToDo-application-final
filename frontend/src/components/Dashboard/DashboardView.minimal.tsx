import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { trackDashboardView } from '../../services/analytics/user-interactions';
import { useVisualStyle } from './VisualStyleProvider';

interface DashboardViewProps {
  className?: string;
}

const DashboardView: React.FC<DashboardViewProps> = ({ className = '' }) => {
  const { themeConfig } = useVisualStyle(); // Use the visual style context
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading config
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Track dashboard view
    trackDashboardView();
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen p-4 md:p-8 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      }}
    >
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Dashboard
        </h1>
        <p className="text-white/80 mt-2">
          Your productivity hub with animated controls
        </p>
        
        <div className="mt-4">
          <a 
            href="/" 
            className="inline-block px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-200 text-sm"
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium">
                New Task
              </button>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
              <button className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-3 px-6 rounded-lg font-medium">
                Settings
              </button>
            </div>
          </div>

          {/* Right Column - Simple content */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Simple Content</h2>
              <p>Basic dashboard content</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardView;