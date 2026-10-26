import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Row = Record<string, unknown>;

export function useRows<T = Row>(table: string, options?: { select?: string; order?: string; ascending?: boolean }) {
  return useQuery({
    queryKey: [table, options?.select ?? "*", options?.order ?? "created_at"],
    queryFn: async () => {
      try {
        const query = supabase
          .from(table as never)
          .select(options?.select ?? "*")
          .order(options?.order ?? "created_at", { ascending: options?.ascending ?? false });
        const { data, error } = await query;
        if (error) {
          console.warn(`[useRows] ${table} fetch warning:`, error.message);
          return [] as T[];
        }
        return (data ?? []) as T[];
      } catch (err) {
        console.warn(`[useRows] ${table} failed:`, err);
        return [] as T[];
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 3,
  });
}

export function useRow<T = Row>(table: string, id?: string, select = "*") {
  return useQuery({
    enabled: Boolean(id) && id !== "new",
    queryKey: [table, "row", id, select],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table as never)
        .select(select)
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data as T | null;
    },
  });
}

export function useSaveRow(table: string, message = "Saved") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: Row) => {
      const { data, error } = await supabase
        .from(table as never)
        .upsert(values as never)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data as unknown as Row;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success(message);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteRow(table: string, message = "Deleted") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success(message);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useBusinessProfile() {
  return useQuery({
    queryKey: ["business_profile"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("business_profile").select("*").limit(1).maybeSingle();
        if (error) {
          console.warn("[useBusinessProfile] Fetch warning:", error.message);
          return null;
        }
        return data;
      } catch (err) {
        console.warn("[useBusinessProfile] Failed:", err);
        return null;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useUpdateRow = useSaveRow;
