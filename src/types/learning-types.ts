export interface ModuleContent {
  id: string;
  title: string;
  type: 'resource' | 'assignment' | 'quiz';
  description: string;
  courseId?: string;
}

export interface ModuleMetadata {
  estimatedTime: number;
  difficulty: DifficultyLevel;
  prerequisites: string[];
  tags: string[];
  skills: string[];
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LearningObjective {
  id: string;
  description: string;
  assessmentCriteria: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  content: string;
  duration?: string;
  url?: string;
  embedType?: 'youtube';
  code?: {
    initialCode: string;
    testCases: Array<{
      input: string;
      expectedOutput: string;
    }>;
  };
}

export interface Assessment {
  id: string;
  title: string;
  type: 'quiz' | 'coding' | 'project' | 'peer-review';
  description: string;
  difficultyLevel: DifficultyLevel;
  points: number;
  timeLimit?: number;
  initialCode?: string;
  testCases?: Array<{
    input: string;
    expectedOutput: string;
  }>;
  rubric?: {
    criteria: {
      name: string;
      description: string;
      points: number;
    }[];
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  type?: 'resource' | 'assignment' | 'quiz';
  credits: number;
  metadata: ModuleMetadata;
  content?: ModuleContent;
  learningObjectives: LearningObjective[];
  resources: Resource[];
  assessments: Assessment[];
  milestones: {
    id: string;
    title: string;
    requiredAssessments: string[];
    reward?: {
      type: 'badge' | 'certificate' | 'points';
      value: string | number;
    };
  }[];
}

export interface ModuleListProps {
  curriculumId: string;
  onModuleSelect: (module: ModuleContent) => void;
}