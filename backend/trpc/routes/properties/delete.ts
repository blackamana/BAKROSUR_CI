import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { supabase } from "@/lib/supabase";

export const deletePropertyRoute = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    console.log('[tRPC] Deleting property:', input.id);

    if (!supabase) {
      console.warn('[tRPC] Supabase not configured');
      throw new Error('Database not configured');
    }

    const { data: existing } = await supabase
      .from('properties')
      .select('utilisateur_id')
      .eq('id', input.id)
      .single();

    if (!existing || existing.utilisateur_id !== ctx.user.id) {
      throw new Error('Non autorisé à supprimer cette propriété');
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', input.id);

    if (error) {
      console.error('[tRPC] Error deleting property:', error);
      throw new Error(error.message);
    }

    return { success: true, message: 'Propriété supprimée avec succès' };
  });
