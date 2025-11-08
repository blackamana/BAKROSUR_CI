import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { supabase } from "@/lib/supabase";

export const updatePropertyRoute = protectedProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      titre: z.string().optional(),
      description: z.string().optional(),
      type: z.enum(['MAISON', 'APPARTEMENT', 'TERRAIN', 'COMMERCE', 'BUREAU']).optional(),
      typeTransaction: z.enum(['VENTE', 'LOCATION']).optional(),
      prix: z.number().optional(),
      surface: z.number().optional(),
      villeId: z.string().optional(),
      quartierId: z.string().optional(),
      adresse: z.string().optional(),
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
      statut: z.enum(['BROUILLON', 'PUBLIE', 'ARCHIVE', 'VENDU', 'LOUE']).optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log('[tRPC] Updating property:', input.id);

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
      throw new Error('Non autorisé à modifier cette propriété');
    }

    const updateData: Record<string, any> = {};
    if (input.titre) updateData.titre = input.titre;
    if (input.description) updateData.description = input.description;
    if (input.type) updateData.type = input.type;
    if (input.typeTransaction) updateData.type_transaction = input.typeTransaction;
    if (input.prix !== undefined) updateData.prix = input.prix;
    if (input.surface !== undefined) updateData.surface = input.surface;
    if (input.villeId) updateData.ville_id = input.villeId;
    if (input.quartierId) updateData.quartier_id = input.quartierId;
    if (input.adresse) updateData.adresse = input.adresse;
    if (input.nombreChambres !== undefined) updateData.nombre_chambres = input.nombreChambres;
    if (input.nombreSallesBain !== undefined) updateData.nombre_salles_bain = input.nombreSallesBain;
    if (input.equipements) updateData.equipements = input.equipements;
    if (input.caracteristiques) updateData.caracteristiques = input.caracteristiques;
    if (input.statutJuridique) updateData.statut_juridique = input.statutJuridique;
    if (input.documentsTF !== undefined) updateData.documents_tf = input.documentsTF;
    if (input.documentsPhotos !== undefined) updateData.documents_photos = input.documentsPhotos;
    if (input.documentsPlans !== undefined) updateData.documents_plans = input.documentsPlans;
    if (input.documentsCadastre !== undefined) updateData.documents_cadastre = input.documentsCadastre;
    if (input.documentsNotaire !== undefined) updateData.documents_notaire = input.documentsNotaire;
    if (input.latitude !== undefined) updateData.latitude = input.latitude;
    if (input.longitude !== undefined) updateData.longitude = input.longitude;
    if (input.statut) updateData.statut = input.statut;

    const { data, error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', input.id)
      .select()
      .single();

    if (error) {
      console.error('[tRPC] Error updating property:', error);
      throw new Error(error.message);
    }

    return data;
  });
