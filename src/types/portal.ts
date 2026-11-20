export interface AdmissionRecord {
  id: string;
  formType?: string;
  date: string;
  studentName: string;
  fatherName: string;
  motherName?: string;
  phone: string;
  class: string;
  subject?: string;
  address: string;
  remarks?: string;
  updatedAt?: string;
}

export interface FeedbackRecord {
  id: string;
  formType?: string;
  date: string;
  name: string;
  phone?: string;
  class?: string;
  role?: string;
  subject?: string;
  rating?: number;
  message: string;
  updatedAt?: string;
}

export interface PopupNoticeConfig {
  enabled: 'true' | 'false';
  badge: string;
  title: string;
  body: string;
  highlights: string;
  helpline: string;
  btnText: string;
  btnAction: 'admission' | 'whatsapp' | 'student' | 'about' | 'facilities' | 'feedback' | 'custom';
  customUrl: string;
  isUpdated?: boolean;
  updatedAt?: string;
}

export interface TickerMarqueeConfig {
  enabled: 'true' | 'false';
  tag: string;
  text: string;
  speed: 'slow' | 'normal' | 'fast';
  theme: 'red' | 'blue' | 'green' | 'orange' | 'dark';
  clickAction: 'admission' | 'notice' | 'whatsapp' | 'student';
  updatedAt?: string;
}

