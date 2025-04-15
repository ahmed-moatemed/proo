import { supabase } from './supabase';

export const createCourse = async (name) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  const { data, error } = await supabase
    .from('courses')
    .insert([{ name, user_id: user.id }])
    .select();
  if (error) {
    console.error('Create course error:', error);
    throw error;
  }
  return data[0];
};

export const getCourses = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('user_id', user.id);
  if (error) {
    console.error('Get courses error:', error);
    throw error;
  }
  return data;
};

export const createLecture = async (courseId, title, date, time) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  const { data, error } = await supabase
    .from('lectures')
    .insert([{ course_id: courseId, title, date, time, user_id: user.id }])
    .select();
  if (error) {
    console.error('Create lecture error:', error);
    throw error;
  }
  return data[0];
};

export const getLectures = async (courseId) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('course_id', courseId)
    .eq('user_id', user.id);
  if (error) {
    console.error('Get lectures error:', error);
    throw error;
  }
  return data;
};