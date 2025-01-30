import { z } from "zod";
import type { Program, Course, Module } from "@/types/curriculum";

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
  embedType: z.enum(['youtube']).optional()
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
  points: z.number()
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
  metadata: moduleMetadataSchema,
  learningObjectives: z.array(learningObjectiveSchema),
  resources: z.array(resourceSchema),
  assignments: z.array(assignmentSchema),
  quizzes: z.array(quizSchema)
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