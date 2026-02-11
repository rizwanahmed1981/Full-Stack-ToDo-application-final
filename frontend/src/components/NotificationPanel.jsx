import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationPanel = ({ userId = 1 }) => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    reminder_time_before_due: 15,
    enable_browser_notifications: true,
    enable_email_notifications: false,
    notification_sound_enabled: true,
    notification_snooze_duration: 5
  });
  const [showSettings, setShowSettings] = useState(false);

  // Fetch notifications when component mounts or userId changes
  useEffect(() => {
    fetchNotifications();
    fetchNotificationSettings();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/v1/recurring-tasks/notifications/?user_id=${userId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      const response = await axios.get(`/api/v1/recurring-tasks/notification-settings/${userId}`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      // Use default settings if none exist
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/v1/recurring-tasks/notifications/${notificationId}/mark-read`);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const snoozeNotification = async (notificationId) => {
    try {
      await axios.put(`/api/v1/recurring-tasks/notifications/${notificationId}/snooze`);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error snoozing notification:', error);
    }
  };

  const updateSettings = async () => {
    try {
      await axios.put(`/api/v1/recurring-tasks/notification-settings/${userId}`, settings);
      alert('Notification settings updated successfully!');
      setShowSettings(false);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      alert('Error updating notification settings: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="notification-panel">
      <div className="panel-header">
        <h3>Notifications</h3>
        <button onClick={() => setShowSettings(!showSettings)}>
          {showSettings ? 'Hide Settings' : 'Show Settings'}
        </button>
      </div>

      {showSettings && (
        <div className="notification-settings">
          <h4>Notification Settings</h4>
          <div className="form-group">
            <label>
              Reminder Time (minutes before due):
              <input
                type="number"
                name="reminder_time_before_due"
                value={settings.reminder_time_before_due}
                onChange={handleSettingChange}
                min="1"
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="enable_browser_notifications"
                checked={settings.enable_browser_notifications}
                onChange={handleSettingChange}
              />
              Enable Browser Notifications
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="enable_email_notifications"
                checked={settings.enable_email_notifications}
                onChange={handleSettingChange}
              />
              Enable Email Notifications
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="notification_sound_enabled"
                checked={settings.notification_sound_enabled}
                onChange={handleSettingChange}
              />
              Enable Notification Sound
            </label>
          </div>
          
          <div className="form-group">
            <label>
              Snooze Duration (minutes):
              <input
                type="number"
                name="notification_snooze_duration"
                value={settings.notification_snooze_duration}
                onChange={handleSettingChange}
                min="1"
              />
            </label>
          </div>
          
          <button onClick={updateSettings}>Save Settings</button>
        </div>
      )}

      <div className="notifications-list">
        <h4>Pending Notifications ({notifications.length})</h4>
        {notifications.length === 0 ? (
          <p>No pending notifications</p>
        ) : (
          <ul>
            {notifications.map(notification => (
              <li key={notification.id} className="notification-item">
                <div className="notification-content">
                  <h5>{notification.title}</h5>
                  <p>{notification.message}</p>
                  <small>Scheduled: {new Date(notification.scheduled_time).toLocaleString()}</small>
                </div>
                <div className="notification-actions">
                  <button onClick={() => markAsRead(notification.id)}>Mark Read</button>
                  <button onClick={() => snoozeNotification(notification.id)}>Snooze</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;