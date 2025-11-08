/**
 * Service de suggestions de recherche avec Supabase
 * Fournit l'autocomplete pour la barre de recherche
 */

import { supabase } from '@/lib/supabase';
import { SearchSuggestion } from '@/lib/types/search.types';

class SearchSuggestionsService {
  /**
   * Récupère les suggestions de recherche
   */
  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (!supabase || query.length < 2) return [];

    const suggestions: SearchSuggestion[] = [];

    try {
      // Recherche dans les villes
      const { data: cities } = await supabase
        .from('cities')
        .select('id, name')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (cities) {
        // Compter les propriétés par ville
        for (const city of cities) {
          const { count } = await supabase
            .from('properties')
            .select('*', { count: 'exact', head: true })
            .eq('city_id', city.id);

          suggestions.push({
            id: city.id,
            type: 'city',
            label: city.name,
            metadata: {
              count: count || 0,
            },
          });
        }
      }

      // Recherche dans les quartiers
      const { data: neighborhoods } = await supabase
        .from('neighborhoods')
        .select('id, name, city:cities(name)')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (neighborhoods) {
        for (const neighborhood of neighborhoods as any[]) {
          const { count } = await supabase
            .from('properties')
            .select('*', { count: 'exact', head: true })
            .eq('neighborhood_id', neighborhood.id);

          suggestions.push({
            id: neighborhood.id,
            type: 'neighborhood',
            label: neighborhood.name,
            metadata: {
              city: neighborhood.city?.name,
              count: count || 0,
            },
          });
        }
      }

      // Recherche dans les propriétés (titres)
      const { data: properties } = await supabase
        .from('properties')
        .select('id, title, city_name')
        .ilike('title', `%${query}%`)
        .limit(3);

      if (properties) {
        properties.forEach((property) => {
          suggestions.push({
            id: property.id,
            type: 'property',
            label: property.title,
            metadata: {
              city: property.city_name,
            },
          });
        });
      }

      return suggestions;
    } catch (error) {
      console.error('Erreur récupération suggestions:', error);
      return [];
    }
  }

  /**
   * Sauvegarde une recherche dans l'historique
   */
  async saveSearchToHistory(userId: string, query: string): Promise<void> {
    if (!supabase) return;

    try {
      await supabase.from('search_history').insert({
        user_id: userId,
        query,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Erreur sauvegarde historique:', error);
    }
  }

  /**
   * Récupère l'historique de recherche
   */
  async getSearchHistory(userId: string, limit: number = 5): Promise<string[]> {
    if (!supabase) return [];

    try {
      const { data } = await supabase
        .from('search_history')
        .select('query')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return data?.map((item) => item.query) || [];
    } catch (error) {
      console.error('Erreur récupération historique:', error);
      return [];
    }
  }

  /**
   * Efface l'historique de recherche
   */
  async clearSearchHistory(userId: string): Promise<void> {
    if (!supabase) return;

    try {
      await supabase
        .from('search_history')
        .delete()
        .eq('user_id', userId);
    } catch (error) {
      console.error('Erreur effacement historique:', error);
    }
  }
}

export const searchSuggestionsService = new SearchSuggestionsService();
