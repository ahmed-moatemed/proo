import { supabase } from './supabase';

export const signUp = async (email, password) => {
  if (!email || !password) throw new Error('Email and password are required');
  const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
  if (error) {
    console.error('SignUp error:', error);
    throw error;
  }
  return data;
};

export const signIn = async (email, password) => {
  if (!email || !password) throw new Error('Email and password are required');
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) {
    console.error('SignIn error:', error);
    throw error;
  }
  return data;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};