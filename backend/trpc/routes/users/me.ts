import { protectedProcedure } from "../../create-context";
import { supabase } from "@/lib/supabase";

export const meRoute = protectedProcedure.query(async ({ ctx }) => {
  console.log('[tRPC] Fetching user profile:', ctx.user?.id);
  
  if (!ctx.user?.id) {
    return null;
  }

  if (!supabase) {
    console.warn('[tRPC] Supabase not configured');
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', ctx.user.id)
    .single();

  if (error) {
    console.error('[tRPC] Error fetching user:', error);
    throw new Error(error.message);
  }

  return data;
});
