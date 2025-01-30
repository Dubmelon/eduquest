import { serve } from 'https://deno.fresh.dev/std@v9.6.2/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Program {
  id: string;
  title: string;
  description?: string;
}

interface Degree {
  id: string;
  program_id: string;
  title: string;
  description?: string;
  required_credits: number;
}

interface Course {
  id: string;
  degree_id: string;
  title: string;
  description?: string;
  credits: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean);
    const [resource, id] = path;

    // GET requests
    if (req.method === 'GET') {
      let query;

      switch (resource) {
        case 'programs':
          query = supabaseClient.from('programs').select('*');
          if (id) query = query.eq('id', id);
          break;

        case 'degrees':
          query = supabaseClient.from('degrees').select('*');
          if (id) {
            query = query.eq('program_id', id);
          }
          break;

        case 'courses':
          query = supabaseClient.from('courses').select('*');
          if (id) {
            query = query.eq('degree_id', id);
          }
          break;

        case 'modules':
          query = supabaseClient.from('modules').select('*');
          if (id) {
            query = query.eq('course_id', id);
          }
          break;

        case 'assignments':
          query = supabaseClient.from('assignments').select('*');
          if (id) {
            query = query.eq('module_id', id);
          }
          break;

        case 'quizzes':
          query = supabaseClient.from('quizzes').select('*');
          if (id) {
            query = query.eq('module_id', id);
          }
          break;

        case 'questions':
          query = supabaseClient.from('questions').select('*');
          if (id) {
            query = query.eq('quiz_id', id);
          }
          break;

        default:
          return new Response(
            JSON.stringify({ error: 'Invalid resource' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
      }

      const { data, error } = await query;

      if (error) throw error;

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST requests
    if (req.method === 'POST') {
      const body = await req.json();

      let query;
      switch (resource) {
        case 'programs':
          query = supabaseClient
            .from('programs')
            .insert(body)
            .select();
          break;

        case 'degrees':
          query = supabaseClient
            .from('degrees')
            .insert(body)
            .select();
          break;

        case 'courses':
          query = supabaseClient
            .from('courses')
            .insert(body)
            .select();
          break;

        case 'modules':
          query = supabaseClient
            .from('modules')
            .insert(body)
            .select();
          break;

        default:
          return new Response(
            JSON.stringify({ error: 'Invalid resource' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
      }

      const { data, error } = await query;

      if (error) throw error;

      return new Response(
        JSON.stringify({ data }),
        { 
          status: 201, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});