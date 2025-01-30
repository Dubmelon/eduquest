import { useState } from "react";
import { ModuleList } from "@/components/curriculum/ModuleList";
import { ModuleContent } from "@/types/learning-types";

const Learning = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleContent | null>(null);

  const handleModuleSelect = (module: ModuleContent) => {
    setSelectedModule(module);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-1 bg-card rounded-lg shadow-sm">
          <ModuleList
            curriculumId="default"
            onModuleSelect={handleModuleSelect}
          />
        </div>
        <div className="md:col-span-2">
          {selectedModule ? (
            <div className="p-4 sm:p-6 bg-card rounded-lg shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{selectedModule.title}</h2>
              <p className="text-muted-foreground text-sm sm:text-base">{selectedModule.description}</p>
            </div>
          ) : (
            <div className="p-4 sm:p-6 bg-card rounded-lg shadow-sm text-center">
              <p className="text-muted-foreground text-sm sm:text-base">Select a module to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learning;