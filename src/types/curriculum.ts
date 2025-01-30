export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseLevel = 'introductory' | 'intermediate' | 'advanced';

export interface ModuleMetadata {
  estimatedTime: number;
  difficulty: DifficultyLevel;
  prerequisites: string[];
  tags: string[];
  skills: string[];
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

export interface LearningObjective {
  id: string;
  description: string;
  assessmentCriteria: string[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  questions?: Question[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'essay' | 'coding';
  title: string;
  description: string;
  points: number;
  options?: string[];
  correctAnswer?: number;
  initialCode?: string;
  testCases?: Array<{
    input: string;
    expectedOutput: string;
  }>;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  credits: number;
  type?: 'resource' | 'assignment' | 'quiz';
  metadata: ModuleMetadata;
  learningObjectives: LearningObjective[];
  resources: Resource[];
  assignments: Assignment[];
  quizzes: Quiz[];
  content?: {
    id: string;
    title: string;
    type: 'resource' | 'assignment' | 'quiz';
    description: string;
    courseId?: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  credits: number;
  level: CourseLevel;
  modules: Module[];
}

export interface Degree {
  id: string;
  title: string;
  type: string;
  description: string;
  requiredCredits: number;
  courses: Course[];
}

export interface Program {
  name: string;
  description: string;
  programOutcomes: string[];
  institution: string;
  complianceStandards: string[];
  degrees: Degree[];
}

export interface Curriculum {
  name: string;
  description: string;
  degrees: Degree[];
}

export interface CourseCard extends Course {
  category: string;
  duration: string;
}