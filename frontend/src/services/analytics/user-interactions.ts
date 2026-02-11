// User interaction tracking service for the dashboard

// Define event types
export type EventType =
  | 'dashboard_view'
  | 'button_click'
  | 'task_created'
  | 'task_completed'
  | 'task_deleted'
  | 'filter_applied'
  | 'search_performed'
  | 'theme_changed'
  | 'accessibility_setting_changed'
  | 'navigation';

// Event data interface
export interface EventData {
  eventType: EventType;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  properties?: Record<string, any>;
  elementId?: string;
  componentName?: string;
}

// Analytics service interface
export interface AnalyticsService {
  track(event: EventData): void;
  setUser(userId: string): void;
  setSession(sessionId: string): void;
  flush(): void;
}

// Mock analytics service implementation
class MockAnalyticsService implements AnalyticsService {
  private userId?: string;
  private sessionId?: string;
  private eventQueue: EventData[] = [];

  setUser(userId: string): void {
    this.userId = userId;
  }

  setSession(sessionId: string): void {
    this.sessionId = sessionId;
  }

  track(event: EventData): void {
    // Add user and session info if available
    const enrichedEvent: EventData = {
      ...event,
      userId: event.userId || this.userId,
      sessionId: event.sessionId || this.sessionId,
      timestamp: event.timestamp || new Date(),
    };

    // In a real implementation, this would send data to an analytics endpoint
    console.log('Tracking event:', enrichedEvent);
    
    // Add to queue for potential batching
    this.eventQueue.push(enrichedEvent);
    
    // In a real implementation, we might want to send events in batches
    if (this.eventQueue.length >= 10) {
      this.flush();
    }
  }

  flush(): void {
    if (this.eventQueue.length > 0) {
      // Send batched events to analytics endpoint
      console.log('Sending batched events:', this.eventQueue);
      
      // Clear the queue after sending
      this.eventQueue = [];
    }
  }
}

// Production analytics service implementation
class ProductionAnalyticsService implements AnalyticsService {
  private userId?: string;
  private sessionId?: string;
  private eventQueue: EventData[] = [];
  private readonly batchSize: number = 10;
  private readonly flushInterval: number = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    // Set up periodic flushing
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  setUser(userId: string): void {
    this.userId = userId;
  }

  setSession(sessionId: string): void {
    this.sessionId = sessionId;
  }

  track(event: EventData): void {
    // Add user and session info if available
    const enrichedEvent: EventData = {
      ...event,
      userId: event.userId || this.userId,
      sessionId: event.sessionId || this.sessionId,
      timestamp: event.timestamp || new Date(),
    };

    // Add to queue
    this.eventQueue.push(enrichedEvent);
    
    // Flush if we've reached the batch size
    if (this.eventQueue.length >= this.batchSize) {
      this.flush();
    }
  }

  flush(): void {
    if (this.eventQueue.length > 0) {
      // In a real implementation, this would send data to an analytics endpoint
      // Example: send to Segment, Google Analytics, etc.
      console.log('Sending batched events:', this.eventQueue);
      
      // Clear the queue after sending
      this.eventQueue = [];
    }
  }

  // Cleanup method to clear timers
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
  }
}

// Create analytics service instance based on environment
const analyticsService: AnalyticsService = 
  process.env.NODE_ENV === 'production' 
    ? new ProductionAnalyticsService()
    : new MockAnalyticsService();

// Track dashboard view event
export const trackDashboardView = (properties?: Record<string, any>) => {
  analyticsService.track({
    eventType: 'dashboard_view',
    properties,
    componentName: 'DashboardView',
  });
};

// Track button click event
export const trackButtonClick = (elementId: string, properties?: Record<string, any>) => {
  analyticsService.track({
    eventType: 'button_click',
    elementId,
    properties,
    componentName: 'AnimatedButton',
  });
};

// Track task creation event
export const trackTaskCreated = (taskId: string, properties?: Record<string, any>) => {
  analyticsService.track({
    eventType: 'task_created',
    properties: {
      taskId,
      ...properties,
    },
    componentName: 'TaskForm',
  });
};

// Track task completion event
export const trackTaskCompleted = (taskId: string, properties?: Record<string, any>) => {
  analyticsService.track({
    eventType: 'task_completed',
    properties: {
      taskId,
      ...properties,
    },
    componentName: 'TaskItem',
  });
};

// Track task deletion event
export const trackTaskDeleted = (taskId: string, properties?: Record<string, any>) => {
  analyticsService.track({
    eventType: 'task_deleted',
    properties: {
      taskId,
      ...properties,
    },
    componentName: 'TaskItem',
  });
};

// Track filter applied event
export const trackFilterApplied = (filterType: string, filterValue: string, properties?: Record<string, any>) => {
  analyticsService.track({
    eventType: 'filter_applied',
    properties: {
      filterType,
      filterValue,
      ...properties,
    },
    componentName: 'TaskFilter',
  });
};

// Track search performed event
export const trackSearchPerformed = (searchTerm: string, properties?: Record<string, any>) => {
  analyticsService.track({
    eventType: 'search_performed',
    properties: {
      searchTerm,
      ...properties,
    },
    componentName: 'TaskSearch',
  });
};

// Track theme changed event
export const trackThemeChanged = (theme: string, properties?: Record<string, any>) => {
  analyticsService.track({
    eventType: 'theme_changed',
    properties: {
      theme,
      ...properties,
    },
    componentName: 'ThemeSelector',
  });
};

// Track accessibility setting changed event
export const trackAccessibilitySettingChanged = (setting: string, value: any, properties?: Record<string, any>) => {
  analyticsService.track({
    eventType: 'accessibility_setting_changed',
    properties: {
      setting,
      value,
      ...properties,
    },
    componentName: 'AccessibilitySettings',
  });
};

// Track navigation event
export const trackNavigation = (from: string, to: string, properties?: Record<string, any>) => {
  analyticsService.track({
    eventType: 'navigation',
    properties: {
      from,
      to,
      ...properties,
    },
    componentName: 'Navigation',
  });
};

// Export the analytics service for direct use if needed
export { analyticsService };