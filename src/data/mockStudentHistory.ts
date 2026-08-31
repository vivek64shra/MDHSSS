import { StudentProfile, StudentExamRecord } from '../types';

export const DEFAULT_STUDENTS_PROFILES: Record<string, StudentProfile> = {
  '279201': {
    rollNo: '279201',
    name: 'आदित्य मिश्रा (Aditya Mishra)',
    fatherName: 'श्री राजेश मिश्रा',
    motherName: 'श्रीमती सुनीता मिश्रा',
    className: 'Class 9',
    section: 'B',
    session: '2026-27',
    attendancePercent: 94,
    contactNumber: '+91 9753443093',
    records: [
      {
        examName: 'मासिक टेस्ट 1 (July)',
        examCode: 'MT-1',
        date: '2026-07-28',
        month: 'Jul',
        totalMarks: 215,
        maxMarks: 250,
        percentage: 86.0,
        classAverage: 68.5,
        rank: 3,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 44, maxMarks: 50, classAverage: 34, highestMarks: 48, grade: 'A+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 42, maxMarks: 50, classAverage: 33, highestMarks: 46, grade: 'A', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 45, maxMarks: 50, classAverage: 36, highestMarks: 47, grade: 'A+', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 44, maxMarks: 50, classAverage: 37, highestMarks: 48, grade: 'A+', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 40, maxMarks: 50, classAverage: 32, highestMarks: 45, grade: 'A', status: 'Pass' },
        ]
      },
      {
        examName: 'मासिक टेस्ट 2 (August)',
        examCode: 'MT-2',
        date: '2026-08-25',
        month: 'Aug',
        totalMarks: 228,
        maxMarks: 250,
        percentage: 91.2,
        classAverage: 71.0,
        rank: 2,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 48, maxMarks: 50, classAverage: 35, highestMarks: 49, grade: 'A+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 46, maxMarks: 50, classAverage: 34, highestMarks: 47, grade: 'A+', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 44, maxMarks: 50, classAverage: 36, highestMarks: 46, grade: 'A', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 47, maxMarks: 50, classAverage: 38, highestMarks: 48, grade: 'A+', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 43, maxMarks: 50, classAverage: 33, highestMarks: 46, grade: 'A', status: 'Pass' },
        ]
      },
      {
        examName: 'त्रैमासिक परीक्षा (Quarterly)',
        examCode: 'QT-1',
        date: '2026-09-30',
        month: 'Sep',
        totalMarks: 445,
        maxMarks: 500,
        percentage: 89.0,
        classAverage: 69.5,
        rank: 2,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 88, maxMarks: 100, classAverage: 67, highestMarks: 94, grade: 'A+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 91, maxMarks: 100, classAverage: 68, highestMarks: 95, grade: 'A+', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 86, maxMarks: 100, classAverage: 71, highestMarks: 92, grade: 'A', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 94, maxMarks: 100, classAverage: 76, highestMarks: 96, grade: 'A+', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 86, maxMarks: 100, classAverage: 65, highestMarks: 91, grade: 'A', status: 'Pass' },
        ]
      },
      {
        examName: 'मासिक टेस्ट 3 (November)',
        examCode: 'MT-3',
        date: '2026-11-24',
        month: 'Nov',
        totalMarks: 236,
        maxMarks: 250,
        percentage: 94.4,
        classAverage: 72.5,
        rank: 1,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 49, maxMarks: 50, classAverage: 36, highestMarks: 49, grade: 'A+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 48, maxMarks: 50, classAverage: 35, highestMarks: 48, grade: 'A+', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 47, maxMarks: 50, classAverage: 38, highestMarks: 47, grade: 'A+', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 48, maxMarks: 50, classAverage: 39, highestMarks: 49, grade: 'A+', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 44, maxMarks: 50, classAverage: 34, highestMarks: 47, grade: 'A', status: 'Pass' },
        ]
      },
      {
        examName: 'अर्धवार्षिक परीक्षा (Half-Yearly)',
        examCode: 'HY-1',
        date: '2026-12-22',
        month: 'Dec',
        totalMarks: 468,
        maxMarks: 500,
        percentage: 93.6,
        classAverage: 71.8,
        rank: 1,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 96, maxMarks: 100, classAverage: 70, highestMarks: 96, grade: 'A+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 95, maxMarks: 100, classAverage: 69, highestMarks: 95, grade: 'A+', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 92, maxMarks: 100, classAverage: 73, highestMarks: 94, grade: 'A+', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 96, maxMarks: 100, classAverage: 78, highestMarks: 97, grade: 'A+', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 89, maxMarks: 100, classAverage: 67, highestMarks: 92, grade: 'A', status: 'Pass' },
        ]
      }
    ]
  },
  '279202': {
    rollNo: '279202',
    name: 'अंशिका तिवारी (Anshika Tiwari)',
    fatherName: 'श्री विजय तिवारी',
    motherName: 'श्रीमती ममता तिवारी',
    className: 'Class 9',
    section: 'B',
    session: '2026-27',
    attendancePercent: 96,
    contactNumber: '+91 9753443094',
    records: [
      {
        examName: 'मासिक टेस्ट 1 (July)',
        examCode: 'MT-1',
        date: '2026-07-28',
        month: 'Jul',
        totalMarks: 230,
        maxMarks: 250,
        percentage: 92.0,
        classAverage: 68.5,
        rank: 1,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 46, maxMarks: 50, classAverage: 34, highestMarks: 48, grade: 'A+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 46, maxMarks: 50, classAverage: 33, highestMarks: 46, grade: 'A+', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 47, maxMarks: 50, classAverage: 36, highestMarks: 47, grade: 'A+', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 46, maxMarks: 50, classAverage: 37, highestMarks: 48, grade: 'A+', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 45, maxMarks: 50, classAverage: 32, highestMarks: 45, grade: 'A+', status: 'Pass' },
        ]
      },
      {
        examName: 'मासिक टेस्ट 2 (August)',
        examCode: 'MT-2',
        date: '2026-08-25',
        month: 'Aug',
        totalMarks: 235,
        maxMarks: 250,
        percentage: 94.0,
        classAverage: 71.0,
        rank: 1,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 47, maxMarks: 50, classAverage: 35, highestMarks: 49, grade: 'A+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 47, maxMarks: 50, classAverage: 34, highestMarks: 47, grade: 'A+', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 46, maxMarks: 50, classAverage: 36, highestMarks: 46, grade: 'A+', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 48, maxMarks: 50, classAverage: 38, highestMarks: 48, grade: 'A+', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 47, maxMarks: 50, classAverage: 33, highestMarks: 47, grade: 'A+', status: 'Pass' },
        ]
      },
      {
        examName: 'त्रैमासिक परीक्षा (Quarterly)',
        examCode: 'QT-1',
        date: '2026-09-30',
        month: 'Sep',
        totalMarks: 460,
        maxMarks: 500,
        percentage: 92.0,
        classAverage: 69.5,
        rank: 1,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 92, maxMarks: 100, classAverage: 67, highestMarks: 94, grade: 'A+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 94, maxMarks: 100, classAverage: 68, highestMarks: 95, grade: 'A+', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 90, maxMarks: 100, classAverage: 71, highestMarks: 92, grade: 'A+', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 94, maxMarks: 100, classAverage: 76, highestMarks: 96, grade: 'A+', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 90, maxMarks: 100, classAverage: 65, highestMarks: 91, grade: 'A+', status: 'Pass' },
        ]
      },
      {
        examName: 'अर्धवार्षिक परीक्षा (Half-Yearly)',
        examCode: 'HY-1',
        date: '2026-12-22',
        month: 'Dec',
        totalMarks: 465,
        maxMarks: 500,
        percentage: 93.0,
        classAverage: 71.8,
        rank: 2,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 94, maxMarks: 100, classAverage: 70, highestMarks: 96, grade: 'A+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 94, maxMarks: 100, classAverage: 69, highestMarks: 95, grade: 'A+', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 93, maxMarks: 100, classAverage: 73, highestMarks: 94, grade: 'A+', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 93, maxMarks: 100, classAverage: 78, highestMarks: 97, grade: 'A+', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 91, maxMarks: 100, classAverage: 67, highestMarks: 92, grade: 'A+', status: 'Pass' },
        ]
      }
    ]
  },
  '279203': {
    rollNo: '279203',
    name: 'आयुष पटेल (Ayush Patel)',
    fatherName: 'श्री रामनरेश पटेल',
    motherName: 'श्रीमती सीमा पटेल',
    className: 'Class 9',
    section: 'B',
    session: '2026-27',
    attendancePercent: 88,
    contactNumber: '+91 9753443095',
    records: [
      {
        examName: 'मासिक टेस्ट 1 (July)',
        examCode: 'MT-1',
        date: '2026-07-28',
        month: 'Jul',
        totalMarks: 180,
        maxMarks: 250,
        percentage: 72.0,
        classAverage: 68.5,
        rank: 18,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 36, maxMarks: 50, classAverage: 34, highestMarks: 48, grade: 'B+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 34, maxMarks: 50, classAverage: 33, highestMarks: 46, grade: 'B', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 38, maxMarks: 50, classAverage: 36, highestMarks: 47, grade: 'B+', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 39, maxMarks: 50, classAverage: 37, highestMarks: 48, grade: 'B+', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 33, maxMarks: 50, classAverage: 32, highestMarks: 45, grade: 'B', status: 'Pass' },
        ]
      },
      {
        examName: 'त्रैमासिक परीक्षा (Quarterly)',
        examCode: 'QT-1',
        date: '2026-09-30',
        month: 'Sep',
        totalMarks: 380,
        maxMarks: 500,
        percentage: 76.0,
        classAverage: 69.5,
        rank: 12,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 76, maxMarks: 100, classAverage: 67, highestMarks: 94, grade: 'B+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 72, maxMarks: 100, classAverage: 68, highestMarks: 95, grade: 'B+', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 79, maxMarks: 100, classAverage: 71, highestMarks: 92, grade: 'B+', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 82, maxMarks: 100, classAverage: 76, highestMarks: 96, grade: 'A', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 71, maxMarks: 100, classAverage: 65, highestMarks: 91, grade: 'B', status: 'Pass' },
        ]
      },
      {
        examName: 'अर्धवार्षिक परीक्षा (Half-Yearly)',
        examCode: 'HY-1',
        date: '2026-12-22',
        month: 'Dec',
        totalMarks: 410,
        maxMarks: 500,
        percentage: 82.0,
        classAverage: 71.8,
        rank: 8,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 82, maxMarks: 100, classAverage: 70, highestMarks: 96, grade: 'A', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 80, maxMarks: 100, classAverage: 69, highestMarks: 95, grade: 'A', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 85, maxMarks: 100, classAverage: 73, highestMarks: 94, grade: 'A', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 88, maxMarks: 100, classAverage: 78, highestMarks: 97, grade: 'A+', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 75, maxMarks: 100, classAverage: 67, highestMarks: 92, grade: 'B+', status: 'Pass' },
        ]
      }
    ]
  },
  '279204': {
    rollNo: '279204',
    name: 'दीपक शुक्ला (Deepak Shukla)',
    fatherName: 'श्री अनिल शुक्ला',
    motherName: 'श्रीमती किरण शुक्ला',
    className: 'Class 9',
    section: 'B',
    session: '2026-27',
    attendancePercent: 82,
    contactNumber: '+91 9753443096',
    records: [
      {
        examName: 'मासिक टेस्ट 1 (July)',
        examCode: 'MT-1',
        date: '2026-07-28',
        month: 'Jul',
        totalMarks: 155,
        maxMarks: 250,
        percentage: 62.0,
        classAverage: 68.5,
        rank: 32,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 30, maxMarks: 50, classAverage: 34, highestMarks: 48, grade: 'C+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 29, maxMarks: 50, classAverage: 33, highestMarks: 46, grade: 'C+', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 34, maxMarks: 50, classAverage: 36, highestMarks: 47, grade: 'B', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 36, maxMarks: 50, classAverage: 37, highestMarks: 48, grade: 'B', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 26, maxMarks: 50, classAverage: 32, highestMarks: 45, grade: 'C', status: 'Pass' },
        ]
      },
      {
        examName: 'त्रैमासिक परीक्षा (Quarterly)',
        examCode: 'QT-1',
        date: '2026-09-30',
        month: 'Sep',
        totalMarks: 320,
        maxMarks: 500,
        percentage: 64.0,
        classAverage: 69.5,
        rank: 28,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 64, maxMarks: 100, classAverage: 67, highestMarks: 94, grade: 'B', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 60, maxMarks: 100, classAverage: 68, highestMarks: 95, grade: 'B', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 68, maxMarks: 100, classAverage: 71, highestMarks: 92, grade: 'B', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 74, maxMarks: 100, classAverage: 76, highestMarks: 96, grade: 'B+', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 54, maxMarks: 100, classAverage: 65, highestMarks: 91, grade: 'C+', status: 'Pass' },
        ]
      },
      {
        examName: 'अर्धवार्षिक परीक्षा (Half-Yearly)',
        examCode: 'HY-1',
        date: '2026-12-22',
        month: 'Dec',
        totalMarks: 365,
        maxMarks: 500,
        percentage: 73.0,
        classAverage: 71.8,
        rank: 20,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 72, maxMarks: 100, classAverage: 70, highestMarks: 96, grade: 'B+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 70, maxMarks: 100, classAverage: 69, highestMarks: 95, grade: 'B+', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 76, maxMarks: 100, classAverage: 73, highestMarks: 94, grade: 'B+', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 82, maxMarks: 100, classAverage: 78, highestMarks: 97, grade: 'A', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 65, maxMarks: 100, classAverage: 67, highestMarks: 92, grade: 'B', status: 'Pass' },
        ]
      }
    ]
  },
  '279205': {
    rollNo: '279205',
    name: 'गौरव पाण्डेय (Gaurav Pandey)',
    fatherName: 'श्री दिनेश पाण्डेय',
    motherName: 'श्रीमती रेखा पाण्डेय',
    className: 'Class 9',
    section: 'B',
    session: '2026-27',
    attendancePercent: 74,
    contactNumber: '+91 9753443097',
    records: [
      {
        examName: 'मासिक टेस्ट 1 (July)',
        examCode: 'MT-1',
        date: '2026-07-28',
        month: 'Jul',
        totalMarks: 170,
        maxMarks: 250,
        percentage: 68.0,
        classAverage: 68.5,
        rank: 22,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 32, maxMarks: 50, classAverage: 34, highestMarks: 48, grade: 'B', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 35, maxMarks: 50, classAverage: 33, highestMarks: 46, grade: 'B+', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 37, maxMarks: 50, classAverage: 36, highestMarks: 47, grade: 'B+', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 38, maxMarks: 50, classAverage: 37, highestMarks: 48, grade: 'B+', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 28, maxMarks: 50, classAverage: 32, highestMarks: 45, grade: 'C+', status: 'Pass' },
        ]
      },
      {
        examName: 'त्रैमासिक परीक्षा (Quarterly)',
        examCode: 'QT-1',
        date: '2026-09-30',
        month: 'Sep',
        totalMarks: 0,
        maxMarks: 500,
        percentage: 0,
        classAverage: 69.5,
        rank: 45,
        totalStudents: 45,
        status: 'Absent',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 0, maxMarks: 100, classAverage: 67, highestMarks: 94, grade: 'AB', status: 'Absent' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 0, maxMarks: 100, classAverage: 68, highestMarks: 95, grade: 'AB', status: 'Absent' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 0, maxMarks: 100, classAverage: 71, highestMarks: 92, grade: 'AB', status: 'Absent' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 0, maxMarks: 100, classAverage: 76, highestMarks: 96, grade: 'AB', status: 'Absent' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 0, maxMarks: 100, classAverage: 65, highestMarks: 91, grade: 'AB', status: 'Absent' },
        ]
      },
      {
        examName: 'अर्धवार्षिक परीक्षा (Half-Yearly)',
        examCode: 'HY-1',
        date: '2026-12-22',
        month: 'Dec',
        totalMarks: 390,
        maxMarks: 500,
        percentage: 78.0,
        classAverage: 71.8,
        rank: 14,
        totalStudents: 45,
        status: 'Pass',
        subjects: [
          { name: 'गणित (Mathematics)', code: 'MATH', marks: 78, maxMarks: 100, classAverage: 70, highestMarks: 96, grade: 'B+', status: 'Pass' },
          { name: 'विज्ञान (Science)', code: 'SCI', marks: 79, maxMarks: 100, classAverage: 69, highestMarks: 95, grade: 'B+', status: 'Pass' },
          { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 80, maxMarks: 100, classAverage: 73, highestMarks: 94, grade: 'A', status: 'Pass' },
          { name: 'हिंदी (Hindi)', code: 'HIN', marks: 85, maxMarks: 100, classAverage: 78, highestMarks: 97, grade: 'A', status: 'Pass' },
          { name: 'अंग्रेजी (English)', code: 'ENG', marks: 68, maxMarks: 100, classAverage: 67, highestMarks: 92, grade: 'B', status: 'Pass' },
        ]
      }
    ]
  }
};

