export interface StudentExamRecord {
  examName: string;
  examCode: string;
  date: string;
  month: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  classAverage: number;
  rank: number;
  totalStudents: number;
  status: 'Pass' | 'Fail' | 'Absent';
  subjects: {
    name: string;
    code: string;
    marks: number;
    maxMarks: number;
    classAverage: number;
    highestMarks: number;
    grade: string;
    status: 'Pass' | 'Fail' | 'Absent';
  }[];
}

export interface StudentProfile {
  rollNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  className: string;
  section: string;
  session: string;
  attendancePercent: number;
  contactNumber: string;
  records: StudentExamRecord[];
}

export interface SubjectComparison {
  subject: string;
  studentScore: number;
  classAvg: number;
  topperScore: number;
  fullMarks: number;
}
