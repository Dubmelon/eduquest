import type { Program, Course, Module, Resource, Question } from '@/types/curriculum';
import programData from '@/data/curriculum/New defaults/program.json';
import coursesData from '@/data/curriculum/New defaults/courses.json';
import modulesData from '@/data/curriculum/New defaults/modules.json';
import { AppError } from '@/lib/errorHandling';
import { DifficultyLevel } from '@/types/learning-types';

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
          
          const module: Module = {
            id: moduleData.id,
            title: moduleData.title,
            description: moduleData.description || '',
            credits: moduleData.credits || 0,
            type: 'resource',
            metadata: {
              estimatedTime: moduleData.metadata?.estimatedTime || 0,
              difficulty: (moduleData.metadata?.difficulty || 'beginner') as DifficultyLevel,
              prerequisites: moduleData.metadata?.prerequisites || [],
              tags: moduleData.metadata?.tags || [],
              skills: moduleData.metadata?.skills || []
            },
            learningObjectives: moduleData.learningObjectives || [],
            resources: (moduleData.resources || []).map(resource => ({
              id: resource.id,
              title: resource.title,
              type: resource.type,
              content: resource.content,
              duration: resource.duration,
              url: resource.url,
              embedType: resource.embedType as "youtube" | undefined,
              code: resource.code
            })),
            assignments: (moduleData.assignments || []).map(assignment => ({
              id: assignment.id,
              title: assignment.title,
              description: assignment.description,
              dueDate: assignment.dueDate,
              points: assignment.points,
              questions: assignment.questions?.map(q => ({
                ...q,
                type: q.type as 'multiple-choice' | 'essay' | 'coding',
                initialCode: q.initialCode,
                testCases: q.testCases
              })) || []
            })),
            quizzes: (moduleData.quizzes || []).map(quiz => ({
              id: quiz.id,
              title: quiz.title,
              description: quiz.description,
              questions: quiz.questions.map(q => ({
                ...q,
                type: q.type as 'multiple-choice' | 'essay' | 'coding',
                description: q.description || '',
                initialCode: q.initialCode,
                testCases: q.testCases
              }))
            })),
            content: {
              id: moduleData.id,
              title: moduleData.title,
              type: 'resource',
              description: moduleData.description || '',
              courseId: course.id
            }
          };
          
          return module;
        }).filter((module): module is Module => module !== null)
      }));
    } catch (error) {
      console.error("Failed to load courses data:", error);
      throw new AppError('Failed to load courses data', 'COURSES_LOAD_ERROR');
    }
  }
}