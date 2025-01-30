import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronDown, BookOpen, FileText, CheckCircle } from "lucide-react";
import { useCurriculumQueries } from "@/hooks/useCurriculumQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { ModuleListProps, ModuleContent } from "@/types/learning-types";

const ModuleListSkeleton = () => (
  <div className="space-y-2 sm:space-y-4 p-2 sm:p-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-3 sm:p-4 border rounded-lg bg-card">
        <Skeleton className="h-5 sm:h-6 w-3/4 mb-2" />
        <Skeleton className="h-3 sm:h-4 w-full mb-3 sm:mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 sm:h-6 w-14 sm:w-16" />
          <Skeleton className="h-5 sm:h-6 w-14 sm:w-16" />
        </div>
      </div>
    ))}
  </div>
);

export const ModuleList = ({ curriculumId, onModuleSelect }: ModuleListProps) => {
  const { modules, modulesLoading, modulesError } = useCurriculumQueries(curriculumId);
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);

  if (modulesLoading) {
    return <ModuleListSkeleton />;
  }

  if (modulesError) {
    return (
      <Alert variant="destructive" className="m-2 sm:m-4">
        <AlertDescription>
          Error loading modules: {modulesError.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!modules?.length) {
    return (
      <Alert className="m-2 sm:m-4">
        <AlertDescription>
          No modules available for this curriculum
        </AlertDescription>
      </Alert>
    );
  }

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const courseGroups = modules.reduce((acc, module) => {
    if (!module.content) return acc;
    const courseId = module.content.courseId || 'uncategorized';
    if (!acc[courseId]) {
      acc[courseId] = [];
    }
    acc[courseId].push(module);
    return acc;
  }, {} as Record<string, typeof modules>);

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
        {Object.entries(courseGroups).map(([courseId, courseModules]) => (
          <Collapsible
            key={courseId}
            open={expandedCourses.includes(courseId)}
            onOpenChange={() => toggleCourse(courseId)}
          >
            <CollapsibleTrigger className="flex items-center w-full p-2 sm:p-3 hover:bg-accent rounded-lg text-sm sm:text-base">
              {expandedCourses.includes(courseId) ? (
                <ChevronDown className="w-4 h-4 mr-2 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
              )}
              <span className="font-medium truncate">
                {courseId === 'uncategorized' ? 'General Modules' : `Course ${courseId}`}
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">
                {courseModules.length}
              </Badge>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1 sm:space-y-2">
              {courseModules.map((module) => (
                module.content && (
                  <div
                    key={module.content.id}
                    className="flex items-center gap-2 p-2 sm:p-3 hover:bg-accent rounded-lg cursor-pointer text-sm sm:text-base"
                    onClick={() => onModuleSelect(module.content)}
                  >
                    {module.content.type === 'resource' && <BookOpen className="w-4 h-4 flex-shrink-0" />}
                    {module.content.type === 'assignment' && <FileText className="w-4 h-4 flex-shrink-0" />}
                    {module.content.type === 'quiz' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                    <span className="truncate">{module.content.title}</span>
                  </div>
                )
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </ScrollArea>
  );
};