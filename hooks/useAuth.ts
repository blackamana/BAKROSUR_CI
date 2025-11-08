/**
 * Hook useAuth - Wrapper pour AuthContext
 */

import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const authContext = useAuthContext();
  
  return {
    user: authContext.user,
    isAuthenticated: authContext.isAuthenticated,
    loading: authContext.loading,
    signIn: authContext.signIn,
    signUp: authContext.signUp,
    signOut: authContext.signOut,
  };
};