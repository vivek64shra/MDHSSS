import {
  DEFAULT_GALLERY_IMAGES,
  DEFAULT_RESULT_LINK_CONFIG,
  GalleryImageItem,
  isValidActiveNotice,
  PopupNoticeConfig,
  PortalStoreSnapshot,
  ResultLinkConfig,
  sortWhatsAppGroups,
  TICKER_THEMES,
  TickerMarqueeConfig,
  WhatsAppGroupItem,
} from '../types/portal';

const WA_SVG_ICON = `<svg class="wa-svg-inline" viewBox="0 0 24 24" style="width:1.15rem; height:1.15rem; fill:currentColor; vertical-align:middle;"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.126-.525-1.704-.7-2.779-2.42-2.864-2.535-.086-.115-.691-.92-1.077-.92-.387 0-.58.077-.788.286-.208.208-.795.777-.795 1.895 0 1.118.814 2.197.928 2.35.114.153 1.589 2.426 3.849 3.401.538.232.958.371 1.286.475.541.172 1.033.148 1.423.09.435-.065 1.336-.546 1.527-1.072.191-.527.191-.979.134-1.073-.058-.094-.211-.153-.443-.269z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.436 5.176L2 22l4.98-1.398A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.636 0-3.16-.487-4.437-1.326l-.318-.21-2.96.83.844-2.884-.23-.332A8.12 8.12 0 0 1 3.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z"/></svg>`;

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeHref(url: string): string {
  const trimmed = String(url || '').trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return '#';
}

let lastAutoPopupVersion: string | null = null;

export function applyNoticeToPublicDom(noticeData: PopupNoticeConfig | null, ready: boolean) {
  const modalEl = document.getElementById('firstTimeNoticeModal');
  const bellPulse = document.getElementById('navBellPulseDot');

  // Never flash unverified notice before Firestore check completes
  if (!ready) {
    if (modalEl && !(window as any)._manualNoticeModalOpen) {
      modalEl.style.display = 'none';
    }
    return;
  }

  if (!isValidActiveNotice(noticeData)) {
    if (modalEl && !(window as any)._manualNoticeModalOpen) {
      modalEl.style.display = 'none';
    }
    if (bellPulse) bellPulse.style.display = 'none';
    return;
  }

  // Populate notice modal fields safely via textContent
  const badgeEl = document.getElementById('firstNoticeBadge');
  const titleEl = document.getElementById('firstNoticeTitle');
  const bodyEl = document.getElementById('firstNoticeBodyText');
  const highlightsEl = document.getElementById('firstNoticeHighlights');
  const helplineEl = document.getElementById('firstNoticeHelpline');
  const btnEl = document.getElementById('firstNoticeActionBtn');

  if (badgeEl) badgeEl.textContent = noticeData.badge?.trim() || '🔔 आवश्यक सूचना';
  if (titleEl) titleEl.textContent = noticeData.title?.trim() || '';

  if (bodyEl) {
    if (noticeData.body?.trim()) {
      bodyEl.textContent = noticeData.body.trim();
      bodyEl.style.display = 'block';
    } else {
      bodyEl.textContent = '';
      bodyEl.style.display = 'none';
    }
  }

  if (highlightsEl) {
    if (noticeData.highlights?.trim()) {
      highlightsEl.textContent = noticeData.highlights.trim();
      highlightsEl.style.display = 'block';
    } else {
      highlightsEl.textContent = '';
      highlightsEl.style.display = 'none';
    }
  }

  if (helplineEl) {
    if (noticeData.helpline?.trim()) {
      helplineEl.textContent = noticeData.helpline.trim();
      helplineEl.style.display = 'flex';
    } else {
      helplineEl.textContent = '';
      helplineEl.style.display = 'none';
    }
  }

  if (btnEl) {
    if (noticeData.btnText?.trim()) {
      btnEl.textContent = noticeData.btnText.trim();
      btnEl.style.display = 'inline-flex';
    } else {
      btnEl.textContent = '';
      btnEl.style.display = 'none';
    }
  }

  const noticeVer = (noticeData.updatedAt || noticeData.title || 'v1').trim();
  const lastSeenVer = localStorage.getItem('mdhss_notice_last_seen_ver');
  const sessionDismissed = sessionStorage.getItem('mdhss_notice_dismissed_' + noticeVer);
  const isNewOrUpdated = lastSeenVer !== noticeVer;

  if (bellPulse) {
    bellPulse.style.display = isNewOrUpdated ? 'block' : 'none';
  }

  // Only auto-open popup when user is NOT actively editing inside Admin Panel
  const currentPage = (window as any)._currentAppPage || 'home';
  if (currentPage === 'admin') return;

  if ((sessionDismissed !== 'true' || isNewOrUpdated) && lastAutoPopupVersion !== noticeVer) {
    lastAutoPopupVersion = noticeVer;
    if (modalEl) {
      modalEl.style.display = 'flex';
    }
  }
}

