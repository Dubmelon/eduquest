import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <FeaturedCourses />
      </div>
    </motion.div>
  );
};

export default Index;