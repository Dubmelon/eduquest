import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { defaultProgram } from "@/data/program";
import { FileUploadZone } from "@/components/curriculum/FileUploadZone";
import { DefaultImportButton } from "@/components/curriculum/DefaultImportButton";
import { importCurriculumFromFile, importDefaultCurriculum } from "@/lib/curriculum/importHelpers";

const CurriculumImport: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleImportDefault = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      await importDefaultCurriculum(user.id, defaultProgram);

      toast({
        title: "Success",
        description: "Default curriculum template imported successfully",
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import curriculum",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      await importCurriculumFromFile(file, user.id);

      toast({
        title: "Success",
        description: "Curriculum imported successfully",
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import curriculum",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileUploadZone onFileUpload={handleFileUpload} isLoading={isLoading} />

      <div className="flex items-center">
        <div className="flex-grow border-t border-border" />
        <span className="px-4 text-sm text-muted-foreground">OR</span>
        <div className="flex-grow border-t border-border" />
      </div>

      <DefaultImportButton onImport={handleImportDefault} isLoading={isLoading} />
    </div>
  );
};

export default CurriculumImport;