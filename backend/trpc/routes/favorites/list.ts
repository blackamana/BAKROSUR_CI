import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { supabase } from "@/lib/supabase";

export const listFavoritesRoute = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    })
  )
  .query(async ({ input, ctx }) => {
    console.log('[tRPC] Fetching favorites for user:', ctx.user.id);
    
    if (!supabase) {
      console.warn('[tRPC] Supabase not configured');
      return {
        favorites: [],
        total: 0,
        hasMore: false,
      };
    }
    
    const { data, error, count } = await supabase
      .from('favorites')
      .select(`
        id,
        property:properties(
          *,
          property_images(url),
          users(nom, telephone)
        )
      `, { count: 'exact' })
      .eq('utilisateur_id', ctx.user.id)
      .order('date_ajout', { ascending: false })
      .range(input.offset, input.offset + input.limit - 1);

    if (error) {
      console.error('[tRPC] Error fetching favorites:', error);
      throw new Error(error.message);
    }

    return {
      favorites: data || [],
      total: count || 0,
      hasMore: (count || 0) > input.offset + input.limit,
    };
  });
