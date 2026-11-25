import React, { useEffect, useState } from 'react';
import { Bell, Eye, Save, Trash2, RefreshCw } from 'lucide-react';
import {
  deleteSettingFromCloud,
  fetchSettingFromCloud,
  saveSettingToCloud,
  usePortalStore,
} from '../../../firebase';
import { isValidActiveNotice, PopupNoticeConfig } from '../../../types/portal';
import { previewNoticeInPublicModal } from '../../../services/publicSyncBridge';
import { ConfirmDialogState } from '../AdminUiHelpers';

interface Props {
  onToast: (type: 'success' | 'error' | 'info', text: string) => void;
  onConfirm: (dialog: ConfirmDialogState) => void;
}

const EMPTY_NOTICE: PopupNoticeConfig = {
  enabled: 'true',
  badge: '🔔 आवश्यक सूचना',
  title: '',
  body: '',
  highlights: '',
  helpline: '',
  btnText: '',
  btnAction: 'admission',
  customUrl: '',
};

export default function NoticeTab({ onToast, onConfirm }: Props) {
  const { popupNotice, ready } = usePortalStore();
  const [form, setForm] = useState<PopupNoticeConfig>(EMPTY_NOTICE);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Sync live Firestore snapshot into form whenever notice changes remotely
  useEffect(() => {
    if (popupNotice && isValidActiveNotice(popupNotice)) {
      setForm({
        ...EMPTY_NOTICE,
        ...popupNotice,
      });
    } else if (ready.popupNotice && !popupNotice) {
      setForm(EMPTY_NOTICE);
    }
  }, [popupNotice, ready.popupNotice]);

  const isLive = isValidActiveNotice(popupNotice);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      onToast('error', 'कृपया मुख्य शीर्षक (Notice Title) अवश्य दर्ज करें।');
      return;
    }

    setSaving(true);
    try {
      const payload: PopupNoticeConfig = {
        ...form,
        badge: form.badge.trim() || '🔔 आवश्यक सूचना',
        title: form.title.trim(),
        body: form.body.trim(),
        highlights: form.highlights.trim(),
        helpline: form.helpline.trim(),
        btnText: form.btnText.trim(),
        customUrl: form.customUrl.trim(),
        isUpdated: true,
        updatedAt: new Date().toISOString(),
      };

      // Clear local dismissal so newly published notice immediately pops up on devices
      localStorage.removeItem('mdhss_notice_last_seen_ver');
      sessionStorage.removeItem('mdhss_notice_dismissed_' + payload.updatedAt);

      const ok = await saveSettingToCloud('popup_notification', payload);
      if (ok) {
        onToast('success', '✅ सूचना Firebase में सुरक्षित हो गई — सभी फोन पर तुरंत लाइव अपडेटेड!');
      } else {
        onToast('info', '⚠️ ऑफलाइन मोड: सूचना स्थानीय कैश में सुरक्षित है, इंटरनेट मिलते ही सिंक होगी।');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    onConfirm({
      title: 'सूचना स्थायी रूप से हटाएं?',
      message:
        'क्या आप निश्चित हैं कि आप Firebase Firestore से इस सूचना पॉपअप को हटाना चाहते हैं?\n\nहटाने के बाद किसी भी यूज़र के फोन पर पॉपअप नहीं खुलेगा।',
      confirmLabel: '🗑️ हाँ, Firebase से हटाएं',
      danger: true,
      onConfirm: async () => {
        const ok = await deleteSettingFromCloud('popup_notification');
        setForm(EMPTY_NOTICE);
        if (ok) {
          onToast('success', '🗑️ सूचना Firebase से सफलतापूर्वक हटा दी गई है।');
        } else {
          onToast('error', 'हटाने में समस्या आई, कृपया पुनः प्रयास करें।');
        }
      },
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSettingFromCloud('popup_notification');
    setRefreshing(false);
    onToast('info', '🔄 Firebase से नवीनतम सूचना स्थिति रीफ्रेश हो गई।');
  };

  const handlePreview = () => {
    previewNoticeInPublicModal({
      ...form,
      enabled: 'true',
      title: form.title.trim() || 'माँ दुर्गा उच्चतर माध्यमिक विद्यालय सेमरिया',
    });
  };

  return (
    <div className="space-y-5">
      {/* Live Firestore Status Card */}
      <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <h3 className="text-sm font-extrabold text-slate-900 m-0">
              सक्रिय सूचना पॉपअप स्थिति
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              रीफ्रेश
            </button>
            {popupNotice && (
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

        {!ready.popupNotice ? (
          <div className="text-sm text-slate-500 py-2">☁️ Firebase से लाइव स्थिति लोड हो रही है...</div>
        ) : !isLive ? (
          <div className="flex items-start gap-2.5 text-slate-600">
            <span className="text-lg">⚪</span>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Firebase में कोई सूचना सक्रिय नहीं है (खाली है)
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                वेबसाइट पर विजिटर्स को कोई पॉपअप नहीं दिखेगा। नीचे दिए फॉर्म से नई सूचना दर्ज कर सुरक्षित करें।
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="text-[11px] font-bold text-slate-500">शीर्षक (Title)</div>
                <div className="text-sm font-extrabold text-sky-700">{popupNotice.title}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500">स्थिति</div>
                <span className="inline-block mt-0.5 px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-100 text-emerald-800">
                  🟢 सक्रिय (Live Active)
                </span>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500">अंतिम अपडेट</div>
                <div className="text-xs font-semibold text-slate-700">
                  {popupNotice.updatedAt
                    ? new Date(popupNotice.updatedAt).toLocaleString('hi-IN')
                    : 'सक्रिय'}
                </div>
              </div>
            </div>
            {popupNotice.body && (
              <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2.5 whitespace-pre-line">
                <strong>विवरण:</strong> {popupNotice.body}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Editor Form */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Bell className="w-5 h-5 text-sky-600" />
          <h4 className="text-base font-extrabold text-slate-900 m-0">
            पॉपअप सूचना संपादित / प्रकाशित करें
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              प्रदर्शन स्थिति (Popup Status)
            </label>
            <select
              value={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.value as 'true' | 'false' })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="true">🟢 सक्रिय (वेबसाइट पर तुरंत दिखाएं)</option>
              <option value="false">🔴 बंद (अस्थायी रूप से छुपाएं)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              बैज / टैग (Badge Label)
            </label>
            <input
              type="text"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              placeholder="🔔 आवश्यक सूचना"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            मुख्य शीर्षक (Notice Title) *
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="उदा: सत्र 2026-27 हेतु प्रवेश एवं परीक्षा समय-सारणी सूचना"
            className="w-full px-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            विस्तृत संदेश (Body Description)
          </label>
          <textarea
            rows={4}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="अभिभावकों व विद्यार्थियों के लिए विस्तृत सूचना यहाँ लिखें..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              विशेष हाइलाइट पट्टी (Green Highlights Box)
            </label>
            <input
              type="text"
              value={form.highlights}
              onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              placeholder="उदा: ✨ अंतिम तिथि: 30 अप्रैल • सीमित सीटें उपलब्ध"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              हेल्पलाइन / समय नोट (Helpline Footer)
            </label>
            <input
              type="text"
              value={form.helpline}
              onChange={(e) => setForm({ ...form, helpline: e.target.value })}
              placeholder="📞 संपर्क: 9200178385 • समय: 9:30 AM - 4:00 PM"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              एक्शन बटन टेक्स्ट (Optional CTA Button)
            </label>
            <input
              type="text"
              value={form.btnText}
              onChange={(e) => setForm({ ...form, btnText: e.target.value })}
              placeholder="उदा: ✍️ ऑनलाइन प्रवेश आवेदन करें →"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              बटन क्लिक पर क्या खुले (Button Action)
            </label>
            <select
              value={form.btnAction}
              onChange={(e) =>
                setForm({ ...form, btnAction: e.target.value as PopupNoticeConfig['btnAction'] })
              }
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="admission">📝 ऑनलाइन प्रवेश फॉर्म (Admission)</option>
              <option value="whatsapp">💬 व्हाट्सएप ग्रुप्स (WhatsApp)</option>
              <option value="student">🎓 छात्र परिणाम पोर्टल (Result)</option>
              <option value="about">ℹ️ विद्यालय परिचय (About)</option>
              <option value="facilities">🚌 विद्यालय सुविधाएं (Facilities)</option>
              <option value="feedback">⭐ सुझाव / प्रतिक्रिया (Feedback)</option>
              <option value="custom">🔗 कस्टम बाहरी लिंक (Custom URL)</option>
            </select>
          </div>
        </div>

        {form.btnAction === 'custom' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              कस्टम लिंक URL (https://...)
            </label>
            <input
              type="url"
              value={form.customUrl}
              onChange={(e) => setForm({ ...form, customUrl: e.target.value })}
              placeholder="https://mdhsssresult.netlify.app/"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-extrabold rounded-xl cursor-pointer shadow-sm transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'सेव हो रहा है...' : '💾 Firebase में लाइव पब्लिश करें'}
          </button>

          <button
            type="button"
            onClick={handlePreview}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold rounded-xl cursor-pointer transition-colors"
          >
            <Eye className="w-4 h-4" />
            प्रीव्यू देखें
          </button>
        </div>
      </form>
    </div>
  );
}
