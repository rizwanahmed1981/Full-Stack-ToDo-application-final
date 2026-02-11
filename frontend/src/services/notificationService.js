// Service for handling browser notifications
class NotificationService {
  constructor() {
    this.requestPermission();
  }

  // Request permission to show browser notifications
  async requestPermission() {
    if (!("Notification" in window)) {
      console.log("Browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }

  // Show a browser notification
  showNotification(title, options = {}) {
    if (Notification.permission === "granted") {
      try {
        const notification = new Notification(title, options);
        return notification;
      } catch (error) {
        console.error("Error showing notification:", error);
        return null;
      }
    } else {
      console.warn("Notification permission not granted");
      return null;
    }
  }

  // Show a notification with default options
  showDefaultNotification(title, message, icon = null) {
    const options = {
      body: message,
      icon: icon || "/favicon.ico",
      badge: "/favicon.ico",
      requireInteraction: false, // Auto-dismiss after a short time
    };

    return this.showNotification(title, options);
  }

  // Schedule a notification for a future time
  scheduleNotification(title, message, delayMs, icon = null) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const notification = this.showDefaultNotification(title, message, icon);
        if (notification) {
          resolve(notification);
        } else {
          reject(new Error("Could not show notification"));
        }
      }, delayMs);
    });
  }

  // Check if browser notifications are supported
  isSupported() {
    return "Notification" in window;
  }

  // Check if notifications are enabled
  isEnabled() {
    return Notification.permission === "granted";
  }

  // Get current permission status
  getPermissionStatus() {
    return Notification.permission;
  }

  // Convert UTC time to local time
  convertUTCToLocal(utcDateString) {
    const utcDate = new Date(utcDateString);
    return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
  }

  // Format time difference for display (e.g., "in 5 minutes")
  getTimeDifferenceString(date) {
    const now = new Date();
    const targetDate = new Date(date);
    const diffMs = targetDate - now;
    
    if (diffMs < 0) {
      return "Time has passed";
    }

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      return `in ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    }
  }
}

// Export a singleton instance
const notificationService = new NotificationService();
export default notificationService;