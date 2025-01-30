import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const importCurriculumFromFile = async (file: File, userId: string) => {
  try {
    const text = await file.text();
    const jsonData = JSON.parse(text);
    
    const template = {
      user_id: userId,
      name: jsonData.name,
      description: jsonData.description,
      template_type: 'program',
      content: jsonData,
      is_default: false,
    };

    const { error, data } = await supabase
      .from('curriculum_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
};

export const importDefaultCurriculum = async (userId: string, defaultProgram: any) => {
  try {
    const template = {
      user_id: userId,
      name: defaultProgram.name,
      description: defaultProgram.description,
      template_type: 'program',
      content: {
        name: defaultProgram.name,
        description: defaultProgram.description,
        programOutcomes: defaultProgram.programOutcomes,
        institution: defaultProgram.institution,
        complianceStandards: defaultProgram.complianceStandards,
        degrees: defaultProgram.degrees.map((degree: any) => ({
          id: degree.id,
          title: degree.title,
          type: degree.type,
          description: degree.description,
          requiredCredits: degree.requiredCredits,
          metadata: degree.metadata,
          courses: degree.courses
        }))
      },
      is_default: true,
    };

    const { error, data } = await supabase
      .from('curriculum_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
};