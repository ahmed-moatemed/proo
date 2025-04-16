import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';
import { getCourses, getLectures } from '../lib/api';
import '../style/schedule.css';

export default function Schedule() {
  const [schedule, setSchedule] = useState({});
  const [error, setError] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(null);
  const navigate = useNavigate();

  // تهيئة بداية الأسبوع عند تحميل الصفحة
  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) navigate('/auth', { replace: true });
      else {
        setWeekStart();
      }
    };
    checkUser();
  }, [navigate]);

  // جلب الجدول بعد تهيئة currentWeekStart
  useEffect(() => {
    if (currentWeekStart) {
      fetchSchedule();
    }
  }, [currentWeekStart]);

  const setWeekStart = () => {
    const today = new Date('2025-04-16'); // التاريخ الحالي (16 أبريل 2025)
    const dayOfWeek = (today.getDay() + 1) % 7; // نعدل ليبدأ الأسبوع من السبت (السبت=0, الجمعة=6)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek); // بداية الأسبوع (السبت)
    setCurrentWeekStart(startOfWeek);
  };

  const fetchSchedule = async () => {
    try {
      const courses = await getCourses();
      const scheduleData = {};
      const daysOfWeek = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

      for (const day of daysOfWeek) {
        scheduleData[day] = [];
      }

      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6); // نهاية الأسبوع (الجمعة)

      for (const course of courses) {
        const lectures = await getLectures(course.id);
        for (const lecture of lectures) {
          const lectureDate = new Date(lecture.date);
          // فلترة المحاضرات لتكون ضمن الأسبوع الحالي
          if (lectureDate >= currentWeekStart && lectureDate <= weekEnd) {
            const dayIndex = (lectureDate.getDay() + 1) % 7; // نعدل ليطابق ترتيب الأيام (السبت=0)
            const dayName = daysOfWeek[dayIndex];
            scheduleData[dayName].push({ ...lecture, courseName: course.name });
          }
        }
      }

      setSchedule(scheduleData);
    } catch (err) {
      setError(err.message);
    }
  };

  const goToNextWeek = () => {
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(nextWeekStart);
  };

  const goToPreviousWeek = () => {
    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prevWeekStart);
  };

  const daysOfWeek = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  return (
    <div className="schedule-container">
      <h2>الجدول الأسبوعي</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="week-navigation">
        <button onClick={goToPreviousWeek}>الأسبوع السابق</button>
        <span>
          الأسبوع من {currentWeekStart?.toLocaleDateString('ar-EG')} إلى{' '}
          {new Date(currentWeekStart?.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-EG')}
        </span>
        <button onClick={goToNextWeek}>الأسبوع التالي</button>
      </div>
      <div className="schedule-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-column">
            <h3>{day}</h3>
            <ul className="lectures-list">
              {(schedule[day] || []).map((lecture) => (
                <li key={lecture.id} className="lecture-item">
                  {lecture.courseName}: {lecture.title} - {lecture.time}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}