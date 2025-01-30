import type { Program, Course, Module } from '@/types/curriculum';
import programData from '@/data/curriculum/New defaults/program.json';
import coursesData from '@/data/curriculum/New defaults/courses.json';
import modulesData from '@/data/curriculum/New defaults/modules.json';
import { AppError } from '@/lib/errorHandling';
import { validateAndTransformProgram } from '@/lib/curriculumValidation';

export class CurriculumLoader {
  static async loadProgram(): Promise<Program> {
    try {
      console.log("Loading program data...");
      const program = validateAndTransformProgram(programData);
      console.log("Program loaded successfully:", program);
      return program;
    } catch (error) {
      console.error("Failed to load program data:", error);
      throw new AppError('Failed to load program data', 'PROGRAM_LOAD_ERROR');
    }
  }

  static async loadCourses(): Promise<Course[]> {
    try {
      console.log("Loading courses data...");
      const courses = coursesData.map(course => ({
        ...course,
        level: course.level as Course['level'],
        modules: course.modules
          .map(moduleId => {
            const module = modulesData.find(m => m.id === moduleId);
            if (!module) return null;
            return {
              ...module,
              metadata: {
                ...module.metadata,
                tags: module.metadata?.tags || [],
                skills: module.metadata?.skills || []
              }
            };
          })
          .filter((module): module is Module => module !== null)
      }));
      console.log("Courses loaded successfully:", courses);
      return courses;
    } catch (error) {
      console.error("Failed to load courses data:", error);
      throw new AppError('Failed to load courses data', 'COURSES_LOAD_ERROR');
    }
  }

  static async loadModules(): Promise<Module[]> {
    try {
      console.log("Loading modules data...");
      const modules = modulesData.map(module => ({
        ...module,
        metadata: {
          ...module.metadata,
          tags: module.metadata?.tags || [],
          skills: module.metadata?.skills || []
        }
      })) as Module[];
      console.log("Modules loaded successfully:", modules);
      return modules;
    } catch (error) {
      console.error("Failed to load modules data:", error);
      throw new AppError('Failed to load modules data', 'MODULES_LOAD_ERROR');
    }
  }
}