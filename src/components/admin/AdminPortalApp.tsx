import React, { useCallback, useEffect, useState } from 'react';
import {
  Award,
  Bell,
  Cloud,
  Database,
  ExternalLink,
  Flame,
  Image as ImageIcon,
  Lock,
  LogOut,
  Megaphone,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  Shield,
  Smartphone,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { refreshAllFromCloud, usePortalStore } from '../../firebase';
import { AdminSession, isValidActiveNotice, PortalRole } from '../../types/portal';
import { ConfirmDialogState, ConfirmModal, ToastMessage, ToastStack } from './AdminUiHelpers';
import NoticeTab from './tabs/NoticeTab';
import TickerTab from './tabs/TickerTab';
import WhatsAppTab from './tabs/WhatsAppTab';
import AdmissionsTab from './tabs/AdmissionsTab';
import FeedbacksTab from './tabs/FeedbacksTab';
import GalleryTab from './tabs/GalleryTab';
import ResultLinkTab from './tabs/ResultLinkTab';
import FirebaseExplorerTab from './tabs/FirebaseExplorerTab';
import StaffPortalView from './StaffPortalView';

type AdminTabId =
  | 'admissions'
  | 'feedbacks'
  | 'notice'
  | 'ticker'
  | 'gallery'
  | 'result'
  | 'whatsapp'
  | 'firebase';

const SESSION_KEY = 'mdhss_admin_session';
const VALID_ADMIN_USER = 'Vivek@';
const VALID_ADMIN_PASS = 'Vivek64@';
const LEGACY_PINS = ['920017', '322517'];
const STAFF_ACCESS_CODES = ['322517', 'MDHSSS', 'mdhsss'];

function readSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AdminSession>;
    if (!parsed || (!parsed.role && !parsed.name)) return null;
    return {
      role: parsed.role === 'staff' ? 'staff' : 'admin',
      name: parsed.name || 'निर्मल कुमार द्विवेदी / मुरलीधर शर्मा (रन्नू सर)',
      time: parsed.time || Date.now(),
    };
  } catch {
    return null;
  }
}

