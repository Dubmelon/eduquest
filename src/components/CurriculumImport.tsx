import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { validateAndTransformCurriculum } from "@/lib/curriculumValidation";
import { defaultProgram } from "@/data/program";
import { defaultCourses } from "@/data/curriculum/New defaults/courses";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileUp, Upload } from "lucide-react";

export const CurriculumImport = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleImportDefault = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const template = {
        user_id: user.id,
        name: defaultProgram.name,
        description: defaultProgram.description,
        template_type: 'program',
        content: {
          name: defaultProgram.name,
          description: defaultProgram.description,
          programOutcomes: defaultProgram.programOutcomes,
          institution: defaultProgram.institution,
          complianceStandards: defaultProgram.complianceStandards,
          degrees: defaultProgram.degrees.map(degree => ({
            id: degree.id,
            title: degree.title,
            type: degree.type,
            description: degree.description,
            requiredCredits: degree.requiredCredits,
            metadata: degree.metadata,
            courses: degree.courses
          }))
        },
        is_default: true,
      };

      const { error } = await supabase
        .from('curriculum_templates')
        .insert(template);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Default curriculum template imported successfully",
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: "Failed to import curriculum template",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/json') {
      toast({
        title: "Invalid file type",
        description: "Please upload a JSON file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      const validatedData = validateAndTransformCurriculum(jsonData);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const template = {
        user_id: user.id,
        name: validatedData.name,
        description: validatedData.description,
        template_type: 'program',
        content: validatedData,
        is_default: false,
      };

      const { error } = await supabase
        .from('curriculum_templates')
        .insert(template);

      if (error) throw error;

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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card
        className={`p-8 border-2 border-dashed transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <FileUp className="w-12 h-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Drag and drop your curriculum JSON file here, or click to select
            </p>
            <Input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="mt-4"
              disabled={isLoading}
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center">
        <div className="flex-grow border-t border-border" />
        <span className="px-4 text-sm text-muted-foreground">OR</span>
        <div className="flex-grow border-t border-border" />
      </div>

      <Button
        onClick={handleImportDefault}
        disabled={isLoading}
        className="w-full"
        variant="outline"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isLoading ? "Importing..." : "Import Default Curriculum"}
      </Button>
    </div>
  );
};