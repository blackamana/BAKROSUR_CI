import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { supabase } from "@/lib/supabase";

export const toggleFavoriteRoute = protectedProcedure
  .input(z.object({ propertyId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    console.log('[tRPC] Toggling favorite for property:', input.propertyId);
    
    if (!supabase) {
      console.warn('[tRPC] Supabase not configured');
      throw new Error('Database not configured');
    }
    
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('utilisateur_id', ctx.user.id)
      .eq('propriete_id', input.propertyId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);

      if (error) {
        console.error('[tRPC] Error removing favorite:', error);
        throw new Error(error.message);
      }

      return {
        isFavorite: false,
        message: 'Favori retiré',
      };
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({
          utilisateur_id: ctx.user.id,
          propriete_id: input.propertyId,
        });

      if (error) {
        console.error('[tRPC] Error adding favorite:', error);
        throw new Error(error.message);
      }

      return {
        isFavorite: true,
        message: 'Ajouté aux favoris',
      };
    }
  });
