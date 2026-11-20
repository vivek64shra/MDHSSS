import React, { useCallback, useEffect, useState } from 'react';
import { Database, Eye, Flame, RefreshCw, Trash2 } from 'lucide-react';
import {
  deleteSettingFromCloud,
  FirebaseOverviewReport,
  getFirebaseOverview,
  usePortalStore,
} from '../../../firebase';
import { ConfirmDialogState } from '../AdminUiHelpers';

interface Props {
  onToast: (type: 'success' | 'error' | 'info', text: string) => void;
  onConfirm: (dialog: ConfirmDialogState) => void;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const SETTING_META: Record<string, { label: string; color: string }> = {
  popup_notification: { label: '📢 सूचना पॉपअप (popup_notification)', color: 'text-sky-700' },
  ticker_marquee: { label: '🚩 प्रवेश सूचना पट्टी (ticker_marquee)', color: 'text-rose-700' },
  whatsapp_groups: { label: '💬 व्हाट्सएप ग्रुप्स (whatsapp_groups)', color: 'text-emerald-700' },
  gallery_images: { label: '📸 कस्टम गैलरी (gallery_images)', color: 'text-violet-700' },
  result_link_config: { label: '🏆 रिजल्ट लिंक (result_link_config)', color: 'text-amber-700' },
};

export default function FirebaseExplorerTab({ onToast, onConfirm }: Props) {
  const { connectionStatus, lastSyncAt, lastError } = usePortalStore();
  const [report, setReport] = useState<FirebaseOverviewReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [inspectedKey, setInspectedKey] = useState<string>('popup_notification');

  const loadOverview = useCallback(async () => {
    setLoading(true);
    const data = await getFirebaseOverview();
    setReport(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handleDeleteSetting = (key: string) => {
    onConfirm({
      title: `डॉक्यूमेंट 'settings/${key}' हटाएं?`,
      message: `चेतावनी: इससे Firebase Firestore का settings/${key} डॉक्यूमेंट स्थायी रूप से डिलीट हो जाएगा।`,
      confirmLabel: '🗑️ स्थायी रूप से हटाएं',
      danger: true,
      onConfirm: async () => {
        await deleteSettingFromCloud(key);
        onToast('success', `🗑️ settings/${key} Firebase से हटा दिया गया।`);
        await loadOverview();
      },
    });
  };

  const inspectedPayload =
    inspectedKey === 'admissions'
      ? report?.collections.admissions.items
      : inspectedKey === 'feedbacks'
      ? report?.collections.feedbacks.items
      : report?.settings[inspectedKey]?.data;

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
            <Flame className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <h3 className="text-base font-extrabold m-0">
              Firebase Firestore लाइव डेटाबेस व स्टोरेज एक्सप्लोरर
            </h3>
            <p className="text-xs text-orange-100 m-0 mt-0.5">
              प्रोजेक्ट: {report?.projectId || 'argon-alchemy-hthv3'} • स्थिति:{' '}
              {connectionStatus === 'online'
                ? '🟢 ऑनलाइन (Live onSnapshot)'
                : connectionStatus === 'offline'
                ? '🟠 ऑफलाइन कैश मोड'
                : '🔄 कनेक्शन जांच...'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={loadOverview}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-orange-700 hover:bg-orange-50 text-xs font-extrabold rounded-lg cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          लाइव रीफ्रेश
        </button>
      </div>

      {lastError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-800">
          ⚠️ अंतिम Firestore सूचना: {lastError}
        </div>
      )}

      {/* Storage Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500">कुल अनुमानित स्टोरेज</div>
          <div className="text-xl font-extrabold text-orange-600 mt-1">
            {loading ? '...' : formatBytes(report?.storageEstimateBytes || 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Firestore लाइव उपयोग</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500">प्रवेश कलेक्शन (admissions)</div>
          <div className="text-xl font-extrabold text-sky-700 mt-1">
            {loading ? '...' : report?.collections.admissions.count ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {formatBytes(report?.collections.admissions.sizeBytes || 0)}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500">सुझाव कलेक्शन (feedbacks)</div>
          <div className="text-xl font-extrabold text-emerald-700 mt-1">
            {loading ? '...' : report?.collections.feedbacks.count ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {formatBytes(report?.collections.feedbacks.sizeBytes || 0)}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500">अंतिम लाइव सिंक</div>
          <div className="text-xs font-extrabold text-slate-800 mt-1.5">
            {lastSyncAt ? new Date(lastSyncAt).toLocaleTimeString('hi-IN') : 'सक्रिय'}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            onSnapshot + localStorage
          </div>
        </div>
      </div>

      {/* Settings Documents Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Database className="w-4 h-4 text-orange-600" />
          <h4 className="text-sm font-extrabold text-slate-900 m-0">
            settings/* डॉक्यूमेंट्स (क्लाउड कॉन्फ़िगरेशन)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(SETTING_META).map(([key, meta]) => {
            const docInfo = report?.settings[key];
            const exists = Boolean(docInfo?.exists);
            return (
              <div
                key={key}
                className={`rounded-xl border p-3.5 flex flex-col justify-between gap-2.5 ${
                  exists ? 'border-slate-200 bg-white' : 'border-dashed border-slate-300 bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-extrabold ${meta.color}`}>{meta.label}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        exists ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {exists ? 'मौजूद' : 'खाली'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    आकार: {formatBytes(docInfo?.sizeBytes || 0)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectedKey(key)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> डेटा देखें
                  </button>
                  {exists && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSetting(key)}
                      className="inline-flex items-center justify-center p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg cursor-pointer"
                      title="Firebase से हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live JSON Inspector */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-extrabold text-amber-300">
            🔍 लाइव Firestore डॉक्यूमेंट इंस्पेक्टर (Raw JSON)
          </div>
          <select
            value={inspectedKey}
            onChange={(e) => setInspectedKey(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none"
          >
            <option value="popup_notification">settings/popup_notification</option>
            <option value="ticker_marquee">settings/ticker_marquee</option>
            <option value="whatsapp_groups">settings/whatsapp_groups</option>
            <option value="gallery_images">settings/gallery_images</option>
            <option value="result_link_config">settings/result_link_config</option>
            <option value="admissions">collection/admissions</option>
            <option value="feedbacks">collection/feedbacks</option>
          </select>
        </div>

        <pre className="text-[11px] leading-relaxed font-mono bg-slate-950/70 p-3 rounded-lg overflow-x-auto max-h-72 text-emerald-300 m-0">
          {inspectedPayload
            ? JSON.stringify(inspectedPayload, null, 2)
            : '// यह डॉक्यूमेंट अभी Firebase में खाली (null) है।'}
        </pre>
      </div>
    </div>
  );
}
