import React, { useState } from "react";
import { FileUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface FileUploadZoneProps {
  onFileUpload: (file: File) => Promise<void>;
  isLoading: boolean;
}

export const FileUploadZone = ({ onFileUpload, isLoading }: FileUploadZoneProps) => {
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

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
      if (file.type !== 'application/json') {
        toast({
          title: "Invalid file type",
          description: "Please upload a JSON file",
          variant: "destructive",
        });
        return;
      }
      await onFileUpload(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onFileUpload(file);
    }
  };

  return (
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
  );
};