import { create } from 'zustand';
import type { Program, Course, Module } from '@/types/curriculum';
import { CurriculumLoader } from './loader';
import { AppError } from '@/lib/errorHandling';

interface CurriculumState {
  program: Program | null;
  coursesMap: Map<string, Course>;
  modulesMap: Map<string, Module>;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  getProgram: () => Program | null;
  getCourse: (courseId: string) => Course | undefined;
  getCourseModules: (courseId: string) => Module[];
}

export const useCurriculumStore = create<CurriculumState>((set, get) => ({
  program: null,
  coursesMap: new Map(),
  modulesMap: new Map(),
  isInitialized: false,

  initialize: async () => {
    try {
      console.log("Initializing curriculum store...");
      const program = await CurriculumLoader.loadProgram();
      const courses = await CurriculumLoader.loadCourses();
      
      const coursesMap = new Map(courses.map(c => [c.id, c]));
      const modulesMap = new Map(
        courses.flatMap(c => c.modules.map(m => [m.id, m]))
      );

      set({
        program,
        coursesMap,
        modulesMap,
        isInitialized: true
      });
    } catch (error) {
      console.error('Failed to initialize curriculum store:', error);
      throw new AppError('Failed to initialize curriculum', 'CURRICULUM_INIT_ERROR');
    }
  },

  getProgram: () => get().program,

  getCourse: (courseId: string) => get().coursesMap.get(courseId),

  getCourseModules: (courseId: string) => {
    const course = get().coursesMap.get(courseId);
    if (!course) return [];
    return course.modules;
  }
}));