import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { supabase } from "@/lib/supabase";

export const uploadPropertyImageRoute = protectedProcedure
  .input(
    z.object({
      propertyId: z.string().uuid(),
      imageUrl: z.string(),
      ordre: z.number().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log('[tRPC] Uploading property image:', input.propertyId);

    if (!supabase) {
      console.warn('[tRPC] Supabase not configured');
      throw new Error('Database not configured');
    }

    const { data: property } = await supabase
      .from('properties')
      .select('utilisateur_id')
      .eq('id', input.propertyId)
      .single();

    if (!property || property.utilisateur_id !== ctx.user.id) {
      throw new Error('Non autorisé à ajouter des images à cette propriété');
    }

    const { data, error } = await supabase
      .from('property_images')
      .insert({
        propriete_id: input.propertyId,
        url: input.imageUrl,
        ordre: input.ordre || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('[tRPC] Error uploading property image:', error);
      throw new Error(error.message);
    }

    return data;
  });
