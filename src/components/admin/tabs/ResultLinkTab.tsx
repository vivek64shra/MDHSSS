import React, { useEffect, useState } from 'react';
import { Award, Copy, ExternalLink, Save } from 'lucide-react';
import { saveSettingToCloud, usePortalStore } from '../../../firebase';
import { DEFAULT_RESULT_LINK_CONFIG, ResultLinkConfig } from '../../../types/portal';

interface Props {
  onToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export default function ResultLinkTab({ onToast }: Props) {
  const { resultLinkConfig } = usePortalStore();
  const [form, setForm] = useState<ResultLinkConfig>(DEFAULT_RESULT_LINK_CONFIG);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ ...DEFAULT_RESULT_LINK_CONFIG, ...resultLinkConfig });
  }, [resultLinkConfig]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim()) {
      onToast('error', 'कृपया वैध पोर्टल लिंक दर्ज करें।');
      return;
    }
    setSaving(true);
    try {
      const payload: ResultLinkConfig = {
        url: form.url.trim(),
        btnText: form.btnText.trim() || DEFAULT_RESULT_LINK_CONFIG.btnText,
        tag: form.tag.trim() || DEFAULT_RESULT_LINK_CONFIG.tag,
        note: form.note.trim(),
        updatedAt: new Date().toISOString(),
      };
      const ok = await saveSettingToCloud('result_link_config', payload);
      if (ok) {
        onToast('success', '✅ छात्र लॉगिन / परिणाम लिंक Firebase में लाइव अपडेट हो गया!');
      } else {
        onToast('info', '⚠️ ऑफलाइन कैश में सुरक्षित — नेटवर्क मिलते ही सिंक होगा।');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(form.url);
      onToast('success', '📋 लिंक कॉपी हो गया!');
    } catch {
      onToast('info', form.url);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="bg-white rounded-xl border border-rose-200 p-4 sm:p-5 shadow-xs space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-rose-600" />
          <h4 className="text-base font-extrabold text-slate-900 m-0">
            छात्र लॉगिन / परीक्षा परिणाम पोर्टल लिंक नियंत्रण
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" /> कॉपी
          </button>
          <a
            href={form.url || DEFAULT_RESULT_LINK_CONFIG.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg no-underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> लिंक खोलकर जांचें
          </a>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          अधिकृत छात्र लॉगिन / रिजल्ट URL *
        </label>
        <input
          type="url"
          required
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://mdhsssresult.netlify.app/"
          className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">बटन का नाम</label>
          <input
            type="text"
            value={form.btnText}
            onChange={(e) => setForm({ ...form, btnText: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">बैज / सत्र टैग</label>
          <input
            type="text"
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          छात्रों हेतु निर्देश (Portal Note)
        </label>
        <textarea
          rows={3}
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-extrabold rounded-xl cursor-pointer shadow-sm transition-colors disabled:opacity-60"
      >
        <Save className="w-4 h-4" />
        {saving ? 'सेव हो रहा है...' : '💾 लिंक सेटिंग्स Firebase में सेव करें'}
      </button>
    </form>
  );
}
