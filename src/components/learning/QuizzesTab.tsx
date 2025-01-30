import { QuizPlayer } from "./QuizPlayer";
import type { Module } from "@/types/curriculum";

interface QuizzesTabProps {
  module: Module;
  completedQuizzes: number[];
  onQuizComplete: (score: number) => void;
}

export const QuizzesTab = ({ 
  module, 
  completedQuizzes, 
  onQuizComplete 
}: QuizzesTabProps) => {
  return (
    <div className="space-y-6">
      {module.quizzes?.map((quiz) => (
        <QuizPlayer
          key={quiz.id}
          quiz={quiz}
          onComplete={onQuizComplete}
        />
      ))}
    </div>
  );
};