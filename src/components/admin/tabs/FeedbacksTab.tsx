import React, { useMemo, useState } from 'react';
import { MessageSquare, Phone, Search, Star, Trash2 } from 'lucide-react';
import {
  clearCollectionFromCloud,
  deleteFeedbackFromCloud,
  usePortalStore,
} from '../../../firebase';
import { ConfirmDialogState } from '../AdminUiHelpers';

interface Props {
  onToast: (type: 'success' | 'error' | 'info', text: string) => void;
  onConfirm: (dialog: ConfirmDialogState) => void;
}

export default function FeedbacksTab({ onToast, onConfirm }: Props) {
  const { feedbacks } = usePortalStore();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return feedbacks;
    return feedbacks.filter(
      (f) =>
        f.name?.toLowerCase().includes(q) ||
        f.message?.toLowerCase().includes(q) ||
        f.subject?.toLowerCase().includes(q) ||
        f.role?.toLowerCase().includes(q)
    );
  }, [feedbacks, search]);

  const handleDeleteOne = (id: string, name: string) => {
    onConfirm({
      title: 'प्रतिक्रिया हटाएं?',
      message: `क्या आप '${name}' की प्रतिक्रिया को Firebase से हटाना चाहते हैं?`,
      confirmLabel: '🗑️ हटाएं',
      danger: true,
      onConfirm: async () => {
        await deleteFeedbackFromCloud(id);
        onToast('success', '🗑️ प्रतिक्रिया सफलतापूर्वक हटा दी गई।');
      },
    });
  };

  const handleClearAll = () => {
    if (feedbacks.length === 0) return;
    onConfirm({
      title: 'सभी प्रतिक्रियाएं क्लियर करें?',
      message: `चेतावनी: इससे Firebase की सभी ${feedbacks.length} प्रतिक्रियाएं स्थायी रूप से हट जाएंगी।`,
      confirmLabel: '🗑️ सभी हटाएं',
      danger: true,
      onConfirm: async () => {
        await clearCollectionFromCloud('feedbacks');
        onToast('success', '🗑️ सभी प्रतिक्रियाएं क्लियर कर दी गईं।');
      },
    });
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
            placeholder="नाम, विषय या संदेश से खोजें..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        {feedbacks.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> सभी क्लियर करें
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <div className="font-bold text-slate-700">कोई प्रतिक्रिया या सुझाव नहीं मिला</div>
          <div className="text-xs mt-1">
            अभिभावकों व छात्रों के सुझाव यहाँ लाइव अपडेट होते रहेंगे।
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((fb) => {
            const stars = Math.max(1, Math.min(5, Number(fb.rating) || 5));
            return (
              <div
                key={fb.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">{fb.name}</div>
                      <div className="text-xs text-slate-500">
                        {fb.role || 'अभिभावक/छात्र'} {fb.class ? `• ${fb.class}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                      {Array.from({ length: stars }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      ))}
                    </div>
                  </div>

                  {fb.subject && (
                    <div className="inline-block px-2 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-800 rounded-md">
                      {fb.subject}
                    </div>
                  )}

                  <p className="text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2.5 m-0 leading-relaxed whitespace-pre-line">
                    {fb.message}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>🕒 {fb.date}</span>
                    {fb.phone && (
                      <a
                        href={`tel:${fb.phone}`}
                        className="inline-flex items-center gap-1 font-bold text-sky-700 no-underline"
                      >
                        <Phone className="w-3 h-3" /> {fb.phone}
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteOne(fb.id, fb.name)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> हटाएं
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
