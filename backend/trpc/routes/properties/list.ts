import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { supabase } from "@/lib/supabase";

export const listPropertiesRoute = publicProcedure
  .input(
    z.object({
      cityId: z.string().optional(),
      neighborhoodId: z.string().optional(),
      type: z.enum(['MAISON', 'APPARTEMENT', 'TERRAIN', 'COMMERCE', 'BUREAU']).optional(),
      transactionType: z.enum(['VENTE', 'LOCATION']).optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      minSurface: z.number().optional(),
      maxSurface: z.number().optional(),
      bedrooms: z.number().optional(),
      bathrooms: z.number().optional(),
      featured: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    })
  )
  .query(async ({ input, ctx }) => {
    console.log('[tRPC] Fetching properties with filters:', input);
    
    if (!supabase) {
      console.warn('[tRPC] Supabase not configured, returning empty results');
      return {
        properties: [],
        total: 0,
        hasMore: false,
      };
    }
    
    let query = supabase
      .from('properties')
      .select('*, property_images(url), users(nom, telephone)', { count: 'exact' })
      .eq('statut', 'PUBLIE');

    if (input.cityId) {
      query = query.eq('ville_id', input.cityId);
    }
    if (input.neighborhoodId) {
      query = query.eq('quartier_id', input.neighborhoodId);
    }
    if (input.type) {
      query = query.eq('type', input.type);
    }
    if (input.transactionType) {
      query = query.eq('type_transaction', input.transactionType);
    }
    if (input.minPrice !== undefined) {
      query = query.gte('prix', input.minPrice);
    }
    if (input.maxPrice !== undefined) {
      query = query.lte('prix', input.maxPrice);
    }
    if (input.minSurface !== undefined) {
      query = query.gte('surface', input.minSurface);
    }
    if (input.maxSurface !== undefined) {
      query = query.lte('surface', input.maxSurface);
    }
    if (input.bedrooms !== undefined) {
      query = query.gte('nombre_chambres', input.bedrooms);
    }
    if (input.bathrooms !== undefined) {
      query = query.gte('nombre_salles_bain', input.bathrooms);
    }
    if (input.featured) {
      query = query.eq('est_vedette', true);
    }

    query = query
      .order('date_publication', { ascending: false })
      .range(input.offset, input.offset + input.limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('[tRPC] Error fetching properties:', error);
      throw new Error(error.message);
    }

    return {
      properties: data || [],
      total: count || 0,
      hasMore: (count || 0) > input.offset + input.limit,
    };
  });