export function previewNoticeInPublicModal(noticeData: PopupNoticeConfig) {
  (window as any)._manualNoticeModalOpen = true;
  const badgeEl = document.getElementById('firstNoticeBadge');
  const titleEl = document.getElementById('firstNoticeTitle');
  const bodyEl = document.getElementById('firstNoticeBodyText');
  const highlightsEl = document.getElementById('firstNoticeHighlights');
  const helplineEl = document.getElementById('firstNoticeHelpline');
  const btnEl = document.getElementById('firstNoticeActionBtn');

  if (badgeEl) badgeEl.textContent = noticeData.badge?.trim() || '🔔 आवश्यक सूचना';
  if (titleEl) titleEl.textContent = noticeData.title?.trim() || 'माँ दुर्गा उच्चतर माध्यमिक विद्यालय सेमरिया';

  if (bodyEl) {
    bodyEl.textContent = noticeData.body?.trim() || '';
    bodyEl.style.display = noticeData.body?.trim() ? 'block' : 'none';
  }
  if (highlightsEl) {
    highlightsEl.textContent = noticeData.highlights?.trim() || '';
    highlightsEl.style.display = noticeData.highlights?.trim() ? 'block' : 'none';
  }
  if (helplineEl) {
    helplineEl.textContent = noticeData.helpline?.trim() || '';
    helplineEl.style.display = noticeData.helpline?.trim() ? 'flex' : 'none';
  }
  if (btnEl) {
    btnEl.textContent = noticeData.btnText?.trim() || '';
    btnEl.style.display = noticeData.btnText?.trim() ? 'inline-flex' : 'none';
  }

  const modalEl = document.getElementById('firstTimeNoticeModal');
  if (modalEl) modalEl.style.display = 'flex';
}

export function applyTickerToPublicDom(tickerData: TickerMarqueeConfig | null, ready: boolean) {
  const bar = document.getElementById('portalMarqueeBar');
  if (!bar) return;

  const currentPage = (window as any)._currentAppPage || 'home';
  if (currentPage === 'admin' || currentPage === 'teacher') {
    bar.style.setProperty('display', 'none', 'important');
    return;
  }

  if (!ready || !tickerData || tickerData.enabled === 'false' || !tickerData.text || !tickerData.text.trim()) {
    bar.style.display = 'none';
    return;
  }

  bar.style.display = 'flex';

  const tagEl = document.getElementById('portalMarqueeTag');
  const tagTextEl = document.getElementById('portalMarqueeTagText');
  const textEl = document.getElementById('portalMarqueeText');

  if (tagTextEl) {
    tagTextEl.textContent = tickerData.tag?.trim() || '🔔 प्रवेश सूचना';
  }

  if (textEl) {
    textEl.textContent = tickerData.text.trim();
    let duration = '52s';
    if (tickerData.speed === 'slow') duration = '80s';
    else if (tickerData.speed === 'fast') duration = '32s';
    textEl.style.animationDuration = duration;
  }

  const theme = TICKER_THEMES[tickerData.theme] || TICKER_THEMES.red;
  bar.style.background = theme.bar;
  if (tagEl) tagEl.style.background = theme.tag;
  bar.dataset.clickAction = tickerData.clickAction || 'admission';
}

