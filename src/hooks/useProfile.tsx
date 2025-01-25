import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useProfile = () => {
  const { toast } = useToast();

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id,
            full_name: user.email?.split('@')[0] || '',
            level: 'Intermediate',
            notification_preferences: {
              email: true,
              push: true,
              marketing: false
            },
            language_preference: 'en',
            theme_preference: 'system',
            accessibility_settings: {
              fontSize: 'medium',
              highContrast: false,
              reducedMotion: false
            },
            privacy_settings: {
              profileVisibility: 'public',
              activityVisibility: 'friends'
            }
          }])
          .select()
          .single();

        if (createError) throw createError;
        return { user, profile: newProfile };
      }

      return { user, profile };
    },
    retry: 1
  });

  const updateProfile = async (updates: {
    name: string;
    level: string;
    avatar_url?: string;
    notification_preferences?: Record<string, boolean>;
    language_preference?: string;
    theme_preference?: string;
    accessibility_settings?: Record<string, any>;
    privacy_settings?: Record<string, string>;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: updates.name,
          level: updates.level,
          avatar_url: updates.avatar_url,
          notification_preferences: updates.notification_preferences,
          language_preference: updates.language_preference,
          theme_preference: updates.theme_preference,
          accessibility_settings: updates.accessibility_settings,
          privacy_settings: updates.privacy_settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { userData, isLoading, error, updateProfile };
};