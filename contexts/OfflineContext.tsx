import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Platform } from 'react-native';

const OFFLINE_PROPERTIES_KEY = '@bakrosur_offline_properties';
const OFFLINE_FAVORITES_KEY = '@bakrosur_offline_favorites';
const OFFLINE_SEARCHES_KEY = '@bakrosur_offline_searches';
const LAST_SYNC_KEY = '@bakrosur_last_sync';

export interface OfflineData {
  properties: any[];
  favorites: string[];
  searches: any[];
  lastSync: string | null;
}

export const [OfflineProvider, useOffline] = createContextHook(() => {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    properties: [],
    favorites: [],
    searches: [],
    lastSync: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOfflineData();
    checkConnectivity();

    if (Platform.OS === 'web') {
      window.addEventListener('online', () => setIsOnline(true));
      window.addEventListener('offline', () => setIsOnline(false));

      return () => {
        window.removeEventListener('online', () => setIsOnline(true));
        window.removeEventListener('offline', () => setIsOnline(false));
      };
    }
  }, []);

  const checkConnectivity = async () => {
    if (Platform.OS === 'web') {
      setIsOnline(navigator.onLine);
    } else {
      setIsOnline(true);
    }
  };

  const loadOfflineData = async () => {
    try {
      const [properties, favorites, searches, lastSync] = await Promise.all([
        AsyncStorage.getItem(OFFLINE_PROPERTIES_KEY),
        AsyncStorage.getItem(OFFLINE_FAVORITES_KEY),
        AsyncStorage.getItem(OFFLINE_SEARCHES_KEY),
        AsyncStorage.getItem(LAST_SYNC_KEY),
      ]);

      setOfflineData({
        properties: properties ? JSON.parse(properties) : [],
        favorites: favorites ? JSON.parse(favorites) : [],
        searches: searches ? JSON.parse(searches) : [],
        lastSync: lastSync || null,
      });
    } catch (error) {
      console.error('Error loading offline data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProperties = useCallback(async (properties: any[]) => {
    try {
      await AsyncStorage.setItem(OFFLINE_PROPERTIES_KEY, JSON.stringify(properties));
      setOfflineData((prev) => ({ ...prev, properties }));
    } catch (error) {
      console.error('Error saving offline properties:', error);
    }
  }, []);

  const saveFavorites = useCallback(async (favorites: string[]) => {
    try {
      await AsyncStorage.setItem(OFFLINE_FAVORITES_KEY, JSON.stringify(favorites));
      setOfflineData((prev) => ({ ...prev, favorites }));
    } catch (error) {
      console.error('Error saving offline favorites:', error);
    }
  }, []);

  const saveSearches = useCallback(async (searches: any[]) => {
    try {
      await AsyncStorage.setItem(OFFLINE_SEARCHES_KEY, JSON.stringify(searches));
      setOfflineData((prev) => ({ ...prev, searches }));
    } catch (error) {
      console.error('Error saving offline searches:', error);
    }
  }, []);

  const syncData = useCallback(async (data: Partial<OfflineData>) => {
    try {
      const promises = [];

      if (data.properties) {
        promises.push(AsyncStorage.setItem(OFFLINE_PROPERTIES_KEY, JSON.stringify(data.properties)));
      }

      if (data.favorites) {
        promises.push(AsyncStorage.setItem(OFFLINE_FAVORITES_KEY, JSON.stringify(data.favorites)));
      }

      if (data.searches) {
        promises.push(AsyncStorage.setItem(OFFLINE_SEARCHES_KEY, JSON.stringify(data.searches)));
      }

      const lastSync = new Date().toISOString();
      promises.push(AsyncStorage.setItem(LAST_SYNC_KEY, lastSync));

      await Promise.all(promises);

      setOfflineData((prev) => ({
        ...prev,
        ...data,
        lastSync,
      }));

      console.log('Data synced successfully at:', lastSync);
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    }
  }, []);

  const clearOfflineData = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(OFFLINE_PROPERTIES_KEY),
        AsyncStorage.removeItem(OFFLINE_FAVORITES_KEY),
        AsyncStorage.removeItem(OFFLINE_SEARCHES_KEY),
        AsyncStorage.removeItem(LAST_SYNC_KEY),
      ]);

      setOfflineData({
        properties: [],
        favorites: [],
        searches: [],
        lastSync: null,
      });

      console.log('Offline data cleared');
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }, []);

  const getProperty = useCallback((propertyId: string) => {
    return offlineData.properties.find((p: any) => p.id === propertyId);
  }, [offlineData.properties]);

  const isFavorite = useCallback((propertyId: string) => {
    return offlineData.favorites.includes(propertyId);
  }, [offlineData.favorites]);

  const toggleFavorite = useCallback(async (propertyId: string) => {
    const newFavorites = isFavorite(propertyId)
      ? offlineData.favorites.filter((id) => id !== propertyId)
      : [...offlineData.favorites, propertyId];
    
    await saveFavorites(newFavorites);
  }, [offlineData.favorites, isFavorite, saveFavorites]);

  return useMemo(() => ({
    isOnline,
    offlineData,
    isLoading,
    saveProperties,
    saveFavorites,
    saveSearches,
    syncData,
    clearOfflineData,
    getProperty,
    isFavorite,
    toggleFavorite,
  }), [
    isOnline,
    offlineData,
    isLoading,
    saveProperties,
    saveFavorites,
    saveSearches,
    syncData,
    clearOfflineData,
    getProperty,
    isFavorite,
    toggleFavorite,
  ]);
});
