import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { supabase } from "@/lib/supabase";

export const getPropertyRoute = publicProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ input, ctx }) => {
    console.log('[tRPC] Fetching property:', input.id);
    
    if (!supabase) {
      console.warn('[tRPC] Supabase not configured');
      throw new Error('Database not configured');
    }
    
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images(id, url, ordre),
        property_documents(id, type, url),
        users(id, nom, prenom, telephone, avatar, verification_kyc_status),
        cities(nom),
        neighborhoods(nom)
      `)
      .eq('id', input.id)
      .single();

    if (error) {
      console.error('[tRPC] Error fetching property:', error);
      throw new Error(error.message);
    }

    await supabase.rpc('increment_property_views', { property_id: input.id });

    return data;
  });
