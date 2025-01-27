import { useState, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModuleList } from '@/components/curriculum/ModuleList';
import { ModuleContent } from '@/components/learning/ModuleContent';
import { CurriculumSelector } from '@/components/learning/CurriculumSelector';
import { useCurriculum } from '@/hooks/use-curriculum';
import { useProgress } from '@/hooks/use-progress';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Loader2, Plus } from "lucide-react";
import type { Module } from '@/types/curriculum';
import { TooltipProvider } from '@/components/ui/tooltip';

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="h-12 w-full bg-muted animate-pulse rounded" />
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 w-full bg-muted animate-pulse rounded" />
      ))}
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex items-center justify-center h-[calc(100vh-20rem)] glass-panel rounded-xl p-8 text-center">
    <div className="max-w-md">
      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <h2 className="text-2xl font-semibold mb-2">No Curriculum Selected</h2>
      <p className="text-muted-foreground mb-6">
        Import a curriculum or select an existing one to start learning
      </p>
      <Button 
        onClick={() => window.location.href = '/curriculum-import'}
        className="gap-2"
      >
        <Plus className="w-4 h-4" />
        Import Curriculum
      </Button>
    </div>
  </div>
);

const Learning = () => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const { curriculumId } = useParams();
  const { curricula, isLoading } = useCurriculum();
  const { updateProgress } = useProgress(curriculumId);
  const navigate = useNavigate();

  const handleModuleSelect = async (module: Module) => {
    setSelectedModule(module);
    if (curriculumId) {
      await updateProgress.mutateAsync({
        moduleId: module.id,
        courseId: module.id,
      });
    }
  };

  const handleCurriculumChange = (id: string) => {
    if (id === 'new') {
      navigate('/curriculum-import');
    } else {
      navigate(`/learning/${id}`);
      setSelectedModule(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your learning materials...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b animate-fade-in">
            <h1 className="text-3xl font-bold">Learning</h1>
            <CurriculumSelector
              curricula={curricula}
              currentCurriculumId={curriculumId}
              onCurriculumChange={handleCurriculumChange}
            />
          </div>

          {curriculumId ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              <div className="lg:col-span-4">
                <div className="sticky top-4">
                  <Suspense fallback={<LoadingSkeleton />}>
                    <ModuleList
                      curriculumId={curriculumId}
                      onModuleSelect={handleModuleSelect}
                    />
                  </Suspense>
                </div>
              </div>
              
              <div className="lg:col-span-8">
                <Suspense fallback={<LoadingSkeleton />}>
                  {selectedModule ? (
                    <ModuleContent module={selectedModule} />
                  ) : (
                    <EmptyState />
                  )}
                </Suspense>
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Learning;