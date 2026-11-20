import React, { useMemo, useState } from 'react';
import { Download, Phone, Search, Trash2, UserPlus } from 'lucide-react';
import {
  clearCollectionFromCloud,
  deleteAdmissionFromCloud,
  usePortalStore,
} from '../../../firebase';
import { ConfirmDialogState } from '../AdminUiHelpers';

interface Props {
  onToast: (type: 'success' | 'error' | 'info', text: string) => void;
  onConfirm: (dialog: ConfirmDialogState) => void;
}

export default function AdmissionsTab({ onToast, onConfirm }: Props) {
  const { admissions } = usePortalStore();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return admissions;
    return admissions.filter(
      (a) =>
        a.studentName?.toLowerCase().includes(q) ||
        a.fatherName?.toLowerCase().includes(q) ||
        a.phone?.toLowerCase().includes(q) ||
        a.class?.toLowerCase().includes(q) ||
        a.address?.toLowerCase().includes(q)
    );
  }, [admissions, search]);

  const handleDeleteOne = (id: string, name: string) => {
    onConfirm({
      title: 'प्रवेश आवेदन हटाएं?',
      message: `क्या आप '${name}' (${id}) का प्रवेश आवेदन Firebase से स्थायी रूप से हटाना चाहते हैं?`,
      confirmLabel: '🗑️ हटाएं',
      danger: true,
      onConfirm: async () => {
        await deleteAdmissionFromCloud(id);
        onToast('success', `🗑️ '${name}' का आवेदन हटा दिया गया।`);
      },
    });
  };

  const handleClearAll = () => {
    if (admissions.length === 0) return;
    onConfirm({
      title: 'सभी प्रवेश आवेदन क्लियर करें?',
      message: `चेतावनी: इससे Firebase के सभी ${admissions.length} ऑनलाइन प्रवेश आवेदन स्थायी रूप से मिट जाएंगे।`,
      confirmLabel: '🗑️ सभी हटाएं',
      danger: true,
      onConfirm: async () => {
        await clearCollectionFromCloud('admissions');
        onToast('success', '🗑️ सभी प्रवेश आवेदन सफलतापूर्वक क्लियर हो गए।');
      },
    });
  };

  const handleExportCsv = () => {
    if (filtered.length === 0) {
      onToast('info', 'निर्यात करने के लिए कोई रिकॉर्ड उपलब्ध नहीं है।');
      return;
    }
    const headers = ['ID', 'Date', 'Student Name', 'Father Name', 'Mother Name', 'Phone', 'Class', 'Subject', 'Address', 'Remarks'];
    const escapeCsv = (val: unknown) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const rows = filtered.map((a) =>
      [a.id, a.date, a.studentName, a.fatherName, a.motherName, a.phone, a.class, a.subject, a.address, a.remarks]
        .map(escapeCsv)
        .join(',')
    );
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MDHSSS_Admissions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('success', '📥 Excel CSV फ़ाइल डाउनलोड हो गई!');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="छात्र नाम, पिता का नाम, मोबाइल या कक्षा खोजें..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Excel CSV
          </button>
          {admissions.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> पूरा डेटा क्लियर करें
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          <UserPlus className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <div className="font-bold text-slate-700">कोई ऑनलाइन प्रवेश आवेदन नहीं मिला</div>
          <div className="text-xs mt-1">
            जब भी कोई छात्र/अभिभावक फॉर्म भरेगा, वह यहाँ लाइव (बिना पेज रिफ्रेश) दिखने लगेगा।
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs">
                  <th className="py-3 px-3.5 font-extrabold">#</th>
                  <th className="py-3 px-3.5 font-extrabold">दिनांक</th>
                  <th className="py-3 px-3.5 font-extrabold">छात्र का नाम</th>
                  <th className="py-3 px-3.5 font-extrabold">पिता / माता</th>
                  <th className="py-3 px-3.5 font-extrabold">मोबाइल</th>
                  <th className="py-3 px-3.5 font-extrabold">कक्षा व संकाय</th>
                  <th className="py-3 px-3.5 font-extrabold">पता</th>
                  <th className="py-3 px-3.5 font-extrabold text-center">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((adm, idx) => (
                  <tr key={adm.id} className="hover:bg-sky-50/40">
                    <td className="py-2.5 px-3.5 text-xs font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-3.5 text-xs text-slate-600 whitespace-nowrap">
                      {adm.date}
                    </td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-900">{adm.studentName}</td>
                    <td className="py-2.5 px-3.5 text-xs text-slate-700">
                      <div>पिता: {adm.fatherName || '-'}</div>
                      {adm.motherName && <div className="text-slate-500">माता: {adm.motherName}</div>}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <a
                        href={`tel:${adm.phone}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline no-underline"
                      >
                        <Phone className="w-3 h-3" /> {adm.phone}
                      </a>
                    </td>
                    <td className="py-2.5 px-3.5 text-xs">
                      <span className="inline-block px-2 py-0.5 bg-sky-100 text-sky-800 font-bold rounded-md">
                        {adm.class}
                      </span>
                      {adm.subject && (
                        <div className="text-[11px] text-slate-500 mt-0.5">{adm.subject}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-xs text-slate-600 max-w-[200px]">
                      {adm.address}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteOne(adm.id, adm.studentName)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((adm) => (
              <div
                key={adm.id}
                className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">{adm.studentName}</div>
                    <div className="text-xs text-slate-500">पिता: {adm.fatherName || '-'}</div>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold bg-sky-100 text-sky-800 rounded-md shrink-0">
                    {adm.class}
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>📍 {adm.address}</div>
                  <div className="text-slate-400">🕒 {adm.date}</div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <a
                    href={`tel:${adm.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-sky-50 text-sky-700 rounded-lg no-underline"
                  >
                    <Phone className="w-3.5 h-3.5" /> {adm.phone}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDeleteOne(adm.id, adm.studentName)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-red-50 text-red-700 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> हटाएं
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
