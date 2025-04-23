import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';
import { getCourses, createTask, getTasks, updateTaskStatus } from '../lib/api';
import '../style/tasks.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newTask, setNewTask] = useState({ courseId: '', title: '', dueDate: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) navigate('/auth', { replace: true });
      else {
        await fetchCourses();
        await fetchTasks();
      }
    };
    checkUser();
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data || []);
      if (data.length > 0) setNewTask({ ...newTask, courseId : data[0].id });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching courses:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      console.log('Fetched tasks:', data);
      setTasks(data || []);
    } catch (err) {
      setError(`خطأ في جلب المهام: ${err.message}`);
      console.error('Error fetching tasks:', err);
    }
  };

  const handleCreateTask = async () => {
    const { courseId, title, dueDate } = newTask;
    if (!courseId || !title || !dueDate) {
      setError('جميع الحقول مطلوبة لإضافة المهمة');
      return;
    }
    try {
      await createTask(courseId, title, dueDate);
      await fetchTasks();
      setNewTask({ courseId: courses[0]?.id || '', title: '', dueDate: '' });
      setError(null);
    } catch (err) {
      setError(`خطأ في إنشاء المهمة: ${err.message}`);
      console.error('Error creating task:', err);
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    try {
      const updatedTask = await updateTaskStatus(taskId, !completed);
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (err) {
      setError(`خطأ في تحديث المهمة: ${err.message}`);
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="tasks-container">
      <h2>المهام</h2>
      {error && <p className="error-message">{error}</p>}
      {tasks.length === 0 && !error && <p>لا توجد مهام حاليًا.</p>}
      <div className="add-task-form">
        <select
          value={newTask.courseId}
          onChange={(e) => setNewTask({ ...newTask, courseId: e.target.value })}
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="عنوان المهمة"
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <button onClick={handleCreateTask}>إضافة مهمة</button>
      </div>
      <ul className="tasks-list">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.completed || false}
              onChange={() => handleToggleTask(task.id, task.completed)}
            />
            <span>
              {task.courses_name || 'دورة غير محددة'}: {task.title || 'مهمة بدون عنوان'} - الموعد النهائي: {task.due_date || 'غير محدد'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}