export function applyWhatsAppGroupsToPublicDom(groups: WhatsAppGroupItem[], ready: boolean) {
  const grid = document.getElementById('publicWhatsAppCardsGrid');
  if (!grid) return;

  if (!ready) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:1.75rem 1.25rem; background:#f0fdf4; border:1.5px solid #86efac; border-radius:12px; color:#166534;">
        <div style="font-size:1.8rem; margin-bottom:6px;">☁️</div>
        <strong style="font-size:1rem;">फायरबेस क्लाउड से नवीनतम व्हाट्सएप ग्रुप लिंक लोड किए जा रहे हैं...</strong>
        <div style="font-size:0.8rem; color:#15803d; margin-top:4px;">कृपया एक पल प्रतीक्षा करें, लाइव डाटा लोड हो रहा है।</div>
      </div>
    `;
    return;
  }

  const activeGroups = sortWhatsAppGroups(groups).filter((g) => g.status !== 'inactive');

  if (activeGroups.length === 0) {
    grid.innerHTML =
      '<div style="grid-column: 1 / -1; text-align:center; padding:2.5rem; color:#64748b; background:#f8fafc; border-radius:12px; border:1px dashed #cbd5e1;">वर्तमान में कोई व्हाट्सएप ग्रुप लिंक सक्रिय नहीं है। कृपया स्कूल हेल्पलाइन पर संपर्क करें।</div>';
    return;
  }

  grid.innerHTML = activeGroups
    .map((item) => {
      const isCare = item.isCare || item.id === 'wa-helpline';
      const cardStyle = isCare ? 'background:#f0fdf4; border: 1.5px solid #86efac;' : '';
      const bubbleStyle = isCare ? 'background: linear-gradient(135deg, #16a34a, #15803d);' : '';
      const btnStyle = isCare ? 'background: linear-gradient(135deg, #16a34a, #15803d);' : '';
      const btnText = escapeHtml(
        item.btnText || (isCare ? 'Chat on WhatsApp ↗' : `Join ${item.className || 'Group'} ↗`)
      );
      const safeHref = escapeHtml(sanitizeHref(item.link));

      return `
        <div class="wa-class-card" style="${cardStyle}">
          <div class="wa-icon-bubble" style="${bubbleStyle}">${escapeHtml(item.badge || 'WA')}</div>
          <h4 class="wa-class-title">${escapeHtml(item.className || 'WhatsApp Group')}</h4>
          <p class="wa-class-sub">${escapeHtml(item.sub || 'आधिकारिक ग्रुप')}</p>
          <a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="btn-join-wa" style="${btnStyle}">
            ${WA_SVG_ICON}
            ${btnText}
          </a>
        </div>
      `;
    })
    .join('');
}

export function applyGalleryToPublicDom(customImages: GalleryImageItem[]) {
  const track = document.getElementById('galleryTrack');
  if (!track) return;

  const validCustom = Array.isArray(customImages) ? customImages : [];
  const allImages = [...validCustom, ...DEFAULT_GALLERY_IMAGES];
  const loopImages = [...allImages, ...allImages];

  track.innerHTML = loopImages
    .map((img) => {
      const safeUrl = escapeHtml(img.url || '/images/school_building.svg');
      const safeTitle = escapeHtml(img.title || 'स्कूल फोटो');
      const safeTag = escapeHtml(img.tag || '📸 फोटो');
      const safeDesc = escapeHtml(img.desc || '');
      return `
        <div class="gallery-card" data-preview-url="${safeUrl}" data-preview-title="${safeTitle}" onclick="window.openGalleryLightbox && window.openGalleryLightbox(this.dataset.previewUrl, this.dataset.previewTitle)">
          <div class="gallery-img-box">
            <img src="${safeUrl}" alt="${safeTitle}" loading="lazy" onerror="this.src='/images/school_building.svg'">
            <span class="gallery-tag-pill">${safeTag}</span>
          </div>
          <div class="gallery-info">
            <h4 class="gallery-title">${safeTitle}</h4>
            <p class="gallery-desc">${safeDesc}</p>
          </div>
        </div>
      `;
    })
    .join('');
}

export function applyResultLinkToPublicDom(config: ResultLinkConfig | null) {
  const merged: ResultLinkConfig = {
    ...DEFAULT_RESULT_LINK_CONFIG,
    ...(config || {}),
  };
  if (merged.url && merged.url.includes('online.edumentsolution.com')) {
    merged.url = DEFAULT_RESULT_LINK_CONFIG.url;
  }

  const displayUrl = document.getElementById('portalResultUrlDisplay');
  const mainBtn = document.getElementById('portalResultMainBtn') as HTMLAnchorElement | null;
  const btnLabel = document.getElementById('portalResultBtnLabel');
  const tagEl = document.getElementById('portalResultTag');
  const noteEl = document.getElementById('portalResultNote');
  const navResultLink = document.getElementById('navResultLinkDirect') as HTMLAnchorElement | null;

  if (displayUrl) displayUrl.textContent = merged.url;
  if (mainBtn) mainBtn.href = merged.url;
  if (btnLabel) btnLabel.textContent = merged.btnText;
  if (tagEl) tagEl.textContent = merged.tag;
  if (noteEl) noteEl.textContent = merged.note;
  if (navResultLink) navResultLink.href = merged.url;
}

export function syncAllPublicDom(snapshot: PortalStoreSnapshot) {
  applyNoticeToPublicDom(snapshot.popupNotice, snapshot.ready.popupNotice);
  applyTickerToPublicDom(snapshot.tickerMarquee, snapshot.ready.tickerMarquee);
  applyWhatsAppGroupsToPublicDom(snapshot.whatsappGroups, snapshot.ready.whatsappGroups);
  applyGalleryToPublicDom(snapshot.galleryImages);
  applyResultLinkToPublicDom(snapshot.resultLinkConfig);
}

// Clean in-page lightbox for gallery clicks (avoids blocked window.open popups in iframes)
if (typeof window !== 'undefined') {
  (window as any).openGalleryLightbox = (url: string, title: string) => {
    if (!url) return;
    let overlay = document.getElementById('mdhssGalleryLightbox');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'mdhssGalleryLightbox';
      overlay.style.cssText =
        'position:fixed;inset:0;background:rgba(15,23,42,0.85);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px);';
      overlay.onclick = (e) => {
        if (e.target === overlay && overlay) overlay.style.display = 'none';
      };
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `
      <div style="background:#ffffff;border-radius:16px;max-width:680px;width:100%;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.4);">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#0f172a;color:#ffffff;">
          <strong style="font-size:0.95rem;">${escapeHtml(title || 'विद्यालय गैलरी')}</strong>
          <button type="button" onclick="document.getElementById('mdhssGalleryLightbox').style.display='none'" style="background:rgba(255,255,255,0.15);border:none;color:#ffffff;width:30px;height:30px;border-radius:8px;cursor:pointer;font-weight:700;">✕</button>
        </div>
        <div style="padding:12px;background:#f8fafc;display:flex;align-items:center;justify-content:center;">
          <img src="${escapeHtml(url)}" alt="${escapeHtml(title || '')}" style="max-height:70vh;max-width:100%;border-radius:10px;object-fit:contain;" onerror="this.src='/images/school_building.svg'" />
        </div>
      </div>
    `;
    overlay.style.display = 'flex';
  };
}
