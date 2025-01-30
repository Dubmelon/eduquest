import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCurriculumAPI = () => {
  const queryClient = useQueryClient();

  const fetchPrograms = async () => {
    const { data, error } = await supabase.functions.invoke('curriculum-api', {
      body: { resource: 'programs' }
    });
    if (error) throw error;
    return data;
  };

  const fetchDegreesByProgram = async (programId: string) => {
    const { data, error } = await supabase.functions.invoke('curriculum-api', {
      body: { resource: 'degrees', programId }
    });
    if (error) throw error;
    return data;
  };

  const fetchCoursesByDegree = async (degreeId: string) => {
    const { data, error } = await supabase.functions.invoke('curriculum-api', {
      body: { resource: 'courses', degreeId }
    });
    if (error) throw error;
    return data;
  };

  const usePrograms = () => {
    return useQuery({
      queryKey: ['programs'],
      queryFn: fetchPrograms
    });
  };

  const useDegrees = (programId: string) => {
    return useQuery({
      queryKey: ['degrees', programId],
      queryFn: () => fetchDegreesByProgram(programId),
      enabled: !!programId
    });
  };

  const useCourses = (degreeId: string) => {
    return useQuery({
      queryKey: ['courses', degreeId],
      queryFn: () => fetchCoursesByDegree(degreeId),
      enabled: !!degreeId
    });
  };

  const createProgram = useMutation({
    mutationFn: async (program: { title: string; description?: string }) => {
      const { data, error } = await supabase.functions.invoke('curriculum-api', {
        body: { resource: 'programs', method: 'POST', data: program }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    }
  });

  return {
    usePrograms,
    useDegrees,
    useCourses,
    createProgram
  };
};