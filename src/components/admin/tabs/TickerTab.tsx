import React, { useEffect, useState } from 'react';
import { Megaphone, RefreshCw, Save, Trash2 } from 'lucide-react';
import {
  deleteSettingFromCloud,
  fetchSettingFromCloud,
  saveSettingToCloud,
  usePortalStore,
} from '../../../firebase';
import { TICKER_THEMES, TickerMarqueeConfig } from '../../../types/portal';
import { ConfirmDialogState } from '../AdminUiHelpers';

interface Props {
  onToast: (type: 'success' | 'error' | 'info', text: string) => void;
  onConfirm: (dialog: ConfirmDialogState) => void;
}

const EMPTY_TICKER: TickerMarqueeConfig = {
  enabled: 'true',
  tag: '🔔 प्रवेश सूचना',
  text: '',
  speed: 'normal',
  theme: 'red',
  clickAction: 'admission',
};

export default function TickerTab({ onToast, onConfirm }: Props) {
  const { tickerMarquee, ready } = usePortalStore();
  const [form, setForm] = useState<TickerMarqueeConfig>(EMPTY_TICKER);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (tickerMarquee) {
      setForm({ ...EMPTY_TICKER, ...tickerMarquee });
    } else if (ready.tickerMarquee) {
      setForm(EMPTY_TICKER);
    }
  }, [tickerMarquee, ready.tickerMarquee]);

  const isLive = Boolean(
    tickerMarquee && tickerMarquee.enabled !== 'false' && tickerMarquee.text?.trim()
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim()) {
      onToast('error', 'कृपया सूचना पट्टी का स्क्रॉलिंग टेक्स्ट अवश्य लिखें।');
      return;
    }

    setSaving(true);
    try {
      const payload: TickerMarqueeConfig = {
        ...form,
        tag: form.tag.trim() || '🔔 प्रवेश सूचना',
        text: form.text.trim(),
        updatedAt: new Date().toISOString(),
      };
      const ok = await saveSettingToCloud('ticker_marquee', payload);
      if (ok) {
        onToast('success', '✅ सूचना पट्टी (Ticker) Firebase में लाइव अपडेट हो गई!');
      } else {
        onToast('info', '⚠️ ऑफलाइन कैश में सुरक्षित — नेटवर्क मिलते ही सिंक होगी।');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    onConfirm({
      title: 'सूचना पट्टी Firebase से हटाएं?',
      message:
        'हटाने के बाद होम स्क्रीन के ऊपर चलने वाली सूचना पट्टी सभी यूज़र्स के फोन से तुरंत गायब हो जाएगी।',
      confirmLabel: '🗑️ हाँ, हटाएं',
      danger: true,
      onConfirm: async () => {
        const ok = await deleteSettingFromCloud('ticker_marquee');
        setForm(EMPTY_TICKER);
        if (ok) {
          onToast('success', '🗑️ सूचना पट्टी Firebase से हटा दी गई है।');
        } else {
          onToast('error', 'हटाने में त्रुटि आई।');
        }
      },
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSettingFromCloud('ticker_marquee');
    setRefreshing(false);
    onToast('info', '🔄 Firebase से सूचना पट्टी रीफ्रेश हो गई।');
  };

  const previewTheme = TICKER_THEMES[form.theme] || TICKER_THEMES.red;

  return (
    <div className="space-y-5">
      {/* Live Status Card */}
      <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <h3 className="text-sm font-extrabold text-slate-900 m-0">
              Firebase लाइव सूचना पट्टी (Ticker Status)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              रीफ्रेश
            </button>
            {tickerMarquee && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Firebase से हटाएं
              </button>
            )}
          </div>
        </div>

        {!ready.tickerMarquee ? (
          <div className="text-sm text-slate-500">☁️ Firebase से लाइव स्थिति लोड हो रही है...</div>
        ) : !isLive ? (
          <div className="text-sm text-slate-600">
            ⚪ वर्तमान में कोई सूचना पट्टी सक्रिय नहीं है। होम स्क्रीन पर पट्टी छिपी हुई है।
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                🟢 लाइव सक्रिय
              </span>
              <span>
                <strong>टैग:</strong> {tickerMarquee?.tag}
              </span>
              <span>
                <strong>स्पीड:</strong> {tickerMarquee?.speed}
              </span>
              {tickerMarquee?.updatedAt && (
                <span>
                  <strong>अपडेट:</strong>{' '}
                  {new Date(tickerMarquee.updatedAt).toLocaleString('hi-IN')}
                </span>
              )}
            </div>
            <div className="text-xs font-semibold text-rose-900 bg-rose-50 border border-rose-200 rounded-lg p-2.5">
              {tickerMarquee?.text}
            </div>
          </div>
        )}
      </div>

      {/* Live Visual Preview */}
      {form.text.trim() && (
        <div
          className="rounded-xl overflow-hidden flex items-center text-white text-xs sm:text-sm font-bold shadow-sm"
          style={{ background: previewTheme.bar }}
        >
          <span
            className="px-3 py-2.5 shrink-0 font-extrabold whitespace-nowrap"
            style={{ background: previewTheme.tag }}
          >
            {form.tag || '🔔 प्रवेश सूचना'}
          </span>
          <div className="px-3 py-2.5 truncate">{form.text}</div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Megaphone className="w-5 h-5 text-rose-600" />
          <h4 className="text-base font-extrabold text-slate-900 m-0">
            प्रवेश सूचना पट्टी (Scrolling Ticker) सेटिंग्स
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              पट्टी स्थिति (Status)
            </label>
            <select
              value={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.value as 'true' | 'false' })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="true">🟢 सक्रिय (होम स्क्रीन पर दिखाएं)</option>
              <option value="false">🔴 बंद (छुपा कर रखें)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              टैग हेडिंग (Left Badge Tag)
            </label>
            <input
              type="text"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              placeholder="🔔 प्रवेश सूचना"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            स्क्रॉलिंग सूचना संदेश (Ticker Text) *
          </label>
          <textarea
            rows={3}
            required
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="उदा: ★ सत्र 2026-27 में नर्सरी से 12वीं तक प्रवेश प्रारंभ ★ सीमित सीटें उपलब्ध ★ हेल्पलाइन: 9200178385 ★"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">रंग थीम (Theme)</label>
            <select
              value={form.theme}
              onChange={(e) =>
                setForm({ ...form, theme: e.target.value as TickerMarqueeConfig['theme'] })
              }
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {Object.entries(TICKER_THEMES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              चलने की गति (Speed)
            </label>
            <select
              value={form.speed}
              onChange={(e) =>
                setForm({ ...form, speed: e.target.value as TickerMarqueeConfig['speed'] })
              }
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="slow">🐢 धीमी (Slow)</option>
              <option value="normal">⚡ सामान्य (Normal)</option>
              <option value="fast">🚀 तेज (Fast)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              क्लिक करने पर क्या खुले
            </label>
            <select
              value={form.clickAction}
              onChange={(e) =>
                setForm({
                  ...form,
                  clickAction: e.target.value as TickerMarqueeConfig['clickAction'],
                })
              }
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="admission">📝 ऑनलाइन प्रवेश फॉर्म</option>
              <option value="notice">🔔 सूचना पॉपअप खोलें</option>
              <option value="whatsapp">💬 व्हाट्सएप ग्रुप्स</option>
              <option value="student">🎓 छात्र परिणाम पोर्टल</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-extrabold rounded-xl cursor-pointer shadow-sm transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'सेव हो रहा है...' : '💾 सूचना पट्टी Firebase में लाइव सेव करें'}
        </button>
      </form>
    </div>
  );
}
