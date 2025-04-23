import { useState, useEffect } from 'react';
import db from '../db';
import '../styles/WeeklySchedule.css';

function WeeklySchedule({ userId }) {
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        await db.open(); // التأكد من فتح قاعدة البيانات
        const data = await db.lectures.where('userId').equals(userId).toArray();
        setLectures(data);
      } catch (error) {
        console.error('Error fetching lectures:', error);
        setLectures([]);
      }
    };
    fetchLectures();
  }, [userId]);

  return (
    <div className="weekly-schedule">
      <h2>الجدول الأسبوعي</h2>
      <div className="schedule-grid">
        {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => (
          <div key={day} className="day">
            <h3>{day}</h3>
            {lectures
              .filter((lecture) => lecture.day === day)
              .map((lecture) => (
                <div key={lecture.id} className="lecture">
                  <p>{lecture.subject}</p>
                  <p>{lecture.time}</p>
                  <p>{lecture.location || 'غير محدد'}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklySchedule;