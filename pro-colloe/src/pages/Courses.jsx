import { useState, useEffect } from 'react';
import { createCourse, getCourses } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';
import '../style/courses.css'; // استيراد ملف الأنماط

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) navigate('/auth', { replace: true });
      else fetchCourses();
    };
    checkUser();
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourse) {
      setError('اسم الدورة مطلوب');
      return;
    }
    try {
      const course = await createCourse(newCourse);
      setCourses([...courses, course]);
      setNewCourse('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="courses-container">
      <h2>الدورات</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="add-course-form">
        <input
          type="text"
          value={newCourse}
          onChange={(e) => setNewCourse(e.target.value)}
          placeholder="اسم الدورة (مثال: Math 101)"
        />
        <button onClick={handleCreateCourse}>إضافة دورة</button>
      </div>
      <ul className="courses-list">
        {courses.map((course) => (
          <li key={course.id} className="course-item">
            {course.name}
          </li>
        ))}
      </ul>
    </div>
  );
}