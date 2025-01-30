import type { Program, Course, Module } from '@/types/curriculum';
import programData from '@/data/curriculum/New defaults/program.json';
import coursesData from '@/data/curriculum/New defaults/courses.json';
import modulesData from '@/data/curriculum/New defaults/modules.json';
import { AppError } from '@/lib/errorHandling';
import { validateAndTransformProgram } from '@/lib/curriculumValidation';

export class CurriculumLoader {
  static async loadProgram(): Promise<Program> {
    try {
      return validateAndTransformProgram(programData);
    } catch (error) {
      throw new AppError('Failed to load program data', 'PROGRAM_LOAD_ERROR');
    }
  }

  static async loadCourses(): Promise<Course[]> {
    try {
      const courses = coursesData.map(course => ({
        ...course,
        modules: course.modules.map(moduleId => 
          modulesData.find(m => m.id === moduleId)
        ).filter((m): m is Module => m !== undefined)
      }));
      return courses;
    } catch (error) {
      throw new AppError('Failed to load courses data', 'COURSES_LOAD_ERROR');
    }
  }

  static async loadModules(): Promise<Module[]> {
    try {
      return modulesData as Module[];
    } catch (error) {
      throw new AppError('Failed to load modules data', 'MODULES_LOAD_ERROR');
    }
  }
}