export function getStudentProfile(rollNo: string): StudentProfile {
  const cleanRoll = rollNo.trim();
  let profile = DEFAULT_STUDENTS_PROFILES[cleanRoll];

  // If not found in static, create fallback baseline profile
  if (!profile) {
    profile = {
      rollNo: cleanRoll,
      name: `विद्यार्थी (Roll ${cleanRoll})`,
      fatherName: 'अभिभावक',
      motherName: 'माता',
      className: 'Class 9',
      section: 'B',
      session: '2026-27',
      attendancePercent: 86,
      contactNumber: '+91 9753443093',
      records: [
        {
          examName: 'मासिक टेस्ट 1 (July)',
          examCode: 'MT-1',
          date: '2026-07-28',
          month: 'Jul',
          totalMarks: 190,
          maxMarks: 250,
          percentage: 76.0,
          classAverage: 68.5,
          rank: 15,
          totalStudents: 45,
          status: 'Pass',
          subjects: [
            { name: 'गणित (Mathematics)', code: 'MATH', marks: 38, maxMarks: 50, classAverage: 34, highestMarks: 48, grade: 'B+', status: 'Pass' },
            { name: 'विज्ञान (Science)', code: 'SCI', marks: 36, maxMarks: 50, classAverage: 33, highestMarks: 46, grade: 'B+', status: 'Pass' },
            { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 40, maxMarks: 50, classAverage: 36, highestMarks: 47, grade: 'A', status: 'Pass' },
            { name: 'हिंदी (Hindi)', code: 'HIN', marks: 41, maxMarks: 50, classAverage: 37, highestMarks: 48, grade: 'A', status: 'Pass' },
            { name: 'अंग्रेजी (English)', code: 'ENG', marks: 35, maxMarks: 50, classAverage: 32, highestMarks: 45, grade: 'B', status: 'Pass' },
          ]
        },
        {
          examName: 'त्रैमासिक परीक्षा (Quarterly)',
          examCode: 'QT-1',
          date: '2026-09-30',
          month: 'Sep',
          totalMarks: 405,
          maxMarks: 500,
          percentage: 81.0,
          classAverage: 69.5,
          rank: 9,
          totalStudents: 45,
          status: 'Pass',
          subjects: [
            { name: 'गणित (Mathematics)', code: 'MATH', marks: 80, maxMarks: 100, classAverage: 67, highestMarks: 94, grade: 'A', status: 'Pass' },
            { name: 'विज्ञान (Science)', code: 'SCI', marks: 82, maxMarks: 100, classAverage: 68, highestMarks: 95, grade: 'A', status: 'Pass' },
            { name: 'सामाजिक विज्ञान (Social)', code: 'SOC', marks: 84, maxMarks: 100, classAverage: 71, highestMarks: 92, grade: 'A', status: 'Pass' },
            { name: 'हिंदी (Hindi)', code: 'HIN', marks: 86, maxMarks: 100, classAverage: 76, highestMarks: 96, grade: 'A+', status: 'Pass' },
            { name: 'अंग्रेजी (English)', code: 'ENG', marks: 73, maxMarks: 100, classAverage: 65, highestMarks: 91, grade: 'B+', status: 'Pass' },
          ]
        }
      ]
    };
  }

  // Synchronize dynamically with localStorage teacher uploaded marks
  try {
    const rawSheets = localStorage.getItem('mdhss_marks_sheets');
    if (rawSheets) {
      const sheets = JSON.parse(rawSheets);
      sheets.forEach((sheet: any) => {
        if (sheet.students && Array.isArray(sheet.students)) {
          const studentEntry = sheet.students.find((s: any) => s.rollNo === cleanRoll || s.roll === cleanRoll);
          if (studentEntry && studentEntry.marks !== undefined) {
            // Check if record for this exam and subject exists or needs updating
            const marksVal = studentEntry.marks === 'AB' || studentEntry.marks === 'Ab' ? 0 : Number(studentEntry.marks) || 0;
            const isAbsent = studentEntry.marks === 'AB' || studentEntry.marks === 'Ab' || studentEntry.status === 'Absent';
            
            // Check if we have an exam record for this
            let examRec = profile.records.find(r => r.examName.includes(sheet.examType) || r.examCode === sheet.examType);
            if (!examRec) {
              examRec = {
                examName: sheet.examType || 'नवीन परीक्षा सत्र 2026-27',
                examCode: 'EX-' + Math.floor(Math.random()*1000),
                date: sheet.date ? sheet.date.split(' ')[0] : '2026-10-15',
                month: 'Oct',
                totalMarks: marksVal,
                maxMarks: Number(sheet.maxMarks) || 100,
                percentage: isAbsent ? 0 : Math.round((marksVal / (Number(sheet.maxMarks) || 100)) * 1000) / 10,
                classAverage: 68.0,
                rank: isAbsent ? 45 : (marksVal >= 85 ? 2 : marksVal >= 70 ? 10 : 25),
                totalStudents: sheet.enteredCount || 45,
                status: isAbsent ? 'Absent' : 'Pass',
                subjects: []
              };
              profile.records.push(examRec);
            }

            // Update subject inside exam
            const subName = sheet.subject || 'गणित (Mathematics)';
            let sub = examRec.subjects.find(s => s.name === subName);
            if (!sub) {
              examRec.subjects.push({
                name: subName,
                code: subName.substring(0, 4).toUpperCase(),
                marks: marksVal,
                maxMarks: Number(sheet.maxMarks) || 100,
                classAverage: 68,
                highestMarks: Math.max(marksVal, 92),
                grade: isAbsent ? 'AB' : marksVal >= 90 ? 'A+' : marksVal >= 75 ? 'A' : marksVal >= 60 ? 'B' : 'C',
                status: isAbsent ? 'Absent' : 'Pass'
              });
            } else {
              sub.marks = marksVal;
              sub.status = isAbsent ? 'Absent' : 'Pass';
              sub.grade = isAbsent ? 'AB' : marksVal >= 90 ? 'A+' : marksVal >= 75 ? 'A' : marksVal >= 60 ? 'B' : 'C';
            }
          }
        }
      });
    }
  } catch (err) {
    console.error('Error syncing dynamic teacher marks:', err);
  }

  return profile;
}
