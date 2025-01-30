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
          const moduleData = modulesData.find(m => m.id === moduleId);
          if (!moduleData) return null;
          return {
            id: moduleData.id,
            title: moduleData.title,
            description: moduleData.description || '',
            credits: 0,
            metadata: {
              estimatedTime: moduleData.metadata?.estimatedTime || 0,
              difficulty: moduleData.metadata?.difficulty || 'beginner',
              prerequisites: moduleData.metadata?.prerequisites || [],
              tags: moduleData.metadata?.tags || [],
              skills: moduleData.metadata?.skills || []
            },
            content: {
              id: moduleData.id,
              title: moduleData.title,
              type: moduleData.type as 'resource' | 'assignment' | 'quiz',
              description: moduleData.description || '',
              courseId: course.id
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
      return modulesData.map(moduleData => ({
        id: moduleData.id,
        title: moduleData.title,
        description: moduleData.description || '',
        credits: 0,
        metadata: {
          estimatedTime: moduleData.metadata?.estimatedTime || 0,
          difficulty: moduleData.metadata?.difficulty || 'beginner',
          prerequisites: moduleData.metadata?.prerequisites || [],
          tags: moduleData.metadata?.tags || [],
          skills: moduleData.metadata?.skills || []
        },
        content: {
          id: moduleData.id,
          title: moduleData.title,
          type: moduleData.type as 'resource' | 'assignment' | 'quiz',
          description: moduleData.description || ''
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