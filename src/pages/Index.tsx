import { motion } from "framer-motion";
import { Hero } from "@/components/home/Hero";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";

const Index = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Hero />
      <section className="container mx-auto px-4 py-12 md:py-20">
        <FeaturedCourses />
      </section>
    </motion.main>
  );
};

export default Index;