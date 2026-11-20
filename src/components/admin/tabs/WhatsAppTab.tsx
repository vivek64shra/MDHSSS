import React, { useMemo, useState } from 'react';
import {
  Copy,
  Edit3,
  ExternalLink,
  MessageCircle,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { saveSettingToCloud, usePortalStore } from '../../../firebase';
import {
  DEFAULT_WHATSAPP_GROUPS,
  sortWhatsAppGroups,
  WhatsAppGroupItem,
} from '../../../types/portal';
import { ConfirmDialogState } from '../AdminUiHelpers';

interface Props {
  onToast: (type: 'success' | 'error' | 'info', text: string) => void;
  onConfirm: (dialog: ConfirmDialogState) => void;
}

const EMPTY_FORM = {
  id: '',
  className: '',
  badge: '',
  sub: '',
  link: '',
  btnText: '',
  status: 'active' as 'active' | 'inactive',
};

export default function WhatsAppTab({ onToast, onConfirm }: Props) {
  const { whatsappGroups } = usePortalStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const sortedGroups = useMemo(() => sortWhatsAppGroups(whatsappGroups), [whatsappGroups]);

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedGroups;
    return sortedGroups.filter(
      (g) =>
        g.className?.toLowerCase().includes(q) ||
        g.badge?.toLowerCase().includes(q) ||
        g.sub?.toLowerCase().includes(q) ||
        g.link?.toLowerCase().includes(q)
    );
  }, [sortedGroups, search]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.className.trim() || !form.badge.trim() || !form.link.trim()) {
      onToast('error', 'कृपया कक्षा का नाम, बैज और व्हाट्सएप लिंक अवश्य भरें!');
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const className = form.className.trim();
      const sub = form.sub.trim() || `${className} आधिकारिक ग्रुप`;
      const btnText = form.btnText.trim() || `Join ${className} ↗`;

      let updated: WhatsAppGroupItem[];
      if (form.id) {
        updated = sortedGroups.map((g) =>
          g.id === form.id
            ? {
                ...g,
                className,
                badge: form.badge.trim(),
                sub,
                link: form.link.trim(),
                btnText,
                status: form.status,
                updatedAt: now,
              }
            : g
        );
      } else {
        const newItem: WhatsAppGroupItem = {
          id: `wa-${Date.now()}`,
          className,
          badge: form.badge.trim(),
          sub,
          link: form.link.trim(),
          btnText,
          status: form.status,
          createdAt: now,
          updatedAt: now,
        };
        updated = [...sortedGroups, newItem];
      }

      const ok = await saveSettingToCloud('whatsapp_groups', sortWhatsAppGroups(updated));
      if (ok) {
        onToast(
          'success',
          form.id
            ? `✅ '${className}' अपडेट होकर Firebase में सुरक्षित हो गया!`
            : `✅ नया ग्रुप '${className}' क्रमबद्ध तरीके से Firebase में जुड़ गया!`
        );
      } else {
        onToast('info', '⚠️ ऑफलाइन कैश में सुरक्षित — नेटवर्क मिलते ही सिंक होगा।');
      }
      setForm(EMPTY_FORM);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: WhatsAppGroupItem) => {
    setForm({
      id: item.id,
      className: item.className || '',
      badge: item.badge || '',
      sub: item.sub || '',
      link: item.link || '',
      btnText: item.btnText || '',
      status: item.status === 'inactive' ? 'inactive' : 'active',
    });
    const el = document.getElementById('reactWaEditorForm');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleToggleStatus = async (item: WhatsAppGroupItem) => {
    const nextStatus: 'active' | 'inactive' = item.status === 'inactive' ? 'active' : 'inactive';
    const updated = sortedGroups.map((g) =>
      g.id === item.id ? { ...g, status: nextStatus, updatedAt: new Date().toISOString() } : g
    );
    await saveSettingToCloud('whatsapp_groups', updated);
    onToast(
      'info',
      `'${item.className}' अब ${nextStatus === 'active' ? '🟢 सक्रिय' : '🔴 निष्क्रिय'} है।`
    );
  };

  const handleDelete = (item: WhatsAppGroupItem) => {
    onConfirm({
      title: `व्हाट्सएप ग्रुप हटाएं?`,
      message: `क्या आप वाकई '${item.className}' को Firebase और वेबसाइट से हटाना चाहते हैं?`,
      confirmLabel: '🗑️ हाँ, हटाएं',
      danger: true,
      onConfirm: async () => {
        const remaining = sortedGroups.filter((g) => g.id !== item.id);
        await saveSettingToCloud('whatsapp_groups', remaining);
        if (form.id === item.id) setForm(EMPTY_FORM);
        onToast('success', `🗑️ '${item.className}' Firebase से हटा दिया गया।`);
      },
    });
  };

  const handleRestoreDefaults = () => {
    onConfirm({
      title: 'डिफ़ॉल्ट सभी कक्षा ग्रुप्स बहाल करें?',
      message:
        'इससे Nursery से 12वीं तक के सभी आधिकारिक ग्रुप्स (आपके 1st, 2nd, 6th, 7th लिंक्स सहित) क्रमबद्ध रूप से Firebase में सेव हो जाएंगे।',
      confirmLabel: '🔄 हाँ, बहाल करें',
      onConfirm: async () => {
        await saveSettingToCloud('whatsapp_groups', sortWhatsAppGroups(DEFAULT_WHATSAPP_GROUPS));
        setForm(EMPTY_FORM);
        onToast('success', '✅ सभी आधिकारिक व्हाट्सएप ग्रुप्स Firebase में बहाल हो गए!');
      },
    });
  };

  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      onToast('success', '📋 व्हाट्सएप लिंक क्लिपबोर्ड पर कॉपी हो गया!');
    } catch {
      onToast('info', 'लिंक: ' + link);
    }
  };

  return (
    <div className="space-y-5">
      {/* Add / Edit Form */}
      <form
        id="reactWaEditorForm"
        onSubmit={handleSave}
        className="bg-white rounded-xl border border-emerald-200 p-4 sm:p-5 shadow-xs space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h4 className="text-base font-extrabold text-slate-900 m-0">
              {form.id ? `✏️ ग्रुप सम्पादित करें: ${form.className}` : '➕ नया व्हाट्सएप ग्रुप जोड़ें'}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            {form.id && (
              <button
                type="button"
                onClick={() => setForm(EMPTY_FORM)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> एडिट रद्द करें
              </button>
            )}
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> डिफ़ॉल्ट बहाल करें
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              कक्षा / ग्रुप का नाम *
            </label>
            <input
              type="text"
              required
              value={form.className}
              onChange={(e) => setForm({ ...form, className: e.target.value })}
              placeholder="उदा: Class 1st Group"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              बैज (Badge: LKG, 1st, 10th) *
            </label>
            <input
              type="text"
              required
              maxLength={8}
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              placeholder="1st"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">प्रदर्शन स्थिति</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as 'active' | 'inactive' })
              }
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="active">🟢 सक्रिय (वेबसाइट पर दिखेगा)</option>
              <option value="inactive">🔴 निष्क्रिय (छुपा रहेगा)</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              आधिकारिक व्हाट्सएप लिंक (https://chat.whatsapp.com/...) *
            </label>
            <input
              type="url"
              required
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              उप-शीर्षक (Subtitle)
            </label>
            <input
              type="text"
              value={form.sub}
              onChange={(e) => setForm({ ...form, sub: e.target.value })}
              placeholder="कक्षा-1st आधिकारिक ग्रुप"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              बटन टेक्स्ट (Join Button Label)
            </label>
            <input
              type="text"
              value={form.btnText}
              onChange={(e) => setForm({ ...form, btnText: e.target.value })}
              placeholder="Join Class 1st Group ↗"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-xl cursor-pointer shadow-sm transition-colors disabled:opacity-60"
        >
          {form.id ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {saving
            ? 'सेव हो रहा है...'
            : form.id
            ? '💾 अपडेट Firebase में सेव करें'
            : '💾 नया ग्रुप Firebase में जोड़ें'}
        </button>
      </form>

      {/* Group List */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 m-0">
              📋 क्रमबद्ध व्हाट्सएप ग्रुप्स ({filteredGroups.length} / {sortedGroups.length})
            </h4>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              स्वतः क्रमबद्ध: Nursery → LKG → UKG → 1st → 2nd ... → 12th → Helpline
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="कक्षा या नाम से खोजें..."
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {filteredGroups.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-300 rounded-xl">
            कोई व्हाट्सएप ग्रुप नहीं मिला।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredGroups.map((item) => {
              const isActive = item.status !== 'inactive';
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3.5 flex flex-col justify-between transition-colors ${
                    isActive
                      ? 'bg-white border-emerald-200'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                          {item.badge || 'WA'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-extrabold text-slate-900 truncate">
                            {item.className}
                          </div>
                          <div className="text-xs text-slate-500 truncate">{item.sub}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        className={`px-2 py-0.5 text-[11px] font-bold rounded-full border cursor-pointer shrink-0 ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                        title="सक्रिय / निष्क्रिय बदलें"
                      >
                        {isActive ? '🟢 सक्रिय' : '🔴 निष्क्रिय'}
                      </button>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 mb-2.5">
                      <div className="font-mono text-[11px] text-sky-700 break-all line-clamp-2">
                        {item.link}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> एडिट
                      </button>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg no-underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> टेस्ट
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.link)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" /> कॉपी
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg cursor-pointer"
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
    </div>
  );
}
