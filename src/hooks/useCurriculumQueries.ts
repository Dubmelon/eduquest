import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import type { Module } from "@/types/curriculum";

export const useCurriculumQueries = (curriculumId?: string) => {
  const { data: modules, isLoading: modulesLoading, error: modulesError } = useQuery({
    queryKey: ["curriculum-modules", curriculumId],
    queryFn: async () => {
      if (!curriculumId) {
        console.warn("No curriculum ID provided to useCurriculumQueries");
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('curriculum_modules')
          .select('*')
          .eq('curriculum_id', curriculumId);

        if (error) {
          toast({
            title: "Error loading modules",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }

        return data as Module[];
      } catch (error) {
        console.error("Error in useCurriculumQueries:", error);
        throw error;
      }
    },
    enabled: !!curriculumId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  return { 
    modules: modules || [], 
    modulesLoading, 
    modulesError 
  };
};