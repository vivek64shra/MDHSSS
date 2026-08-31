import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Award,
  Calendar,
  BookOpen,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Printer,
  Search,
  School,
  Sparkles,
  BarChart3,
  Compass,
  PieChart as PieIcon
} from 'lucide-react';
import { getStudentProfile } from '../data/mockStudentHistory';
import { StudentProfile, StudentExamRecord } from '../types';

interface StudentAnalyticsProps {
  initialRollNo?: string;
  onClose?: () => void;
}

const PRESET_STUDENTS = [
  { roll: '279201', label: 'Roll No: 279201', classSec: '9th - B' },
  { roll: '279202', label: 'Roll No: 279202', classSec: '9th - B' },
  { roll: '279203', label: 'Roll No: 279203', classSec: '9th - B' },
  { roll: '279204', label: 'Roll No: 279204', classSec: '9th - B' },
  { roll: '279205', label: 'Roll No: 279205', classSec: '9th - B' },
];

const COLORS = {
  primary: '#0284c7',
  primaryDark: '#0369a1',
  secondary: '#2563eb',
  accentGreen: '#16a34a',
  accentAmber: '#d97706',
  accentPurple: '#9333ea',
  accentPink: '#e11d48',
  softBlue: '#bae6fd',
  softGreen: '#bbf7d0',
  softAmber: '#fed7aa',
  slateDark: '#0f172a',
  slateMuted: '#475569',
};

const PIE_COLORS = ['#0284c7', '#16a34a', '#f59e0b', '#ef4444'];

