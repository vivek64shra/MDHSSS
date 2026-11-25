import React, { useMemo, useState } from 'react';
import {
  Bell,
  Copy,
  ExternalLink,
  Home,
  LogOut,
  Megaphone,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { refreshAllFromCloud, usePortalStore } from '../../firebase';
import { AdminSession, isValidActiveNotice, sortWhatsAppGroups } from '../../types/portal';

interface Props {
  session: AdminSession;
  onToast: (type: 'success' | 'error' | 'info', text: string) => void;
  onLogout: () => void;
  onSwitchToAdmin?: () => void;
  onGoHome: () => void;
}

export default function StaffPortalView({
  session,
  onToast,
  onLogout,
  onSwitchToAdmin,
  onGoHome,
}: Props) {
  const store = usePortalStore();
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'whatsapp' | 'admissions'>('overview');

  const activeGroups = useMemo(() => {
    const sorted = sortWhatsAppGroups(store.whatsappGroups).filter((g) => g.status !== 'inactive');
    const q = search.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (g) =>
        g.className?.toLowerCase().includes(q) ||
        g.badge?.toLowerCase().includes(q) ||
        g.sub?.toLowerCase().includes(q)
    );
  }, [store.whatsappGroups, search]);

  const noticeActive = isValidActiveNotice(store.popupNotice);
  const tickerActive = Boolean(
    store.tickerMarquee &&
      store.tickerMarquee.enabled !== 'false' &&
      store.tickerMarquee.text?.trim()
  );

  const handleSync = async () => {
    setSyncing(true);
    const ok = await refreshAllFromCloud();
    setSyncing(false);
    if (ok) {
      onToast('success', '✅ Firebase से सभी लाइव डेटा अपडेट हो गया।');
    } else {
      onToast('info', '⚠️ ऑफलाइन कैश मोड सक्रिय है।');
    }
  };

  const handleCopy = async (link: string, label: string) => {
    try {
      await navigator.clipboard.writeText(link);
      onToast('success', `📋 '${label}' लिंक कॉपी हो गया!`);
    } catch {
      onToast('error', 'लिंक कॉपी नहीं हो सका।');
    }
  };

  return (
    <div className="space-y-4 text-slate-900">
      {/* Compact Mobile-First Top Bar */}
      <header className="bg-gradient-to-r from-[#0f2b5b] to-[#1e40af] text-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-4 sm:px-5 py-4 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-extrabold leading-tight truncate m-0">
                स्टाफ पोर्टल (MDHSSS सेमरिया)
              </h1>
              <p className="text-xs text-sky-100 truncate m-0">
                {session.name} · MDHSSS सेमरिया
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">

            <button
              type="button"
              onClick={handleSync}
              disabled={syncing}
              title="Firebase सिंक करें"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onGoHome}
              title="मुख्य वेबसाइट"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              title="लॉगआउट"
              className="p-2 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fast Mobile Tabs */}
        <div className="px-4 sm:px-5 pb-3 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSection('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === 'overview'
                ? 'bg-white text-[#0f2b5b] shadow-xs'
                : 'bg-white/10 text-sky-100 hover:bg-white/20'
            }`}
          >
            📌 सूचना एवं डैशबोर्ड
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('whatsapp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === 'whatsapp'
                ? 'bg-white text-[#0f2b5b] shadow-xs'
                : 'bg-white/10 text-sky-100 hover:bg-white/20'
            }`}
          >
            💬 व्हाट्सएप ग्रुप्स ({activeGroups.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('admissions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === 'admissions'
                ? 'bg-white text-[#0f2b5b] shadow-xs'
                : 'bg-white/10 text-sky-100 hover:bg-white/20'
            }`}
          >
            📝 नए प्रवेश ({store.admissions.length})
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* Quick External Portals Strip */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href="https://mdhssslogin.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition-colors no-underline"
          >
            <div className="min-w-0">
              <div className="text-xs font-extrabold truncate">👨‍🏫 Teacher Login</div>
              <div className="text-[11px] text-amber-700 truncate">mdhssslogin.netlify.app</div>
            </div>
            <ExternalLink className="w-4 h-4 shrink-0 text-amber-700" />
          </a>

          <a
            href={store.resultLinkConfig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 hover:bg-sky-100 transition-colors no-underline"
          >
            <div className="min-w-0">
              <div className="text-xs font-extrabold truncate">🎓 Student Login</div>
              <div className="text-[11px] text-sky-700 truncate">mdhsssresult.netlify.app</div>
            </div>
            <ExternalLink className="w-4 h-4 shrink-0 text-sky-700" />
          </a>
        </div>

        {/* Section 1: Overview & Live Notices */}
        {activeSection === 'overview' && (
          <div className="space-y-4">
            {/* KPI Row */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white rounded-xl border border-slate-200 p-3 text-center shadow-2xs">
                <div className="text-xl font-black text-sky-700">{store.admissions.length}</div>
                <div className="text-[11px] font-bold text-slate-500 mt-0.5">प्रवेश आवेदन</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3 text-center shadow-2xs">
                <div className="text-xl font-black text-emerald-700">{activeGroups.length}</div>
                <div className="text-[11px] font-bold text-slate-500 mt-0.5">सक्रिय ग्रुप</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3 text-center shadow-2xs">
                <div className="text-xl font-black text-violet-700">{store.feedbacks.length}</div>
                <div className="text-[11px] font-bold text-slate-500 mt-0.5">फीडबैक</div>
              </div>
            </div>

            {/* Live Notice Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-sky-600" />
                  <h2 className="text-sm font-extrabold text-slate-900 m-0">
                    वर्तमान लाइव सूचना (Live Popup Notice)
                  </h2>
                </div>
                <span
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                    noticeActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {noticeActive ? '● सक्रिय' : '○ कोई सूचना नहीं'}
                </span>
              </div>

              {noticeActive && store.popupNotice ? (
                <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 space-y-2">
                  <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-600 text-white">
                    {store.popupNotice.badge || '🔔 आवश्यक सूचना'}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 m-0">
                    {store.popupNotice.title}
                  </h3>
                  {store.popupNotice.body && (
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line m-0">
                      {store.popupNotice.body}
                    </p>
                  )}
                  {store.popupNotice.highlights && (
                    <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc m-0">
                      {store.popupNotice.highlights
                        .split('\n')
                        .map((l) => l.trim())
                        .filter(Boolean)
                        .map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                    </ul>
                  )}
                  {store.popupNotice.helpline && (
                    <div className="text-xs font-bold text-sky-800 pt-1">
                      📞 {store.popupNotice.helpline}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500 m-0">
                  अभी Firebase में कोई सक्रिय पॉपअप सूचना प्रकाशित नहीं है। जैसे ही एडमिन नई सूचना जोड़ेंगे, वह यहाँ तुरंत दिखाई देगी।
                </p>
              )}
            </div>

            {/* Live Ticker Status Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-rose-600" />
                  <h2 className="text-sm font-extrabold text-slate-900 m-0">
                    प्रवेश सूचना पट्टी (Ticker Bar)
                  </h2>
                </div>
                <span
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                    tickerActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tickerActive ? '● चल रही है' : '○ बंद'}
                </span>
              </div>
              {tickerActive && store.tickerMarquee ? (
                <div className="text-xs sm:text-sm font-semibold text-slate-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
                  <span className="inline-block font-extrabold text-rose-700 mr-2">
                    [{store.tickerMarquee.tag}]
                  </span>
                  {store.tickerMarquee.text}
                </div>
              ) : (
                <p className="text-xs text-slate-500 m-0">
                  वर्तमान में कोई लाइव सूचना पट्टी सक्रिय नहीं है।
                </p>
              )}
            </div>

            {onSwitchToAdmin && (
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                एडमिन डैशबोर्ड पर वापस जाएं
              </button>
            )}
          </div>
        )}

        {/* Section 2: Searchable Class-Wise WhatsApp Groups */}
        {activeSection === 'whatsapp' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="कक्षा खोजें (जैसे 1st, 6th, 7th, LKG)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeGroups.map((g) => (
                <div
                  key={g.id}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0">
                      {g.badge || 'WA'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-extrabold text-slate-900 m-0 truncate">
                        {g.className}
                      </h3>
                      <p className="text-xs text-slate-500 m-0 truncate">{g.sub}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={g.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 no-underline transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      जॉइन करें
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(g.link, g.className)}
                      className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      कॉपी
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Recent Live Admissions (Read-only for Staff) */}
        {activeSection === 'admissions' && (
          <div className="space-y-2.5">
            {store.admissions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
                अभी कोई नया प्रवेश आवेदन प्राप्त नहीं हुआ है।
              </div>
            ) : (
              store.admissions.slice(0, 30).map((adm) => (
                <div
                  key={adm.id}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                        <UserPlus className="w-3 h-3" />
                        {adm.class}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">{adm.date}</span>
                    </div>
                    <div className="text-sm font-extrabold text-slate-900">{adm.studentName}</div>
                    <div className="text-xs text-slate-600">
                      पिता: {adm.fatherName} {adm.address ? `• ${adm.address}` : ''}
                    </div>
                  </div>
                  {adm.phone && (
                    <a
                      href={`tel:${adm.phone}`}
                      className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold no-underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      कॉल
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
