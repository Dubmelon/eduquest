import { z } from "zod";
import type { Curriculum, Program } from "@/types/curriculum";

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
  description: z.string(),
  credits: z.number(),
  level: z.enum(['introductory', 'intermediate', 'advanced']),
  modules: z.array(moduleSchema).default([])
});

const degreeSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  requiredCredits: z.number(),
  courses: z.array(courseSchema).default([])
});

export const curriculumSchema = z.object({
  name: z.string(),
  description: z.string(),
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
    
    return {
      name: validationResult.name,
      description: validationResult.description,
      degrees: validationResult.degrees.map(degree => ({
        ...degree,
        courses: degree.courses.map(course => ({
          ...course,
          modules: course.modules.map(module => ({
            ...module,
            metadata: {
              estimatedTime: module.metadata?.estimatedTime ?? 0,
              difficulty: module.metadata?.difficulty ?? 'beginner',
              prerequisites: module.metadata?.prerequisites ?? [],
              tags: module.metadata?.tags ?? [],
              skills: module.metadata?.skills ?? []
            },
            learningObjectives: module.learningObjectives ?? [],
            resources: module.resources ?? [],
            assignments: module.assignments ?? [],
            quizzes: module.quizzes ?? []
          }))
        }))
      }))
    };
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
