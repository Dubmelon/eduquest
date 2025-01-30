import { z } from "zod";
import type { Curriculum, Program } from "@/types/curriculum";

const learningObjectiveSchema = z.object({
  id: z.string(),
  description: z.string(),
  assessmentCriteria: z.array(z.string()).default([])
});

const resourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['video', 'document', 'article', 'code']),
  content: z.string(),
  duration: z.string().optional(),
  url: z.string().optional(),
  embedType: z.enum(['youtube']).optional()
});

const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['multiple-choice', 'essay', 'coding', 'true-false', 'short-answer', 'matching']),
  title: z.string(),
  description: z.string().default(''),
  points: z.number().default(0)
});

const assignmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().default('No description provided'),
  dueDate: z.string().default('TBD'),
  points: z.number().default(0),
  questions: z.array(questionSchema).optional().default([])
});

const quizSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().default('No description provided'),
  questions: z.array(questionSchema).default([])
});

const moduleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().default('No description provided'),
  credits: z.number().default(1),
  metadata: z.object({
    estimatedTime: z.number().default(0),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    prerequisites: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([])
  }).default({}),
  learningObjectives: z.array(learningObjectiveSchema).default([]),
  resources: z.array(resourceSchema).default([]),
  assignments: z.array(assignmentSchema).default([]),
  quizzes: z.array(quizSchema).default([])
});

const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().default('No description provided'),
  credits: z.number().default(3),
  level: z.enum(['introductory', 'intermediate', 'advanced']).default('introductory'),
  modules: z.array(moduleSchema).default([])
});

const degreeSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string().default('No description provided'),
  requiredCredits: z.number().default(0),
  courses: z.array(courseSchema).default([])
});

export const curriculumSchema = z.object({
  name: z.string(),
  description: z.string().default('No description provided'),
  degrees: z.array(degreeSchema).default([])
});

export const programSchema = z.object({
  name: z.string(),
  description: z.string(),
  programOutcomes: z.array(z.string()),
  institution: z.string(),
  complianceStandards: z.array(z.string()),
  degrees: z.array(degreeSchema)
});

export const validateAndTransformCurriculum = (data: unknown): Curriculum => {
  console.log("Validating curriculum data:", data);
  
  try {
    const validationResult = curriculumSchema.parse(data);
    console.log("Validation successful:", validationResult);
    return validationResult;
  } catch (error) {
    console.error("Validation error:", error);
    throw error;
  }
};

export const validateAndTransformProgram = (data: unknown): Program => {
  console.log("Validating program data:", data);
  
  try {
    const validationResult = programSchema.parse(data);
    console.log("Program validation successful:", validationResult);
    return validationResult;
  } catch (error) {
    console.error("Program validation error:", error);
    throw error;
  }
};