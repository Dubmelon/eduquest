import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, FileText, CheckCircle } from "lucide-react";
import CurriculumImport from "@/components/CurriculumImport";
import CodeEditor from "@/components/CodeEditor";
import type { Curriculum, Module, LearningResource } from "@/types/curriculum";

const ResourceViewer = ({ resource }: { resource: LearningResource }) => {
  if (resource.type === 'video' && resource.embedType === 'youtube' && resource.url) {
    const videoId = resource.url.split('v=')[1];
    return (
      <div className="aspect-video w-full">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        />
      </div>
    );
  }

  if ((resource.type === 'pdf' || resource.type === 'epub') && resource.url) {
    return (
      <div className="aspect-[4/3] w-full">
        <iframe
          src={resource.url}
          width="100%"
          height="100%"
          className="rounded-lg border"
        />
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border">
      <p className="text-sm text-muted-foreground">{resource.content}</p>
    </div>
  );
};

const Learning = () => {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);

  const handleImport = (imported: Curriculum) => {
    setCurriculum(imported);
    if (imported.modules.length > 0) {
      setActiveModule(imported.modules[0]);
    }
  };

  if (!curriculum) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-bold mb-8">Learning</h1>
          <CurriculumImport onImport={handleImport} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl font-bold">{curriculum.name}</h1>
          <Progress value={33} className="w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel rounded-xl p-4">
            <h2 className="font-semibold mb-4">Modules</h2>
            <nav className="space-y-2">
              {curriculum.modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeModule?.id === module.id
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {module.title}
                </button>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3">
            {activeModule && (
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">{activeModule.title}</h2>
                <p className="text-muted-foreground mb-6">
                  {activeModule.description}
                </p>

                <Tabs defaultValue="resources">
                  <TabsList>
                    <TabsTrigger value="resources">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Resources
                    </TabsTrigger>
                    <TabsTrigger value="assignments">
                      <FileText className="w-4 h-4 mr-2" />
                      Assignments
                    </TabsTrigger>
                    <TabsTrigger value="quizzes">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Quizzes
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="resources" className="mt-4">
                    <div className="space-y-6">
                      {activeModule.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="p-4 rounded-lg border hover:border-primary transition-colors"
                        >
                          <h3 className="font-semibold mb-2">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {resource.type} • {resource.duration || "No duration"}
                          </p>
                          <ResourceViewer resource={resource} />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="assignments" className="mt-4">
                    <div className="space-y-4">
                      {activeModule.assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="p-4 rounded-lg border hover:border-primary transition-colors"
                        >
                          <h3 className="font-semibold">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {assignment.description}
                          </p>
                          <div className="flex justify-between text-sm mb-4">
                            <span>Due: {assignment.dueDate}</span>
                            <span>{assignment.points} points</span>
                          </div>
                          <CodeEditor />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="quizzes" className="mt-4">
                    <div className="space-y-4">
                      {activeModule.quizzes.map((quiz) => (
                        <div
                          key={quiz.id}
                          className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer"
                        >
                          <h3 className="font-semibold">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {quiz.questions.length} questions
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Learning;