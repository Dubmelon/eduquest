export interface ModuleContent {
  id: string;
  title: string;
  type: 'resource' | 'assignment' | 'quiz';
  description: string;
  courseId?: string;
}

export interface ModuleListProps {
  curriculumId: string;
  onModuleSelect: (module: ModuleContent) => void;
}

export interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
}

export interface ResourceViewerProps {
  resource: Resource;
  onComplete: () => void;
}

export interface Module {
  content: ModuleContent;
  credits?: number;
  metadata: {
    estimatedTime: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    prerequisites: string[];
    tags: string[];
    skills: string[];
  };
  learningObjectives: {
    id: string;
    description: string;
    assessmentCriteria: string[];
  }[];
  resources: Resource[];
  assignments: any[];
  quizzes: Quiz[];
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  content: string;
  duration?: string;
  url?: string;
  embedType?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  title: string;
  points: number;
  options?: string[];
  correctAnswer?: number | boolean;
}