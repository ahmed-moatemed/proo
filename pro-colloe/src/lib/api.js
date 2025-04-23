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

export const createTask = async (courseId, title, dueDate) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ course_id: courseId, title, due_date: dueDate, user_id: user.id }])
    .select();
  if (error) {
    console.error('Create task error:', error);
    throw error;
  }
  return data[0];
};

export const getTasks = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select(`
      id,
      course_id,
      user_id,
      title,
      due_date,
      completed
    `)
    .eq('user_id', user.id)
    .order('due_date', { ascending: true });
  if (tasksError) {
    console.error('Get tasks error:', tasksError.message);
    throw new Error(`فشل في جلب المهام: ${tasksError.message}`);
  }

  const courseIds = tasks.map(task => task.course_id);
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, name')
    .in('id', courseIds);
  if (coursesError) {
    console.error('Get courses error:', coursesError.message);
    throw new Error(`فشل في جلب الدورات: ${coursesError.message}`);
  }

  const courseMap = courses.reduce((map, course) => {
    map[course.id] = course.name;
    return map;
  }, {});

  console.log('Raw tasks data:', tasks);
  return tasks.map(task => ({
    id: task.id,
    course_id: task.course_id,
    user_id: task.user_id,
    title: task.title || 'مهمة بدون عنوان',
    due_date: task.due_date || 'غير محدد',
    completed: task.completed || false,
    courses: { name: courseMap[task.course_id] || 'دورة غير محددة' }
  }));
};

export const updateTaskStatus = async (taskId, completed) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', taskId)
    .select();
  if (error) {
    console.error('Update task error:', error);
    throw error;
  }
  return data[0];
};