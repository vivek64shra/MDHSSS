import React, { useState } from 'react';
import { Image as ImageIcon, Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
import { saveSettingToCloud, usePortalStore } from '../../../firebase';
import {
  compressImageToTargetSize,
  DEFAULT_GALLERY_IMAGES,
  GalleryImageItem,
} from '../../../types/portal';
import { ConfirmDialogState } from '../AdminUiHelpers';

interface Props {
  onToast: (type: 'success' | 'error' | 'info', text: string) => void;
  onConfirm: (dialog: ConfirmDialogState) => void;
}

export default function GalleryTab({ onToast, onConfirm }: Props) {
  const { galleryImages } = usePortalStore();
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('📸 स्कूल फोटो');
  const [desc, setDesc] = useState('');
  const [url, setUrl] = useState('');
  const [compressInfo, setCompressInfo] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    setCompressInfo('🔄 फोटो 10 KB सीमा के भीतर कंप्रेस हो रही है...');
    try {
      const res = await compressImageToTargetSize(file, 10);
      setUrl(res.base64);
      setCompressInfo(
        `✅ फोटो कंप्रेस हुई: ${res.sizeKb} KB (मूल: ${res.originalSizeKb} KB) • ≤10 KB सुरक्षित!`
      );
      onToast('success', `✅ फोटो ${res.sizeKb} KB में कंप्रेस हो गई!`);
    } catch (err: any) {
      setCompressInfo(null);
      onToast('error', err?.message || 'फोटो कंप्रेशन में त्रुटि आई।');
    } finally {
      setCompressing(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      onToast('error', 'कृपया फोटो शीर्षक और फोटो फ़ाइल/URL अवश्य दें।');
      return;
    }

    setSaving(true);
    try {
      const newItem: GalleryImageItem = {
        id: `custom-${Date.now()}`,
        title: title.trim(),
        tag: tag.trim() || '📸 स्कूल फोटो',
        desc: desc.trim(),
        url: url.trim(),
        isCustom: true,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...galleryImages];
      const ok = await saveSettingToCloud('gallery_images', updated);
      if (ok) {
        onToast('success', '✅ नई फोटो Firebase गैलरी में लाइव जुड़ गई!');
      } else {
        onToast('info', '⚠️ ऑफलाइन कैश में सुरक्षित — नेटवर्क मिलते ही सिंक होगी।');
      }
      setTitle('');
      setDesc('');
      setUrl('');
      setTag('📸 स्कूल फोटो');
      setCompressInfo(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item: GalleryImageItem) => {
    onConfirm({
      title: 'फोटो गैलरी से हटाएं?',
      message: `क्या आप '${item.title}' को होमपेज गैलरी व Firebase से हटाना चाहते हैं?`,
      confirmLabel: '🗑️ हटाएं',
      danger: true,
      onConfirm: async () => {
        const updated = galleryImages.filter((g) => g.id !== item.id);
        await saveSettingToCloud('gallery_images', updated);
        onToast('success', '🗑️ फोटो गैलरी से हटा दी गई।');
      },
    });
  };

  const handleReset = () => {
    if (galleryImages.length === 0) return;
    onConfirm({
      title: 'गैलरी को मूल डिफ़ॉल्ट में बहाल करें?',
      message: 'इससे सभी कस्टम अपलोड की गई फोटो हट जाएंगी और केवल मूल 8 कैंपस फोटो रहेंगी।',
      confirmLabel: '🔄 रीसेट करें',
      danger: true,
      onConfirm: async () => {
        await saveSettingToCloud('gallery_images', []);
        onToast('success', '✅ गैलरी मूल डिफ़ॉल्ट में बहाल हो गई।');
      },
    });
  };

  return (
    <div className="space-y-5">
      <form
        onSubmit={handleAdd}
        className="bg-white rounded-xl border border-violet-200 p-4 sm:p-5 shadow-xs space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-violet-600" />
            <div>
              <h4 className="text-base font-extrabold text-slate-900 m-0">
                नई फोटो जोड़ें (Auto-Compressed ≤ 10 KB)
              </h4>
              <p className="text-xs text-slate-500 m-0">
                कोई भी फोटो चुनें — सिस्टम स्वतः अधिकतम 10 KB में कंप्रेस कर Firebase में सेव करेगा
              </p>
            </div>
          </div>
          {galleryImages.length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> डिफ़ॉल्ट रीसेट
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              फोटो शीर्षक (Title) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदा: वार्षिक पुरस्कार वितरण समारोह"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">टैग (Tag)</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="📸 स्कूल फोटो"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              फोन/पीसी से फोटो चुनें (Auto ≤ 10 KB)
            </label>
            <label className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-violet-300 bg-violet-50/50 hover:bg-violet-50 rounded-lg text-xs font-bold text-violet-700 cursor-pointer">
              <Upload className="w-4 h-4" />
              {compressing ? 'कंप्रेस हो रहा है...' : 'फोटो अपलोड करें (JPG / PNG / WEBP)'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              या फोटो URL / Base64 डेटा *
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="अपलोड पर स्वतः भरेगा या URL पेस्ट करें"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              संक्षिप्त विवरण (Description)
            </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="छात्रों की उत्कृष्ट प्रस्तुति व सम्मान"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {compressInfo && url && (
          <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <img
              src={url}
              alt="Preview"
              className="w-12 h-12 rounded-lg object-cover border border-emerald-300 shrink-0"
            />
            <div className="text-xs font-bold text-emerald-800">{compressInfo}</div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving || compressing}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-extrabold rounded-xl cursor-pointer shadow-sm transition-colors disabled:opacity-60"
        >
          <Plus className="w-4 h-4" />
          {saving ? 'सेव हो रहा है...' : '💾 गैलरी में लाइव जोड़ें'}
        </button>
      </form>

      {/* Custom Uploaded Images */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <h4 className="text-sm font-extrabold text-slate-900 m-0">
          🖼️ कस्टम अपलोड फोटो ({galleryImages.length}) + मूल कैंपस फोटो ({DEFAULT_GALLERY_IMAGES.length})
        </h4>

        {galleryImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {galleryImages.map((img) => (
              <div
                key={img.id}
                className="rounded-xl border border-violet-200 overflow-hidden bg-white flex flex-col"
              >
                <div className="h-32 bg-slate-100 relative overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/school_building.svg';
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[11px] font-bold bg-slate-900/75 text-white rounded-md">
                    {img.tag || '📸 फोटो'}
                  </span>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-slate-900 line-clamp-1">{img.title}</div>
                    {img.desc && (
                      <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">{img.desc}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(img)}
                    className="inline-flex items-center justify-center gap-1 w-full py-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> फोटो हटाएं
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-500 mb-2">
            मूल डिफ़ॉल्ट कैंपस गैलरी (कोड में सुरक्षित):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DEFAULT_GALLERY_IMAGES.map((img) => (
              <div
                key={img.id}
                className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50"
              >
                <img src={img.url} alt={img.title} className="w-full h-20 object-cover" />
                <div className="p-2 text-[11px] font-bold text-slate-700 truncate">{img.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