export interface WhatsAppGroupItem {
  id: string;
  className: string;
  badge: string;
  sub: string;
  link: string;
  btnText: string;
  status: 'active' | 'inactive';
  isCare?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryImageItem {
  id: string;
  title: string;
  desc: string;
  tag: string;
  url: string;
  isCustom?: boolean;
  sizeKb?: string;
  createdAt?: string;
}

export interface ResultLinkConfig {
  url: string;
  btnText: string;
  tag: string;
  note: string;
  updatedAt?: string;
}

export type PortalRole = 'admin' | 'staff';

export interface AdminSession {
  role: PortalRole;
  name: string;
  time: number;
}

export interface PortalStoreSnapshot {
  admissions: AdmissionRecord[];
  feedbacks: FeedbackRecord[];
  popupNotice: PopupNoticeConfig | null;
  tickerMarquee: TickerMarqueeConfig | null;
  whatsappGroups: WhatsAppGroupItem[];
  galleryImages: GalleryImageItem[];
  resultLinkConfig: ResultLinkConfig;
  ready: {
    admissions: boolean;
    feedbacks: boolean;
    popupNotice: boolean;
    tickerMarquee: boolean;
    whatsappGroups: boolean;
    galleryImages: boolean;
    resultLinkConfig: boolean;
  };
  connectionStatus: 'checking' | 'online' | 'offline';
  lastSyncAt: string | null;
  lastError: string | null;
}

export const DEFAULT_RESULT_LINK_CONFIG: ResultLinkConfig = {
  url: 'https://mdhsssresult.netlify.app/',
  btnText: '🌐 अधिकृत परीक्षा परिणाम पोर्टल खोलें (Open Result Portal) ↗',
  tag: '🏆 वार्षिक एवं बोर्ड परीक्षा परिणाम • सत्र 2026-27',
  note: 'सत्र 2026-27 के सभी छात्र एवं अभिभावक अपने अनुक्रमांक (Roll Number) द्वारा परीक्षा परिणाम व अंकपत्र देखने हेतु नीचे दिए गए अधिकृत परीक्षा परिणाम पोर्टल लिंक पर क्लिक करें। यह लिंक सीधे नए पेज/टैब में खुलेगा।',
};

export const DEFAULT_WHATSAPP_GROUPS: WhatsAppGroupItem[] = [
  {
    id: 'wa-nursery',
    className: 'Nursery & KG Class',
    badge: 'NUR',
    sub: 'नर्सरी व बालवाटिका आधिकारिक ग्रुप',
    link: 'https://chat.whatsapp.com/KL8gLpiBNrc6lhVEPnwVmP',
    btnText: 'Join Nursery Group ↗',
    status: 'active',
  },
  {
    id: 'wa-lkg',
    className: 'LKG Class Group',
    badge: 'LKG',
    sub: 'एल.के.जी. आधिकारिक क्लास ग्रुप',
    link: 'https://chat.whatsapp.com/KL8gLpiBNrc6lhVEPnwVmP',
    btnText: 'Join LKG Group ↗',
    status: 'active',
  },
  {
    id: 'wa-ukg',
    className: 'UKG Class Group',
    badge: 'UKG',
    sub: 'यू.के.जी. आधिकारिक क्लास ग्रुप',
    link: 'https://chat.whatsapp.com/KL8gLpiBNrc6lhVEPnwVmP',
    btnText: 'Join UKG Group ↗',
    status: 'active',
  },
  {
    id: 'wa-class-1st',
    className: 'Class 1st Group',
    badge: '1st',
    sub: 'कक्षा-1st आधिकारिक ग्रुप',
    link: 'https://chat.whatsapp.com/GjjqASc0W749b8zCCFkmtM?s=cl&p=a&mlu=4&ilr=4',
    btnText: 'Join Class 1st Group ↗',
    status: 'active',
  },
  {
    id: 'wa-class-2nd',
    className: 'Class 2nd Group',
    badge: '2nd',
    sub: 'Class 2nd Group आधिकारिक ग्रुप',
    link: 'https://chat.whatsapp.com/FZa41MneuszDXT6ldFGKwV?s=cl&p=a&iam=2',
    btnText: 'Join Class 2nd Group ↗',
    status: 'active',
  },
  {
    id: 'wa-class-3rd',
    className: 'Class 3rd Group',
    badge: '3rd',
    sub: 'कक्षा 3री आधिकारिक ग्रुप',
    link: 'https://chat.whatsapp.com/KL8gLpiBNrc6lhVEPnwVmP',
    btnText: 'Join Class 3rd Group ↗',
    status: 'active',
  },
  {
    id: 'wa-class-4th',
    className: 'Class 4th Group',
    badge: '4th',
    sub: 'कक्षा 4थी आधिकारिक ग्रुप',
    link: 'https://chat.whatsapp.com/KL8gLpiBNrc6lhVEPnwVmP',
    btnText: 'Join Class 4th Group ↗',
    status: 'active',
  },
  {
    id: 'wa-class-5th',
    className: 'Class 5th Group',
    badge: '5th',
    sub: 'कक्षा 5वीं आधिकारिक ग्रुप',
    link: 'https://chat.whatsapp.com/DwZKKN3R5ixIc92LwjfCvS',
    btnText: 'Join Class 5th Group ↗',
    status: 'active',
  },
  {
    id: 'wa-class-6th',
    className: 'Class 6th Group',
    badge: '6th',
    sub: 'कक्षा -6th आधिकारिक ग्रुप',
    link: 'https://chat.whatsapp.com/Fm4NBqtUlQE0zwEhzcdfm0',
    btnText: 'Join Class 6th Group ↗',
    status: 'active',
  },
  {
    id: 'wa-class-7th',
    className: 'Class 7th Group',
    badge: '7th',
    sub: 'कक्षा -7th आधिकारिक ग्रुप',
    link: 'https://chat.whatsapp.com/EkBgEXerlQtEcBiQ58rcvt?s=cl&p=a&mlu=4&ilr=4',
    btnText: 'Join Class 7th Group ↗',
    status: 'active',
  },
  {
    id: 'wa-class-8th',
    className: 'Class 8th Group',
    badge: '8th',
    sub: 'कक्षा 8वीं बोर्ड आधिकारिक ग्रुप',
    link: 'https://chat.whatsapp.com/LGqCRBl4EubE8NoF0YMSf6',
    btnText: 'Join Class 8th Group ↗',
    status: 'active',
  },
  {
    id: 'wa-class-9th',
    className: 'Class 9th Group',
    badge: '9th',
    sub: 'कक्षा 9वीं आधिकारिक ग्रुप',
    link: 'https://chat.whatsapp.com/IbDfB52AEkU5ev0wAK7GXb',
    btnText: 'Join Class 9th Group ↗',
    status: 'active',
  },
  {
    id: 'wa-class-10th',
    className: 'Class 10th Board',
    badge: '10th',
    sub: 'कक्षा 10वीं बोर्ड विशेष ग्रुप',
    link: 'https://chat.whatsapp.com/CWcP1g8k9HJBr27fGy04n0',
    btnText: 'Join Class 10th Board ↗',
    status: 'active',
  },
  {
    id: 'wa-class-11th',
    className: 'क्लास 11th (Science & Commerce)',
    badge: '11th',
    sub: '11वीं गणित, विज्ञान, वाणिज्य संकाय',
    link: 'https://chat.whatsapp.com/EmLysOwKpYqEHp5cCR3mOE',
    btnText: 'Join Class 11th Group ↗',
    status: 'active',
  },
  {
    id: 'wa-class-12th',
    className: 'Class 12th Board',
    badge: '12th',
    sub: '12वीं हायर सेकेंडरी बोर्ड ग्रुप',
    link: 'https://chat.whatsapp.com/BOcoXHvJZ8SCPyv2Mm1RBL',
    btnText: 'Join Class 12th Board ↗',
    status: 'active',
  },
  {
    id: 'wa-helpline',
    className: 'School Admission Care',
    badge: 'MD',
    sub: 'प्रवेश सहायता व सामान्य पूछताछ',
    link: 'https://wa.me/919200178385?text=Namaste%20Maa%20Durga%20School%20Semariya,%20I%20want%20to%20know%20about%20admission.',
    btnText: 'Chat on WhatsApp ↗',
    status: 'active',
    isCare: true,
  },
];

export const DEFAULT_GALLERY_IMAGES: GalleryImageItem[] = [
  {
    id: 'img-1',
    title: 'मुख्य विद्यालय भवन व भव्य प्रांगण',
    desc: 'सेमरिया नगर का सर्वसुविधायुक्त एवं अनुशासित शैक्षणिक परिसर।',
    tag: '🏫 मुख्य परिसर',
    url: '/images/school_building.svg',
  },
  {
    id: 'img-2',
    title: 'डिजिटल स्मार्ट क्लासरूम',
    desc: 'इंटरैक्टिव स्मार्ट बोर्ड एवं ऑडियो-विजुअल शिक्षा प्रणाली।',
    tag: '💻 स्मार्ट क्लास',
    url: '/images/smart_classroom.svg',
  },
  {
    id: 'img-3',
    title: 'हाई-टेक साइंस लैबोरेटरी',
    desc: 'भौतिकी, रसायन व जीव विज्ञान के संपूर्ण प्रायोगिक उपकरण।',
    tag: '🔬 साइंस लैब',
    url: '/images/science_lab.svg',
  },
  {
    id: 'img-4',
    title: 'आधुनिक कंप्यूटर एवं आईटी लैब',
    desc: 'हाई-स्पीड इंटरनेट, कोडिंग एवं डिजिटल कौशल प्रशिक्षण।',
    tag: '🖥️ कंप्यूटर लैब',
    url: '/images/computer_lab.svg',
  },
  {
    id: 'img-5',
    title: 'समृद्ध पुस्तकालय व रीडिंग रूम',
    desc: 'एनसीईआरटी, म.प्र. बोर्ड पुस्तकें एवं प्रतियोगी संदर्भ ग्रंथ।',
    tag: '📚 पुस्तकालय',
    url: '/images/library_books.svg',
  },
  {
    id: 'img-6',
    title: 'खेलकूद एवं एथलेटिक्स ग्राउंड',
    desc: 'क्रिकेट, वॉलीबॉल, खो-खो एवं शारीरिक दक्षता प्रशिक्षण।',
    tag: '🏆 खेलकूद',
    url: '/images/sports_activities.svg',
  },
  {
    id: 'img-7',
    title: 'वार्षिक सांस्कृतिक उत्सव व मंच',
    desc: 'छात्र-छात्राओं की प्रतिभा एवं भारतीय संस्कारों का उत्सव।',
    tag: '🎭 सांस्कृतिक मंच',
    url: '/images/cultural_event.svg',
  },
  {
    id: 'img-8',
    title: 'सुरक्षित बस एवं परिवहन सेवा',
    desc: 'सेमरिया नगर एवं आसपास के समस्त ग्रामों तक सुरक्षित आवागमन।',
    tag: '🚌 स्कूल बस',
    url: '/images/school_bus.svg',
  },
];

export const TICKER_THEMES: Record<
  TickerMarqueeConfig['theme'],
  { bar: string; tag: string; label: string }
> = {
  red: {
    bar: 'linear-gradient(90deg, #b91c1c, #dc2626, #b91c1c)',
    tag: '#991b1b',
    label: '🔴 लाल अलर्ट (Red Alert)',
  },
  blue: {
    bar: 'linear-gradient(90deg, #0369a1, #0284c7, #0369a1)',
    tag: '#075985',
    label: '🔵 रॉयल ब्लू (Royal Blue)',
  },
  green: {
    bar: 'linear-gradient(90deg, #15803d, #16a34a, #15803d)',
    tag: '#166534',
    label: '🟢 ग्रीन (Success Green)',
  },
  orange: {
    bar: 'linear-gradient(90deg, #c2410c, #ea580c, #c2410c)',
    tag: '#9a3412',
    label: '🟠 केसरिया (Saffron Orange)',
  },
  dark: {
    bar: 'linear-gradient(90deg, #0f172a, #334155, #0f172a)',
    tag: '#020617',
    label: '⚫ डार्क स्लेट (Dark Slate)',
  },
};

export function getGradeOrderRank(item: Partial<WhatsAppGroupItem> | null | undefined): number {
  if (!item) return 9999;
  if (item.isCare || item.id === 'wa-helpline') return 3000;

  const raw = `${item.className || ''} ${item.badge || ''} ${item.sub || ''}`.toLowerCase();

  if (
    raw.includes('care') ||
    raw.includes('help') ||
    raw.includes('पूछताछ') ||
    raw.includes('हेल्पलाइन') ||
    raw.includes('admission care')
  ) {
    return 3000;
  }

  if (
    raw.includes('nursery') ||
    raw.includes('नर्सरी') ||
    raw.includes('play') ||
    raw.includes('प्ले') ||
    raw.includes('balvatika') ||
    raw.includes('बालवाटिका')
  ) {
    return 10;
  }
  if (
    raw.includes('lkg') ||
    raw.includes('एलकेजी') ||
    raw.includes('l.k.g') ||
    /\bkg[- ]?1\b/.test(raw) ||
    raw.includes('केजी 1') ||
    raw.includes('के.जी. 1')
  ) {
    return 20;
  }
  if (
    raw.includes('ukg') ||
    raw.includes('यूकेजी') ||
    raw.includes('u.k.g') ||
    /\bkg[- ]?2\b/.test(raw) ||
    raw.includes('केजी 2') ||
    raw.includes('के.जी. 2')
  ) {
    return 30;
  }

  if (/\b12(th)?\b/i.test(raw) || raw.includes('12वीं') || raw.includes('बारहवीं') || raw.includes('12th')) return 1200;
  if (/\b11(th)?\b/i.test(raw) || raw.includes('11वीं') || raw.includes('ग्यारहवीं') || raw.includes('11th')) return 1100;
  if (/\b10(th)?\b/i.test(raw) || raw.includes('10वीं') || raw.includes('दसवीं') || raw.includes('10th')) return 1000;
  if (/\b9(th)?\b/i.test(raw) || raw.includes('9वीं') || raw.includes('नौवीं') || raw.includes('9th')) return 900;
  if (/\b8(th)?\b/i.test(raw) || raw.includes('8वीं') || raw.includes('आठवीं') || raw.includes('8th')) return 800;
  if (/\b7(th)?\b/i.test(raw) || raw.includes('7वीं') || raw.includes('सातवीं') || raw.includes('7th')) return 700;
  if (/\b6(th)?\b/i.test(raw) || raw.includes('6वीं') || raw.includes('छठवीं') || raw.includes('6th')) return 600;
  if (/\b5(th)?\b/i.test(raw) || raw.includes('5वीं') || raw.includes('पांचवीं') || raw.includes('5th')) return 500;
  if (/\b4(th)?\b/i.test(raw) || raw.includes('4थी') || raw.includes('चौथी') || raw.includes('4th')) return 400;
  if (/\b3(rd)?\b/i.test(raw) || raw.includes('3री') || raw.includes('तीसरी') || raw.includes('3rd')) return 300;
  if (/\b2(nd)?\b/i.test(raw) || raw.includes('2री') || raw.includes('दूसरी') || raw.includes('2nd')) return 200;
  if (/\b1(st)?\b/i.test(raw) || raw.includes('1ली') || raw.includes('पहली') || raw.includes('1st')) return 100;

  const match = raw.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    if (num >= 1 && num <= 12) return num * 100;
  }

