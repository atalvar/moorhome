import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/contexts/ReservationContext';

const QUERY_OPTIONS = {
  staleTime: 60_000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  retry: false,
};

export const useProducts = (includeReserved = false) => {
  return useQuery({
    queryKey: ['products', includeReserved],
    queryFn: async (): Promise<Product[]> => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!includeReserved) {
        query = query.eq('is_reserved', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    ...QUERY_OPTIONS,
  });
};
