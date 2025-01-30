import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface DefaultImportButtonProps {
  onImport: () => Promise<void>;
  isLoading: boolean;
}

export const DefaultImportButton = ({ onImport, isLoading }: DefaultImportButtonProps) => {
  return (
    <Button
      onClick={onImport}
      disabled={isLoading}
      className="w-full"
      variant="outline"
    >
      <Upload className="w-4 h-4 mr-2" />
      {isLoading ? "Importing..." : "Import Default Curriculum"}
    </Button>
  );
};