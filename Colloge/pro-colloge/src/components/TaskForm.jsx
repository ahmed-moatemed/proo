import { useState } from 'react';
import { supabase } from '../supabase';
import db from '../db';
// import '../styles/TaskForm.css';
import '../styles/TaskForm.css';

function TaskForm({ userId }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('منخفضة');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = { title, subject, dueDate, priority, userId };

    const { error: supabaseError } = await supabase.from('tasks').insert([task]);
    if (supabaseError) console.error('Supabase error:', supabaseError);

    await db.tasks.add(task);

    if (Notification.permission === 'granted') {
      new Notification(`تذكير: ${title} مستحق في ${dueDate}`);
    } else {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') new Notification(`تذكير: ${title} مستحق في ${dueDate}`);
      });
    }

    setTitle('');
    setSubject('');
    setDueDate('');
    setPriority('منخفضة');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>إضافة مهمة</h2>
      <input
        type="text"
        placeholder="اسم المهمة"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="المادة"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="منخفضة">منخفضة</option>
        <option value="متوسطة">متوسطة</option>
        <option value="عالية">عالية</option>
      </select>
      <button type="submit">إضافة</button>
    </form>
  );
}

export default TaskForm;