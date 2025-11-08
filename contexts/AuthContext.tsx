import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  kycStatus?: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  profileType?: 'particulier' | 'professionnel' | 'intervenant';
  firstName?: string;
  companyName?: string;
  activityType?: string;
  rccm?: string;
  profession?: string;
  agrementNumber?: string;
  cabinet?: string;
  cityId?: string;
  neighborhoodId?: string;
  address?: string;
  isBailleur?: boolean;
  
  // 🆕 NOUVEAUX CHAMPS pour Intervenants
  intervenantType?: 'NOTAIRE' | 'AVOCAT' | 'HUISSIER' | 'GEOMETRE' | 'EXPERT';
  chambreInscription?: string;      // "Chambre des Notaires CI"
  numeroInscription?: string;       // "N°12345"
  assuranceRCPro?: string;          // Numéro de police
  specialites?: string[];           // ["Droit immobilier", "Contentieux"]
  tarifConsultation?: number;       // Prix consultation en FCFA
  zonesIntervention?: string[];     // IDs de villes
  disponibilites?: {
    lundi: boolean;
    mardi: boolean;
    mercredi: boolean;
    jeudi: boolean;
    vendredi: boolean;
    samedi: boolean;
    dimanche: boolean;
  };
  delaiMoyenIntervention?: number;  // En jours
  nombreInterventions?: number;     // Statistiques
  noteMoyenne?: number;             // Sur 5
};

const AUTH_STORAGE_KEY = '@bakrôsur_auth';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      if (!supabase) {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
        setIsLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: userData.nom || session.user.email!.split('@')[0],
            phone: userData.telephone,
            avatar: userData.avatar,
            kycStatus: userData.verification_kyc_status,
            profileType: userData.type_profil,
            firstName: userData.prenom,
            companyName: userData.nom_entreprise,
            activityType: userData.type_activite,
            rccm: userData.rccm,
            profession: userData.profession,
            agrementNumber: userData.numero_agrement,
            cabinet: userData.cabinet,
            cityId: userData.ville_id,
            neighborhoodId: userData.quartier_id,
            address: userData.adresse,
            isBailleur: userData.est_bailleur,
            
            // 🆕 Champs intervenants
            intervenantType: userData.type_intervenant,
            chambreInscription: userData.chambre_inscription,
            numeroInscription: userData.numero_inscription,
            assuranceRCPro: userData.assurance_rc_pro,
            specialites: userData.specialites,
            tarifConsultation: userData.tarif_consultation,
            zonesIntervention: userData.zones_intervention,
            disponibilites: userData.disponibilites,
            delaiMoyenIntervention: userData.delai_moyen_intervention,
            nombreInterventions: userData.nombre_interventions,
            noteMoyenne: userData.note_moyenne,
          };
          
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
          setUser(user);
        }
      } else {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!supabase) {
        return { success: false, error: 'Connexion à la base de données non disponible' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('User data fetch error:', userError);
        }

        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          name: userData?.nom || data.user.email!.split('@')[0],
          phone: userData?.telephone,
          avatar: userData?.avatar,
          kycStatus: userData?.verification_kyc_status,
          profileType: userData?.type_profil,
          firstName: userData?.prenom,
          companyName: userData?.nom_entreprise,
          activityType: userData?.type_activite,
          rccm: userData?.rccm,
          profession: userData?.profession,
          agrementNumber: userData?.numero_agrement,
          cabinet: userData?.cabinet,
          cityId: userData?.ville_id,
          neighborhoodId: userData?.quartier_id,
          address: userData?.adresse,
          isBailleur: userData?.est_bailleur,
          
          // 🆕 Champs intervenants
          intervenantType: userData?.type_intervenant,
          chambreInscription: userData?.chambre_inscription,
          numeroInscription: userData?.numero_inscription,
          assuranceRCPro: userData?.assurance_rc_pro,
          specialites: userData?.specialites,
          tarifConsultation: userData?.tarif_consultation,
          zonesIntervention: userData?.zones_intervention,
          disponibilites: userData?.disponibilites,
          delaiMoyenIntervention: userData?.delai_moyen_intervention,
          nombreInterventions: userData?.nombre_interventions,
          noteMoyenne: userData?.note_moyenne,
        };

        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        setUser(user);
        return { success: true };
      }

      return { success: false, error: 'Utilisateur non trouvé' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (
    email: string,
    password: string,
    name: string,
    phone?: string,
    isBailleur?: boolean
  ) => {
    setIsLoading(true);
    try {
      if (!supabase) {
        return { success: false, error: 'Connexion à la base de données non disponible' };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nom: name,
            telephone: phone,
            est_bailleur: isBailleur,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email!,
          nom: name,
          telephone: phone,
          est_bailleur: isBailleur,
          verification_kyc_status: 'PENDING',
        });

        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          name,
          phone,
          kycStatus: 'PENDING',
          isBailleur,
        };

        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        setUser(user);
        return { success: true };
      }

      return { success: false, error: 'Erreur lors de la création du compte' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: "Erreur lors de l'inscription" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('Starting logout process...');
      
      // Force le re-rendu en activant d'abord le loading
      setIsLoading(true);
      
      if (supabase) {
        console.log('Signing out from Supabase...');
        await supabase.auth.signOut();
      }
      
      console.log('Removing user from AsyncStorage...');
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      
      console.log('Setting user to null...');
      setUser(null);
      
      console.log('Forcing context refresh...');
      setRefreshKey(prev => prev + 1);
      
      // Petit délai pour assurer la mise à jour de l'état
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Désactiver le loading pour forcer un cycle de rendu complet
      setIsLoading(false);
      
      console.log('Logout completed successfully');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
      return { success: false, error };
    }
  }, []);

  const updateUser = useCallback(
    async (updates: Partial<User>) => {
      if (!user) return;

      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    },
    [user]
  );

  return useMemo(
    () => ({
      user,
      isLoading,
      login,
      signup,
      logout,
      updateUser,
      isAuthenticated: !!user,
      refreshKey,
    }),
    [user, isLoading, login, signup, logout, updateUser, refreshKey]
  );
});