  return 2000;
}

export function sortWhatsAppGroups(groups: WhatsAppGroupItem[]): WhatsAppGroupItem[] {
  if (!Array.isArray(groups)) return [];
  return [...groups].sort((a, b) => {
    const rA = getGradeOrderRank(a);
    const rB = getGradeOrderRank(b);
    if (rA !== rB) return rA - rB;
    return (a.className || '').localeCompare(b.className || '', undefined, { numeric: true });
  });
}

export function isValidActiveNotice(noticeData: PopupNoticeConfig | null | undefined): noticeData is PopupNoticeConfig {
  if (!noticeData || typeof noticeData !== 'object') return false;
  if (noticeData.enabled === 'false') return false;
  if (!noticeData.title || !noticeData.title.trim()) return false;
  if (
    noticeData.title.trim() === 'माँ दुर्गा उच्चतर माध्यमिक विद्यालय सेमरिया में प्रवेश प्रारंभ!' &&
    !noticeData.isUpdated &&
    !noticeData.updatedAt
  ) {
    return false;
  }
  return true;
}

export function compressImageToTargetSize(
  file: File,
  maxKb = 10
): Promise<{ base64: string; sizeKb: string; originalSizeKb: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('कृपया एक वैध फोटो फ़ाइल (JPG/PNG/WEBP) चुनें।'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context उपलब्ध नहीं है।'));
          return;
        }

        const maxDim = 520;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const targetBytes = maxKb * 1024;
        let quality = 0.72;
        let base64 = canvas.toDataURL('image/jpeg', quality);

        const calcByteSize = (dataUrl: string) => {
          const head = 'data:image/jpeg;base64,';
          const body = dataUrl.startsWith(head) ? dataUrl.slice(head.length) : dataUrl;
          return Math.round((body.length * 3) / 4);
        };

        let byteSize = calcByteSize(base64);
        let loopCount = 0;

        while (byteSize > targetBytes && loopCount < 12) {
          loopCount++;
          if (quality > 0.3) {
            quality -= 0.08;
          } else {
            width = Math.max(80, Math.round(width * 0.8));
            height = Math.max(80, Math.round(height * 0.8));
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            quality = 0.58;
          }
          base64 = canvas.toDataURL('image/jpeg', quality);
          byteSize = calcByteSize(base64);
        }

        resolve({
          base64,
          sizeKb: (byteSize / 1024).toFixed(1),
          originalSizeKb: (file.size / 1024).toFixed(1),
          width,
          height,
        });
      };
      img.onerror = () => reject(new Error('फोटो लोड करने में विफल'));
      img.src = String(e.target?.result || '');
    };
    reader.onerror = () => reject(new Error('फ़ाइल पढ़ने में त्रुटि'));
    reader.readAsDataURL(file);
  });
}
