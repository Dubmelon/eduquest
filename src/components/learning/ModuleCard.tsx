import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag } from "lucide-react";
import type { Module } from "@/types/curriculum";

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
  onHover: () => void;
}

export const ModuleCard = ({ module, onClick, onHover }: ModuleCardProps) => {
  return (
    <Card 
      className="p-4 hover:bg-accent cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={onClick}
      onMouseEnter={onHover}
    >
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {module.title || "Untitled Module"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-sm text-muted-foreground mb-2">
          {module.description || "No description available"}
        </p>
        <div className="flex flex-wrap gap-2">
          {module.metadata?.estimatedTime && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {module.metadata.estimatedTime} mins
            </Badge>
          )}
          {module.metadata?.tags?.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};