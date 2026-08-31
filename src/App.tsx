import React, { useState, useEffect } from 'react';
import StudentAnalyticsDashboard from './components/StudentAnalyticsDashboard';

export default function App() {
  const [currentRoll, setCurrentRoll] = useState<string>('279201');

  // Listen to custom events or URL params if roll is passed
  useEffect(() => {
    const handleRollChange = (e: any) => {
      if (e.detail && e.detail.rollNo) {
        setCurrentRoll(e.detail.rollNo);
      }
    };

    window.addEventListener('mdhss_view_student_analytics', handleRollChange);
    return () => {
      window.removeEventListener('mdhss_view_student_analytics', handleRollChange);
    };
  }, []);

  return (
    <div className="w-full">
      <StudentAnalyticsDashboard initialRollNo={currentRoll} />
    </div>
  );
}
