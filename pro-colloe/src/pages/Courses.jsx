import { useState, useEffect } from 'react';
import { createCourse, getCourses, createLecture, getLectures } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';
import '../style/courses.css';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState('');
  const [error, setError] = useState(null);
  const [lectures, setLectures] = useState({});
  const [newLecture, setNewLecture] = useState({ title: '', date: '', time: '' });
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
      // جلب المحاضرات لكل دورة
      const lecturesData = {};
      for (const course of data) {
        const courseLectures = await getLectures(course.id);
        lecturesData[course.id] = courseLectures || [];
      }
      setLectures(lecturesData);
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
      setLectures({ ...lectures, [course.id]: [] });
      setNewCourse('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateLecture = async (courseId) => {
    const { title, date, time } = newLecture;
    if (!title || !date || !time) {
      setError('جميع الحقول مطلوبة لإضافة المحاضرة');
      return;
    }
    try {
      const lecture = await createLecture(courseId, title, date, time);
      setLectures({
        ...lectures,
        [courseId]: [...(lectures[courseId] || []), lecture],
      });
      setNewLecture({ title: '', date: '', time: '' });
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
            <div>
              <strong>{course.name}</strong>
            </div>
            {/* نموذج إضافة محاضرة */}
            <div className="add-lecture-form">
              <input
                type="text"
                value={newLecture.title}
                onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
                placeholder="عنوان المحاضرة"
              />
              <input
                type="date"
                value={newLecture.date}
                onChange={(e) => setNewLecture({ ...newLecture, date: e.target.value })}
              />
              <input
                type="time"
                value={newLecture.time}
                onChange={(e) => setNewLecture({ ...newLecture, time: e.target.value })}
              />
              <button onClick={() => handleCreateLecture(course.id)}>
                إضافة محاضرة
              </button>
            </div>
            {/* قائمة المحاضرات */}
            <ul className="lectures-list">
              {(lectures[course.id] || []).map((lecture) => (
                <li key={lecture.id} className="lecture-item">
                  {lecture.title} - {lecture.date} الساعة {lecture.time}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}