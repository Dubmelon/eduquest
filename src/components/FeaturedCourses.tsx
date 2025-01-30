import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  metadata: {
    duration?: string;
  } | null;
  created_at: string;
}

export const FeaturedCourses = () => {
  const { toast } = useToast();
  
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .limit(3)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Course[];
    },
  });

  if (error) {
    toast({
      title: "Error loading courses",
      description: "Please try again later",
      variant: "destructive",
    });
  }

  return (
    <section id="featured-courses" className="py-20">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-4">Featured Courses</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular courses designed to help you advance your career
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(3)].map((_, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-8 w-full mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </CardFooter>
              </Card>
            ))
          ) : (
            courses?.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit">
                      {course.level || 'All Levels'}
                    </Badge>
                    <h3 className="text-xl font-bold mt-2">{course.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{course.description}</p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.metadata?.duration || 'Self-paced'}
                    </div>
                    <Button variant="ghost" className="font-medium">
                      Learn more
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};