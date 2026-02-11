import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnimations } from '../hooks/useAnimations';
import { useResponsive } from '../hooks/useResponsive';
import AnimatedButton from './AnimatedButton';
import { trackDashboardView } from '../../services/analytics/user-interactions';
import { FadeIn } from '../ui/animations/FadeIn';
import { SlideIn } from '../ui/animations/SlideIn';
import { Card, CardContent } from '../common/Card';
import DashboardIcon from '../ui/icons/DashboardIcon';
import { fetchDashboardConfig, updateDashboardConfig } from '../../services/api/dashboard';
import { useVisualStyle } from './VisualStyleProvider';
import TaskDisplay from './TaskDisplay';

interface DashboardViewProps {
  className?: string;
}

const DashboardView: React.FC<DashboardViewProps> = ({ className = '' }) => {
  const { animationVariants } = useAnimations();
  const { isMobile, isTablet } = useResponsive();
  const { themeConfig } = useVisualStyle(); // Use the visual style context
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardConfig, setDashboardConfig] = useState<any>(null);

  // Load dashboard configuration on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await fetchDashboardConfig();
        setDashboardConfig(config);
      } catch (error) {
        console.error('Failed to load dashboard config:', error);
        // Use default config if loading fails
        setDashboardConfig({
          theme: { themeType: 'auto', colorPalette: {}, background: {} },
          layout: { columns: 3, rows: 4, widgetsPositions: [] },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
    
    // Track dashboard view
    trackDashboardView();
  }, []);

  // Define grid columns based on screen size
  const gridColsClass = isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen p-4 md:p-8 ${className}`}
      style={{
        background: dashboardConfig?.background?.type === 'gradient' 
          ? `linear-gradient(135deg, ${dashboardConfig.background.gradient?.colors?.[0] || themeConfig.colors.primary[500]}, ${dashboardConfig.background.gradient?.colors?.[1] || themeConfig.colors.secondary[500]})`
          : dashboardConfig?.background?.color || themeConfig.colors.background.light,
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

            <SlideIn direction="left">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <AnimatedButton
                    label="Reports"
                    action={() => console.log('Reports')}
                    variant="tertiary"
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </SlideIn>

            <SlideIn direction="left">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <AnimatedButton
                    label="Calendar"
                    action={() => console.log('Calendar')}
                    variant="ghost"
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </SlideIn>
          </div>

          {/* Right Column - Task Display */}
          <div className="lg:col-span-2">
            <SlideIn direction="right">
              <TaskDisplay />
            </SlideIn>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardView;