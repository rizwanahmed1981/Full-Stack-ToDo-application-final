import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';
import { CacheService } from '@/services/cache';
import { Task } from '@/types';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check last sync time on mount
  useEffect(() => {
    const checkLastSyncTime = async () => {
      const time = await CacheService.getLastSyncTime();
      setLastSyncTime(time);
    };

    checkLastSyncTime();
  }, []);

  const syncWithServer = async (): Promise<boolean> => {
    if (!isOnline) {
      console.warn('Device is offline, skipping sync');
      return false;
    }

    setSyncing(true);
    try {
      // Get pending operations from cache
      const pendingOps = await CacheService.getPendingOperations();

      // Process each pending operation
      for (const op of pendingOps) {
        let result;
        switch (op.type) {
          case 'create':
            result = await ApiService.createTask(op.data);
            break;
          case 'update':
            result = await ApiService.updateTask(op.data.id, op.data);
            break;
          case 'delete':
            result = await ApiService.deleteTask(op.data.id);
            break;
          default:
            console.warn(`Unknown operation type: ${op.type}`);
            continue;
        }

        if (result.error) {
          console.error(`Failed to sync ${op.type} operation:`, result.error);
          // For now, we'll continue with other operations, but in a real app you might want to handle this differently
        }
      }

      // If all operations succeeded, clear the pending operations
      await CacheService.clearPendingOperations();

      // Update the last sync time
      const now = new Date();
      await CacheService.setLastSyncTime(now);
      setLastSyncTime(now);

      // Refresh tasks from server
      const response = await ApiService.getTasks();
      if (!response.error) {
        await CacheService.setAllTasks(response.data.tasks);
      }

      return true;
    } catch (error) {
      console.error('Error during sync:', error);
      return false;
    } finally {
      setSyncing(false);
    }
  };

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline) {
      // Small delay to ensure network is fully restored
      const timer = setTimeout(() => {
        syncWithServer();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  return {
    isOnline,
    syncing,
    lastSyncTime,
    syncWithServer,
  };
};