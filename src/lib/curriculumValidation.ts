import { z } from "zod";
import type { Curriculum } from "@/types/curriculum";

const learningObjectiveSchema = z.object({
  id: z.string(),
  description: z.string(),
  assessmentCriteria: z.array(z.string())
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
  metadata: z.object({
    estimatedTime: z.number(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    prerequisites: z.array(z.string()),
    tags: z.array(z.string()),
    skills: z.array(z.string())
  }),
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

export const curriculumSchema = z.object({
  name: z.string(),
  description: z.string(),
  degrees: z.array(degreeSchema)
});

export const validateAndTransformCurriculum = (data: unknown): Curriculum => {
  const validationResult = curriculumSchema.safeParse(data);
  
  if (!validationResult.success) {
    throw new Error("Invalid curriculum format: " + JSON.stringify(validationResult.error.errors, null, 2));
  }

  return validationResult.data;
};