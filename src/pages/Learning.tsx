import { useState } from "react";
import { ModuleList } from "@/components/curriculum/ModuleList";
import { ModuleContent } from "@/types/learning-types";

const Learning = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleContent | null>(null);

  const handleModuleSelect = (module: ModuleContent) => {
    setSelectedModule(module);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ModuleList
            curriculumId="default"
            onModuleSelect={handleModuleSelect}
          />
        </div>
        <div className="md:col-span-2">
          {selectedModule ? (
            <div className="p-6 bg-card rounded-lg">
              <h2 className="text-2xl font-bold mb-4">{selectedModule.title}</h2>
              <p className="text-muted-foreground">{selectedModule.description}</p>
            </div>
          ) : (
            <div className="p-6 bg-card rounded-lg text-center">
              <p className="text-muted-foreground">Select a module to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learning;