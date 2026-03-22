import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/contexts/ReservationContext';

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
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('is_reserved', false);

      if (error) throw error;
      const unique = [...new Set((data || []).map((p) => p.category))];
      return ['Kõik', ...unique.sort()];
    },
  });
};
