import { useState } from 'react';
import { supabase } from '../supabase';
import db from '../db';
import '../styles/global.css';

function LectureForm({ userId }) {
  const [subject, setSubject] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  // قائمة أيام الأسبوع
  const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lecture = { subject, day, time, location, userid: userId };

    try {
      // التحقق من تسجيل دخول المستخدم
      // const { user, error: authError } = await supabase.auth.getUser();
      // if (authError) {
      //   throw new Error(`Authentication error: ${authError.message}`);
      // }
      // if (!user || !user.id) {
      //   throw new Error('No user logged in or invalid user data. Please log in to add a lecture.');
      // }

      // التأكد من تطابق userId مع المستخدم الحالي
      if (user.id !== userId) {
        throw new Error('User ID mismatch. You can only add lectures for yourself.');
      }

      // إضافة المحاضرة إلى Supabase
      const { error: supabaseError } = await supabase.from('lectures').insert([lecture]);
      if (supabaseError) throw supabaseError;

      // إضافة المحاضرة إلى Dexie.js (محليًا)
      await db.lectures.add(lecture);

      // إعادة تعيين الحقول بعد النجاح
      setSubject('');
      setDay('');
      setTime('');
      setLocation('');
      console.log('Lecture added successfully');
    } catch (error) {
      console.error('Error adding lecture:', error.message || error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="lecture-form">
      <h2>إضافة محاضرة</h2>
      <input
        type="text"
        placeholder="اسم المادة"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <select
        value={day}
        onChange={(e) => setDay(e.target.value)}
        required
      >
        <option value="" disabled>اختر اليوم</option>
        {daysOfWeek.map((dayOption) => (
          <option key={dayOption} value={dayOption}>
            {dayOption}
          </option>
        ))}
      </select>
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="المكان (اختياري)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button type="submit">إضافة</button>
    </form>
  );
}

export default LectureForm;