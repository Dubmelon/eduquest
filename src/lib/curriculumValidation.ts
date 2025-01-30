import { z } from 'zod';
import type { Program } from '@/types/curriculum';

const programSchema = z.object({
  name: z.string(),
  description: z.string(),
  programOutcomes: z.array(z.string()),
  institution: z.string(),
  complianceStandards: z.array(z.string()),
  degrees: z.array(z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(),
    description: z.string(),
    requiredCredits: z.number(),
    courses: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      credits: z.number(),
      level: z.string(),
      modules: z.array(z.any())
    }))
  }))
});

export function validateProgram(data: unknown): Program {
  return programSchema.parse(data) as Program;
}

export function validateAndTransformCurriculum(data: unknown): Program {
  // First validate the data structure
  const validatedData = validateProgram(data);
  
  // Transform and return the validated data
  return {
    name: validatedData.name,
    description: validatedData.description,
    programOutcomes: validatedData.programOutcomes,
    institution: validatedData.institution,
    complianceStandards: validatedData.complianceStandards,
    degrees: validatedData.degrees.map(degree => ({
      id: degree.id,
      title: degree.title,
      type: degree.type,
      description: degree.description,
      requiredCredits: degree.requiredCredits,
      courses: degree.courses.map(course => ({
        ...course,
        modules: course.modules || []
      }))
    }))
  };
}