import type { Program, Course, Module } from '@/types/curriculum';
import programData from '@/data/curriculum/New defaults/program.json';
import coursesData from '@/data/curriculum/New defaults/courses.json';
import modulesData from '@/data/curriculum/New defaults/modules.json';
import { AppError } from '@/lib/errorHandling';

export class CurriculumLoader {
  static async loadProgram(): Promise<Program> {
    try {
      console.log("Loading program data...");
      return {
        name: programData.name,
        description: programData.description,
        programOutcomes: programData.programOutcomes || [],
        institution: programData.institution || '',
        complianceStandards: programData.complianceStandards || [],
        degrees: programData.degrees.map(degree => ({
          id: degree.id,
          title: degree.title,
          type: degree.type,
          description: degree.description,
          requiredCredits: degree.requiredCredits,
          courses: []
        }))
      };
    } catch (error) {
      console.error("Failed to load program data:", error);
      throw new AppError('Failed to load program data', 'PROGRAM_LOAD_ERROR');
    }
  }

  static async loadCourses(): Promise<Course[]> {
    try {
      console.log("Loading courses data...");
      return coursesData.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        credits: course.credits,
        level: course.level as Course['level'],
        modules: course.modules.map(moduleId => {
          const module = modulesData.find(m => m.id === moduleId);
          if (!module) return null;
          return {
            id: module.id,
            title: module.title,
            description: module.description || '',
            credits: 0,
            type: module.type as 'resource' | 'assignment' | 'quiz',
            metadata: {
              estimatedTime: module.metadata?.estimatedTime || 0,
              difficulty: module.metadata?.difficulty || 'beginner',
              prerequisites: module.metadata?.prerequisites || [],
              tags: module.metadata?.tags || [],
              skills: module.metadata?.skills || []
            },
            learningObjectives: [],
            resources: [],
            assignments: [],
            quizzes: []
          };
        }).filter((module): module is Module => module !== null)
      }));
    } catch (error) {
      console.error("Failed to load courses data:", error);
      throw new AppError('Failed to load courses data', 'COURSES_LOAD_ERROR');
    }
  }

  static async loadModules(): Promise<Module[]> {
    try {
      console.log("Loading modules data...");
      return modulesData.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description || '',
        credits: 0,
        type: module.type as 'resource' | 'assignment' | 'quiz',
        metadata: {
          estimatedTime: module.metadata?.estimatedTime || 0,
          difficulty: module.metadata?.difficulty || 'beginner',
          prerequisites: module.metadata?.prerequisites || [],
          tags: module.metadata?.tags || [],
          skills: module.metadata?.skills || []
        },
        learningObjectives: [],
        resources: [],
        assignments: [],
        quizzes: []
      }));
    } catch (error) {
      console.error("Failed to load modules data:", error);
      throw new AppError('Failed to load modules data', 'MODULES_LOAD_ERROR');
    }
  }
}