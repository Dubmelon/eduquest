import { z } from "zod";
import type { Program } from "@/types/curriculum";

const moduleMetadataSchema = z.object({
  estimatedTime: z.number().default(0),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  prerequisites: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([])
});

const resourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  content: z.string(),
  duration: z.string().optional(),
  url: z.string().optional(),
  embedType: z.enum(['youtube']).optional(),
  code: z.object({
    initialCode: z.string(),
    testCases: z.array(z.object({
      input: z.string(),
      expectedOutput: z.string()
    }))
  }).optional()
});

const learningObjectiveSchema = z.object({
  id: z.string(),
  description: z.string(),
  assessmentCriteria: z.array(z.string()).default([])
});

const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['multiple-choice', 'essay', 'coding']),
  title: z.string(),
  description: z.string(),
  points: z.number(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.number().optional(),
  initialCode: z.string().optional(),
  testCases: z.array(z.object({
    input: z.string(),
    expectedOutput: z.string()
  })).optional()
});

const assignmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  points: z.number(),
  questions: z.array(questionSchema).optional()
});

const quizSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  questions: z.array(questionSchema)
});

const moduleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  credits: z.number(),
  type: z.enum(['resource', 'assignment', 'quiz']).optional(),
  metadata: moduleMetadataSchema,
  learningObjectives: z.array(learningObjectiveSchema),
  resources: z.array(resourceSchema),
  assignments: z.array(assignmentSchema),
  quizzes: z.array(quizSchema),
  content: z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(['resource', 'assignment', 'quiz']),
    description: z.string(),
    courseId: z.string().optional()
  }).optional()
});

const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  credits: z.number(),
  level: z.enum(['introductory', 'intermediate', 'advanced']),
  modules: z.array(moduleSchema)
});

const degreeSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  requiredCredits: z.number(),
  courses: z.array(courseSchema)
});

const programSchema = z.object({
  name: z.string(),
  description: z.string(),
  programOutcomes: z.array(z.string()),
  institution: z.string(),
  complianceStandards: z.array(z.string()),
  degrees: z.array(degreeSchema)
});

export const validateAndTransformProgram = (data: unknown): Program => {
  try {
    const validatedData = programSchema.parse(data);
    return {
      name: validatedData.name,
      description: validatedData.description,
      programOutcomes: validatedData.programOutcomes,
      institution: validatedData.institution,
      complianceStandards: validatedData.complianceStandards,
      degrees: validatedData.degrees
    };
  } catch (error) {
    console.error("Program validation error:", error);
    throw error;
  }
};

export const validateAndTransformCurriculum = (data: unknown): Program => {
  return validateAndTransformProgram(data);
};