export const StudentAnalyticsDashboard: React.FC<StudentAnalyticsProps> = ({
  initialRollNo = '279201',
  onClose
}) => {
  const [selectedRoll, setSelectedRoll] = useState<string>(initialRollNo);
  const [inputRoll, setInputRoll] = useState<string>(initialRollNo);
  const [activeTab, setActiveTab] = useState<'trend' | 'subjects' | 'radar' | 'report'>('trend');
  const [selectedExamIndex, setSelectedExamIndex] = useState<number>(0);

  // Retrieve student profile
  const profile: StudentProfile = useMemo(() => {
    return getStudentProfile(selectedRoll);
  }, [selectedRoll]);

  // Set default selected exam to the latest exam record
  React.useEffect(() => {
    if (profile.records && profile.records.length > 0) {
      setSelectedExamIndex(profile.records.length - 1);
    }
  }, [profile]);

  // Progress Trend Data across milestones
  const progressTimelineData = useMemo(() => {
    return profile.records.map((rec) => ({
      examName: rec.examName.replace(/\(.*?\)/g, '').trim(),
      fullName: rec.examName,
      month: rec.month,
      percentage: rec.percentage,
      classAvg: rec.classAverage,
      rank: rec.rank,
      totalStudents: rec.totalStudents,
      status: rec.status,
    }));
  }, [profile]);

  // Selected Exam Record
  const currentExam: StudentExamRecord | undefined = profile.records[selectedExamIndex] || profile.records[profile.records.length - 1];

  // Subject comparison for the selected exam
  const subjectComparisonData = useMemo(() => {
    if (!currentExam || !currentExam.subjects) return [];
    return currentExam.subjects.map((sub) => ({
      subject: sub.name.split('(')[0].trim(),
      fullName: sub.name,
      studentMarks: sub.marks,
      maxMarks: sub.maxMarks,
      classAverage: sub.classAverage,
      highestMarks: sub.highestMarks,
      percentage: Math.round((sub.marks / sub.maxMarks) * 100),
      grade: sub.grade,
      status: sub.status,
    }));
  }, [currentExam]);

  // Radar chart data
  const radarData = useMemo(() => {
    if (!currentExam || !currentExam.subjects) return [];
    return currentExam.subjects.map((sub) => ({
      subject: sub.name.split('(')[0].trim(),
      score: Math.round((sub.marks / sub.maxMarks) * 100),
      benchmark: Math.round((sub.classAverage / sub.maxMarks) * 100),
      topper: Math.round((sub.highestMarks / sub.maxMarks) * 100),
    }));
  }, [currentExam]);

  // Attendance breakdown data
  const attendanceData = useMemo(() => {
    const present = profile.attendancePercent;
    const leave = 4;
    const absent = Math.max(0, 100 - present - leave);
    return [
      { name: 'उपस्थित दिवस (Present)', value: present },
      { name: 'स्वीकृत अवकाश (Leave)', value: leave },
      { name: 'अनुपस्थित (Absent)', value: absent },
    ];
  }, [profile.attendancePercent]);

  // Key metrics calculation
  const latestPercentage = currentExam ? currentExam.percentage : 0;
  const initialPercentage = profile.records[0] ? profile.records[0].percentage : 0;
  const deltaGrowth = Math.round((latestPercentage - initialPercentage) * 10) / 10;

  // Best subject
  const bestSubject = useMemo(() => {
    if (!currentExam || !currentExam.subjects || currentExam.subjects.length === 0) return 'N/A';
    const sorted = [...currentExam.subjects].sort((a, b) => (b.marks / b.maxMarks) - (a.marks / a.maxMarks));
    return sorted[0]?.name.split('(')[0].trim() || 'गणित';
  }, [currentExam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoll.trim()) {
      setSelectedRoll(inputRoll.trim());
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="student-analytics-container" className="w-full max-w-6xl mx-auto my-6 p-4 sm:p-6 bg-white/90 backdrop-blur-xl border border-sky-200 shadow-xl rounded-2xl text-slate-800 transition-all font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <img
            src="http://www.online.edumentsolution.com/ImageHandler.ashx?pTbl=ApplicationConfig&pImgFiled=iLogo1&pTblFiled=nCampusID&pVal=2&pDBName=My2070"
            alt="School Logo"
            className="w-12 h-12 rounded-full border-2 border-sky-500 shadow-md object-cover bg-white shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/80x80/0284c7/ffffff?text=MDHSS';
            }}
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>प्रगति एनालिटिक्स डैशबोर्ड (Student Progress Analytics)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              माँ दुर्गा उच्चतर माध्यमिक विद्यालय, सेमरिया
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              समय के साथ परीक्षा प्राप्तांक एवं विषयवार प्रगति का विस्तृत विश्लेषण
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-end md:self-auto">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all cursor-pointer shadow-xs"
            title="प्रगति रिपोर्ट प्रिंट करें"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>रिपोर्ट प्रिंट करें (Print)</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
            >
              ✕ बंद करें
            </button>
          )}
        </div>
      </div>

      {/* Student Selector & Quick Roll Bar */}
      <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-sky-50 via-blue-50/50 to-indigo-50/40 border border-sky-200 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Search Roll */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-600" />
            <input
              type="text"
              value={inputRoll}
              onChange={(e) => setInputRoll(e.target.value)}
              placeholder="रोल नंबर दर्ज करें (उदा. 279201)"
              inputMode="numeric"
              className="w-full pl-9 pr-3 py-2 bg-white border border-sky-300 rounded-xl text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
          >
            खोजें
          </button>
        </form>

        {/* Quick Student Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            त्वरित चयन:
          </span>
          {PRESET_STUDENTS.map((st) => {
            const isSelected = selectedRoll === st.roll;
            return (
              <button
                key={st.roll}
                onClick={() => {
                  setSelectedRoll(st.roll);
                  setInputRoll(st.roll);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-white hover:bg-sky-100 text-slate-700 border-sky-200'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Student Profile Card Overview (Focused on Roll Number) */}
      <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-black text-base shrink-0 border border-sky-200">
            #
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">अनुक्रमांक (Roll Number)</div>
            <div className="font-extrabold text-sky-800 text-base">{profile.rollNo}</div>
            <div className="text-xs text-slate-500 font-bold">नामांकन: MDHSS/{profile.rollNo.slice(-4)}</div>
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 font-semibold">अभिलेख एवं सत्र</div>
          <div className="font-bold text-slate-800">सत्र: {profile.session}</div>
          <div className="text-xs text-slate-500 font-medium">अधिकृत डिजिटल अभिलेख</div>
        </div>

        <div>
          <div className="text-xs text-slate-500 font-semibold">कक्षा एवं संकाय</div>
          <div className="font-extrabold text-slate-900">{profile.className} ({profile.section})</div>
          <div className="text-xs text-emerald-700 font-bold">सत्र: {profile.session} • नियमित</div>
        </div>

        <div>
          <div className="text-xs text-slate-500 font-semibold">उपस्थिति एवं संपर्क</div>
          <div className="font-extrabold text-emerald-600 flex items-center gap-1">
            <UserCheck className="w-4 h-4" />
            {profile.attendancePercent}% उपस्थिति
          </div>
          <div className="text-xs text-slate-600 font-medium">{profile.contactNumber}</div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Latest Percentage */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50/70 border border-sky-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-sky-900 uppercase">वर्तमान प्रतिशत</span>
            <div className="w-8 h-8 rounded-lg bg-sky-600/10 text-sky-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-sky-950">
            {latestPercentage}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-700">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{deltaGrowth}% प्रारंभिक टेस्ट की तुलना में</span>
          </div>
        </div>

        {/* Metric 2: Class Rank */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-amber-900 uppercase">कक्षा में स्थान (Rank)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-600/10 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-950">
            #{currentExam?.rank || 1} <span className="text-sm font-bold text-amber-800">/ {currentExam?.totalStudents || 45}</span>
          </div>
          <div className="mt-1 text-xs font-bold text-amber-800">
            🌟 शीर्ष 5% विद्यार्थियों में शामिल
          </div>
        </div>

        {/* Metric 3: Best Subject */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-emerald-900 uppercase">मजबूत विषय (Strength)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-emerald-950 truncate">
            {bestSubject}
          </div>
          <div className="mt-1 text-xs font-bold text-emerald-700">
            ✓ विशेष योग्यता (Distinction)
          </div>
        </div>

        {/* Metric 4: Academic Milestone Count */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50/70 border border-purple-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-purple-900 uppercase">सत्र मूल्यांकन (Exams)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-600/10 text-purple-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-purple-950">
            {profile.records.length} परीक्षाएँ
          </div>
          <div className="mt-1 text-xs font-bold text-purple-700">
            ✓ सभी परिणाम डिजिटल सत्यापित
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-6 flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('trend')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
            activeTab === 'trend'
              ? 'border-sky-600 text-sky-700 bg-sky-50/70'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>समग्र प्रगति ग्राफ (Progress Over Time)</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
            activeTab === 'subjects'
              ? 'border-sky-600 text-sky-700 bg-sky-50/70'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>विषयवार तुलना बार चार्ट (Subject Breakdown)</span>
        </button>

        <button
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
            activeTab === 'radar'
              ? 'border-sky-600 text-sky-700 bg-sky-50/70'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>दक्षता रडार चार्ट (Skills Radar)</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
            activeTab === 'report'
              ? 'border-sky-600 text-sky-700 bg-sky-50/70'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <PieIcon className="w-4 h-4" />
          <span>अभिभावक रिपोर्ट कार्ड (Parent Report Card)</span>
        </button>
      </div>

      {/* TAB 1: OVERALL PROGRESS OVER TIME (RECHARTS AREA & LINE CHART) */}
      {activeTab === 'trend' && (
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                📈 समय के साथ प्रतिशत प्राप्तांक प्रगति व कक्षा औसत की तुलना
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                सत्र 2026-27 के सभी मासिक टेस्ट, त्रैमासिक व अर्धवार्षिक परीक्षाओं का तुलनात्मक ग्राफ
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span> छात्र प्राप्तांक
              <span className="w-3 h-3 rounded-full bg-slate-400 inline-block ml-2"></span> कक्षा औसत
            </div>
          </div>

          <div className="w-full h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={progressTimelineData}
                margin={{ top: 20, right: 30, left: -10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="studentColorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="avgColorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="examName"
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight={600}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  unit="%"
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs leading-relaxed font-sans">
                          <div className="font-extrabold text-sky-300 text-sm border-b border-slate-700 pb-1 mb-1.5">
                            {data.fullName}
                          </div>
                          <div className="flex justify-between gap-4 font-semibold">
                            <span>विद्यार्थी प्राप्तांक:</span>
                            <span className="font-black text-emerald-400">{data.percentage}%</span>
                          </div>
                          <div className="flex justify-between gap-4 text-slate-300 font-medium">
                            <span>कक्षा औसत स्कोर:</span>
                            <span className="font-bold text-slate-300">{data.classAvg}%</span>
                          </div>
                          <div className="flex justify-between gap-4 text-slate-300 font-medium">
                            <span>कक्षा रैंक:</span>
                            <span className="font-bold text-amber-400">#{data.rank} / {data.totalStudents}</span>
                          </div>
                          <div className="mt-1 pt-1 border-t border-slate-700 text-sky-200 text-[11px]">
                            स्थित: {data.status === 'Pass' ? '✅ उत्तीर्ण' : '⚠️ अनुपस्थित'}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => {
                    if (value === 'percentage') return 'छात्र प्राप्तांक (% Marks)';
                    if (value === 'classAvg') return 'कक्षा औसत (% Class Average)';
                    return value;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#0284c7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#studentColorGrad)"
                  activeDot={{ r: 7, stroke: '#0284c7', strokeWidth: 3, fill: '#ffffff' }}
                />
                <Area
                  type="monotone"
                  dataKey="classAvg"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#avgColorGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Exam Timeline Step Cards */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {profile.records.map((rec, idx) => {
              const isLatest = idx === profile.records.length - 1;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedExamIndex(idx);
                    setActiveTab('subjects');
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-center ${
                    selectedExamIndex === idx
                      ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200'
                      : 'bg-slate-50/80 hover:bg-white border-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-500 uppercase">{rec.month} 2026</div>
                  <div className="font-extrabold text-slate-900 text-xs truncate mt-0.5" title={rec.examName}>
                    {rec.examName.split('(')[0]}
                  </div>
                  <div className="text-lg font-black text-sky-700 mt-1">
                    {rec.percentage}%
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700">
                    रैंक: #{rec.rank}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SUBJECT BREAKDOWN BAR CHART */}
      {activeTab === 'subjects' && (
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                📊 विषयवार प्राप्तांक बनाम टॉपर व कक्षा औसत
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                चयनित परीक्षा में प्रत्येक विषय में विद्यार्थी का प्रदर्शन
              </p>
            </div>

            {/* Exam selector dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">परीक्षा चुनें:</label>
              <select
                value={selectedExamIndex}
                onChange={(e) => setSelectedExamIndex(Number(e.target.value))}
                className="px-3 py-1.5 bg-white border border-sky-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {profile.records.map((r, i) => (
                  <option key={i} value={i}>
                    {r.examName} ({r.percentage}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjectComparisonData}
                margin={{ top: 20, right: 30, left: -10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="subject"
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight={600}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs leading-relaxed">
                          <div className="font-extrabold text-sky-300 text-sm border-b border-slate-700 pb-1 mb-1.5">
                            {data.fullName}
                          </div>
                          <div className="flex justify-between gap-4 font-semibold">
                            <span>विद्यार्थी अंक:</span>
                            <span className="font-black text-sky-400">{data.studentMarks} / {data.maxMarks} ({data.percentage}%)</span>
                          </div>
                          <div className="flex justify-between gap-4 text-slate-300">
                            <span>कक्षा औसत:</span>
                            <span>{data.classAverage} / {data.maxMarks}</span>
                          </div>
                          <div className="flex justify-between gap-4 text-amber-300 font-bold">
                            <span>टॉपर का अंक:</span>
                            <span>{data.highestMarks} / {data.maxMarks}</span>
                          </div>
                          <div className="mt-1 pt-1 border-t border-slate-700 text-emerald-300">
                            ग्रेड: {data.grade} • स्थिति: {data.status}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => {
                    if (value === 'studentMarks') return 'विद्यार्थी प्राप्तांक (Student Score)';
                    if (value === 'classAverage') return 'कक्षा औसत (Class Avg)';
                    if (value === 'highestMarks') return 'विषय टॉपर (Highest Score)';
                    return value;
                  }}
                />
                <Bar dataKey="studentMarks" name="studentMarks" fill="#0284c7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="classAverage" name="classAverage" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="highestMarks" name="highestMarks" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Table breakdown */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-sky-50/80 text-sky-900 font-extrabold uppercase border-b border-sky-200">
                <tr>
                  <th className="p-3">विषय (Subject)</th>
                  <th className="p-3 text-center">पूर्णांक (Max)</th>
                  <th className="p-3 text-center">प्राप्तांक (Marks)</th>
                  <th className="p-3 text-center">प्रतिशत (%)</th>
                  <th className="p-3 text-center">कक्षा औसत</th>
                  <th className="p-3 text-center">ग्रेड</th>
                  <th className="p-3 text-center">स्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {subjectComparisonData.map((sub, i) => (
                  <tr key={i} className="hover:bg-sky-50/40 transition-colors">
                    <td className="p-3 font-bold text-slate-800">{sub.fullName}</td>
                    <td className="p-3 text-center text-slate-600">{sub.maxMarks}</td>
                    <td className="p-3 text-center font-extrabold text-sky-700 text-sm">{sub.studentMarks}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{sub.percentage}%</td>
                    <td className="p-3 text-center text-slate-500">{sub.classAverage}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full font-black text-[11px] bg-emerald-100 text-emerald-800">
                        {sub.grade}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-emerald-600 font-bold">
                        {sub.status === 'Pass' ? '✓ उत्तीर्ण' : 'अनुपस्थित'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RADAR SKILLS AND CORRELATION */}
      {activeTab === 'radar' && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Radar Chart */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="mb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                🕸️ विषय दक्षता चक्र (Academic Mastery Radar)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                सभी विषयों में विद्यार्थी बनाम कक्षा औसत व टॉपर का 360° तुलनात्मक चक्र
              </p>
            </div>

            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="subject" stroke="#334155" fontSize={11} fontWeight={700} />
                  <PolarRadiusAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                  <Radar
                    name="विद्यार्थी प्राप्तांक %"
                    dataKey="score"
                    stroke="#0284c7"
                    fill="#0284c7"
                    fillOpacity={0.5}
                  />
                  <Radar
                    name="कक्षा औसत %"
                    dataKey="benchmark"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.2}
                  />
                  <Radar
                    name="टॉपर %"
                    dataKey="topper"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.15}
                  />
                  <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance and Correlation Pie */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                🎯 उपस्थिति एवं परीक्षा परिणाम का सहसंबंध
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                नियमित कक्षा उपस्थिति का परीक्षा अंकों पर सीधा सकारात्मक प्रभाव
              </p>
            </div>

            <div className="w-full h-64 my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name.split('(')[0]}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val}%`, 'अनुपात']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-medium">
              <strong>💡 एनालिटिक्स निष्कर्ष:</strong> {profile.name} की <strong>{profile.attendancePercent}%</strong> उत्कृष्ट उपस्थिति से उनके परीक्षा अंकों में लगातार <strong>+{deltaGrowth}%</strong> की निरंतर वृद्धि दर्ज हुई है।
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PARENT REPORT CARD & AI RECOMMENDATIONS */}
      {activeTab === 'report' && (
        <div className="mt-5 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                📝 अभिभावक प्रगति रिपोर्ट व शिक्षक परामर्श (Parent Consultation Summary)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                सत्र 2026-27 के आधार पर शिक्षक एवं परीक्षा समिति का आधिकारिक परामर्श
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 transition-all cursor-pointer shadow-xs"
            >
              🖨️ प्रिंट करें
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths Card */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <h4 className="text-sm font-black text-emerald-900 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                मुख्य शैक्षिक उपलब्धियां (Key Strengths)
              </h4>
              <ul className="text-xs text-emerald-950 space-y-1.5 list-disc list-inside font-medium">
                <li><strong>{bestSubject}</strong> में उत्कृष्ट प्रदर्शन और विषय दक्षता (90%+ अंक)।</li>
                <li>समय के साथ प्राप्तांकों में निरंतर <strong>+{deltaGrowth}%</strong> का सकारात्मक सुधार।</li>
                <li>नियमित उपस्थिति (<strong>{profile.attendancePercent}%</strong>) और कक्षा अनुशासन।</li>
                <li>प्रश्नोत्तरी एवं प्रायोगिक कार्यों में सक्रिय सहभागिता।</li>
              </ul>
            </div>

            {/* Focus Areas Card */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <h4 className="text-sm font-black text-amber-900 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                सुधार हेतु सुझाव (Focus & Action Points)
              </h4>
              <ul className="text-xs text-amber-950 space-y-1.5 list-disc list-inside font-medium">
                <li>अंग्रेजी व व्याकरण के लिखित अभ्यास में अतिरिक्त 30 मिनट का दैनिक समय दें।</li>
                <li>मॉडल टेस्ट पेपर्स एवं समयबद्ध उत्तर-लेखन का नियमित अभ्यास करें।</li>
                <li>गणित के सूत्रों एवं प्रमेयों का साप्ताहिक रिवीजन सुनिश्चित करें।</li>
              </ul>
            </div>
          </div>

          {/* Official Signatures Row */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4 text-xs font-bold text-slate-600">
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <div>कक्षा अध्यापक के हस्ताक्षर</div>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <div>अभिभावक के हस्ताक्षर</div>
            </div>
            <div className="text-center">
              <div className="w-36 border-b border-sky-600 text-sky-800 mb-1 font-black">
                पुष्पेन्द्र द्विवेदी
              </div>
              <div>परीक्षा नियंत्रक / प्राचार्य</div>
              <div className="text-[10px] text-slate-400">माँ दुर्गा उ.मा.वि. सेमरिया</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentAnalyticsDashboard;
