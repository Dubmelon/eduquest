import { useState, useEffect } from 'react';
import { CourseCard } from '@/components/home/CourseCard';
import { CurriculumManager } from '@/lib/curriculum/manager';
import type { Program, Course } from '@/types/curriculum';
import { useToast } from '@/hooks/use-toast';

interface CurriculumViewProps {
  programId: string;
}

export const CurriculumView = ({ programId }: CurriculumViewProps) => {
  const [manager] = useState(() => new CurriculumManager());
  const [program, setProgram] = useState<Program | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      try {
        console.log("Initializing curriculum manager...");
        await manager.initialize();
        const loadedProgram = manager.getProgram();
        console.log("Loaded program:", loadedProgram);
        setProgram(loadedProgram);
      } catch (error) {
        console.error("Error loading curriculum:", error);
        toast({
          variant: "destructive",
          title: "Error loading curriculum",
          description: "Failed to load the curriculum data. Please try again."
        });
      }
    };
    init();
  }, [programId]);

  if (!program) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{program.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {program.degrees[0].courses.map((course, index) => {
          if (!course) {
            console.warn("Missing course data at index:", index);
            return null;
          }
          
          return (
            <CourseCard 
              key={course.id}
              course={{
                ...course,
                category: course.level,
                duration: `${course.credits} credits`
              }}
              modules={course.modules}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
};