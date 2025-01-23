import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { DEFAULT_SCHOOL } from "@/data/defaultSchool";

export const SchoolHeader = ({ schoolId }: { schoolId: string }) => {
  const { data: school } = useQuery({
    queryKey: ["school", schoolId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("schools")
          .select("*")
          .eq("id", schoolId)
          .maybeSingle();
        
        if (error) throw error;
        
        // If no school is found in the database, return the default school
        if (!data) {
          return DEFAULT_SCHOOL;
        }
        
        return data;
      } catch (error) {
        console.error("Error fetching school:", error);
        // Return default school as fallback
        return DEFAULT_SCHOOL;
      }
    },
    enabled: !!schoolId,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-background/80 backdrop-blur-lg border-b sticky top-0 z-10"
    >
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        {school?.logo_url ? (
          <img 
            src={school.logo_url} 
            alt={school.name} 
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {school?.name?.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold">{school?.name}</h1>
          <p className="text-sm text-muted-foreground">{school?.description}</p>
        </div>
      </div>
    </motion.div>
  );
};