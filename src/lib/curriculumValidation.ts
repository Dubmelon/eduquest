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
