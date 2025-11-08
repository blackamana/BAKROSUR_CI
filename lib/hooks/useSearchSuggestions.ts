/**
 * Hook React pour les suggestions de recherche avec Supabase
 */

import { useState, useCallback } from 'react';
import { searchSuggestionsService } from '@/lib/services/search-suggestions.service';
import { SearchSuggestion } from '@/lib/types/search.types';

export function useSearchSuggestions(userId?: string) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Récupère les suggestions pour un query
   */
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return [];
    }

    setIsLoading(true);
    const data = await searchSuggestionsService.getSuggestions(query);
    setSuggestions(data);
    setIsLoading(false);

    return data;
  }, []);

  /**
   * Sauvegarde une recherche dans l'historique
   */
  const saveToHistory = useCallback(
    async (query: string) => {
      if (!userId) return;
      await searchSuggestionsService.saveSearchToHistory(userId, query);
      // Recharger l'historique
      loadHistory();
    },
    [userId]
  );

  /**
   * Charge l'historique de recherche
   */
  const loadHistory = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    const data = await searchSuggestionsService.getSearchHistory(userId);
    setHistory(data);
    setIsLoading(false);
  }, [userId]);

  /**
   * Efface l'historique de recherche
   */
  const clearHistory = useCallback(async () => {
    if (!userId) return;
    await searchSuggestionsService.clearSearchHistory(userId);
    setHistory([]);
  }, [userId]);

  return {
    suggestions,
    history,
    isLoading,
    fetchSuggestions,
    saveToHistory,
    loadHistory,
    clearHistory,
  };
}
