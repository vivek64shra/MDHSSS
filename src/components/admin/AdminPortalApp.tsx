import React, { useCallback, useEffect, useState } from 'react';
import {
  Award,
  Bell,
  Database,
  ExternalLink,
  Home,
  Image as ImageIcon,
  Lock,
  LogOut,
  Megaphone,
  Menu,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  Shield,
  Smartphone,
  UserCheck,
  UserPlus,
  Wifi,
  WifiOff,
  X,
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
  | 'notice'
  | 'ticker'
  | 'whatsapp'
  | 'admissions'
  | 'feedbacks'
  | 'gallery'
  | 'result'
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
    if (!parsed || !parsed.role) return null;
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
  const [activeTab, setActiveTab] = useState<AdminTabId>('notice');
  const [drawerOpen, setDrawerOpen] = useState(false);
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
        (uid === VALID_ADMIN_USER && pwd === VALID_ADMIN_PASS) ||
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
      pushToast('success', '✅ एडमिन पोर्टल में स्वागत है! रियल-टाइम Firebase सिंक सक्रिय है।');
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
    setDrawerOpen(false);
    window.dispatchEvent(new Event('mdhss_admin_auth_changed'));
    pushToast('info', '🔒 आप सफलतापूर्वक लॉगआउट हो गए हैं।');
  };

  const handleManualSync = async () => {
    setSyncing(true);
    const ok = await refreshAllFromCloud();
    setSyncing(false);
    if (ok) {
      pushToast('success', '✅ Firebase Firestore से सभी डेटा तुरंत सिंक हो गया!');
    } else {
      pushToast('info', '⚠️ ऑफलाइन मोड: स्थानीय कैश डेटा दिखाया जा रहा है।');
    }
  };

  // ==========================================
  // 1. ROLE-BASED LOGIN SCREEN (When Logged Out)
  // ==========================================
  if (!session) {
    return (
      <div className="min-h-[82vh] bg-gradient-to-br from-slate-100 via-sky-50/50 to-slate-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0f2b5b] to-[#1e3a8a] text-white px-6 py-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-300" />
            </div>
            <h2 className="text-lg font-extrabold tracking-tight m-0">
              अधिकृत विद्यालय पोर्टल लॉगिन
            </h2>
            <p className="text-xs text-sky-100 mt-1 m-0">
              माँ दुर्गा हायर सेकेंडरी स्कूल, पपौंध • रियल-टाइम Firebase क्लाउड
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Role Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setLoginRole('admin');
                  setLoginError(null);
                }}
                className={`py-2.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  loginRole === 'admin'
                    ? 'bg-[#0f2b5b] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                एडमिन पैनल
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole('staff');
                  setLoginError(null);
                }}
                className={`py-2.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  loginRole === 'staff'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                स्टाफ पोर्टल
              </button>
            </div>

            {loginError && (
              <div className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                ⚠️ {loginError}
              </div>
            )}

            <form onSubmit={handleRoleLogin} className="space-y-3.5">
              {loginRole === 'admin' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      एडमिन यूज़र आईडी (User ID)
                    </label>
                    <input
                      type="text"
                      value={adminUserId}
                      onChange={(e) => setAdminUserId(e.target.value)}
                      placeholder="अपनी अधिकृत User ID दर्ज करें"
                      required
                      autoComplete="username"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2b5b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      पासवर्ड (Password)
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2b5b]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0f2b5b] to-[#1e40af] hover:opacity-95 text-white text-sm font-extrabold shadow-md cursor-pointer transition-opacity"
                  >
                    🔐 एडमिन डैशबोर्ड खोलें
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      शिक्षक / स्टाफ का नाम
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
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      विद्यालय स्टाफ कोड (School Code)
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
                    📱 फास्ट स्टाफ पोर्टल खोलें
                  </button>
                  <a
                    href="https://mdhssslogin.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold flex items-center justify-center gap-1.5 no-underline hover:bg-amber-100 transition-colors"
                  >
                    👨‍🏫 बाहरी Teacher Login पोर्टल (mdhssslogin.netlify.app)
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </>
              )}
            </form>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={navigateHome}
                className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-[#0f2b5b] cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                मुख्य वेबसाइट पर लौटें
              </button>
              <span
                className={`inline-flex items-center gap-1 font-bold ${
                  store.connectionStatus === 'online' ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {store.connectionStatus === 'online' ? (
                  <Wifi className="w-3.5 h-3.5" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5" />
                )}
                {store.connectionStatus === 'online' ? 'Firebase लाइव' : 'ऑफलाइन कैश'}
              </span>
            </div>
          </div>
        </div>

        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // ==========================================
  // 2. FAST MOBILE-FIRST STAFF PORTAL
  // ==========================================
  if (session.role === 'staff' || previewAsStaff) {
    return (
      <>
        <StaffPortalView
          session={session}
          onToast={pushToast}
          onLogout={handleLogout}
          onSwitchToAdmin={session.role === 'admin' ? () => setPreviewAsStaff(false) : undefined}
          onGoHome={navigateHome}
        />
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  // ==========================================
  // 3. ADMIN PANEL (Left Sidebar + Mobile Drawer)
  // ==========================================
  const noticeActive = isValidActiveNotice(store.popupNotice);
  const tickerActive = Boolean(
    store.tickerMarquee &&
      store.tickerMarquee.enabled !== 'false' &&
      store.tickerMarquee.text?.trim()
  );

  const navItems: {
    id: AdminTabId;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'notice',
      label: 'सूचना पॉपअप (Notification)',
      shortLabel: 'सूचना पॉपअप',
      icon: <Bell className="w-4 h-4" />,
      badge: noticeActive ? 'LIVE' : 'OFF',
      badgeColor: noticeActive
        ? 'bg-emerald-500/20 text-emerald-300'
        : 'bg-slate-700 text-slate-300',
    },
    {
      id: 'ticker',
      label: 'प्रवेश सूचना पट्टी (Ticker)',
      shortLabel: 'सूचना पट्टी',
      icon: <Megaphone className="w-4 h-4" />,
      badge: tickerActive ? 'LIVE' : 'OFF',
      badgeColor: tickerActive
        ? 'bg-emerald-500/20 text-emerald-300'
        : 'bg-slate-700 text-slate-300',
    },
    {
      id: 'whatsapp',
      label: 'व्हाट्सएप ग्रुप्स (WhatsApp)',
      shortLabel: 'व्हाट्सएप',
      icon: <MessageCircle className="w-4 h-4" />,
      badge: store.whatsappGroups.length,
      badgeColor: 'bg-sky-500/25 text-sky-200',
    },
    {
      id: 'admissions',
      label: 'ऑनलाइन प्रवेश आवेदन',
      shortLabel: 'प्रवेश आवेदन',
      icon: <UserPlus className="w-4 h-4" />,
      badge: store.admissions.length,
      badgeColor: 'bg-amber-500/25 text-amber-200',
    },
    {
      id: 'feedbacks',
      label: 'अभिभावक फीडबैक',
      shortLabel: 'फीडबैक',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: store.feedbacks.length,
      badgeColor: 'bg-violet-500/25 text-violet-200',
    },
    {
      id: 'gallery',
      label: 'फोटो गैलरी (≤10 KB)',
      shortLabel: 'फोटो गैलरी',
      icon: <ImageIcon className="w-4 h-4" />,
      badge: store.galleryImages.length,
      badgeColor: 'bg-pink-500/25 text-pink-200',
    },
    {
      id: 'result',
      label: 'छात्र लॉगिन / रिजल्ट लिंक',
      shortLabel: 'रिजल्ट लिंक',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: 'firebase',
      label: 'Firebase स्टोरेज एवं डेटाबेस',
      shortLabel: 'Firebase डेटा',
      icon: <Database className="w-4 h-4" />,
    },
  ];

  const currentNav = navItems.find((n) => n.id === activeTab) || navItems[0];

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#0b1f44] text-slate-100">
      {/* Brand Header */}
      <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-amber-300" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-white truncate">MDHSSS एडमिन</div>
            <div className="text-[11px] text-sky-200/80 truncate">Firebase रियल-टाइम पैनल</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="lg:hidden p-1.5 rounded-lg bg-white/10 text-white cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Live Sync Pill */}
      <div className="px-4 py-3 border-b border-white/10">
        <div
          className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
            store.connectionStatus === 'online'
              ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/25'
              : 'bg-amber-500/15 text-amber-200 border border-amber-400/25'
          }`}
        >
          <span className="flex items-center gap-1.5">
            {store.connectionStatus === 'online' ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            )}
            {store.connectionStatus === 'online' ? 'ऑनलाइन सिंक' : 'ऑफलाइन कैश'}
          </span>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={syncing}
            className="text-[11px] underline cursor-pointer hover:text-white disabled:opacity-50"
          >
            {syncing ? '...' : 'सिंक'}
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setDrawerOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left text-xs font-bold cursor-pointer transition-all ${
                active
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </span>
              {item.badge !== undefined && (
                <span
                  className={`shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    active ? 'bg-white/20 text-white' : item.badgeColor || 'bg-white/10 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Actions */}
      <div className="p-3 border-t border-white/10 space-y-1.5">
        <button
          type="button"
          onClick={() => {
            setPreviewAsStaff(true);
            setDrawerOpen(false);
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 text-xs font-bold cursor-pointer transition-colors"
        >
          <UserCheck className="w-4 h-4" />
          स्टाफ पोर्टल व्यू खोलें
        </button>
        <button
          type="button"
          onClick={navigateHome}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-100 text-xs font-bold cursor-pointer transition-colors"
        >
          <Home className="w-4 h-4" />
          मुख्य वेबसाइट देखें
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 text-xs font-bold cursor-pointer transition-colors"
        >
          <LogOut className="w-4 h-4" />
          सुरक्षित लॉगआउट
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col lg:flex-row">
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:block lg:w-68 xl:w-72 shrink-0 sticky top-0 h-screen shadow-lg z-20">
        {SidebarContent}
      </aside>

      {/* Mobile Slide-out Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[99990] lg:hidden bg-slate-950/60 backdrop-blur-xs flex"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDrawerOpen(false);
          }}
        >
          <div className="w-72 max-w-[85vw] h-full shadow-2xl">{SidebarContent}</div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 truncate m-0 flex items-center gap-2">
                  <span className="text-sky-700">{currentNav.icon}</span>
                  <span>{currentNav.label}</span>
                </h1>
                <p className="text-[11px] text-slate-500 truncate m-0">
                  प्रशासक: {session.name} • सभी बदलाव तुरंत Firebase से लाइव अपडेट होते हैं
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleManualSync}
                disabled={syncing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-extrabold cursor-pointer transition-colors disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">लाइव सिंक</span>
              </button>

              <button
                type="button"
                onClick={navigateHome}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                वेबसाइट
              </button>
            </div>
          </div>

          {/* Mobile Horizontal Quick Tab Strip */}
          <div className="lg:hidden mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#0f2b5b] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.shortLabel}
              </button>
            ))}
          </div>
        </header>

        {/* Active Tab Workspace */}
        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-5">
          {/* Compact Live Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('notice')}
              className="text-left bg-white rounded-xl border border-slate-200 p-3 shadow-2xs hover:border-sky-300 cursor-pointer transition-colors"
            >
              <div className="text-[11px] font-bold text-slate-500">सूचना पॉपअप</div>
              <div
                className={`text-sm font-black mt-0.5 ${
                  noticeActive ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {noticeActive ? '🟢 लाइव सक्रिय' : '⚪ कोई सूचना नहीं'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('whatsapp')}
              className="text-left bg-white rounded-xl border border-slate-200 p-3 shadow-2xs hover:border-emerald-300 cursor-pointer transition-colors"
            >
              <div className="text-[11px] font-bold text-slate-500">व्हाट्सएप ग्रुप्स</div>
              <div className="text-sm font-black text-emerald-700 mt-0.5">
                {store.whatsappGroups.length} कक्षाएं (क्रमबद्ध)
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('admissions')}
              className="text-left bg-white rounded-xl border border-slate-200 p-3 shadow-2xs hover:border-amber-300 cursor-pointer transition-colors"
            >
              <div className="text-[11px] font-bold text-slate-500">प्रवेश आवेदन</div>
              <div className="text-sm font-black text-sky-700 mt-0.5">
                {store.admissions.length} पंजीकरण
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('feedbacks')}
              className="text-left bg-white rounded-xl border border-slate-200 p-3 shadow-2xs hover:border-violet-300 cursor-pointer transition-colors"
            >
              <div className="text-[11px] font-bold text-slate-500">अभिभावक फीडबैक</div>
              <div className="text-sm font-black text-violet-700 mt-0.5">
                {store.feedbacks.length} संदेश
              </div>
            </button>
          </div>

          {store.lastError && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center justify-between gap-2">
              <span>⚠️ क्लाउड सूचना: {store.lastError}</span>
            </div>
          )}

          {/* Tab Panel Content */}
          {activeTab === 'notice' && <NoticeTab onToast={pushToast} onConfirm={requestConfirm} />}
          {activeTab === 'ticker' && <TickerTab onToast={pushToast} onConfirm={requestConfirm} />}
          {activeTab === 'whatsapp' && (
            <WhatsAppTab onToast={pushToast} onConfirm={requestConfirm} />
          )}
          {activeTab === 'admissions' && (
            <AdmissionsTab onToast={pushToast} onConfirm={requestConfirm} />
          )}
          {activeTab === 'feedbacks' && (
            <FeedbacksTab onToast={pushToast} onConfirm={requestConfirm} />
          )}
          {activeTab === 'gallery' && <GalleryTab onToast={pushToast} onConfirm={requestConfirm} />}
          {activeTab === 'result' && <ResultLinkTab onToast={pushToast} />}
          {activeTab === 'firebase' && (
            <FirebaseExplorerTab onToast={pushToast} onConfirm={requestConfirm} />
          )}
        </main>
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
