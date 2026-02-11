import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnimations } from '../hooks/useAnimations';
import { useResponsive } from '../hooks/useResponsive';
import AnimatedButton from './AnimatedButton';
import { trackDashboardView } from '../../services/analytics/user-interactions';
import { FadeIn } from '../ui/animations/FadeIn';
import { SlideIn } from '../ui/animations/SlideIn';
import { Card, CardContent } from '../common/Card';
import { useVisualStyle } from './VisualStyleProvider';

interface DashboardViewProps {
  className?: string;
}

const DashboardView: React.FC<DashboardViewProps> = ({ className = '' }) => {
  const { animationVariants } = useAnimations();
  const { isMobile, isTablet } = useResponsive();
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

  // Define grid columns based on screen size
  const gridColsClass = isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen p-4 md:p-8 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      }}
    >
      <FadeIn>
        <header className="mb-8 text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Dashboard
          </motion.h1>
          <motion.p 
            className="text-white/80 mt-2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Your productivity hub with animated controls
          </motion.p>
        </header>
      </FadeIn>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <SlideIn direction="left">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <AnimatedButton
                    label="New Task"
                    action={() => console.log('New task')}
                    variant="primary"
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </SlideIn>

            <SlideIn direction="left">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <AnimatedButton
                    label="Settings"
                    action={() => console.log('Settings')}
                    variant="secondary"
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </SlideIn>
          </div>

          {/* Right Column - Simple content */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Simple Content</h2>
                <p>Basic dashboard content</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardView;