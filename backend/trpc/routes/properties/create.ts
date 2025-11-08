import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { supabase } from "@/lib/supabase";

export const createPropertyRoute = protectedProcedure
  .input(
    z.object({
      titre: z.string(),
      description: z.string(),
      type: z.enum(['MAISON', 'APPARTEMENT', 'TERRAIN', 'COMMERCE', 'BUREAU']),
      typeTransaction: z.enum(['VENTE', 'LOCATION']),
      prix: z.number(),
      surface: z.number(),
      villeId: z.string(),
      quartierId: z.string(),
      adresse: z.string(),
      nombreChambres: z.number().optional(),
      nombreSallesBain: z.number().optional(),
      equipements: z.array(z.string()).optional(),
      caracteristiques: z.record(z.string(), z.any()).optional(),
      statutJuridique: z.string().optional(),
      documentsTF: z.boolean().optional(),
      documentsPhotos: z.boolean().optional(),
      documentsPlans: z.boolean().optional(),
      documentsCadastre: z.boolean().optional(),
      documentsNotaire: z.boolean().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log('[tRPC] Creating property for user:', ctx.user.id);

    if (!supabase) {
      console.warn('[tRPC] Supabase not configured');
      throw new Error('Database not configured');
    }

    const { data, error } = await supabase
      .from('properties')
      .insert({
        utilisateur_id: ctx.user.id,
        titre: input.titre,
        description: input.description,
        type: input.type,
        type_transaction: input.typeTransaction,
        prix: input.prix,
        surface: input.surface,
        ville_id: input.villeId,
        quartier_id: input.quartierId,
        adresse: input.adresse,
        nombre_chambres: input.nombreChambres,
        nombre_salles_bain: input.nombreSallesBain,
        equipements: input.equipements,
        caracteristiques: input.caracteristiques,
        statut_juridique: input.statutJuridique,
        documents_tf: input.documentsTF,
        documents_photos: input.documentsPhotos,
        documents_plans: input.documentsPlans,
        documents_cadastre: input.documentsCadastre,
        documents_notaire: input.documentsNotaire,
        latitude: input.latitude,
        longitude: input.longitude,
        statut: 'BROUILLON',
      })
      .select()
      .single();

    if (error) {
      console.error('[tRPC] Error creating property:', error);
      throw new Error(error.message);
    }

    return data;
  });
