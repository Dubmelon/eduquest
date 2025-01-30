import React from 'react';
import { CourseCard } from './CourseCard';
import type { CourseCard as CourseCardType, Module } from '@/types/curriculum';

interface CourseCardProps {
  course: CourseCardType;
  index: number;
  modules: Module[];
}

export const FeaturedCourses = () => {
  const courses: CourseCardType[] = []; // Replace with actual data fetching logic

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <CourseCard
          key={course.id}
          course={course}
          index={index}
          modules={course.modules}
        />
      ))}
    </div>
  );
};
