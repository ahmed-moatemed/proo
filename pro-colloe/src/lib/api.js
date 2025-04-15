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