export default function AdminPortalApp() {
  const store = usePortalStore();
  const [session, setSession] = useState<AdminSession | null>(() => readSession());
  const [activeTab, setActiveTab] = useState<AdminTabId>('admissions');
  const [previewAsStaff, setPreviewAsStaff] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Role-based login form state
  const [loginRole, setLoginRole] = useState<PortalRole>('admin');
  const [adminUserId, setAdminUserId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Toast & Confirm dialog state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const pushToast = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev.slice(-3), { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const requestConfirm = useCallback((dialog: ConfirmDialogState) => {
    setConfirmDialog(dialog);
  }, []);

  const handleConfirmExecute = async () => {
    if (!confirmDialog) return;
    setConfirmBusy(true);
    try {
      await confirmDialog.onConfirm();
    } finally {
      setConfirmBusy(false);
      setConfirmDialog(null);
    }
  };

  // Sync with legacy #view-teacher login form via custom event
  useEffect(() => {
    const syncFromStorage = () => {
      setSession(readSession());
      setPreviewAsStaff(false);
    };
    window.addEventListener('mdhss_admin_auth_changed', syncFromStorage);
    window.addEventListener('storage', syncFromStorage);
    return () => {
      window.removeEventListener('mdhss_admin_auth_changed', syncFromStorage);
      window.removeEventListener('storage', syncFromStorage);
    };
  }, []);

  const navigateHome = () => {
    if (typeof (window as any).navigateToPage === 'function') {
      (window as any).navigateToPage('home');
    } else {
      window.location.hash = '#home';
    }
  };

  const handleRoleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (loginRole === 'admin') {
      const uid = adminUserId.trim();
      const pwd = adminPassword.trim();
      const valid =
        (uid.toLowerCase() === VALID_ADMIN_USER.toLowerCase() && pwd === VALID_ADMIN_PASS) ||
        (uid === VALID_ADMIN_PASS && pwd.toLowerCase() === VALID_ADMIN_USER.toLowerCase()) ||
        LEGACY_PINS.includes(pwd) ||
        LEGACY_PINS.includes(uid);

      if (!valid) {
        setLoginError('गलत यूज़र आईडी या पासवर्ड! कृपया अधिकृत एडमिन विवरण दर्ज करें।');
        return;
      }

      const newSession: AdminSession = {
        role: 'admin',
        name: 'निर्मल कुमार द्विवेदी / मुरलीधर शर्मा (रन्नू सर)',
        time: Date.now(),
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      setSession(newSession);
      setAdminUserId('');
      setAdminPassword('');
      window.dispatchEvent(new Event('mdhss_admin_auth_changed'));
      pushToast('success', '✅ एडमिन डैशबोर्ड खुल गया! Firebase रियल-टाइम सिंक सक्रिय है।');
      refreshAllFromCloud();
    } else {
      const code = staffCode.trim();
      const name = staffName.trim() || 'विद्यालय शिक्षक / स्टाफ';
      if (!STAFF_ACCESS_CODES.includes(code)) {
        setLoginError('अमान्य विद्यालय स्टाफ कोड! कृपया सही कोड (322517 या MDHSSS) दर्ज करें।');
        return;
      }
      const newSession: AdminSession = {
        role: 'staff',
        name,
        time: Date.now(),
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      setSession(newSession);
      setStaffCode('');
      window.dispatchEvent(new Event('mdhss_admin_auth_changed'));
      pushToast('success', `✅ स्वागत है ${name}! स्टाफ लाइव पोर्टल सक्रिय है।`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
    setPreviewAsStaff(false);
    window.dispatchEvent(new Event('mdhss_admin_auth_changed'));
    pushToast('info', '🔒 आप सफलतापूर्वक लॉगआउट हो गए हैं।');
  };

  const handleManualSync = async () => {
    setSyncing(true);
    const ok = await refreshAllFromCloud();
    setSyncing(false);
    if (ok) {
      pushToast('success', '✅ क्लाउड सिंक सफल — सभी डिवाइसेज का डेटा लाइव अपडेटेड!');
    } else {
      pushToast('info', '⚠️ ऑफलाइन मोड: स्थानीय कैश डेटा दिखाया जा रहा है।');
    }
  };

  // ==========================================
  // 1. CLASSIC ADMIN / STAFF LOGIN CARD (Inside .glass-card.page-card-body)
  // ==========================================
  if (!session) {
    return (
      <div className="glass-card page-card-body">
        <div className="max-w-lg mx-auto py-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <div className="text-xs font-extrabold text-violet-700 tracking-wide mb-1">
              विद्यालय प्रशासनिक नियंत्रण • MDHSSS सेमरिया (रीवा)
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 m-0">
              प्रशासक लॉगिन (Admin Portal Login)
            </h2>
            <p className="text-sm text-slate-600 mt-1.5 m-0">
              प्रवेश आवेदन, छात्र-पालक फीडबैक, सूचना पॉपअप एवं विद्यालय डिजिटल रिकॉर्ड्स हेतु लॉगिन करें।
            </p>
          </div>

          <div className="bg-white border-2 border-violet-200 rounded-2xl p-6 shadow-md space-y-5">
            {/* Role Toggle */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setLoginRole('admin');
                  setLoginError(null);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  loginRole === 'admin'
                    ? 'bg-gradient-to-r from-violet-700 to-indigo-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                एडमिन पैनल (Admin)
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole('staff');
                  setLoginError(null);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  loginRole === 'staff'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                स्टाफ पोर्टल (Staff)
              </button>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs font-bold text-center">
                ⚠️ {loginError}
              </div>
            )}

            <form onSubmit={handleRoleLogin} className="space-y-4">
              {loginRole === 'admin' ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      प्रशासक यूज़र आईडी (Admin User ID) *
                    </label>
                    <input
                      type="text"
                      value={adminUserId}
                      onChange={(e) => setAdminUserId(e.target.value)}
                      placeholder="यूज़र आईडी दर्ज करें"
                      required
                      autoComplete="username"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      प्रशासक पासवर्ड (Admin Password) *
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="पासवर्ड दर्ज करें"
                      required
                      autoComplete="current-password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 hover:opacity-95 text-white text-sm font-extrabold shadow-md cursor-pointer transition-opacity"
                  >
                    🔓 एडमिन डैशबोर्ड खोलें (Login to Admin Panel)
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      शिक्षक / स्टाफ का नाम *
                    </label>
                    <input
                      type="text"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      placeholder="उदा. श्री मुरलीधर शर्मा"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      विद्यालय स्टाफ कोड (School Code) *
                    </label>
                    <input
                      type="password"
                      value={staffCode}
                      onChange={(e) => setStaffCode(e.target.value)}
                      placeholder="विद्यालय कोड दर्ज करें"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold shadow-md cursor-pointer transition-colors"
                  >
                    📱 स्टाफ लाइव पोर्टल खोलें
                  </button>
                  <a
                    href="https://mdhssslogin.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-extrabold flex items-center justify-center gap-1.5 hover:bg-sky-100 transition-colors"
                  >
                    👨‍🏫 अधिकृत शिक्षक लॉगिन (mdhssslogin.netlify.app)
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </>
              )}
            </form>

            <div className="pt-3 border-t border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-500 font-semibold">
              <span>🔒 केवल अधिकृत विद्यालय प्रशासन हेतु</span>
            </div>
          </div>
        </div>

        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // ==========================================
  // 2. FAST MOBILE-FIRST STAFF PORTAL VIEW
  // ==========================================
  if (session.role === 'staff' || previewAsStaff) {
    return (
      <div className="glass-card page-card-body">
        <StaffPortalView
          session={session}
          onToast={pushToast}
          onLogout={handleLogout}
          onSwitchToAdmin={session.role === 'admin' ? () => setPreviewAsStaff(false) : undefined}
          onGoHome={navigateHome}
        />
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // ==========================================
  // 3. CLASSIC FAMILIAR ADMIN DASHBOARD INTERFACE (Powered by Real-Time React + Firestore)
  // ==========================================
  const noticeActive = isValidActiveNotice(store.popupNotice);
  const tickerActive = Boolean(
    store.tickerMarquee &&
      store.tickerMarquee.enabled !== 'false' &&
      store.tickerMarquee.text?.trim()
  );

  const tabs: {
    id: AdminTabId;
    label: string;
    icon: React.ReactNode;
    activeClass: string;
    inactiveClass: string;
    count?: number | string;
  }[] = [
    {
      id: 'admissions',
      label: 'प्रवेश आवेदन',
      icon: <UserPlus className="w-4 h-4" />,
      activeClass: 'bg-gradient-to-r from-sky-600 to-blue-700 text-white border-sky-700 shadow-md',
      inactiveClass: 'bg-white text-slate-800 border-sky-200 hover:bg-sky-50',
      count: store.admissions.length,
    },
    {
      id: 'feedbacks',
      label: 'फीडबैक',
      icon: <MessageSquare className="w-4 h-4" />,
      activeClass: 'bg-gradient-to-r from-violet-600 to-indigo-700 text-white border-violet-700 shadow-md',
      inactiveClass: 'bg-white text-slate-800 border-violet-200 hover:bg-violet-50',
      count: store.feedbacks.length,
    },
    {
      id: 'notice',
      label: 'सूचना पॉपअप (Notification)',
      icon: <Bell className="w-4 h-4" />,
      activeClass: 'bg-gradient-to-r from-sky-600 to-cyan-700 text-white border-sky-700 shadow-md',
      inactiveClass: 'bg-white text-sky-900 border-sky-300 hover:bg-sky-50',
      count: noticeActive ? 'LIVE' : undefined,
    },
    {
      id: 'ticker',
      label: 'प्रवेश पट्टी (Ticker)',
      icon: <Megaphone className="w-4 h-4" />,
      activeClass: 'bg-gradient-to-r from-rose-600 to-red-700 text-white border-rose-700 shadow-md',
      inactiveClass: 'bg-white text-rose-900 border-rose-300 hover:bg-rose-50',
      count: tickerActive ? 'LIVE' : undefined,
    },
    {
      id: 'gallery',
      label: 'फोटो गैलरी (Gallery)',
      icon: <ImageIcon className="w-4 h-4" />,
      activeClass: 'bg-gradient-to-r from-purple-600 to-violet-700 text-white border-purple-700 shadow-md',
      inactiveClass: 'bg-white text-purple-900 border-purple-300 hover:bg-purple-50',
      count: store.galleryImages.length,
    },
    {
      id: 'result',
      label: 'रिजल्ट लिंक (Result Link)',
      icon: <Award className="w-4 h-4" />,
      activeClass: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-700 shadow-md',
      inactiveClass: 'bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-50',
    },
    {
      id: 'whatsapp',
      label: 'व्हाट्सएप ग्रुप्स (WhatsApp)',
      icon: <MessageCircle className="w-4 h-4" />,
      activeClass: 'bg-gradient-to-r from-green-600 to-emerald-700 text-white border-green-700 shadow-md',
      inactiveClass: 'bg-white text-green-900 border-green-300 hover:bg-green-50',
      count: store.whatsappGroups.length,
    },
    {
      id: 'firebase',
      label: 'Firebase डेटाबेस व स्टोरेज',
      icon: <Flame className="w-4 h-4" />,
      activeClass: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-600 shadow-md',
      inactiveClass: 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100',
    },
  ];

  return (
    <div className="glass-card page-card-body">
      <div className="space-y-6">
        {/* Classic Royal Purple Dashboard Header Bar */}
        <div className="bg-gradient-to-r from-[#3b0764] via-[#5b21b6] to-[#4338ca] text-white p-5 sm:p-6 rounded-2xl shadow-lg flex flex-wrap justify-between items-center gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-1.5 text-xs">
              <span className="bg-yellow-300 text-amber-950 px-2.5 py-0.5 rounded-md font-extrabold">
                🛡️ एडमिन मोड सक्रिय (LIVE DATABASE)
              </span>
              <span className="text-purple-100 font-semibold">
                माँ दुर्गा उच्चतर माध्यमिक विद्यालय, सेमरिया (रीवा)
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white m-0 leading-snug">
              प्रशासक: {session.name}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleManualSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-extrabold shadow-md cursor-pointer transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'सिंक हो रहा है...' : 'क्लाउड डेटा रीफ्रेश (Sync Now)'}
            </button>

            <button
              type="button"
              onClick={() => setPreviewAsStaff(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              स्टाफ व्यू
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-rose-600 border border-white/30 text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              लॉगआउट (Logout)
            </button>
          </div>
        </div>

        {/* Classic 3-Column KPI Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <button
            type="button"
            onClick={() => setActiveTab('admissions')}
            className="text-left bg-blue-50 border border-blue-200 hover:border-blue-400 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div>
              <div className="text-xs font-bold text-blue-800">कुल प्रवेश आवेदन</div>
              <div className="text-2xl font-black text-blue-950 mt-0.5 tabular-nums">
                {store.admissions.length}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('feedbacks')}
            className="text-left bg-emerald-50 border border-emerald-200 hover:border-emerald-400 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div>
              <div className="text-xs font-bold text-emerald-800">अभिभावक फीडबैक</div>
              <div className="text-2xl font-black text-emerald-950 mt-0.5 tabular-nums">
                {store.feedbacks.length}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('firebase')}
            className="text-left bg-purple-50 border border-purple-200 hover:border-purple-400 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div>
              <div className="text-xs font-bold text-purple-800">डेटाबेस व स्टोरेज</div>
              <div className="text-base font-extrabold text-purple-950 mt-1 flex items-center gap-1.5">
                <span>डेटा एक्सप्लोरर खोलें</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Classic Horizontal Action Navigation Tabs */}
        <div className="flex flex-wrap gap-2.5 pb-4 border-b-2 border-slate-200">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-extrabold cursor-pointer transition-all whitespace-nowrap ${
                  isActive ? tab.activeClass : tab.inactiveClass
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[11px] font-black px-1.5 py-0.5 rounded-md tabular-nums ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {store.lastError && (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2">
            <Database className="w-4 h-4 shrink-0 text-amber-700" />
            <span>क्लाउड सूचना: {store.lastError}</span>
          </div>
        )}

        {/* Active Tab Workspace */}
        <div>
          {activeTab === 'admissions' && (
            <AdmissionsTab onToast={pushToast} onConfirm={requestConfirm} />
          )}
          {activeTab === 'feedbacks' && (
            <FeedbacksTab onToast={pushToast} onConfirm={requestConfirm} />
          )}
          {activeTab === 'notice' && <NoticeTab onToast={pushToast} onConfirm={requestConfirm} />}
          {activeTab === 'ticker' && <TickerTab onToast={pushToast} onConfirm={requestConfirm} />}
          {activeTab === 'gallery' && <GalleryTab onToast={pushToast} onConfirm={requestConfirm} />}
          {activeTab === 'result' && <ResultLinkTab onToast={pushToast} />}
          {activeTab === 'whatsapp' && (
            <WhatsAppTab onToast={pushToast} onConfirm={requestConfirm} />
          )}
          {activeTab === 'firebase' && (
            <FirebaseExplorerTab onToast={pushToast} onConfirm={requestConfirm} />
          )}
        </div>
      </div>

      {/* Global In-App Toasts & Confirmation Modal */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <ConfirmModal
        dialog={confirmDialog}
        busy={confirmBusy}
        onCancel={() => !confirmBusy && setConfirmDialog(null)}
        onConfirm={handleConfirmExecute}
      />
    </div>
  );
}
