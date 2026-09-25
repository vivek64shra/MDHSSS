
    // Live Google Apps Script Webhook Endpoint (Provided by User)
    const DEFAULT_GOOGLE_APPS_SCRIPT_WEBHOOK = 'https://script.google.com/macros/s/AKfycbw5eo9huYxTRr6hnIASFXTFiuDJaXXr6o5WG9ErOsXLbii9BM59hbVdQAPyUMx-qGbAtw/exec';

    // Default School Campus Visual Gallery Images
    const DEFAULT_GALLERY_IMAGES = [
      {
        id: 'img-1',
        title: 'मुख्य विद्यालय भवन व भव्य प्रांगण',
        desc: 'सेमरिया नगर का सर्वसुविधायुक्त एवं अनुशासित शैक्षणिक परिसर।',
        tag: '🏫 मुख्य परिसर',
        url: '/images/school_building.svg'
      },
      {
        id: 'img-2',
        title: 'डिजिटल स्मार्ट क्लासरूम',
        desc: 'इंटरैक्टिव स्मार्ट बोर्ड एवं ऑडियो-विजुअल शिक्षा प्रणाली।',
        tag: '💻 स्मार्ट क्लास',
        url: '/images/smart_classroom.svg'
      },
      {
        id: 'img-3',
        title: 'हाई-टेक साइंस लैबोरेटरी',
        desc: 'भौतिकी, रसायन व जीव विज्ञान के संपूर्ण प्रायोगिक उपकरण।',
        tag: '🔬 साइंस लैब',
        url: '/images/science_lab.svg'
      },
      {
        id: 'img-4',
        title: 'आधुनिक कंप्यूटर एवं आईटी लैब',
        desc: 'हाई-स्पीड इंटरनेट, कोडिंग एवं डिजिटल कौशल प्रशिक्षण।',
        tag: '🖥️ कंप्यूटर लैब',
        url: '/images/computer_lab.svg'
      },
      {
        id: 'img-5',
        title: 'समृद्ध पुस्तकालय व रीडिंग रूम',
        desc: 'एनसीईआरटी, म.प्र. बोर्ड पुस्तकें एवं प्रतियोगी संदर्भ ग्रंथ।',
        tag: '📚 पुस्तकालय',
        url: '/images/library_books.svg'
      },
      {
        id: 'img-6',
        title: 'खेलकूद एवं एथलेटिक्स ग्राउंड',
        desc: 'क्रिकेट, वॉलीबॉल, खो-खो एवं शारीरिक दक्षता प्रशिक्षण।',
        tag: '🏆 खेलकूद',
        url: '/images/sports_activities.svg'
      },
      {
        id: 'img-7',
        title: 'वार्षिक सांस्कृतिक उत्सव व मंच',
        desc: 'छात्र-छात्राओं की प्रतिभा एवं भारतीय संस्कारों का उत्सव।',
        tag: '🎭 सांस्कृतिक मंच',
        url: '/images/cultural_event.svg'
      },
      {
        id: 'img-8',
        title: 'सुरक्षित बस एवं परिवहन सेवा',
        desc: 'सेमरिया नगर एवं आसपास के समस्त ग्रामों तक सुरक्षित आवागमन।',
        tag: '🚌 स्कूल बस',
        url: '/images/school_bus.svg'
      }
    ];

    function toggleDropdown(btn) {
      if (btn && btn.closest) {
        const parent = btn.closest('.nav-item-rel') || btn.parentElement;
        if (parent) {
          parent.classList.toggle('open-dropdown');
        }
      }
    }
    window.toggleDropdown = toggleDropdown;

    // 1. Initial Seeding and Page Setup (Preloader removed for instant direct access)
    window.addEventListener('DOMContentLoaded', () => {

      // Always ensure Webhook URL is set to active Google Apps Script endpoint
      if (!localStorage.getItem('mdhss_google_sheets_webhook') || localStorage.getItem('mdhss_google_sheets_webhook') === '') {
        localStorage.setItem('mdhss_google_sheets_webhook', DEFAULT_GOOGLE_APPS_SCRIPT_WEBHOOK);
      }
      const webhookInput = document.getElementById('adminWebhookUrlInput');
      if (webhookInput) {
        webhookInput.value = localStorage.getItem('mdhss_google_sheets_webhook') || DEFAULT_GOOGLE_APPS_SCRIPT_WEBHOOK;
      }

      // Seed initial sample record if empty for instant preview & export testing
      if (!localStorage.getItem('mdhss_feedbacks')) {
        const initialFeedbacks = [
          {
            id: 'FB-1001',
            date: '2026-08-28 10:30 AM',
            name: 'राजेश कुमार पटेल',
            phone: '9826123456',
            class: 'Class 10th',
            role: 'अभिभावक (Parent)',
            subject: 'गणित व विज्ञान लैब',
            rating: 5,
            message: 'विद्यालय की शिक्षण व्यवस्था व अनुशासन बहुत ही सराहनीय है।'
          }
        ];
        localStorage.setItem('mdhss_feedbacks', JSON.stringify(initialFeedbacks));
      }

      if (!localStorage.getItem('mdhss_admissions')) {
        const initialAdmissions = [
          {
            id: 'ADM-2001',
            date: '2026-08-28 11:15 AM',
            studentName: 'अंकित शर्मा',
            fatherName: 'रमेश शर्मा',
            motherName: 'सुनीता शर्मा',
            phone: '9200178385',
            class: 'Class 11th - Mathematics',
            subject: 'PCM + Computer Science',
            remarks: 'नवीन प्रवेश सत्र 2026-27 हेतु आवेदन',
            address: 'सेमरिया, रीवा (म.प्र.)'
          }
        ];
        localStorage.setItem('mdhss_admissions', JSON.stringify(initialAdmissions));
      }

      if (!localStorage.getItem('mdhss_marks_sheets')) {
        const initialMarksSheets = [
          {
            formType: 'ExamMarks',
            id: 'MS-920101',
            date: '2026-08-28 02:45 PM',
            examType: 'त्रैमासिक परीक्षा 2026',
            className: 'Class 9',
            section: 'B',
            subject: 'गणित (Mathematics)',
            maxMarks: 100,
            passMarks: 33,
            teacherName: 'पुष्पेन्द्र द्विवेदी (परीक्षा नियंत्रक)',
            teacherPhone: '9753443093',
            enteredCount: 5,
            passCount: 4,
            failCount: 0,
            absentCount: 1,
            students: [
              { serial: 1, rollNo: '279201', name: 'आदित्य मिश्रा', marks: '88', status: 'Pass' },
              { serial: 2, rollNo: '279202', name: 'अंशिका तिवारी', marks: '92', status: 'Pass' },
              { serial: 3, rollNo: '279203', name: 'आयुष पटेल', marks: '76', status: 'Pass' },
              { serial: 4, rollNo: '279204', name: 'दीपक शुक्ला', marks: '64', status: 'Pass' },
              { serial: 5, rollNo: '279205', name: 'गौरव पाण्डेय', marks: 'AB', status: 'Absent' }
            ]
          }
        ];
        localStorage.setItem('mdhss_marks_sheets', JSON.stringify(initialMarksSheets));
      }

      // Initialize marks grid table and roll series
      generateMarksGrid();
      updateMarksSeriesInfo();

      // Load Result Portal Gateway Configuration
      loadAdminResultLinkConfig();

      // Render Home Auto-Scrolling Image Gallery
      renderAutoGallery();

      // Initialize Scrolling Ticker Marquee from localStorage / Cloud
      initTickerMarquee();

      // Notification Popup Check (Opened directly without delay)
      checkAndShowFirstTimeNotice();

      // Render WhatsApp Public Groups
      if (typeof renderPublicWhatsAppGroups === 'function') {
        renderPublicWhatsAppGroups();
      }

      // Initialize Exam Window & Result Time Limit Access Control
      if (typeof applyExamWindowConfigToUI === 'function') {
        applyExamWindowConfigToUI();
      }

      // Initialize Professional SPA History & Back Button Controller
      initBrowserHistoryRouting();
    });

    // 2. Mobile Menu, 3-Dot Drawer & Navigation Functions
    function openThreeDotMenu() {
      const drawer = document.getElementById('threeDotDrawer');
      const backdrop = document.getElementById('threeDotBackdrop');
      if (drawer) drawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      window.history.pushState({ modal: 'threeDotDrawer', page: window._currentAppPage || 'home' }, '', window.location.hash || '#menu');
    }
    window.openThreeDotMenu = openThreeDotMenu;

    function closeThreeDotMenu(fromPopState = false) {
      const drawer = document.getElementById('threeDotDrawer');
      const backdrop = document.getElementById('threeDotBackdrop');
      if (drawer) drawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
      if (!fromPopState && window.history.state && window.history.state.modal === 'threeDotDrawer') {
        window.history.back();
      }
    }
    window.closeThreeDotMenu = closeThreeDotMenu;

    function navigateToPageAndClose(pageId) {
      closeThreeDotMenu(true);
      navigateToPage(pageId);
    }
    window.navigateToPageAndClose = navigateToPageAndClose;

    // Close 3-Dot Drawer on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeThreeDotMenu();
      }
    });

    function toggleMobileNavMenu() {
      const navMenuList = document.getElementById('navMenuList');
      if (navMenuList) {
        navMenuList.classList.toggle('open-mobile');
        if (navMenuList.classList.contains('open-mobile')) {
          window.history.pushState({ modal: 'mobileNav', page: window._currentAppPage || 'home' }, '', window.location.hash || '#nav');
        }
      }
    }
    window.toggleMobileNavMenu = toggleMobileNavMenu;

    function openStudentResultDirect(event) {
      if (event && event.preventDefault) event.preventDefault();
      let resultUrl = 'https://online.edumentsolution.com/';
      try {
        const saved = localStorage.getItem('mdhss_result_link_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.url && parsed.url.trim()) {
            resultUrl = parsed.url.trim();
          }
        }
      } catch (e) {}
      window.open(resultUrl, '_blank');
    }
    window.openStudentResultDirect = openStudentResultDirect;

    // 3. PAGE ROUTING CONTROLLER (Page-Wise Multi-Screen Architecture)
    const PAGE_TITLES = {
      'about': { title: 'विद्यालय परिचय (About Us)', pill: '🏫 UDISE: 23140402055 | कोड: 322517' },
      'admission': { title: 'ऑनलाइन प्रवेश फॉर्म 2026-27 (Admission Form)', pill: '📝 सत्र 2026-27 प्रवेश प्रारंभ' },
      'whatsapp': { title: 'कक्षावार आधिकारिक व्हाट्सएप ग्रुप्स (WhatsApp Groups)', pill: '💬 Class 4th, 5th, 8th-12th' },
      'books': { title: 'म.प्र. बोर्ड ई-बुक्स एवं अध्ययन सामग्री (MP Board Books)', pill: '📚 All Books (mpboardbooks.com)' },
      'feedback': { title: 'विद्यालय सुधार हेतु प्रतिक्रिया व सुझाव (Feedback)', pill: '⭐ रेटिंग व बहुमूल्य सुझाव' },
      'staff': { title: 'शिक्षक एवं स्टाफ संपर्क डायरेक्टरी (Staff Directory)', pill: '📞 डायरेक्टरी व हेल्पलाइन' },
      'teacher': { title: 'शिक्षक पोर्टल एवं उपस्थिति (Teacher Portal)', pill: '👨‍🏫 उपस्थिति, परीक्षा अंक एवं शुल्क' },
      'student': { title: 'विद्यार्थी पोर्टल एवं परीक्षा परिणाम (Student & Results)', pill: '🏆 ऑनलाइन रिजल्ट व मार्कशीट' },
      'facilities': { title: 'विद्यालय सुविधाएं (Transport, Labs, Library)', pill: '🚌 GPS बस | लैब | लाइब्रेरी' },
      'admin': { title: 'प्रशासक नियंत्रण पोर्टल (Admin Portal)', pill: '🔐 सुरक्षित क्लाउड डेटाबेस' }
    };

    function navigateToPage(pageId, pushState = true) {
      // Normalize pageId
      if (!pageId || pageId === '') pageId = 'home';
      if (pageId === 'login') pageId = 'teacher';

      const homeSection = document.getElementById('home-main-section');
      const pagesContainer = document.getElementById('pages-container');
      const navHomeBtn = document.getElementById('navHomeBtn');
      const navMenuList = document.getElementById('navMenuList');
      const breadcrumbTitle = document.getElementById('pageBreadcrumbTitle');
      const headerPill = document.getElementById('pageHeaderPill');

      // Close mobile menu or 3-dot drawer if open
      if (navMenuList) navMenuList.classList.remove('open-mobile');
      closeThreeDotMenu(true);

      // Top navbar remains persistent across ALL pages
      const topNavbar = document.getElementById('mainTopNavbar');
      if (topNavbar) {
        topNavbar.style.removeProperty('display');
      }

      // Marquee Bar toggle (keep clean in teacher/admin mode)
      const marqueeBar = document.querySelector('.marquee-bar');
      if (pageId === 'admin' || pageId === 'teacher') {
        if (marqueeBar) marqueeBar.style.setProperty('display', 'none', 'important');
      } else {
        if (marqueeBar) marqueeBar.style.removeProperty('display');
      }

      // Top navbar notice bell visible ONLY on home page
      const navTopNoticeBell = document.getElementById('navTopNoticeBell');
      if (pageId === 'home') {
        if (navTopNoticeBell) navTopNoticeBell.style.display = 'inline-flex';
      } else {
        if (navTopNoticeBell) navTopNoticeBell.style.display = 'none';
      }

      // Professional History Management: Push browser state
      if (pushState) {
        const currentHash = (window.location.hash || '').replace(/^#/, '').trim();
        if (pageId === 'home') {
          if (currentHash !== '' && currentHash !== 'home') {
            window.history.pushState({ page: 'home' }, '', window.location.pathname + window.location.search);
          }
        } else {
          if (currentHash !== pageId) {
            window.history.pushState({ page: pageId }, '', '#' + pageId);
          }
        }
      }
      window._currentAppPage = pageId;

      // 1. If returning to Home
      if (pageId === 'home') {
        if (homeSection) homeSection.style.display = 'block';
        if (pagesContainer) pagesContainer.style.display = 'none';
        
        // Hide all subpages
        document.querySelectorAll('.subpage-view').forEach(v => v.style.display = 'none');

        // Reset active nav button
        document.querySelectorAll('.nav-link-btn').forEach(btn => btn.classList.remove('active-tab'));
        if (navHomeBtn) navHomeBtn.classList.add('active-tab');

        window.scrollTo(0, 0);
        return;
      }

      // 2. If navigating to a dedicated subpage
      if (homeSection) homeSection.style.display = 'none';
      if (pagesContainer) pagesContainer.style.display = 'block';

      // Hide all subpages first
      document.querySelectorAll('.subpage-view').forEach(v => v.style.display = 'none');

      // Show selected subpage
      const targetView = document.getElementById('view-' + pageId);
      if (targetView) {
        targetView.style.display = 'block';
      }

      // Highlight active nav buttons across header
      document.querySelectorAll('.nav-link-btn').forEach(btn => {
        btn.classList.remove('active-tab');
        const href = btn.getAttribute('href') || '';
        const onclick = btn.getAttribute('onclick') || '';
        if (href === '#' + pageId || onclick.includes("'" + pageId + "'")) {
          btn.classList.add('active-tab');
        }
      });

      // If teacher module, update login vs dashboard view
      if (pageId === 'teacher') {
        updateTeacherView();
      }

      // If admin module, update admin login vs dashboard view
      if (pageId === 'admin') {
        updateAdminView();
      }

      // If whatsapp page, re-render latest WhatsApp cards
      if (pageId === 'whatsapp') {
        if (typeof renderPublicWhatsAppGroups === 'function') {
          renderPublicWhatsAppGroups();
        }
      }

      // Update breadcrumb and header pill
      const pageMeta = PAGE_TITLES[pageId] || { title: pageId.toUpperCase(), pill: '🕒 समय: 9:30 AM - 4:00 PM' };
      if (breadcrumbTitle) breadcrumbTitle.textContent = pageMeta.title;
      if (headerPill) headerPill.textContent = pageMeta.pill;

      // Scroll to page top instantly without lag
      window.scrollTo(0, 0);
    }

    function initBrowserHistoryRouting() {
      // Determine initial requested page from URL hash
      let _lastHomeBackPressTime = 0;
      let _exitToastTimer = null;

      function showHomeExitNoticeToast() {
        let toast = document.getElementById('homeExitNoticeToast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'homeExitNoticeToast';
          toast.style.cssText = 'position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); background: #0f172a; color: #ffffff; padding: 11px 22px; border-radius: 999px; font-size: 0.88rem; font-weight: 700; z-index: 9999999; box-shadow: 0 10px 25px rgba(0,0,0,0.35); border: 1.5px solid #38bdf8; text-align: center; pointer-events: none; transition: all 0.25s ease; opacity: 0;';
          document.body.appendChild(toast);
        }
        toast.textContent = 'ℹ️ आप मुख्य पृष्ठ पर हैं। वेबसाइट से बाहर जाने के लिए तुरंत (2 सेकंड में) दोबारा बैक दबाएं।';
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        clearTimeout(_exitToastTimer);
        _exitToastTimer = setTimeout(() => {
          if (toast) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(10px)';
          }
        }, 2200);
      }
      window.showHomeExitNoticeToast = showHomeExitNoticeToast;

      const initialHash = (window.location.hash || '').replace(/^#/, '').trim();
      
      if (initialHash && initialHash !== 'home' && (PAGE_TITLES[initialHash] || initialHash === 'teacher' || initialHash === 'admin')) {
        // Base state is home, then subpage
        window.history.replaceState({ page: 'home', root: true }, '', '#home');
        window.history.pushState({ page: initialHash }, '', '#' + initialHash);
        navigateToPage(initialHash, false);
      } else {
        // Ensure double-buffer so back button lands on home first without closing site
        window.history.replaceState({ page: 'home', root: true }, '', '#home');
        window.history.pushState({ page: 'home' }, '', '#home');
        window._currentAppPage = 'home';
      }

      // Handle Hardware Back Button / Browser Back Button / Mobile Gestures
      window.addEventListener('popstate', (e) => {
        // 1. Dismiss Three-Dot drawer if active
        const drawer = document.getElementById('threeDotDrawer');
        if (drawer && drawer.classList.contains('active')) {
          closeThreeDotMenu(true);
          return;
        }

        // 2. Dismiss Mobile nav drawer if active
        const navMenuList = document.getElementById('navMenuList');
        if (navMenuList && navMenuList.classList.contains('open-mobile')) {
          navMenuList.classList.remove('open-mobile');
          return;
        }

        // 3. Dismiss Submit Confirm / Verification Modal if open
        const confirmModal = document.getElementById('marksSubmitConfirmModal');
        if (confirmModal && (confirmModal.style.display === 'flex' || getComputedStyle(confirmModal).display === 'flex')) {
          closeMarksConfirmModal(true);
          return;
        }

        // 4. Dismiss Admin Marks Modal if open
        const marksModal = document.getElementById('adminMarksDetailModal');
        if (marksModal && marksModal.style.display !== 'none' && getComputedStyle(marksModal).display !== 'none') {
          closeAdminMarksModal(true);
          return;
        }

        // 5. Dismiss Add Image Modal if open
        const addImgModal = document.getElementById('addImageModal');
        if (addImgModal && addImgModal.style.display !== 'none' && getComputedStyle(addImgModal).display !== 'none') {
          closeAddImageModal(true);
          return;
        }

        // 6. Dismiss First Time Notice Modal if open
        const firstNoticeModal = document.getElementById('firstTimeNoticeModal');
        if (firstNoticeModal && firstNoticeModal.style.display !== 'none' && getComputedStyle(firstNoticeModal).display !== 'none') {
          closeFirstTimeNotice(true);
          return;
        }

        // 7. Dismiss Roll Number List if open (keep teacher page, hide roll list)
        const rollSec = document.getElementById('marksRollNumberSection');
        if (rollSec && rollSec.style.display !== 'none' && getComputedStyle(rollSec).display !== 'none') {
          hideMarksRollNumberList();
          return;
        }

        // 8. If viewing a single student fee card and class roster was opened, go back to class roster
        const feeResultContainer = document.getElementById('teacherFeeResultContainer');
        if (feeResultContainer && feeResultContainer.style.display === 'block' && window._lastFeeRosterClass) {
          backToClassRoster();
          return;
        }

        // 9. If on a subpage (e.g. teacher, admission, feedback, whatsapp, admin, etc.), navigate back to Home!
        const currentAppPage = window._currentAppPage || 'home';
        if (currentAppPage !== 'home') {
          navigateToPage('home', false);
          return;
        }

        // 10. If already on Home: Double-back to exit safeguard prevents accidental closing of website!
        const now = Date.now();
        if (now - _lastHomeBackPressTime < 2200) {
          // User deliberately pressed back twice within 2.2 seconds: allow default browser exit
          return;
        } else {
          _lastHomeBackPressTime = now;
          window.history.pushState({ page: 'home', root: true }, '', '#home');
          showHomeExitNoticeToast();
        }
      });
    }

    // Scroll helper methods
    function scrollToFeedback() {
      navigateToPage('feedback');
    }

    function scrollToWhatsApp() {
      navigateToPage('whatsapp');
    }

    function scrollToContact() {
      navigateToPage('staff');
    }

    function showHomeScreen() {
      navigateToPage('home');
    }

    // =========================================================================
    // 4. TEACHER MODULE AUTHENTICATION & VERIFICATION (Google Sheets CSV)
    // =========================================================================
    const TEACHER_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuC9gle08lRMyMk8bjSGcXyRUSiZ-d6dJRqBWlHmw8Vjmi6yJfBeag3OI6w_UlJk10DsnxarzXKoBy/pub?output=csv";

    // Verified school staff directory for instantaneous fallback matching
    const BACKUP_STAFF_DIRECTORY = [
      { name: 'Nirmal K. Dwivedi', hindiName: 'निर्मल के. द्विवेदी', phone: '9200178385', post: 'प्राचार्य' },
      { name: 'Murlidhar Sharma', hindiName: 'मुरलीधर शर्मा', phone: '9201431631', post: 'विद्यालय संरक्षक' },
      { name: 'Akhilesh Tiwari', hindiName: 'अखिलेश तिवारी', phone: '7024036526', post: 'उपाचार्य' },
      { name: 'Ram Ratan Tiwari', hindiName: 'रामरतन तिवारी', phone: '7000570538', post: 'शैक्षणिक प्रभारी' },
      { name: 'Pushpendra Dwivedi', hindiName: 'पुष्पेन्द्र द्विवेदी', phone: '9753443093', post: 'परीक्षा नियंत्रक' },
      { name: 'Ramnaresh Tiwari', hindiName: 'रामनरेश तिवारी', phone: '7000084424', post: 'अनुशासन प्रभारी' },
      { name: 'Rajmani Shukla', hindiName: 'राजमणि शुक्ला', phone: '9981452293', post: 'परिवहन प्रभारी' },
      { name: 'Krishna Kumar Pandey', hindiName: 'कृष्ण कुमार पाण्डेय', phone: '6265613772', post: 'लेखाविभाग प्रमुख' },
      { name: 'Ganga Mishra', hindiName: 'गंगा मिश्रा', phone: '8269419720', post: 'स्कॉलर प्रभारी' },
      { name: 'Vivek Kumar Mishra', hindiName: 'विवेक कुमार मिश्रा', phone: '9516234519', post: 'कंप्यूटर ऑपरेटर' },
      { name: 'Ashok Kumar Shukla', hindiName: 'अशोक कुमार शुक्ला', phone: '9630327393', post: 'वरिष्ठ शिक्षक' },
      { name: 'Gyanendra Mishra', hindiName: 'ज्ञानेन्द्र मिश्रा', phone: '8839063673', post: 'वरिष्ठ शिक्षक' },
      { name: 'Sunita Dwivedi', hindiName: 'सुनीता द्विवेदी', phone: '9755497914', post: 'शिक्षिका' },
      { name: 'Pratibha Tiwari', hindiName: 'प्रतिभा तिवारी', phone: '9179836247', post: 'शिक्षिका' },
      { name: 'Priyanka Shukla', hindiName: 'प्रियंका शुक्ला', phone: '8319622538', post: 'शिक्षिका' },
      { name: 'Geeta Pandey', hindiName: 'गीता पाण्डेय', phone: '7489569720', post: 'शिक्षिका' },
      { name: 'Sangeeta Mishra', hindiName: 'संगीता मिश्रा', phone: '8818985833', post: 'शिक्षिका' },
      { name: 'Vandana Dwivedi', hindiName: 'वंदना द्विवेदी', phone: '9977824177', post: 'शिक्षिका' },
      { name: 'Archana Tiwari', hindiName: 'अर्चना तिवारी', phone: '9926515259', post: 'शिक्षिका' },
      { name: 'Rekha Sharma', hindiName: 'रेखा शर्मा', phone: '9752358321', post: 'शिक्षिका' }
    ];

    // CSV line parser supporting quoted values
    function parseCSVLine(text) {
      const result = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"') {
          inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          result.push(cur.trim());
          cur = '';
        } else {
          cur += c;
        }
      }
      result.push(cur.trim());
      return result;
    }

    function isNameMatch(input, target) {
      if (!input || !target) return false;
      const cleanIn = input.trim().toLowerCase();
      const cleanTarget = target.trim().toLowerCase();
      if (cleanIn === cleanTarget) return true;
      if (cleanTarget.includes(cleanIn) || cleanIn.includes(cleanTarget)) return true;

      // Match words (e.g. "Akhilesh" in "Akhilesh Tiwari")
      const inWords = cleanIn.split(/[\s,._-]+/).filter(w => w.length > 2);
      const targetWords = cleanTarget.split(/[\s,._-]+/).filter(w => w.length > 2);
      for (const iw of inWords) {
        for (const tw of targetWords) {
          if (iw === tw || tw.includes(iw) || iw.includes(tw)) return true;
        }
      }
      return false;
    }

    window._cachedTeacherDirectory = null;

    async function verifyTeacherCredentials(inputName, inputPhone) {
      const cleanPhone = inputPhone.replace(/\D/g, '').slice(-10);
      const cleanName = inputName.trim();

      if (!cleanPhone || cleanPhone.length !== 10) {
        return { success: false, message: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' };
      }
      if (!cleanName) {
        return { success: false, message: 'कृपया शिक्षक का नाम दर्ज करें।' };
      }

      let verifiedTeacher = null;

      // SPEED STEP 1: Instant check against verified School Staff directory (0ms latency)
      for (const staff of BACKUP_STAFF_DIRECTORY) {
        const sPhone = staff.phone.replace(/\D/g, '').slice(-10);
        if (sPhone === cleanPhone) {
          if (isNameMatch(cleanName, staff.name) || isNameMatch(cleanName, staff.hindiName)) {
            verifiedTeacher = {
              name: staff.hindiName + ' (' + staff.name + ')',
              phone: staff.phone,
              post: staff.post,
              source: 'Verified Staff Directory'
            };
            return { success: true, teacher: verifiedTeacher };
          }
        }
      }

      // SPEED STEP 2: Instant check against in-memory cached teacher sheet (if previously fetched)
      if (window._cachedTeacherDirectory && window._cachedTeacherDirectory.length > 0) {
        for (const t of window._cachedTeacherDirectory) {
          if (t.phone === cleanPhone && (isNameMatch(cleanName, t.name) || isNameMatch(cleanName, t.col1) || isNameMatch(cleanName, t.col2))) {
            return { success: true, teacher: t };
          }
        }
      }

      // SPEED STEP 3: High-speed timeout-guarded live Google Sheet CSV fetch
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second max timeout

        const res = await fetch(TEACHER_SHEET_CSV_URL, { signal: controller.signal, cache: 'default' });
        clearTimeout(timeoutId);

        if (res.ok) {
          const csvData = await res.text();
          const lines = csvData.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          const parsedTeachers = [];
          
          for (let i = 0; i < lines.length; i++) {
            const cols = parseCSVLine(lines[i]);
            if (cols.length < 1) continue;

            const col1 = (cols[0] || '').replace(/['"]/g, '').trim();
            const col2 = (cols[1] || '').replace(/['"]/g, '').trim();

            const phone1 = col2.replace(/\D/g, '').slice(-10);
            const phone2 = col1.replace(/\D/g, '').slice(-10);

            const recPhone = phone1 || phone2;
            const recName = col1 || col2;

            if (recPhone) {
              parsedTeachers.push({
                name: recName,
                col1,
                col2,
                phone: recPhone,
                source: 'Google Sheet Live'
              });
            }

            const isPhoneValid = (phone1 === cleanPhone) || (phone2 === cleanPhone);
            const isNameValid = isNameMatch(cleanName, col1) || isNameMatch(cleanName, col2);

            if (isPhoneValid && isNameValid && !verifiedTeacher) {
              verifiedTeacher = {
                name: col1 || col2 || cleanName,
                phone: cleanPhone,
                source: 'Google Sheet Live'
              };
            }
          }

          if (parsedTeachers.length > 0) {
            window._cachedTeacherDirectory = parsedTeachers;
          }
        }
      } catch (err) {
        console.warn('Teacher live sheet fast-path note:', err);
      }

      if (verifiedTeacher) {
        return { success: true, teacher: verifiedTeacher };
      } else {
        return { 
          success: false, 
          message: 'दर्ज किया गया शिक्षक नाम और मोबाइल नंबर रिकॉर्ड से मेल नहीं खाता है (Mismatch found)। कृपया विद्यालय में पंजीकृत सही नाम एवं 10 अंकों का मोबाइल नंबर दर्ज करें।' 
        };
      }
    }

    async function handleTeacherLoginSubmit(event) {
      event.preventDefault();
      const nameInput = document.getElementById('teacherLoginName');
      const phoneInput = document.getElementById('teacherLoginPhone');
      const loadingBox = document.getElementById('teacherLoginLoading');
      const errorBox = document.getElementById('teacherLoginError');
      const errorText = document.getElementById('teacherLoginErrorText');
      const loginBtn = document.getElementById('teacherLoginBtn');

      if (!nameInput || !phoneInput) return;

      const enteredName = nameInput.value.trim();
      const enteredPhone = phoneInput.value.trim();

      if (!enteredName || !enteredPhone) {
        if (errorBox && errorText) {
          errorText.textContent = 'कृपया शिक्षक का नाम एवं 10 अंकों का मोबाइल नंबर दोनों दर्ज करें।';
          errorBox.style.display = 'block';
        }
        return;
      }

      if (errorBox) errorBox.style.display = 'none';
      if (loadingBox) loadingBox.style.display = 'block';
      if (loginBtn) loginBtn.disabled = true;

      try {
        const result = await verifyTeacherCredentials(enteredName, enteredPhone);
        if (result.success) {
          sessionStorage.setItem('mdhss_teacher_session', JSON.stringify(result.teacher));
          if (loadingBox) loadingBox.style.display = 'none';
          if (loginBtn) loginBtn.disabled = false;
          
          updateTeacherView();
          document.getElementById('teacherLoginForm').reset();
        } else {
          if (loadingBox) loadingBox.style.display = 'none';
          if (loginBtn) loginBtn.disabled = false;
          if (errorBox && errorText) {
            errorText.textContent = result.message;
            errorBox.style.display = 'block';
          }
        }
      } catch (err) {
        if (loadingBox) loadingBox.style.display = 'none';
        if (loginBtn) loginBtn.disabled = false;
        if (errorBox && errorText) {
          errorText.textContent = 'सत्यापन के दौरान त्रुटि हुई। कृपया सही क्रेडेंशियल्स दर्ज करें।';
          errorBox.style.display = 'block';
        }
      }
    }

    function handleTeacherLogout() {
      sessionStorage.removeItem('mdhss_teacher_session');
      updateTeacherView();
    }

    function updateTeacherView() {
      const loginScreen = document.getElementById('teacher-login-screen');
      const dashboardScreen = document.getElementById('teacher-dashboard-screen');
      const sessionData = sessionStorage.getItem('mdhss_teacher_session');

      if (sessionData) {
        try {
          const teacher = JSON.parse(sessionData);
          if (loginScreen) loginScreen.style.display = 'none';
          if (dashboardScreen) dashboardScreen.style.display = 'block';

          const nameEl = document.getElementById('loggedTeacherName');
          const phoneEl = document.getElementById('loggedTeacherPhone');
          const avatarEl = document.getElementById('loggedTeacherAvatar');
          const teacherBadge = document.getElementById('marksTeacherBadge');
          const dateBadge = document.getElementById('marksCurrentDateBadge');

          const formattedNamePhone = `${teacher.name} (${teacher.phone})`;
          if (nameEl) nameEl.textContent = teacher.name;
          if (phoneEl) phoneEl.textContent = '📞 ' + teacher.phone + (teacher.post ? ' | ' + teacher.post : '');
          if (teacherBadge) teacherBadge.textContent = formattedNamePhone;
          if (dateBadge) dateBadge.textContent = new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' });

          if (avatarEl) {
            const initials = teacher.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '👨‍🏫';
            avatarEl.textContent = initials;
          }

          const attDateInput = document.getElementById('attDateInput');
          if (attDateInput && !attDateInput.value) {
            attDateInput.value = new Date().toISOString().slice(0, 10);
          }

          // Always present the 3 primary options first upon opening Teacher dashboard
          backToTeacherHub();
        } catch (e) {
          if (loginScreen) loginScreen.style.display = 'block';
          if (dashboardScreen) dashboardScreen.style.display = 'none';
        }
      } else {
        if (loginScreen) loginScreen.style.display = 'block';
        if (dashboardScreen) dashboardScreen.style.display = 'none';

        const teacherBadge = document.getElementById('marksTeacherBadge');
        if (teacherBadge) teacherBadge.textContent = 'अधिकृत शिक्षक';

        const errorBox = document.getElementById('teacherLoginError');
        if (errorBox) errorBox.style.display = 'none';
      }
    }

    // Return to the 3 Primary Teacher Options Hub
    function backToTeacherHub() {
      const hub = document.getElementById('teacherHubMainView');
      const navBar = document.getElementById('teacherActiveNavBar');
      const secMarks = document.getElementById('teacherSectionMarks');
      const secAbsent = document.getElementById('teacherSectionAbsent');
      const secFees = document.getElementById('teacherSectionFees');

      if (hub) hub.style.display = 'block';
      if (navBar) navBar.style.display = 'none';
      if (secMarks) secMarks.style.display = 'none';
      if (secAbsent) secAbsent.style.display = 'none';
      if (secFees) secFees.style.display = 'none';
    }

    // Open one of the 3 chosen options directly
    function openTeacherOption(tabName) {
      const hub = document.getElementById('teacherHubMainView');
      const navBar = document.getElementById('teacherActiveNavBar');

      if (hub) hub.style.display = 'none';
      if (navBar) navBar.style.display = 'flex';

      switchTeacherSectionTab(tabName);
    }

    // Helper for Total Absent Message template
    function copyAbsentMsgTemplate() {
      const dateStr = new Date().toLocaleDateString('hi-IN');
      const msg = `आदरणीय अभिभावक, आपका पाल्य आज दिनांक ${dateStr} को माँ दुर्गा उ.मा. विद्यालय सेमरिया में अनुपस्थित रहा है। कृपया नियमित उपस्थिति सुनिश्चित कराएं अथवा विद्यालय कार्यालय से संपर्क करें। - प्राचार्य (9200178385)`;
      navigator.clipboard.writeText(msg).then(() => {
        const notice = document.getElementById('absentTemplateNotice');
        if (notice) {
          notice.style.display = 'block';
          setTimeout(() => { notice.style.display = 'none'; }, 4000);
        }
      }).catch(() => {
        alert('ड्राफ्ट संदेश:\n' + msg);
      });
    }

    // Switch between 3 Teacher Dashboard Sections (Only 1 open at a time)
    function switchTeacherSectionTab(tabName) {
      const secMarks = document.getElementById('teacherSectionMarks');
      const secAbsent = document.getElementById('teacherSectionAbsent');
      const secFees = document.getElementById('teacherSectionFees');
      const btnMarks = document.getElementById('tabTeacherMarksBtn');
      const btnAbsent = document.getElementById('tabTeacherAbsentBtn');
      const btnFees = document.getElementById('tabTeacherFeesBtn');

      if (tabName === 'marks') {
        if (typeof applyExamWindowConfigToUI === 'function') {
          applyExamWindowConfigToUI();
        }
        if (typeof hideMarksRollNumberList === 'function') {
          hideMarksRollNumberList();
        }
        if (typeof onMarksExamTypeChange === 'function') {
          onMarksExamTypeChange();
        }
        if (secMarks) {
          secMarks.style.display = 'block';
          secMarks.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
        if (secAbsent) secAbsent.style.display = 'none';
        if (secFees) secFees.style.display = 'none';

        if (btnMarks) {
          btnMarks.style.background = '#0284c7';
          btnMarks.style.color = '#ffffff';
          btnMarks.style.borderColor = '#0284c7';
          btnMarks.style.boxShadow = '0 4px 12px rgba(2,132,199,0.25)';
        }
        if (btnAbsent) {
          btnAbsent.style.background = '#f8fafc';
          btnAbsent.style.color = '#475569';
          btnAbsent.style.borderColor = '#cbd5e1';
          btnAbsent.style.boxShadow = 'none';
        }
        if (btnFees) {
          btnFees.style.background = '#f8fafc';
          btnFees.style.color = '#475569';
          btnFees.style.borderColor = '#cbd5e1';
          btnFees.style.boxShadow = 'none';
        }
      } else if (tabName === 'absent') {
        if (secMarks) secMarks.style.display = 'none';
        if (secAbsent) {
          secAbsent.style.display = 'block';
          secAbsent.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
        if (secFees) secFees.style.display = 'none';

        if (btnAbsent) {
          btnAbsent.style.background = '#16a34a';
          btnAbsent.style.color = '#ffffff';
          btnAbsent.style.borderColor = '#16a34a';
          btnAbsent.style.boxShadow = '0 4px 12px rgba(22,163,74,0.25)';
        }
        if (btnMarks) {
          btnMarks.style.background = '#f8fafc';
          btnMarks.style.color = '#475569';
          btnMarks.style.borderColor = '#cbd5e1';
          btnMarks.style.boxShadow = 'none';
        }
        if (btnFees) {
          btnFees.style.background = '#f8fafc';
          btnFees.style.color = '#475569';
          btnFees.style.borderColor = '#cbd5e1';
          btnFees.style.boxShadow = 'none';
        }
      } else if (tabName === 'fees') {
        if (secMarks) secMarks.style.display = 'none';
        if (secAbsent) secAbsent.style.display = 'none';
        if (secFees) {
          secFees.style.display = 'block';
          secFees.scrollIntoView({ behavior: 'auto', block: 'start' });
          setTimeout(() => {
            const inp = document.getElementById('teacherFeeScholarInput');
            if (inp) inp.focus();
          }, 50);
        }

        if (btnFees) {
          btnFees.style.background = '#0d9488';
          btnFees.style.color = '#ffffff';
          btnFees.style.borderColor = '#0d9488';
          btnFees.style.boxShadow = '0 4px 12px rgba(13,148,136,0.25)';
        }
        if (btnMarks) {
          btnMarks.style.background = '#f8fafc';
          btnMarks.style.color = '#475569';
          btnMarks.style.borderColor = '#cbd5e1';
          btnMarks.style.boxShadow = 'none';
        }
        if (btnAbsent) {
          btnAbsent.style.background = '#f8fafc';
          btnAbsent.style.color = '#475569';
          btnAbsent.style.borderColor = '#cbd5e1';
          btnAbsent.style.boxShadow = 'none';
        }
      }
    }

    // ==========================================
    // 3. STUDENT FEE LOOKUP SYSTEM (Lazy-Loaded on Search)
    // ==========================================
    function escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
    window.escapeHtml = escapeHtml;

    const FEES_GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSv0gTbGo5P8wkB4CYuVIWzvXDOu1INb_L8beoaLYrXIyw9noqOIIln5PxxlP2S9apBakQfq48_YLZ8/pub?output=csv";
    const FEES_GOOGLE_SHEETS_XLSX_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSv0gTbGo5P8wkB4CYuVIWzvXDOu1INb_L8beoaLYrXIyw9noqOIIln5PxxlP2S9apBakQfq48_YLZ8/pub?output=xlsx";
    const FEES_SHEET_CSV_URL = FEES_GOOGLE_SHEETS_CSV_URL;
    window.FEES_GOOGLE_SHEETS_CSV_URL = FEES_GOOGLE_SHEETS_CSV_URL;
    window.FEES_GOOGLE_SHEETS_XLSX_URL = FEES_GOOGLE_SHEETS_XLSX_URL;
    window.FEES_SHEET_CSV_URL = FEES_GOOGLE_SHEETS_CSV_URL;
    window._cachedStudentFeesRecords = null;
    window._currentFoundStudentFee = null;
    window._activeTeacherFeeTab = 'all';
    window._studentFeesReportDate = '22-Sep-2026';

    function cleanReportDateStr(raw) {
      if (!raw) return '22-Sep-2026';
      const str = String(raw).trim();
      const match = str.match(/AS\s+ON\s+([A-Za-z0-9\-\.\/ ]+)/i);
      if (match && match[1]) {
        return match[1].trim();
      }
      return str.replace(/^["']|["']$/g, '').trim() || '22-Sep-2026';
    }
    window.cleanReportDateStr = cleanReportDateStr;

    function getFeeReportDate() {
      // 1. Live/in-memory date extracted from Excel/CSV sheet
      if (window._studentFeesReportDate && typeof window._studentFeesReportDate === 'string' && window._studentFeesReportDate.trim()) {
        return cleanReportDateStr(window._studentFeesReportDate);
      }
      // 2. Saved in localStorage
      try {
        const saved = localStorage.getItem('mdhss_fees_report_date');
        if (saved && saved.trim()) {
          return cleanReportDateStr(saved);
        }
      } catch (e) {}
      // 3. Fallback: Exact date from the school's Excel fee sheet (22-Sep-2026, never current date!)
      return '22-Sep-2026';
    }
    window.getFeeReportDate = getFeeReportDate;

    async function fetchStudentFeesSheetIfNeeded() {
      // 0. Instant offline packet access via window.MDHSS_STUDENT_FEES (works everywhere offline, netlify, github)
      if (window.MDHSS_STUDENT_FEES && Array.isArray(window.MDHSS_STUDENT_FEES) && window.MDHSS_STUDENT_FEES.length > 50) {
        window._cachedStudentFeesRecords = window.MDHSS_STUDENT_FEES;
        return window.MDHSS_STUDENT_FEES;
      }

      if (window._cachedStudentFeesRecords && window._cachedStudentFeesRecords.length > 0) {
        return window._cachedStudentFeesRecords;
      }

      // 0.1 Instant offline / zero-latency recovery from localStorage
      try {
        const localSaved = localStorage.getItem('mdhss_cached_student_fees_records');
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed) && parsed.length > 50) {
            window._cachedStudentFeesRecords = parsed;
            setTimeout(refreshLiveFeesInBackground, 2000);
            return parsed;
          }
        }
      } catch (e) {}

      // 1. Primary zero-latency path: /fees-data.json (1226 pre-parsed records)
      const jsonUrls = ['/fees-data.json', './fees-data.json', 'fees-data.json', 'public/fees-data.json'];
      for (const u of jsonUrls) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          const res = await fetch(u, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 50) {
              window._cachedStudentFeesRecords = data;
              try { localStorage.setItem('mdhss_cached_student_fees_records', JSON.stringify(data)); } catch (e) {}
              // Silent background refresh
              setTimeout(refreshLiveFeesInBackground, 2000);
              return data;
            }
          }
        } catch (e) {
          console.warn('Local json fees fetch notice:', u, e);
        }
      }

      // 2. Secondary fast path: Local server proxy /api/fees-sheet-csv
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch('/api/fees-sheet-csv', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const csvText = await res.text();
          if (csvText && csvText.length > 200 && !csvText.includes('<!DOCTYPE')) {
            const records = parseStudentFeesCSV(csvText);
            if (records && records.length > 0) {
              window._cachedStudentFeesRecords = records;
              try { localStorage.setItem('mdhss_cached_student_fees_records', JSON.stringify(records)); } catch (e) {}
              return records;
            }
          }
        }
      } catch (e) {
        console.warn('Proxy fees fetch notice, trying direct URL:', e);
      }

      // 3. Fallback path: /public/fees-data.csv or /fees-data.csv
      const csvUrls = ['/fees-data.csv', './fees-data.csv', 'fees-data.csv', 'public/fees-data.csv'];
      for (const u of csvUrls) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const res = await fetch(u, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.ok) {
            const csvText = await res.text();
            if (csvText && csvText.length > 200 && !csvText.includes('<!DOCTYPE')) {
              const records = parseStudentFeesCSV(csvText);
              if (records && records.length > 0) {
                window._cachedStudentFeesRecords = records;
                try { localStorage.setItem('mdhss_cached_student_fees_records', JSON.stringify(records)); } catch (e) {}
                return records;
              }
            }
          }
        } catch (e) {
          console.warn('Direct fees-data.csv notice:', u, e);
        }
      }

      // 4. Remote fallbacks: Google Sheets URL direct or CORS proxies
      const remoteUrls = [
        FEES_SHEET_CSV_URL,
        'https://api.allorigins.win/raw?url=' + encodeURIComponent(FEES_SHEET_CSV_URL),
        'https://corsproxy.io/?' + encodeURIComponent(FEES_SHEET_CSV_URL)
      ];

      for (const u of remoteUrls) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          const response = await fetch(u, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (response.ok) {
            const csvText = await response.text();
            if (csvText && csvText.length > 200) {
              const records = parseStudentFeesCSV(csvText);
              if (records && records.length > 0) {
                window._cachedStudentFeesRecords = records;
                try { localStorage.setItem('mdhss_cached_student_fees_records', JSON.stringify(records)); } catch (e) {}
                return records;
              }
            }
          }
        } catch (err) {
          console.warn('Remote fee fetch attempt notice:', u, err);
        }
      }

      throw new Error('छात्र फीस रिकॉर्ड लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।');
    }

    async function refreshLiveFeesInBackground() {
      try {
        const res = await fetch('/api/fees-sheet-csv');
        if (res.ok) {
          const csvText = await res.text();
          if (csvText && csvText.length > 200 && !csvText.includes('<!DOCTYPE')) {
            const records = parseStudentFeesCSV(csvText);
            if (records && records.length > 0) {
              window._cachedStudentFeesRecords = records;
            }
          }
        }
      } catch (e) {}
    }

    function parseStudentFeesCSV(csvText) {
      const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      const records = [];

      // Extract update date from Excel row 1 / header line (e.g. "DUE FEE REPORT AS ON 22-Sep-2026")
      if (lines.length > 0) {
        const firstLine = lines[0];
        const cols0 = parseCSVLine(firstLine);
        const titleCol = (cols0[0] || '').trim();
        if (titleCol && /AS\s+ON/i.test(titleCol)) {
          const extractedDate = cleanReportDateStr(titleCol);
          window._studentFeesReportDate = extractedDate;
          try { localStorage.setItem('mdhss_fees_report_date', extractedDate); } catch (e) {}
        }
      }

      for (let i = 0; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (cols.length < 5) continue;

        const col0 = (cols[0] || '').trim();
        const col1 = (cols[1] || '').trim();
        const col2 = (cols[2] || '').trim();
        const col3 = (cols[3] || '').trim();
        const col4 = (cols[4] || '').trim();

        // Skip headers
        const l0 = col0.toLowerCase();
        const l1 = col1.toLowerCase();
        const l2 = col2.toLowerCase();
        if (l0.includes('due fee report') || l0 === 's.no' || l1.includes('scholar') || l2.includes('student name')) {
          continue;
        }

        if (!col1 || !col2) continue;

        records.push({
          sNo: col0 || (records.length + 1).toString(),
          scholarNo: col1,
          studentName: col2,
          fatherName: col3,
          className: col4,
          prevYearDue: cols[5] || '0',
          admissionFeeNew: cols[6] || '0',
          renewableFee: cols[7] || '0',
          boysFund: cols[8] || '0',
          tution1: cols[9] || '0',
          tution2: cols[10] || '0',
          conveyanceJuly: cols[11] || '0',
          conveyanceAugust: cols[12] || '0',
          tution3: cols[13] || '0',
          tution4: cols[14] || '0',
          conveyanceSeptember: cols[15] || '0',
          conveyanceOctober: cols[16] || '0',
          tution5: cols[17] || '0',
          conveyanceNovember: cols[18] || '0',
          conveyanceDecember: cols[19] || '0',
          decRegistrationFee: cols[20] || '0',
          conveyanceJanuary: cols[21] || '0',
          conveyanceFebruary: cols[22] || '0',
          conveyanceMarch: cols[23] || '0',
          conveyanceApril: cols[24] || '0',
          aprilOldDue: cols[25] || '0',
          lateFee: cols[26] || '0',
          advanceAdjustable: cols[27] || '0',
          total: cols[28] || '0'
        });
      }

      return records;
    }

    // Convert Hindi / Devanagari numerals (०-९) to ASCII (0-9)
    function toAsciiDigits(str) {
      if (!str) return '';
      return str.toString().replace(/[०-९]/g, d => "०१२३४५६७८९".indexOf(d));
    }

    async function handleStudentFeeSearchSubmit(event) {
      if (event) event.preventDefault();
      const inputEl = document.getElementById('teacherFeeScholarInput');
      const rawQuery = (inputEl?.value || '').trim();
      const query = toAsciiDigits(rawQuery).trim();

      if (!query) {
        showTeacherFeeError('स्कॉलर नंबर या नाम आवश्यक है', 'कृपया विद्यार्थी का स्कॉलर नंबर अथवा नाम दर्ज करें।');
        return;
      }

      const loadingEl = document.getElementById('teacherFeeLoading');
      const emptyEl = document.getElementById('teacherFeeEmptyState');
      const errorEl = document.getElementById('teacherFeeError');
      const resultContainer = document.getElementById('teacherFeeResultContainer');
      const multiMatchContainer = document.getElementById('teacherFeeMultiMatchContainer');
      const classRosterContainer = document.getElementById('teacherFeeClassRosterContainer');
      const searchBtn = document.getElementById('btnTeacherFeeSearch');

      if (loadingEl) loadingEl.style.display = 'block';
      if (emptyEl) emptyEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';
      if (resultContainer) resultContainer.style.display = 'none';
      if (multiMatchContainer) multiMatchContainer.style.display = 'none';
      if (classRosterContainer) classRosterContainer.style.display = 'none';
      if (searchBtn) searchBtn.disabled = true;

      try {
        const records = await fetchStudentFeesSheetIfNeeded();
        const cleanQuery = query.toLowerCase().replace(/\s+/g, '');

        // 1. Exact Scholar No match
        let exactScholarMatches = records.filter(r => r.scholarNo && r.scholarNo.trim() === query);

        if (exactScholarMatches.length === 1) {
          if (loadingEl) loadingEl.style.display = 'none';
          if (searchBtn) searchBtn.disabled = false;
          window._currentFoundStudentFee = exactScholarMatches[0];
          const classRosterContainer = document.getElementById('teacherFeeClassRosterContainer');
          if (classRosterContainer) classRosterContainer.style.display = 'none';
          const multiMatchContainer = document.getElementById('teacherFeeMultiMatchContainer');
          if (multiMatchContainer) multiMatchContainer.style.display = 'none';
          renderStudentFeeResult(exactScholarMatches[0]);
          return;
        } else if (exactScholarMatches.length > 1) {
          if (loadingEl) loadingEl.style.display = 'none';
          if (searchBtn) searchBtn.disabled = false;
          renderMultiStudentMatches(exactScholarMatches, rawQuery);
          return;
        }

        // 2. Scholar No contains or normalized match
        let scholarMatches = records.filter(r => r.scholarNo && r.scholarNo.toLowerCase().replace(/\s+/g, '') === cleanQuery);
        if (scholarMatches.length === 1) {
          if (loadingEl) loadingEl.style.display = 'none';
          if (searchBtn) searchBtn.disabled = false;
          window._currentFoundStudentFee = scholarMatches[0];
          const classRosterContainer = document.getElementById('teacherFeeClassRosterContainer');
          if (classRosterContainer) classRosterContainer.style.display = 'none';
          const multiMatchContainer = document.getElementById('teacherFeeMultiMatchContainer');
          if (multiMatchContainer) multiMatchContainer.style.display = 'none';
          renderStudentFeeResult(scholarMatches[0]);
          return;
        } else if (scholarMatches.length > 1) {
          if (loadingEl) loadingEl.style.display = 'none';
          if (searchBtn) searchBtn.disabled = false;
          renderMultiStudentMatches(scholarMatches, rawQuery);
          return;
        }

        // 3. Name or Father Name match
        let nameMatches = records.filter(r => {
          const sName = (r.studentName || '').toLowerCase();
          const fName = (r.fatherName || '').toLowerCase();
          const sNo = (r.scholarNo || '').toLowerCase();
          const q = query.toLowerCase();
          return sNo.includes(cleanQuery) || sName.includes(q) || fName.includes(q);
        });

        if (loadingEl) loadingEl.style.display = 'none';
        if (searchBtn) searchBtn.disabled = false;

        if (nameMatches.length === 1) {
          window._currentFoundStudentFee = nameMatches[0];
          const classRosterContainer = document.getElementById('teacherFeeClassRosterContainer');
          if (classRosterContainer) classRosterContainer.style.display = 'none';
          const multiMatchContainer = document.getElementById('teacherFeeMultiMatchContainer');
          if (multiMatchContainer) multiMatchContainer.style.display = 'none';
          renderStudentFeeResult(nameMatches[0]);
        } else if (nameMatches.length > 1) {
          renderMultiStudentMatches(nameMatches, rawQuery);
        } else {
          showTeacherFeeError('छात्र रिकॉर्ड नहीं मिला', `सर्च "${escapeHtml(rawQuery)}" का कोई रिकॉर्ड उपलब्ध नहीं है। कृपया सही स्कॉलर नंबर (Enter Scholar Number) अथवा छात्र का नाम दर्ज करें।`);
        }
      } catch (err) {
        if (loadingEl) loadingEl.style.display = 'none';
        if (searchBtn) searchBtn.disabled = false;
        showTeacherFeeError('डेटा लोड त्रुटि', 'छात्र शुल्क रिकॉर्ड प्राप्त करने में असमर्थ। कृपया पुनः प्रयास करें।');
      }
    }

    // Render list when multiple students match search query
    function renderMultiStudentMatches(matches, searchQuery) {
      const container = document.getElementById('teacherFeeMultiMatchContainer');
      if (!container) return;

      let rowsHtml = matches.slice(0, 50).map((s, idx) => `
        <tr style="border-bottom: 1px solid #f1f5f9; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          <td style="padding: 10px 12px; font-weight: 700; color: #64748b;">${idx + 1}</td>
          <td style="padding: 10px 12px; font-weight: 800; color: #0284c7;">${escapeHtml(s.scholarNo || '-')}</td>
          <td style="padding: 10px 12px; font-weight: 800; color: #0f172a;">${escapeHtml(s.studentName || '-')}</td>
          <td style="padding: 10px 12px; color: #475569;">${escapeHtml(s.fatherName || '-')}</td>
          <td style="padding: 10px 12px; font-weight: 700; color: #0d9488;">${escapeHtml(s.className || '-')}</td>
          <td style="padding: 10px 12px; font-weight: 900; color: #0f766e;">${formatFeeCurrency(s.total)}</td>
          <td style="padding: 10px 12px; text-align: right;">
            <button type="button" onclick="selectStudentForFeeView('${escapeHtml(s.scholarNo)}')" style="background: #0d9488; color: #ffffff; border: none; border-radius: var(--radius-sm); padding: 6px 12px; font-weight: 700; font-size: 0.85rem; cursor: pointer; box-shadow: 0 2px 6px rgba(13,148,136,0.2);">
              विवरण देखें 👁️
            </button>
          </td>
        </tr>
      `).join('');

      container.innerHTML = `
        <div style="background: #ffffff; border: 2px solid #5eead4; border-radius: var(--radius-md); padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 1rem; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 0.75rem;">
            <div style="font-weight: 800; color: #0f766e; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
              <span>👥</span> <span>कुल ${matches.length} छात्र मिले ("${escapeHtml(searchQuery)}")</span>
            </div>
            <span style="font-size: 0.85rem; color: #64748b; font-weight: 600;">
              वांछित छात्र के सामने <strong>'विवरण देखें'</strong> पर क्लिक करें
            </span>
          </div>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
              <thead>
                <tr style="background: #f0fdfa; color: #0f766e; border-bottom: 2px solid #99f6e4;">
                  <th style="padding: 10px 12px;">#</th>
                  <th style="padding: 10px 12px;">स्कॉलर नं</th>
                  <th style="padding: 10px 12px;">विद्यार्थी का नाम</th>
                  <th style="padding: 10px 12px;">पिता का नाम</th>
                  <th style="padding: 10px 12px;">कक्षा</th>
                  <th style="padding: 10px 12px;">कुल देय फीस</th>
                  <th style="padding: 10px 12px; text-align: right;">एक्शन</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      `;

      container.style.display = 'block';
    }

    // Handle Class Dropdown selection to view all students in that class
    async function handleClassFeeFilterChange(className) {
      const classVal = (className || '').trim();
      window._lastFeeRosterClass = classVal;
      const emptyEl = document.getElementById('teacherFeeEmptyState');
      const errorEl = document.getElementById('teacherFeeError');
      const resultContainer = document.getElementById('teacherFeeResultContainer');
      const multiMatchContainer = document.getElementById('teacherFeeMultiMatchContainer');
      const classRosterContainer = document.getElementById('teacherFeeClassRosterContainer');
      const loadingEl = document.getElementById('teacherFeeLoading');

      if (!classVal) {
        clearTeacherFeeSearch();
        return;
      }

      if (loadingEl) loadingEl.style.display = 'block';
      if (emptyEl) emptyEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';
      if (resultContainer) resultContainer.style.display = 'none';
      if (multiMatchContainer) multiMatchContainer.style.display = 'none';
      if (classRosterContainer) classRosterContainer.style.display = 'none';

      try {
        const records = await fetchStudentFeesSheetIfNeeded();
        if (loadingEl) loadingEl.style.display = 'none';

        const filtered = records.filter(r => r.className && r.className.trim().toUpperCase() === classVal.toUpperCase());

        if (!filtered || filtered.length === 0) {
          showTeacherFeeError('कक्षा रिकॉर्ड नहीं मिला', `कक्षा "${escapeHtml(classVal)}" में कोई छात्र रिकॉर्ड नहीं मिला।`);
          return;
        }

        // Render Class Roster Table
        let rowsHtml = filtered.map((s, idx) => `
          <tr style="border-bottom: 1px solid #f1f5f9; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 10px 12px; font-weight: 700; color: #64748b;">${idx + 1}</td>
            <td style="padding: 10px 12px; font-weight: 800; color: #0284c7;">${escapeHtml(s.scholarNo || '-')}</td>
            <td style="padding: 10px 12px; font-weight: 800; color: #0f172a;">${escapeHtml(s.studentName || '-')}</td>
            <td style="padding: 10px 12px; color: #475569;">${escapeHtml(s.fatherName || '-')}</td>
            <td style="padding: 10px 12px; font-weight: 900; color: #0f766e;">${formatFeeCurrency(s.total)}</td>
            <td style="padding: 10px 12px; text-align: right;">
              <button type="button" onclick="selectStudentForFeeView('${escapeHtml(s.scholarNo)}')" style="background: #0d9488; color: #ffffff; border: none; border-radius: var(--radius-sm); padding: 6px 12px; font-weight: 700; font-size: 0.85rem; cursor: pointer; box-shadow: 0 2px 6px rgba(13,148,136,0.2);">
                विवरण देखें 👁️
              </button>
            </td>
          </tr>
        `).join('');

        classRosterContainer.innerHTML = `
          <div style="background: #ffffff; border: 2px solid #5eead4; border-radius: var(--radius-md); padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 1rem; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 0.75rem;">
              <div>
                <span class="section-chip" style="background: #e0f2fe; color: #0369a1; font-size: 0.8rem; font-weight: 800;">
                  कक्षा सूची (Classwise Roster)
                </span>
                <h4 style="margin: 4px 0 0 0; color: #0f766e; font-size: 1.2rem; font-weight: 800;">
                  🏫 कक्षा: ${escapeHtml(classVal)} (कुल विद्यार्थी: ${filtered.length})
                </h4>
              </div>
              <button type="button" onclick="clearTeacherFeeSearch()" class="btn-hero-sec" style="background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; padding: 6px 12px; font-size: 0.85rem; font-weight: 700; cursor: pointer;">
                ✕ सूची बंद करें
              </button>
            </div>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
                <thead>
                  <tr style="background: #f0fdfa; color: #0f766e; border-bottom: 2px solid #99f6e4;">
                    <th style="padding: 10px 12px;">#</th>
                    <th style="padding: 10px 12px;">स्कॉलर नं</th>
                    <th style="padding: 10px 12px;">विद्यार्थी का नाम</th>
                    <th style="padding: 10px 12px;">पिता का नाम</th>
                    <th style="padding: 10px 12px;">कुल देय फीस</th>
                    <th style="padding: 10px 12px; text-align: right;">एक्शन</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </div>
          </div>
        `;

        classRosterContainer.style.display = 'block';
      } catch (err) {
        if (loadingEl) loadingEl.style.display = 'none';
        showTeacherFeeError('कनेक्शन त्रुटि', 'छात्र शुल्क रिकॉर्ड प्राप्त करने में असमर्थ। कृपया इंटरनेट कनेक्शन जांचें।');
      }
    }

    // Return back to Class Roster from Single Student Fee View
    function backToClassRoster() {
      const resultContainer = document.getElementById('teacherFeeResultContainer');
      const classRosterContainer = document.getElementById('teacherFeeClassRosterContainer');
      if (resultContainer) resultContainer.style.display = 'none';
      if (classRosterContainer) {
        classRosterContainer.style.display = 'block';
        classRosterContainer.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
    window.backToClassRoster = backToClassRoster;

    // Select a student from Roster or Multi-match to view full fee slip
    async function selectStudentForFeeView(scholarNo) {
      if (!scholarNo) return;
      try {
        const records = await fetchStudentFeesSheetIfNeeded();
        const student = records.find(r => r.scholarNo && r.scholarNo.trim() === scholarNo.trim());
        if (student) {
          window._currentFoundStudentFee = student;

          // As requested by user: hide the class roster list and multi-match list so only this particular student's fee card is shown
          const classRosterContainer = document.getElementById('teacherFeeClassRosterContainer');
          if (classRosterContainer) classRosterContainer.style.display = 'none';
          const multiMatchContainer = document.getElementById('teacherFeeMultiMatchContainer');
          if (multiMatchContainer) multiMatchContainer.style.display = 'none';

          renderStudentFeeResult(student);
          const resContainer = document.getElementById('teacherFeeResultContainer');
          if (resContainer) {
            resContainer.style.display = 'block';
            resContainer.scrollIntoView({ behavior: 'auto', block: 'start' });
          }
        } else {
          showTeacherFeeError('त्रुटि', 'छात्र रिकॉर्ड प्राप्त नहीं हुआ।');
        }
      } catch (err) {
        showTeacherFeeError('त्रुटि', 'छात्र विवरण लोड करने में असमर्थ।');
      }
    }

    function showTeacherFeeError(title, desc) {
      const errorEl = document.getElementById('teacherFeeError');
      const titleEl = document.getElementById('teacherFeeErrorTitle');
      const descEl = document.getElementById('teacherFeeErrorDesc');
      const emptyEl = document.getElementById('teacherFeeEmptyState');
      const resultContainer = document.getElementById('teacherFeeResultContainer');
      const multiMatchContainer = document.getElementById('teacherFeeMultiMatchContainer');
      const classRosterContainer = document.getElementById('teacherFeeClassRosterContainer');

      if (emptyEl) emptyEl.style.display = 'none';
      if (resultContainer) resultContainer.style.display = 'none';
      if (multiMatchContainer) multiMatchContainer.style.display = 'none';
      if (classRosterContainer) classRosterContainer.style.display = 'none';
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
      if (errorEl) errorEl.style.display = 'block';
    }

    function clearTeacherFeeSearch() {
      const inputEl = document.getElementById('teacherFeeScholarInput');
      if (inputEl) inputEl.value = '';
      const classFilter = document.getElementById('teacherFeeClassFilter');
      if (classFilter) classFilter.value = '';

      const loadingEl = document.getElementById('teacherFeeLoading');
      const emptyEl = document.getElementById('teacherFeeEmptyState');
      const errorEl = document.getElementById('teacherFeeError');
      const resultContainer = document.getElementById('teacherFeeResultContainer');
      const multiMatchContainer = document.getElementById('teacherFeeMultiMatchContainer');
      const classRosterContainer = document.getElementById('teacherFeeClassRosterContainer');

      if (loadingEl) loadingEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';
      if (multiMatchContainer) {
        multiMatchContainer.style.display = 'none';
        multiMatchContainer.innerHTML = '';
      }
      if (classRosterContainer) {
        classRosterContainer.style.display = 'none';
        classRosterContainer.innerHTML = '';
      }
      if (resultContainer) {
        resultContainer.style.display = 'none';
        resultContainer.innerHTML = '';
      }
      if (emptyEl) emptyEl.style.display = 'block';
      window._currentFoundStudentFee = null;
      if (window.location.hash === '#teacher-fee') {
        window.history.replaceState({ page: 'teacher' }, '', '#teacher');
      }
    }

    function parseFeeNum(v) {
      if (v === null || v === undefined || v === '') return 0;
      const n = parseFloat(String(v).replace(/,/g, '').trim());
      return isNaN(n) ? 0 : Math.round(n);
    }
    window.parseFeeNum = parseFeeNum;

    function formatFeeCurrency(val) {
      if (val === null || val === undefined || val === '' || val === '-' || val === '0' || val === '0.00' || val === 0) return '₹0';
      const clean = String(val).replace(/[^0-9.-]/g, '');
      const num = parseFloat(clean);
      if (isNaN(num)) return '₹0';
      return '₹' + Math.round(num).toLocaleString('en-IN');
    }
    window.formatFeeCurrency = formatFeeCurrency;

    function buildTeacherFeeModel(student) {
      const sNo = student.sNo || student['S.No'] || '-';
      const scholarNo = String(student.scholarNo || student['Scholar No'] || '').trim();
      const studentName = String(student.studentName || student['Student Name'] || 'विद्यार्थी').trim();
      const fatherName = String(student.fatherName || student['Father Name'] || '-').trim();
      const className = String(student.className || student['Class Name'] || 'सामान्य').trim();

      const prevYearDue = parseFeeNum(student.prevYearDue || student['PREV YEAR DUE PREV YEAR DUE']);
      const admissionFee = parseFeeNum(student.admissionFeeNew || student['ADMISSION FEES NEW ADMISSION FEE']);
      const renewableFee = parseFeeNum(student.renewableFee || student['RENEWABLE FEE ADMISSION FEE']);
      const boysFund = parseFeeNum(student.boysFund || student['I INS BOYS FUND']);

      const u = parseFeeNum(student.tution1 || student['I INS TUTION FEE']);
      const d = parseFeeNum(student.tution2 || student['II INS TUTION FEE']);
      const f = parseFeeNum(student.tution3 || student['III INS TUTION FEE']);
      const p = parseFeeNum(student.tution4 || student['IV INS TUTION FEE']);
      const m = parseFeeNum(student.tution5 || student['V INS TUTION FEE']);
      const totalTuition = u + d + f + p + m;

      const conveyanceMonths = [
        { monthHindi: 'जुलाई', monthEng: 'July', val: parseFeeNum(student.conveyanceJuly || student['JULY CONVEYANCE FEE']) },
        { monthHindi: 'अगस्त', monthEng: 'August', val: parseFeeNum(student.conveyanceAugust || student['AUGUST CONVEYANCE FEE']) },
        { monthHindi: 'सितम्बर', monthEng: 'September', val: parseFeeNum(student.conveyanceSeptember || student['SEPTEMBER CONVEYANCE FEE']) },
        { monthHindi: 'अक्टूबर', monthEng: 'October', val: parseFeeNum(student.conveyanceOctober || student['OCTOBER CONVEYANCE FEE']) },
        { monthHindi: 'नवम्बर', monthEng: 'November', val: parseFeeNum(student.conveyanceNovember || student['NOVEMBER CONVEYANCE FEE']) },
        { monthHindi: 'दिसम्बर', monthEng: 'December', val: parseFeeNum(student.conveyanceDecember || student['DECEMBER CONVEYANCE FEE']) },
        { monthHindi: 'जनवरी', monthEng: 'January', val: parseFeeNum(student.conveyanceJanuary || student['JANUARY CONVEYANCE FEE']) },
        { monthHindi: 'फ़रवरी', monthEng: 'February', val: parseFeeNum(student.conveyanceFebruary || student['FEBRUARY CONVEYANCE FEE']) },
        { monthHindi: 'मार्च', monthEng: 'March', val: parseFeeNum(student.conveyanceMarch || student['MARCH CONVEYANCE FEE']) },
        { monthHindi: 'अप्रैल', monthEng: 'April', val: parseFeeNum(student.conveyanceApril || student['APRIL CONVEYANCE FEE']) }
      ];
      const totalConveyance = conveyanceMonths.reduce((acc, x) => acc + x.val, 0);

      const decRegistrationFee = parseFeeNum(student.decRegistrationFee || student['DECEMBER REGISTRATION FEE']);
      const aprilOldDueFee = parseFeeNum(student.aprilOldDue || student['APRIL OLD DUE FEE']);
      const lateFee = parseFeeNum(student.lateFee || student['Late Fee']);
      const advanceAdjustable = parseFeeNum(student.advanceAdjustable || student['Advance Adjustable']);

      const parsedTotal = parseFeeNum(student.total || student['Total']);
      const computedTotal = prevYearDue + admissionFee + renewableFee + boysFund + totalTuition + totalConveyance + decRegistrationFee + aprilOldDueFee + lateFee - advanceAdjustable;
      const grandTotal = parsedTotal > 0 ? parsedTotal : computedTotal;

      const items = [];
      if (renewableFee > 0) items.push({ id: 'renewable_fee', nameHindi: 'वार्षिक नवीनीकरण शुल्क', nameEnglish: 'Annual Renewal Fee', category: 'Admission', amount: renewableFee });
      if (admissionFee > 0) items.push({ id: 'admission_fee', nameHindi: 'नवीन प्रवेश शुल्क', nameEnglish: 'New Admission Fee', category: 'Admission', amount: admissionFee });
      if (prevYearDue > 0) items.push({ id: 'prev_year_due', nameHindi: 'गत वर्ष का पुराना बकाया', nameEnglish: 'Previous Year Dues', category: 'Dues', amount: prevYearDue });
      if (boysFund > 0) items.push({ id: 'boys_fund', nameHindi: 'प्रथम किश्त बालक निधि', nameEnglish: 'I Installment Boys Fund', category: 'Other', amount: boysFund });
      if (u > 0) items.push({ id: 'inst1_tuition', nameHindi: 'प्रथम किश्त शिक्षण शुल्क (I Term)', nameEnglish: 'I Installment Tuition Fee', category: 'Tuition', amount: u });
      if (d > 0) items.push({ id: 'inst2_tuition', nameHindi: 'द्वितीय किश्त शिक्षण शुल्क (II Term)', nameEnglish: 'II Installment Tuition Fee', category: 'Tuition', amount: d });
      if (f > 0) items.push({ id: 'inst3_tuition', nameHindi: 'तृतीय किश्त शिक्षण शुल्क (III Term)', nameEnglish: 'III Installment Tuition Fee', category: 'Tuition', amount: f });
      if (p > 0) items.push({ id: 'inst4_tuition', nameHindi: 'चतुर्थ किश्त शिक्षण शुल्क (IV Term)', nameEnglish: 'IV Installment Tuition Fee', category: 'Tuition', amount: p });
      if (m > 0) items.push({ id: 'inst5_tuition', nameHindi: 'पंचम किश्त शिक्षण शुल्क (V Term)', nameEnglish: 'V Installment Tuition Fee', category: 'Tuition', amount: m });

      conveyanceMonths.forEach(m => {
        if (m.val > 0) {
          items.push({ id: 'conveyance_' + m.monthEng.toLowerCase(), nameHindi: m.monthHindi + ' वाहन/बस शुल्क', nameEnglish: m.monthEng + ' Conveyance Fee', category: 'Conveyance', amount: m.val });
        }
      });

      if (decRegistrationFee > 0) items.push({ id: 'dec_reg_fee', nameHindi: 'दिसम्बर पंजीयन/बोर्ड शुल्क', nameEnglish: 'December Registration Fee', category: 'Other', amount: decRegistrationFee });
      if (aprilOldDueFee > 0) items.push({ id: 'april_old_due', nameHindi: 'अप्रैल पुराना बकाया शुल्क', nameEnglish: 'April Old Due Fee', category: 'Dues', amount: aprilOldDueFee });
      if (lateFee > 0) items.push({ id: 'late_fee', nameHindi: 'विलंब शुल्क (Late Fee)', nameEnglish: 'Late Fee', category: 'Other', amount: lateFee });
      if (advanceAdjustable > 0) items.push({ id: 'advance_adj', nameHindi: 'अग्रिम समायोजन (छूट/समायोजित)', nameEnglish: 'Advance Adjustable (-)', category: 'Other', amount: -advanceAdjustable });

      return {
        sNo,
        scholarNo,
        studentName,
        fatherName,
        className,
        prevYearDue,
        admissionFee,
        renewableFee,
        boysFund,
        totalTuition,
        totalConveyance,
        decRegistrationFee,
        aprilOldDueFee,
        lateFee,
        advanceAdjustable,
        grandTotal,
        items
      };
    }
    window.buildTeacherFeeModel = buildTeacherFeeModel;

    window.setTeacherFeeTab = function(tab) {
      window._activeTeacherFeeTab = tab;
      if (window._currentFoundStudentFee) {
        renderStudentFeeResult(window._currentFoundStudentFee);
      }
    };

    function renderStudentFeeResult(student) {
      const container = document.getElementById('teacherFeeResultContainer');
      if (!container) return;

      const model = buildTeacherFeeModel(student);
      const activeTab = window._activeTeacherFeeTab || 'all';

      const reportDate = getFeeReportDate();
      const session = '2026-27';

      // Items filtered by activeTab
      let itemsToShow = model.items;
      if (activeTab === 'current') {
        itemsToShow = model.items.filter(item => item.category !== 'Dues');
      } else if (activeTab === 'prev_year') {
        itemsToShow = model.items.filter(item => item.category === 'Dues');
      }

      // Tab subtotals
      const totalOutstanding = model.grandTotal;
      const prevYearTotal = model.prevYearDue + model.aprilOldDueFee;
      const currentYearTotal = Math.max(0, totalOutstanding - prevYearTotal);

      // Tab subtotal for displayed items
      const displayedSum = itemsToShow.reduce((acc, x) => acc + x.amount, 0);

      // Render items HTML
      const itemsHtml = itemsToShow.length > 0 ? itemsToShow.map((item, idx) => {
        const isDue = item.category === 'Dues' || item.id === 'prev_year_due' || item.id === 'april_old_due';
        const isRenewal = item.id === 'renewable_fee' || item.id === 'admission_fee';
        const rowBg = isDue ? 'background: #fffbeb;' : isRenewal ? 'background: #eef2ff;' : idx % 2 === 0 ? 'background: #ffffff;' : 'background: #f8fafc;';
        const amountColor = item.amount < 0 ? '#15803d' : isDue ? '#b45309' : '#0f172a';

        let categoryBadge = '#64748b';
        let categoryBg = '#f1f5f9';
        let categoryHindi = 'अन्य';
        if (item.category === 'Admission') { categoryBadge = '#4338ca'; categoryBg = '#e0e7ff'; categoryHindi = 'प्रवेश/नवीनीकरण'; }
        else if (item.category === 'Tuition') { categoryBadge = '#0369a1'; categoryBg = '#e0f2fe'; categoryHindi = 'शिक्षण शुल्क'; }
        else if (item.category === 'Conveyance') { categoryBadge = '#7c3aed'; categoryBg = '#ede9fe'; categoryHindi = 'वाहन/बस'; }
        else if (item.category === 'Dues') { categoryBadge = '#b45309'; categoryBg = '#fef3c7'; categoryHindi = 'गत वर्ष बकाया'; }

        return `
          <tr style="${rowBg} border-bottom: 1px solid #e2e8f0; transition: background 0.15s ease;">
            <td class="fee-col-sr" style="padding: 9px 8px; text-align: center; font-weight: 700; color: #64748b; font-family: monospace; width: 44px; border-right: 1px solid #e2e8f0;">${idx + 1}</td>
            <td class="fee-col-desc" style="padding: 9px 12px; border-right: 1px solid #e2e8f0;">
              <div style="font-weight: 800; color: #0f172a; font-size: 0.92rem; line-height: 1.3;">${escapeHtml(item.nameHindi)}</div>
              <div style="font-size: 0.78rem; color: #64748b; margin-top: 1px;">${escapeHtml(item.nameEnglish)}</div>
              <span class="fee-category-mobile-badge" style="background: ${categoryBg}; color: ${categoryBadge}; padding: 2px 7px; border-radius: 4px; font-size: 0.72rem; font-weight: 800;">
                ${escapeHtml(categoryHindi)}
              </span>
            </td>
            <td class="fee-category-col" style="padding: 9px 12px; border-right: 1px solid #e2e8f0; width: 140px;">
              <span style="display: inline-block; background: ${categoryBg}; color: ${categoryBadge}; padding: 3px 8px; border-radius: 6px; font-size: 0.76rem; font-weight: 800;">
                ${escapeHtml(categoryHindi)}
              </span>
            </td>
            <td class="fee-col-amt" style="padding: 9px 12px; text-align: right; font-weight: 800; font-family: monospace; font-size: 0.98rem; color: ${amountColor}; width: 130px;">
              ${item.amount < 0 ? '-' : ''}₹${Math.abs(item.amount).toLocaleString('en-IN')}
            </td>
          </tr>
        `;
      }).join('') : `
        <tr>
          <td colspan="4" style="text-align: center; padding: 2rem 1rem; color: #64748b; font-size: 0.95rem; background: #ffffff;">
            ✨ इस श्रेणी में कोई देय शुल्क शेष नहीं है (All Cleared)।
          </td>
        </tr>
      `;

      container.innerHTML = `
        <div class="fee-slip-card-container">
          
          ${window._lastFeeRosterClass ? `
          <div style="margin-bottom: 0.85rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <button type="button" onclick="backToClassRoster()" class="btn-hero-sec" style="background: #f0fdfa; color: #0f766e; border: 1.5px solid #99f6e4; padding: 6px 14px; font-size: 0.88rem; font-weight: 800; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px;">
              ⬅️ वापस कक्षा (${escapeHtml(window._lastFeeRosterClass)}) सूची देखें
            </button>
            <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">(कक्षा के अन्य विद्यार्थियों की सूची खोलने हेतु क्लिक करें)</span>
          </div>` : ''}

          <!-- Netlify-style Top Segmented Filter Tabs -->
          <div class="fee-tabs-grid">
            <button type="button" onclick="setTeacherFeeTab('all')" style="padding: 10px 12px; border-radius: 10px; font-size: 0.85rem; font-weight: 800; cursor: pointer; border: none; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; transition: all 0.2s ease; ${activeTab === 'all' ? 'background: #0d9488; color: #ffffff; box-shadow: 0 4px 12px rgba(13,148,136,0.3);' : 'background: transparent; color: #334155;'}">
              <span>📋 1. संपूर्ण शुल्क विवरण</span>
              <span style="font-size: 0.72rem; opacity: 0.9; font-weight: 700;">(कुल ₹${totalOutstanding.toLocaleString('en-IN')})</span>
            </button>
            <button type="button" onclick="setTeacherFeeTab('current')" style="padding: 10px 12px; border-radius: 10px; font-size: 0.85rem; font-weight: 800; cursor: pointer; border: none; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; transition: all 0.2s ease; ${activeTab === 'current' ? 'background: #0d9488; color: #ffffff; box-shadow: 0 4px 12px rgba(13,148,136,0.3);' : 'background: transparent; color: #334155;'}">
              <span>📅 2. वर्तमान सत्र (${session})</span>
              <span style="font-size: 0.72rem; opacity: 0.9; font-weight: 700;">(सत्र देय ₹${currentYearTotal.toLocaleString('en-IN')})</span>
            </button>
            <button type="button" onclick="setTeacherFeeTab('prev_year')" style="padding: 10px 12px; border-radius: 10px; font-size: 0.85rem; font-weight: 800; cursor: pointer; border: none; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; position: relative; transition: all 0.2s ease; ${activeTab === 'prev_year' ? 'background: #d97706; color: #ffffff; box-shadow: 0 4px 12px rgba(217,119,6,0.3);' : prevYearTotal > 0 ? 'background: #fef3c7; color: #92400e; border: 1px solid #fde68a;' : 'background: transparent; color: #334155;'}">
              ${prevYearTotal > 0 ? '<span style="position: absolute; top: -5px; right: -5px; background: #dc2626; color: #ffffff; border-radius: 999px; font-size: 0.65rem; padding: 2px 6px; font-weight: 900;">देय</span>' : ''}
              <span>⚠️ 3. गत वर्ष का पुराना बकाया</span>
              <span style="font-size: 0.72rem; opacity: 0.9; font-weight: 700;">(पुराना ₹${prevYearTotal.toLocaleString('en-IN')})</span>
            </button>
          </div>

          <!-- Netlify-style 5 Key Summary Cards -->
          <div class="fee-summary-cards-grid">
            <div style="background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 10px 12px; text-align: center;">
              <span style="font-size: 0.72rem; font-weight: 800; color: #065f46; display: block; text-transform: uppercase;">कुल देय शुल्क</span>
              <span style="font-size: 1.25rem; font-weight: 900; color: #047857; font-family: monospace; display: block; margin-top: 2px;">₹${totalOutstanding.toLocaleString('en-IN')}</span>
            </div>
            <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 10px 12px; text-align: center;">
              <span style="font-size: 0.72rem; font-weight: 800; color: #92400e; display: block; text-transform: uppercase;">गत वर्ष बकाया</span>
              <span style="font-size: 1.25rem; font-weight: 900; color: #b45309; font-family: monospace; display: block; margin-top: 2px;">₹${prevYearTotal.toLocaleString('en-IN')}</span>
            </div>
            <div style="background: #eef2ff; border: 1.5px solid #c7d2fe; border-radius: 12px; padding: 10px 12px; text-align: center;">
              <span style="font-size: 0.72rem; font-weight: 800; color: #3730a3; display: block; text-transform: uppercase;">वार्षिक नवीनीकरण</span>
              <span style="font-size: 1.25rem; font-weight: 900; color: #4338ca; font-family: monospace; display: block; margin-top: 2px;">₹${model.renewableFee.toLocaleString('en-IN')}</span>
            </div>
            <div style="background: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 10px 12px; text-align: center;">
              <span style="font-size: 0.72rem; font-weight: 800; color: #075985; display: block; text-transform: uppercase;">शिक्षण शुल्क</span>
              <span style="font-size: 1.25rem; font-weight: 900; color: #0284c7; font-family: monospace; display: block; margin-top: 2px;">₹${model.totalTuition.toLocaleString('en-IN')}</span>
            </div>
            <div style="background: #faf5ff; border: 1.5px solid #e9d5ff; border-radius: 12px; padding: 10px 12px; text-align: center;">
              <span style="font-size: 0.72rem; font-weight: 800; color: #6b21a8; display: block; text-transform: uppercase;">वाहन/बस शुल्क</span>
              <span style="font-size: 1.25rem; font-weight: 900; color: #7e22ce; font-family: monospace; display: block; margin-top: 2px;">₹${model.totalConveyance.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <!-- If Previous Year Dues Tab is Selected: Context Alert Box -->
          ${activeTab === 'prev_year' ? `
            <div style="background: #fffbeb; border: 1.5px solid #f59e0b; border-radius: 12px; padding: 12px 16px; margin-bottom: 1.25rem; display: flex; align-items: flex-start; gap: 10px;">
              <span style="font-size: 1.3rem;">⚠️</span>
              <div>
                <strong style="color: #92400e; font-size: 0.92rem; display: block;">गत वर्ष (Previous Academic Session) का पुराना बकाया विवरण:</strong>
                <p style="margin: 3px 0 0; color: #78350f; font-size: 0.85rem; line-height: 1.4;">
                  ${prevYearTotal > 0 ? `विद्यार्थी <strong>${escapeHtml(model.studentName)}</strong> का पूर्व शैक्षणिक सत्र का कुल <strong>₹${prevYearTotal.toLocaleString('en-IN')}</strong> पुराना बकाया शेष है। कृपया इसे विद्यालय कार्यालय में संपर्क कर समय पर समाधान कराएं।` : `विद्यार्थी का गत शैक्षणिक सत्र का कोई भी पुराना बकाया शेष नहीं है (₹0 - All Cleared)।`}
                </p>
              </div>
            </div>
          ` : ''}

          <!-- Official School Due Fee Slip Box -->
          <div id="officialFeeSlipPrintArea" class="fee-slip-inner-box">
            
            <!-- School Header with Codes -->
            <div style="border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; text-align: center;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 0.78rem; color: #475569; margin-bottom: 6px;">
                <span>डाइस कोड: <strong style="color: #0f172a; font-family: monospace;">23140402055</strong></span>
                <span style="background: #f0fdfa; color: #0d9488; border: 1px solid #99f6e4; padding: 2px 10px; border-radius: 999px; font-weight: 800;">सत्र: ${session}</span>
                <span>संस्था कोड: <strong style="color: #0f172a; font-family: monospace;">322517</strong></span>
              </div>
              <h3 style="margin: 4px 0 2px; color: #d93025; font-size: 1.3rem; font-weight: 900; letter-spacing: -0.2px;">
                माँ दुर्गा उच्च. माध्य. विद्यालय सेमरिया, जिला-रीवा (म.प्र.)
              </h3>
              <div style="font-size: 0.78rem; color: #475569; font-weight: 600;">
                मान्यता प्राप्त शिक्षा संस्थान | Official Due Fee Report
              </div>
              <div style="margin-top: 8px;">
                <span style="display: inline-block; background: #0f172a; color: #ffffff; padding: 4px 14px; border-radius: 999px; font-size: 0.78rem; font-weight: 900; letter-spacing: 0.5px;">
                  DUE FEE REPORT AS ON ${reportDate}
                </span>
              </div>
            </div>

            <!-- Student 4-Field Info Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; margin-bottom: 12px; font-size: 0.85rem;">
              <div>
                <span style="display: block; font-size: 0.72rem; color: #64748b; font-weight: 700;">विद्यार्थी का नाम:</span>
                <strong style="color: #0f172a; font-size: 0.95rem; text-transform: uppercase;">${escapeHtml(model.studentName)}</strong>
              </div>
              <div>
                <span style="display: block; font-size: 0.72rem; color: #64748b; font-weight: 700;">पिता का नाम:</span>
                <strong style="color: #334155; font-size: 0.9rem; text-transform: uppercase;">${escapeHtml(model.fatherName)}</strong>
              </div>
              <div>
                <span style="display: block; font-size: 0.72rem; color: #64748b; font-weight: 700;">स्कॉलर नंबर (Scholar No):</span>
                <strong style="color: #0284c7; font-family: monospace; font-size: 0.95rem;">${escapeHtml(model.scholarNo)}</strong>
              </div>
              <div>
                <span style="display: block; font-size: 0.72rem; color: #64748b; font-weight: 700;">कक्षा (Class):</span>
                <span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 800;">
                  ${escapeHtml(model.className)}
                </span>
              </div>
            </div>

            <!-- Fee Head Items Table (Responsive - Zero Side Scrolling on Phones) -->
            <div class="fee-table-wrap">
              <table class="fee-table-main">
                <thead>
                  <tr style="background: #1e293b; color: #ffffff; font-weight: 800; font-size: 0.8rem; text-transform: uppercase;">
                    <th class="fee-col-sr" style="padding: 10px 8px; width: 44px; text-align: center; border-right: 1px solid #334155;">क्र.</th>
                    <th class="fee-col-desc" style="padding: 10px 12px; border-right: 1px solid #334155;">शुल्क का मद (Fee Particulars)</th>
                    <th class="fee-category-col" style="padding: 10px 12px; width: 140px; border-right: 1px solid #334155;">श्रेणी</th>
                    <th class="fee-col-amt" style="padding: 10px 12px; width: 120px; text-align: right;">देय राशि (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr style="background: #f0fdfa; border-top: 2px solid #0d9488; font-weight: 900;">
                    <td class="fee-col-sr" style="padding: 10px 8px; text-align: center; color: #0f766e; border-right: 1px solid #ccfbf1;">★</td>
                    <td class="fee-col-desc fee-footer-total-label" style="padding: 10px 12px; color: #0f766e; font-size: 0.92rem; border-right: 1px solid #ccfbf1;">
                      ${activeTab === 'all' ? 'कुल देय शुल्क (Total Outstanding Due):' : activeTab === 'current' ? 'वर्तमान सत्र देय शुल्क (Current Session Due):' : 'गत वर्ष कुल बकाया (Previous Year Dues):'}
                    </td>
                    <td class="fee-category-col" style="padding: 10px 12px; border-right: 1px solid #ccfbf1;"></td>
                    <td class="fee-col-amt" style="padding: 10px 12px; text-align: right; color: #0f766e; font-size: 1.15rem; font-family: monospace; font-weight: 900; white-space: nowrap;">
                      ₹${(activeTab === 'all' ? totalOutstanding : displayedSum).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Important Fee Notice Box -->
            <div style="margin-top: 14px; background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 10px; padding: 12px 14px; display: flex; align-items: flex-start; gap: 10px; color: #92400e; font-size: 0.84rem; line-height: 1.55;">
              <span style="font-size: 1.25rem; line-height: 1; flex-shrink: 0;">📌</span>
              <div>
                <strong style="color: #b45309; display: block; font-size: 0.88rem; margin-bottom: 2px;">महत्वपूर्ण सूचना:</strong>
                <span>डेटा तुरंत अपडेट नहीं होता है। यदि आपने हाल ही में (आज अथवा कल) शुल्क जमा किया है, तो कृपया 1-2 दिन की प्रतीक्षा करें, डेटा स्वतः अपडेट हो जाएगा अथवा विद्यालय कार्यालय में संपर्क करें।</span>
              </div>
            </div>

            <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: #64748b;">
              <span>माँ दुर्गा उ.मा. विद्यालय सेमरिया (रीवा म.प्र.) | कम्प्यूटर जनरेटेड देय रसीद</span>
              <span>दिनांक: ${reportDate}</span>
            </div>
          </div>

          <!-- Bottom Action Buttons (Mobile Optimized Full Width & Touch Friendly) -->
          <div class="fee-actions-bar" style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
            <button type="button" class="btn-hero-sec" onclick="clearTeacherFeeSearch()" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; font-weight: 700; cursor: pointer; padding: 0.65rem 1.15rem; font-size: 0.9rem; border-radius: 8px; display: flex; align-items: center; gap: 6px;">
              <span>✕</span> <span>बंद करें / नई खोज</span>
            </button>
            <div class="fee-actions-buttons-group" style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="btn-hero-sec" onclick="copyStudentFeeDetails()" style="background: #f8fafc; color: #0f172a; border: 1.5px solid #cbd5e1; font-weight: 800; cursor: pointer; padding: 0.65rem 1rem; font-size: 0.88rem; border-radius: 8px; display: flex; align-items: center; gap: 6px;">
                <span>📋</span> <span>विवरण कॉपी</span>
              </button>
              <button type="button" class="btn-hero-sec" onclick="shareStudentFeeOnWhatsApp()" style="background: #25d366; color: #ffffff; border: none; font-weight: 800; cursor: pointer; padding: 0.65rem 1.15rem; font-size: 0.88rem; border-radius: 8px; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(37,211,102,0.3);">
                <span>💬</span> <span>WhatsApp भेजें</span>
              </button>
              <button type="button" class="btn-hero-pri" onclick="downloadStudentFeeReceiptJpg()" style="background: linear-gradient(135deg, #0284c7, #0369a1); color: #ffffff; border: none; font-weight: 800; cursor: pointer; padding: 0.7rem 1.25rem; font-size: 0.92rem; border-radius: 8px; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(2,132,199,0.35);" title="मोबाइल गैलरी में सेव करने हेतु A4 साइज JPG इमेज डाउनलोड करें">
                <span>📥</span> <span>रसीद JPG डाउनलोड (A4)</span>
              </button>
              <button type="button" class="btn-hero-sec" onclick="printStudentFeeSlip()" style="background: #0f766e; color: #ffffff; border: none; font-weight: 800; cursor: pointer; padding: 0.65rem 1.1rem; font-size: 0.88rem; border-radius: 8px; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(15,118,110,0.25);">
                <span>🖨️</span> <span>प्रिंट करें</span>
              </button>
            </div>
          </div>

        </div>
      `;

      container.style.display = 'block';
      if (window.location.hash !== '#teacher-fee') {
        window.history.pushState({ page: 'teacher', subview: 'fee-detail' }, '', '#teacher-fee');
      }
    }

    function buildDetailedFeeWhatsAppText(student) {
      if (!student) return '';
      const model = buildTeacherFeeModel(student);
      const reportDate = getFeeReportDate();

      // Build itemized breakdown lines
      const breakdownLines = [];
      if (model.renewableFee > 0) {
        breakdownLines.push(`▫️ वार्षिक नवीनीकरण शुल्क: ₹${model.renewableFee.toLocaleString('en-IN')}`);
      }
      if (model.admissionFee > 0) {
        breakdownLines.push(`▫️ नवीन प्रवेश शुल्क: ₹${model.admissionFee.toLocaleString('en-IN')}`);
      }
      if (model.prevYearDue > 0) {
        breakdownLines.push(`⚠️ *गत वर्ष का पुराना बकाया:* ₹${model.prevYearDue.toLocaleString('en-IN')}`);
      }
      if (model.boysFund > 0) {
        breakdownLines.push(`▫️ प्रथम किश्त बालक निधि: ₹${model.boysFund.toLocaleString('en-IN')}`);
      }
      if (model.totalTuition > 0) {
        breakdownLines.push(`▫️ कुल शिक्षण शुल्क (Tuition): ₹${model.totalTuition.toLocaleString('en-IN')}`);
      }
      if (model.totalConveyance > 0) {
        breakdownLines.push(`▫️ वाहन/बस शुल्क (Conveyance): ₹${model.totalConveyance.toLocaleString('en-IN')}`);
      }
      if (model.decRegistrationFee > 0) {
        breakdownLines.push(`▫️ दिसम्बर पंजीयन/बोर्ड शुल्क: ₹${model.decRegistrationFee.toLocaleString('en-IN')}`);
      }
      if (model.aprilOldDueFee > 0) {
        breakdownLines.push(`▫️ अप्रैल पुराना बकाया: ₹${model.aprilOldDueFee.toLocaleString('en-IN')}`);
      }
      if (model.lateFee > 0) {
        breakdownLines.push(`▫️ विलंब शुल्क (Late Fee): ₹${model.lateFee.toLocaleString('en-IN')}`);
      }
      if (model.advanceAdjustable > 0) {
        breakdownLines.push(`▫️ अग्रिम समायोजन (छूट): -₹${model.advanceAdjustable.toLocaleString('en-IN')}`);
      }

      const breakdownText = breakdownLines.length > 0 ? breakdownLines.join('\n') : `▫️ शुल्क का मद विवरण उपलब्ध`;

      return (
        `🏫 *माँ दुर्गा उच्च. माध्य. विद्यालय सेमरिया*\n` +
        `📍 *जिला-रीवा (म.प्र.) | UDISE: 23140402055 | संस्था कोड: 322517*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📋 *छात्र वार्षिक देय शुल्क विवरण (सत्र 2026-27)*\n` +
        `📅 *विवरण दिनांक:* ${reportDate}\n\n` +
        `👤 *विद्यार्थी का नाम:* ${model.studentName}\n` +
        `🔢 *स्कॉलर नंबर:* ${model.scholarNo}\n` +
        `🏫 *कक्षा (Class):* ${model.className}\n` +
        `👨‍👦 *पिता का नाम:* ${model.fatherName}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📝 *मदवार शुल्क विवरण (Fee Breakdown):*\n` +
        `${breakdownText}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `💰 *कुल देय शुल्क (Total Outstanding):* ₹${model.grandTotal.toLocaleString('en-IN')}\n` +
        (model.prevYearDue > 0 ? `⚠️ *गत वर्ष पुराना बकाया शामिल:* ₹${model.prevYearDue.toLocaleString('en-IN')}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📌 *महत्वपूर्ण सूचना:*\n` +
        `डेटा तुरंत अपडेट नहीं होता है। यदि आपने हाल ही में (आज अथवा कल) शुल्क जमा किया है, तो कृपया 1-2 दिन की प्रतीक्षा करें, डेटा स्वतः अपडेट हो जाएगा अथवा विद्यालय कार्यालय में संपर्क करें।\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📌 *आवश्यक निर्देश:*\n` +
        `कृपया उक्त शुल्क विद्यालय कार्यालय में उपस्थित होकर अथवा अधिकृत माध्यम से समयानुसार जमा कराकर कम्प्यूटरीकृत रसीद प्राप्त करें।\n\n` +
        `📞 *संपर्क सूत्र:* 9200178385, 9669527633, 9516234519\n` +
        `🌐 *माँ दुर्गा स्कूल सेमरिया पोर्टल*`
      );
    }

    function shareStudentFeeOnWhatsApp() {
      const student = window._currentFoundStudentFee;
      if (!student) return;
      const text = buildDetailedFeeWhatsAppText(student);
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }

    function copyStudentFeeDetails() {
      const student = window._currentFoundStudentFee;
      if (!student) return;
      const text = buildDetailedFeeWhatsAppText(student);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showCopyFeeToast('✅ विस्तृत शुल्क विवरण क्लिपबोर्ड में कॉपी हो गया!');
        }).catch(() => {
          fallbackCopyFeeText(text);
        });
      } else {
        fallbackCopyFeeText(text);
      }
    }

    function fallbackCopyFeeText(text) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showCopyFeeToast('✅ विस्तृत शुल्क विवरण कॉपी हो गया!');
      } catch (e) {
        prompt('कॉपी करने हेतु Ctrl+C दबाएं:', text);
      }
    }

    function showCopyFeeToast(msg) {
      let toast = document.getElementById('feeCopyToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'feeCopyToast';
        toast.style.cssText = 'position:fixed; bottom:25px; left:50%; transform:translateX(-50%); background:#0f172a; color:#ffffff; padding:10px 20px; border-radius:999px; font-size:0.9rem; font-weight:700; z-index:999999; box-shadow:0 10px 25px rgba(0,0,0,0.3); transition:all 0.3s ease; pointer-events:none;';
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.style.opacity = '1';
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => { toast.style.display = 'none'; }, 300);
      }, 2500);
    }

    async function downloadStudentFeeReceiptJpg(student) {
      student = student || window._currentFoundStudentFee;
      if (!student) {
        alert('कृपया पहले किसी छात्र का शुल्क रिकॉर्ड खोजें!');
        return;
      }

      if (typeof window.html2canvas !== 'function') {
        const script = document.createElement('script');
        script.src = 'js/html2canvas.min.js';
        document.head.appendChild(script);
        await new Promise((resolve) => { script.onload = resolve; setTimeout(resolve, 1000); });
      }

      if (typeof window.html2canvas !== 'function') {
        alert('JPG रसीद जनरेटर लोड हो रहा है, कृपया 2 सेकंड बाद पुनः प्रयास करें अथवा प्रिंट विकल्प चुनें।');
        return;
      }

      const model = buildTeacherFeeModel(student);
      const reportDate = getFeeReportDate();
      const session = '2026-27';

      // Create an offscreen, pristine A4 canvas container (Width: 794px, proportional to A4 print standard)
      const a4Box = document.createElement('div');
      a4Box.id = 'tempA4FeeSlipCanvasContainer';
      a4Box.style.cssText = 'position: fixed; left: -9999px; top: 0; width: 794px; min-height: 1123px; background: #ffffff; color: #0f172a; font-family: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif; padding: 32px 36px; box-sizing: border-box; z-index: -9999;';

      const itemsRowsHtml = model.items.map((item, idx) => {
        const isDue = item.category === 'Dues' || item.id === 'prev_year_due' || item.id === 'april_old_due';
        const isRenewal = item.id === 'renewable_fee' || item.id === 'admission_fee';
        const bg = isDue ? '#fffbeb' : isRenewal ? '#f0fdf4' : idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        const color = item.amount < 0 ? '#15803d' : isDue ? '#b45309' : '#0f172a';
        return `
          <tr style="background: ${bg}; border-bottom: 1px solid #cbd5e1;">
            <td style="padding: 9px 12px; text-align: center; font-weight: 700; color: #64748b; font-family: monospace; border-right: 1px solid #cbd5e1; width: 44px;">${idx + 1}</td>
            <td style="padding: 9px 14px; border-right: 1px solid #cbd5e1;">
              <div style="font-weight: 800; color: #0f172a; font-size: 14px;">${escapeHtml(item.nameHindi)}</div>
              <div style="font-size: 11.5px; color: #64748b; margin-top: 1px;">${escapeHtml(item.nameEnglish)}</div>
            </td>
            <td style="padding: 9px 12px; border-right: 1px solid #cbd5e1; width: 140px;">
              <span style="display: inline-block; background: #f1f5f9; color: #334155; padding: 2px 8px; border-radius: 4px; font-size: 11.5px; font-weight: 700;">
                ${escapeHtml(item.category)}
              </span>
            </td>
            <td style="padding: 9px 14px; text-align: right; font-weight: 800; font-family: monospace; font-size: 15px; color: ${color}; width: 130px;">
              ${item.amount < 0 ? '-' : ''}₹${Math.abs(item.amount).toLocaleString('en-IN')}
            </td>
          </tr>
        `;
      }).join('');

      a4Box.innerHTML = `
        <div style="border: 2px solid #0f766e; border-radius: 12px; padding: 24px; background: #ffffff;">
          
          <!-- Top Header Meta -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 14px;">
            <div style="font-size: 12px; font-weight: 700; color: #334155;">
              डाइस कोड (UDISE): <span style="font-family: monospace; color: #0f172a; font-weight: 900;">23140402055</span>
            </div>
            <div style="background: #0f766e; color: #ffffff; padding: 3px 14px; border-radius: 999px; font-size: 12px; font-weight: 900; letter-spacing: 0.5px;">
              शैक्षणिक सत्र: ${session}
            </div>
            <div style="font-size: 12px; font-weight: 700; color: #334155;">
              संस्था कोड (School Code): <span style="font-family: monospace; color: #0f172a; font-weight: 900;">322517</span>
            </div>
          </div>

          <!-- School Name & Title -->
          <div style="text-align: center; margin-bottom: 16px;">
            <h1 style="margin: 0 0 4px 0; color: #b91c1c; font-size: 24px; font-weight: 900; letter-spacing: -0.3px;">
              माँ दुर्गा उच्चतर माध्यमिक विद्यालय सेमरिया
            </h1>
            <div style="font-size: 14px; font-weight: 800; color: #1e293b; margin-bottom: 4px;">
              Maa Durga Higher Secondary School, Semariya, District Rewa (M.P.) - 486445
            </div>
            <div style="font-size: 12px; color: #475569; font-weight: 600;">
              मध्य प्रदेश शासन स्कूल शिक्षा विभाग द्वारा मान्यता प्राप्त • नर्सरी से 12वीं (कला, विज्ञान, वाणिज्य, कृषि)
            </div>
            <div style="margin-top: 10px;">
              <span style="display: inline-block; background: #0f172a; color: #ffffff; padding: 5px 18px; border-radius: 999px; font-size: 12px; font-weight: 900; letter-spacing: 0.8px;">
                OFFICIAL STUDENT DUE FEE RECEIPT (A4 FORMAT) • AS ON ${reportDate}
              </span>
            </div>
          </div>

          <!-- Student 4-Card Info Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
            <div>
              <span style="font-size: 11.5px; color: #64748b; font-weight: 700; display: block;">विद्यार्थी का नाम (Student Name):</span>
              <strong style="color: #0f172a; font-size: 15px; text-transform: uppercase;">${escapeHtml(model.studentName)}</strong>
            </div>
            <div>
              <span style="font-size: 11.5px; color: #64748b; font-weight: 700; display: block;">पिता का नाम (Father's Name):</span>
              <strong style="color: #334155; font-size: 14px; text-transform: uppercase;">${escapeHtml(model.fatherName)}</strong>
            </div>
            <div>
              <span style="font-size: 11.5px; color: #64748b; font-weight: 700; display: block;">स्कॉलर नंबर (Scholar No):</span>
              <strong style="color: #0284c7; font-family: monospace; font-size: 16px;">${escapeHtml(model.scholarNo)}</strong>
            </div>
            <div>
              <span style="font-size: 11.5px; color: #64748b; font-weight: 700; display: block;">कक्षा (Class & Section):</span>
              <span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 2px 10px; border-radius: 6px; font-size: 13px; font-weight: 800;">
                ${escapeHtml(model.className)}
              </span>
            </div>
          </div>

          <!-- Particulars Table -->
          <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #0f172a; margin-bottom: 14px;">
            <thead>
              <tr style="background: #1e293b; color: #ffffff; font-size: 12.5px; font-weight: 800; text-transform: uppercase;">
                <th style="padding: 10px 12px; width: 44px; text-align: center; border-right: 1px solid #334155;">क्र.</th>
                <th style="padding: 10px 14px; border-right: 1px solid #334155; text-align: left;">शुल्क का मद विवरण (Fee Particulars)</th>
                <th style="padding: 10px 12px; width: 140px; border-right: 1px solid #334155; text-align: left;">श्रेणी</th>
                <th style="padding: 10px 14px; width: 130px; text-align: right;">देय राशि (Due ₹)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #0f766e; color: #ffffff; font-weight: 900; border-top: 2px solid #0f172a;">
                <td style="padding: 12px 14px; text-align: center; font-size: 16px;">★</td>
                <td colspan="2" style="padding: 12px 14px; font-size: 14.5px; letter-spacing: 0.3px;">
                  कुल देय शुल्क (Total Outstanding Due Amount)
                </td>
                <td style="padding: 12px 14px; text-align: right; font-size: 18px; font-family: monospace;">
                  ₹${model.grandTotal.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>

          <!-- Important Note -->
          <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 8px; padding: 10px 14px; margin-bottom: 18px; font-size: 11.5px; color: #92400e; line-height: 1.5;">
            <strong>📌 महत्वपूर्ण सूचना:</strong> डेटा तुरंत अपडेट नहीं होता है। यदि आपने हाल ही में (आज अथवा कल) शुल्क जमा किया है, तो कृपया 1-2 दिन की प्रतीक्षा करें, डेटा स्वतः अपडेट हो जाएगा अथवा विद्यालय कार्यालय में संपर्क करें।
          </div>

          <!-- Signatures & Official Stamp Footer -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 18px; border-top: 1px dashed #cbd5e1; font-size: 11.5px; color: #475569;">
            <div>
              <div style="font-weight: 700; color: #0f172a;">माँ दुर्गा उ.मा. विद्यालय सेमरिया (रीवा म.प्र.)</div>
              <div>कम्प्यूटर जनरेटेड अधिकृत देय रसीद | दिनांक: ${reportDate}</div>
              <div style="color: #0369a1; font-weight: 700; margin-top: 2px;">हेल्पलाइन: 9200178385, 9669527633, 9516234519</div>
            </div>
            <div style="text-align: center;">
              <div style="border-bottom: 1px solid #94a3b8; width: 170px; margin-bottom: 6px;"></div>
              <div style="font-weight: 800; color: #0f172a;">अधिकृत हस्ताक्षर / सील</div>
              <div style="font-size: 10.5px; color: #64748b;">(Authorized Signatory)</div>
            </div>
          </div>

        </div>
      `;

      document.body.appendChild(a4Box);
      showCopyFeeToast('⏳ A4 साइज JPG रसीद तैयार की जा रही है...');

      try {
        const canvas = await window.html2canvas(a4Box, {
          scale: 2, // 2x scale for sharp crystal clear 300 DPI text
          backgroundColor: '#ffffff',
          useCORS: true,
          allowTaint: true,
          logging: false,
          windowWidth: 794
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const cleanName = (model.studentName || 'Student').trim().replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_');
        const fileName = `MaaDurga_FeeReceipt_${model.scholarNo}_${cleanName}_A4.jpg`;

        const downloadLink = document.createElement('a');
        downloadLink.href = imgData;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        showCopyFeeToast('✅ A4 साइज JPG शुल्क रसीद सफलतापूर्वक डाउनलोड हो गई!');
      } catch (err) {
        console.error('Error rendering A4 JPG slip:', err);
        alert('JPG रसीद डाउनलोड करने में त्रुटि हुई। कृपया प्रिंट बटन का उपयोग करें।');
      } finally {
        if (a4Box.parentNode) {
          a4Box.parentNode.removeChild(a4Box);
        }
      }
    }
    window.downloadStudentFeeReceiptJpg = downloadStudentFeeReceiptJpg;

    function printStudentFeeSlip() {
      const student = window._currentFoundStudentFee;
      if (!student) return;

      const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        // Mobile users directly get high-quality A4 JPG download as requested!
        downloadStudentFeeReceiptJpg(student);
        return;
      }

      const model = buildTeacherFeeModel(student);
      const reportDate = getFeeReportDate();
      const session = '2026-27';

      const printWindow = window.open('', '_blank', 'width=850,height=750');
      if (!printWindow) {
        // If popup blocked, fallback to A4 JPG download
        downloadStudentFeeReceiptJpg(student);
        return;
      }

      const rowsHtml = model.items.map((item, idx) => `
        <tr>
          <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 10px; font-family: monospace;">${idx + 1}</td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 10px;">
            <strong>${escapeHtml(item.nameHindi)}</strong>
            <div style="font-size: 11px; color: #64748b;">${escapeHtml(item.nameEnglish)}</div>
          </td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 12px; color: #475569;">${escapeHtml(item.category)}</td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 10px; text-align: right; font-weight: 700; font-family: monospace;">
            ${item.amount < 0 ? '-' : ''}₹${Math.abs(item.amount).toLocaleString('en-IN')}
          </td>
        </tr>
      `).join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Fee Slip - ${escapeHtml(model.studentName)} (${escapeHtml(model.scholarNo)})</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 25px; color: #0f172a; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 14px; }
            .meta { display: flex; justify-content: space-between; font-size: 12px; color: #475569; margin-bottom: 6px; }
            .title { font-size: 20px; font-weight: 900; color: #d93025; }
            .subtitle { font-size: 12px; color: #475569; margin-top: 3px; }
            .badge { display: inline-block; background: #0f172a; color: #ffffff; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 800; margin-top: 8px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; font-size: 13px; background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
            th { background: #1e293b; color: #ffffff; border: 1px solid #1e293b; padding: 8px 10px; text-align: left; }
            .total-row { background: #f0fdfa; font-weight: 800; font-size: 14px; }
            .footer { margin-top: 35px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="meta">
              <span>डाइस कोड: <b>23140402055</b></span>
              <span>सत्र: <b>${session}</b></span>
              <span>संस्था कोड: <b>322517</b></span>
            </div>
            <div class="title">माँ दुर्गा उच्च. माध्य. विद्यालय सेमरिया, जिला-रीवा (म.प्र.)</div>
            <div class="subtitle">मान्यता प्राप्त शिक्षा संस्थान | Official Due Fee Report</div>
            <div class="badge">DUE FEE REPORT AS ON ${escapeHtml(reportDate)}</div>
          </div>
          <div class="info-grid">
            <div><span style="color:#64748b; font-size:11px; display:block;">विद्यार्थी का नाम:</span><b>${escapeHtml(model.studentName)}</b></div>
            <div><span style="color:#64748b; font-size:11px; display:block;">पिता का नाम:</span><b>${escapeHtml(model.fatherName)}</b></div>
            <div><span style="color:#64748b; font-size:11px; display:block;">स्कॉलर नंबर (Scholar No):</span><b style="color:#0284c7;">${escapeHtml(model.scholarNo)}</b></div>
            <div><span style="color:#64748b; font-size:11px; display:block;">कक्षा (Class):</span><b>${escapeHtml(model.className)}</b></div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">क्र.</th>
                <th>शुल्क का विवरण (Fee Particulars)</th>
                <th style="width: 130px;">श्रेणी</th>
                <th style="width: 120px; text-align: right;">देय राशि (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
              <tr class="total-row">
                <td colspan="3" style="text-align: right; border: 1px solid #cbd5e1; padding: 10px; color: #0f766e;">
                  <strong>कुल देय शुल्क (Total Outstanding Due)</strong>
                </td>
                <td style="border: 1px solid #cbd5e1; padding: 10px; text-align: right; color: #0f766e; font-size: 15px;">
                  <strong>₹${model.grandTotal.toLocaleString('en-IN')}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top: 14px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 8px 12px; font-size: 11.5px; color: #92400e; line-height: 1.45;">
            <b>📌 महत्वपूर्ण सूचना:</b> डेटा तुरंत अपडेट नहीं होता है। यदि आपने हाल ही में (आज अथवा कल) शुल्क जमा किया है, तो कृपया 1-2 दिन की प्रतीक्षा करें, डेटा स्वतः अपडेट हो जाएगा अथवा विद्यालय कार्यालय में संपर्क करें।
          </div>
          <div class="footer">
            <div>कंप्यूटर जनरेटेड प्रति | विद्यालय कार्यालय सेमरिया रीवा | दिनांक: ${escapeHtml(reportDate)}</div>
            <div>अधिकृत हस्ताक्षर __________________</div>
          </div>
          <script>
            window.onload = function() { window.print(); };
          <\/script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }

    function handleSaveAttendance(event) {
      event.preventDefault();
      const attDate = document.getElementById('attDateInput')?.value || new Date().toISOString().slice(0, 10);
      const attClass = document.getElementById('attClassSelect')?.value || 'Class 9th';
      const attSection = document.getElementById('attSectionSelect')?.value || 'A';
      const absentRolls = (document.getElementById('attAbsentRollsInput')?.value || '').trim();

      const sessionData = sessionStorage.getItem('mdhss_teacher_session');
      let teacherName = 'शिक्षक (Staff)';
      let teacherPhone = '-';
      if (sessionData) {
        try {
          const t = JSON.parse(sessionData);
          teacherName = t.name || teacherName;
          teacherPhone = t.phone || teacherPhone;
        } catch (e) {}
      }

      const attendanceRecord = {
        formType: 'Attendance',
        id: 'ATT-' + Date.now().toString().slice(-4),
        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        attDate: attDate,
        className: attClass,
        section: attSection,
        absentRolls: absentRolls || 'कोई अनुपस्थित नहीं (All Present)',
        teacherName: teacherName,
        teacherPhone: teacherPhone
      };

      // Dispatched directly to Google Sheets Webhook
      postToGoogleSheetsWebhook(attendanceRecord);

      const alertBox = document.getElementById('attendanceSuccessAlert');
      if (alertBox) {
        alertBox.style.display = 'block';
        setTimeout(() => { alertBox.style.display = 'none'; }, 4000);
      }
      event.target.reset();
      const attDateInput = document.getElementById('attDateInput');
      if (attDateInput) attDateInput.value = new Date().toISOString().slice(0, 10);
    }

    // =========================================================================
    // 4. TEACHER DASHBOARD - 1-99 ROLL NUMBER MARKS GRID & LOGIC
    // =========================================================================
    const CLASS_CODE_MAP = {
      '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
      '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
      '11': '11', '12': '12',
      'Nursery': '0', 'LKG': '01', 'UKG': '02'
    };

    const SECTION_CODE_MAP = {
      'A': '1',
      'B': '2',
      'C': '3',
      'Maths': '1',
      'Bio': '2',
      'Comm': '3'
    };

    function getSelectedClassInfo() {
      const select = document.getElementById('marksClassSelect');
      if (!select) return { text: 'Class 9th (कक्षा 9वीं)', code: '9', raw: '9' };
      const opt = select.options[select.selectedIndex];
      const val = select.value || '9';
      const code = (opt && opt.getAttribute('data-code')) ? opt.getAttribute('data-code') : (CLASS_CODE_MAP[val] || '9');
      const text = opt ? opt.text : `Class ${val}`;
      return { text: text, code: code, raw: val };
    }

    function getSelectedSectionInfo() {
      const select = document.getElementById('marksSectionSelect');
      if (!select) return { text: 'B', code: '2', raw: 'B' };
      const opt = select.options[select.selectedIndex];
      const val = select.value || 'B';
      const code = (opt && opt.getAttribute('data-sec-code')) ? opt.getAttribute('data-sec-code') : (SECTION_CODE_MAP[val] || '2');
      const text = opt ? opt.text : val;
      return { text: text, code: code, raw: val };
    }

    function computeRollNumber(rollIndex) {
      const cls = getSelectedClassInfo();
      const sec = getSelectedSectionInfo();
      const rollStr = String(rollIndex).padStart(2, '0');
      // Format: 27 (Year 2026-27) + [ClassCode] + [SectionCode] + [RollNo 01-99]
      return `27${cls.code}${sec.code}${rollStr}`;
    }

    function updateMarksSeriesInfo() {
      const cls = getSelectedClassInfo();
      const sec = getSelectedSectionInfo();
      const startRoll = computeRollNumber(1);
      const endRoll = computeRollNumber(99);
      const sample55 = computeRollNumber(55);

      const badge = document.getElementById('marksRollSeriesBadge');
      if (badge) {
        badge.textContent = `${startRoll} से ${endRoll}`;
      }

      const expText = document.getElementById('marksRollExplanationText');
      if (expText) {
        expText.innerHTML = `फॉर्मूला: <strong>27</strong> (सत्र 2026-27) + <strong>${cls.code}</strong> (${cls.text.split('(')[0].trim()}) + <strong>${sec.code}</strong> (${sec.text.split('(')[0].trim()}) + <strong>01-99</strong> (छात्र क्रमांक 1 से 99)`;
      }

      const sampleBadge = document.getElementById('sampleRollNoBadge');
      if (sampleBadge) {
        sampleBadge.textContent = sample55;
      }

      // Immediately update roll numbers in all 1-99 table rows
      for (let i = 1; i <= 99; i++) {
        const rollEl = document.getElementById(`grid-roll-cell-${i}`);
        if (rollEl) {
          rollEl.textContent = computeRollNumber(i);
        }
      }
    }

    // ==========================================================================
    // TEACHER EXAM RESULT ENTRY WINDOW & TIME LIMIT CONTROL
    // ==========================================================================
    const DEFAULT_EXAM_WINDOW_CONFIG = {
      masterOpen: true,
      onlyShowActiveExams: false,
      exams: {
        traimasik: {
          id: 'traimasik',
          name: 'त्रैमासिक परीक्षा 2026',
          label: 'त्रैमासिक परीक्षा 2026 (Quarterly Exam)',
          enabled: true,
          startDate: '2026-06-01',
          endDate: '2027-04-30',
          note: 'त्रैमासिक परीक्षा 2026 अंक प्रविष्टि विंडो'
        },
        ardhvarshik: {
          id: 'ardhvarshik',
          name: 'अर्धवार्षिक परीक्षा 2026',
          label: 'अर्धवार्षिक परीक्षा 2026 (Half-Yearly)',
          enabled: true,
          startDate: '2026-06-01',
          endDate: '2027-04-30',
          note: 'अर्धवार्षिक परीक्षा 2026 अंक प्रविष्टि विंडो'
        },
        monthly: {
          id: 'monthly',
          name: 'मासिक टेस्ट',
          label: 'मासिक टेस्ट (Monthly Test)',
          enabled: true,
          startDate: '2026-06-01',
          endDate: '2027-04-30',
          note: 'मासिक टेस्ट अंक प्रविष्टि विंडो (सभी माह)'
        },
        preboard: {
          id: 'preboard',
          name: 'प्री-बोर्ड परीक्षा 2027',
          label: 'प्री-बोर्ड परीक्षा 2027 (Pre-Board)',
          enabled: true,
          startDate: '2026-06-01',
          endDate: '2027-04-30',
          note: 'प्री-बोर्ड 2027 अंक प्रविष्टि विंडो'
        },
        varshik: {
          id: 'varshik',
          name: 'वार्षिक मुख्य परीक्षा 2027',
          label: 'वार्षिक मुख्य परीक्षा 2027 (Annual Exam)',
          enabled: true,
          startDate: '2026-06-01',
          endDate: '2027-04-30',
          note: 'वार्षिक मुख्य परीक्षा 2027 अंक प्रविष्टि विंडो'
        }
      },
      lastUpdated: new Date().toISOString()
    };

    function getExamWindowConfig() {
      try {
        const stored = localStorage.getItem('mdhss_exam_window_config');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.exams) {
            if (parsed.exams.monthly) {
              parsed.exams.monthly.name = 'मासिक टेस्ट';
              parsed.exams.monthly.label = 'मासिक टेस्ट (Monthly Test)';
              parsed.exams.monthly.enabled = true;
            }
            return {
              ...DEFAULT_EXAM_WINDOW_CONFIG,
              ...parsed,
              exams: { ...DEFAULT_EXAM_WINDOW_CONFIG.exams, ...parsed.exams }
            };
          }
        }
      } catch (e) {}
      return DEFAULT_EXAM_WINDOW_CONFIG;
    }
    window.getExamWindowConfig = getExamWindowConfig;

    function calculateExamStatus(examCfg, masterOpen) {
      if (!masterOpen) {
        return { status: 'locked', label: '🔒 मास्टर लॉक (बंद)', isOpen: false, class: 'locked' };
      }
      if (!examCfg.enabled) {
        return { status: 'disabled', label: '🔒 व्यवस्थापक द्वारा बंद / फ्रीज', isOpen: false, class: 'locked' };
      }

      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      if (examCfg.startDate && todayStr < examCfg.startDate) {
        return {
          status: 'upcoming',
          label: `⏳ आगामी (${formatDateHi(examCfg.startDate)} से)`,
          isOpen: false,
          class: 'upcoming'
        };
      }
      if (examCfg.endDate && todayStr > examCfg.endDate) {
        return {
          status: 'expired',
          label: `🛑 समय समाप्त (${formatDateHi(examCfg.endDate)} को बंद)`,
          isOpen: false,
          class: 'expired'
        };
      }
      return {
        status: 'active',
        label: `🟢 सक्रिय (वैध: ${formatDateHi(examCfg.endDate)} तक)`,
        isOpen: true,
        class: 'active'
      };
    }
    window.calculateExamStatus = calculateExamStatus;

    function formatDateHi(dateStr) {
      if (!dateStr) return '';
      try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const monthsHi = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
          const mIdx = parseInt(parts[1], 10) - 1;
          return `${parseInt(parts[2], 10)} ${monthsHi[mIdx] || parts[1]} ${parts[0]}`;
        }
      } catch (e) {}
      return dateStr;
    }

    function applyExamWindowConfigToUI(config) {
      config = config || getExamWindowConfig();
      const masterOpen = config.masterOpen !== false;
      const onlyShowActive = config.onlyShowActiveExams !== false;

      const examSelect = document.getElementById('marksExamTypeSelect');
      const banner = document.getElementById('teacherMarksWindowBanner');
      const lockedNotice = document.getElementById('teacherMarksLockedNotice');
      const lockedText = document.getElementById('teacherMarksLockedNoticeText');
      const btnSaveMarks = document.getElementById('btnSaveMarksUpload');

      const examEntries = Object.values(config.exams || {});
      const activeExams = [];
      const allStatuses = {};

      examEntries.forEach(ex => {
        const st = calculateExamStatus(ex, masterOpen);
        allStatuses[ex.id] = st;
        if (st.isOpen) {
          activeExams.push(ex);
        }
      });

      // Update dropdown options
      if (examSelect) {
        const prevValue = examSelect.value;
        examSelect.innerHTML = '';

        if (!masterOpen || activeExams.length === 0) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.disabled = true;
          opt.selected = true;
          opt.textContent = '⚠️ वर्तमान में कोई परीक्षा प्रविष्टि सक्रिय नहीं है (All Closed)';
          examSelect.appendChild(opt);
        } else {
          // If onlyShowActive is true: ONLY append active exams (User requested: "saath hi jiska option open karoo usi bass ka open ho baki hide rahe")
          const examsToShow = onlyShowActive ? activeExams : examEntries;
          examsToShow.forEach(ex => {
            const st = allStatuses[ex.id];
            const opt = document.createElement('option');
            opt.value = ex.name;
            opt.textContent = ex.label + (st.isOpen ? '' : ' (🔒 बंद)');
            if (!st.isOpen) opt.disabled = true;
            examSelect.appendChild(opt);
          });

          if (activeExams.some(e => e.name === prevValue)) {
            examSelect.value = prevValue;
          } else if (activeExams.length > 0) {
            examSelect.value = activeExams[0].name;
          }
        }
      }

      // Update banner & locked notice
      if (!masterOpen || activeExams.length === 0) {
        if (banner) banner.innerHTML = '';
        if (lockedNotice) {
          lockedNotice.style.display = 'block';
          const detailsList = examEntries.map(e => `• <strong>${escapeHtml(e.label)}:</strong> ${e.startDate ? formatDateHi(e.startDate) : '-'} से ${e.endDate ? formatDateHi(e.endDate) : '-'}`).join('<br>');
          if (lockedText) {
            lockedText.innerHTML = `व्यवस्थापक द्वारा वर्तमान में अंक प्रविष्टि बंद / फ्रीज है अथवा निर्धारित समय-सीमा समाप्त हो चुकी है।<br><div style="margin-top:6px; font-weight:700;">निर्धारित परीक्षा तिथियां:</div><div style="font-size:0.84rem; margin-top:2px; line-height: 1.6;">${detailsList}</div>`;
          }
        }
        if (btnSaveMarks) {
          btnSaveMarks.disabled = true;
          btnSaveMarks.style.opacity = '0.5';
          btnSaveMarks.style.cursor = 'not-allowed';
          btnSaveMarks.title = 'अंक प्रविष्टि विंडो बंद है';
        }
      } else {
        if (lockedNotice) lockedNotice.style.display = 'none';
        if (btnSaveMarks) {
          btnSaveMarks.disabled = false;
          btnSaveMarks.style.opacity = '1';
          btnSaveMarks.style.cursor = 'pointer';
          btnSaveMarks.title = '';
        }

        if (banner) {
          const activeListText = activeExams.map(e => `<strong>${escapeHtml(e.label)}</strong> (${formatDateHi(e.startDate)} से ${formatDateHi(e.endDate)})`).join(', ');
          banner.innerHTML = `
            <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: #15803d;">
                <span style="font-size: 1.2rem;">🟢</span>
                <span><strong>सक्रिय अंक प्रविष्टि:</strong> ${activeListText}</span>
              </div>
              <span style="background: #dcfce7; color: #166534; padding: 3px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; border: 1px solid #bbf7d0;">
                ✓ प्रविष्टि खुली है
              </span>
            </div>
          `;
        }
      }

      if (typeof onMarksExamTypeChange === 'function') {
        onMarksExamTypeChange();
      }
    }
    window.applyExamWindowConfigToUI = applyExamWindowConfigToUI;

    function checkExamEntryAllowed(examTypeName) {
      const config = getExamWindowConfig();
      if (config.masterOpen === false) {
        return { allowed: false, reason: 'मास्टर नियंत्रण द्वारा सभी परीक्षाओं में अंक प्रविष्टि वर्तमान में बंद / फ्रीज है।' };
      }
      const examEntries = Object.values(config.exams || {});
      const matchedExam = examEntries.find(e => e.name === examTypeName || (examTypeName && examTypeName.includes(e.name)) || (examTypeName && e.name.includes(examTypeName)));
      if (!matchedExam) {
        return { allowed: true };
      }
      const st = calculateExamStatus(matchedExam, true);
      if (!st.isOpen) {
        return {
          allowed: false,
          reason: `⚠️ ${matchedExam.label} में अंक प्रविष्टि की अनुमति नहीं है।\nस्थिति: ${st.label}`
        };
      }
      return { allowed: true };
    }
    window.checkExamEntryAllowed = checkExamEntryAllowed;

    function renderAdminExamWindowConfig() {
      const container = document.getElementById('adminExamWindowsContainer');
      if (!container) return;

      const config = getExamWindowConfig();
      const masterOpen = config.masterOpen !== false;
      const masterEl = document.getElementById('examWindowMasterOpen');
      if (masterEl) masterEl.checked = masterOpen;
      const onlyActiveEl = document.getElementById('examWindowOnlyActive');
      if (onlyActiveEl) onlyActiveEl.checked = config.onlyShowActiveExams !== false;

      const examEntries = Object.values(config.exams || {});

      container.innerHTML = examEntries.map(ex => {
        const st = calculateExamStatus(ex, masterOpen);
        const isActiveClass = st.isOpen ? 'is-active' : 'is-locked';

        return `
          <div class="exam-window-card ${isActiveClass}" id="examCard_${ex.id}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 12px;">
              <div>
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <h4 style="margin: 0; font-size: 1.12rem; font-weight: 800; color: #0f172a;">
                    ${escapeHtml(ex.label)}
                  </h4>
                  <span class="exam-window-status-pill ${st.class}">
                    ${escapeHtml(st.label)}
                  </span>
                </div>
                <div style="font-size: 0.82rem; color: #64748b; margin-top: 3px;">
                  आधिकारिक नाम: <span style="font-family: monospace; font-weight: 700; color: #0284c7;">${escapeHtml(ex.name)}</span>
                </div>
              </div>

              <!-- Switch Toggle -->
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: #ffffff; padding: 6px 12px; border-radius: 8px; border: 1.5px solid ${ex.enabled ? '#86efac' : '#cbd5e1'};">
                <input type="checkbox" id="examToggle_${ex.id}" ${ex.enabled ? 'checked' : ''} onchange="updateExamCardState('${ex.id}')" style="width: 17px; height: 17px; cursor: pointer; accent-color: #10b981;" />
                <span id="examToggleLabel_${ex.id}" style="font-size: 0.88rem; font-weight: 800; color: ${ex.enabled ? '#15803d' : '#64748b'};">
                  ${ex.enabled ? '🟢 विकल्प चालू (Open)' : '🔒 विकल्प फ्रीज (Closed)'}
                </span>
              </label>
            </div>

            <!-- Date Range Inputs -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #475569; margin-bottom: 4px;">
                  📅 प्रारंभ तिथि (Start Date):
                </label>
                <input type="date" id="examStart_${ex.id}" value="${ex.startDate || ''}" onchange="updateExamCardState('${ex.id}')" class="form-input-custom" style="padding: 0.5rem 0.75rem; font-weight: 700; font-size: 0.88rem;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #475569; margin-bottom: 4px;">
                  🏁 अंतिम तिथि (End Date):
                </label>
                <input type="date" id="examEnd_${ex.id}" value="${ex.endDate || ''}" onchange="updateExamCardState('${ex.id}')" class="form-input-custom" style="padding: 0.5rem 0.75rem; font-weight: 700; font-size: 0.88rem;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #475569; margin-bottom: 4px;">
                  📝 विवरण / टिप्पणी (Note for Teachers):
                </label>
                <input type="text" id="examNote_${ex.id}" value="${escapeHtml(ex.note || '')}" placeholder="उदा. कक्षा 1 से 12वीं तक अंक प्रविष्टि" class="form-input-custom" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;" />
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
    window.renderAdminExamWindowConfig = renderAdminExamWindowConfig;

    function updateExamCardState(examId) {
      const toggle = document.getElementById(`examToggle_${examId}`);
      const label = document.getElementById(`examToggleLabel_${examId}`);
      const card = document.getElementById(`examCard_${examId}`);
      if (toggle && label) {
        label.textContent = toggle.checked ? '🟢 विकल्प चालू (Open)' : '🔒 विकल्प फ्रीज (Closed)';
        label.style.color = toggle.checked ? '#15803d' : '#64748b';
      }
      if (card && toggle) {
        if (toggle.checked) {
          card.classList.add('is-active');
          card.classList.remove('is-locked');
        } else {
          card.classList.remove('is-active');
          card.classList.add('is-locked');
        }
      }
    }
    window.updateExamCardState = updateExamCardState;

    function toggleExamMasterSwitch(checked) {
      const config = getExamWindowConfig();
      config.masterOpen = checked;
      renderAdminExamWindowConfig();
    }
    window.toggleExamMasterSwitch = toggleExamMasterSwitch;

    function onExamWindowOptionChange() {
      // live toggle update
    }
    window.onExamWindowOptionChange = onExamWindowOptionChange;

    async function saveExamWindowSettings() {
      const config = getExamWindowConfig();
      const masterEl = document.getElementById('examWindowMasterOpen');
      const onlyActiveEl = document.getElementById('examWindowOnlyActive');

      config.masterOpen = masterEl ? masterEl.checked : true;
      config.onlyShowActiveExams = onlyActiveEl ? onlyActiveEl.checked : true;

      const examKeys = Object.keys(config.exams || {});
      examKeys.forEach(key => {
        const toggleEl = document.getElementById(`examToggle_${key}`);
        const startEl = document.getElementById(`examStart_${key}`);
        const endEl = document.getElementById(`examEnd_${key}`);
        const noteEl = document.getElementById(`examNote_${key}`);

        if (toggleEl) config.exams[key].enabled = toggleEl.checked;
        if (startEl) config.exams[key].startDate = startEl.value;
        if (endEl) config.exams[key].endDate = endEl.value;
        if (noteEl) config.exams[key].note = noteEl.value.trim();
      });

      config.lastUpdated = new Date().toISOString();

      localStorage.setItem('mdhss_exam_window_config', JSON.stringify(config));

      if (window.mdhssCloud && typeof window.mdhssCloud.saveSetting === 'function') {
        try {
          await window.mdhssCloud.saveSetting('exam_window_config', config);
        } catch (e) {
          console.warn('Cloud save exam window warning:', e);
        }
      }

      applyExamWindowConfigToUI(config);
      renderAdminExamWindowConfig();

      const badge = document.getElementById('examWindowSaveBadge');
      if (badge) {
        badge.style.display = 'inline-block';
        setTimeout(() => { badge.style.display = 'none'; }, 4000);
      }
    }
    window.saveExamWindowSettings = saveExamWindowSettings;

    function applyExamWindowPreset(presetKey) {
      const config = getExamWindowConfig();
      config.masterOpen = true;
      config.onlyShowActiveExams = true;

      if (presetKey === 'traimasik_2026') {
        // User requested: "man lo mai traimasik ka result chadhane me daal doo ki 22 September 2026 se 15 October 2026 tak option open rahe to tabhi tak teacher result chadha sake baki option freeze rahe saath hi jiska option open karoo usi bass ka open ho baki hide rahe"
        Object.keys(config.exams).forEach(k => {
          if (k === 'traimasik') {
            config.exams[k].enabled = true;
            config.exams[k].startDate = '2026-09-22';
            config.exams[k].endDate = '2026-10-15';
          } else {
            config.exams[k].enabled = false;
          }
        });
      } else if (presetKey === 'ardhvarshik') {
        Object.keys(config.exams).forEach(k => {
          if (k === 'ardhvarshik') {
            config.exams[k].enabled = true;
            config.exams[k].startDate = '2026-11-15';
            config.exams[k].endDate = '2026-12-10';
          } else {
            config.exams[k].enabled = false;
          }
        });
      } else if (presetKey === 'varshik') {
        Object.keys(config.exams).forEach(k => {
          if (k === 'varshik') {
            config.exams[k].enabled = true;
            config.exams[k].startDate = '2027-02-20';
            config.exams[k].endDate = '2027-03-25';
          } else {
            config.exams[k].enabled = false;
          }
        });
      } else if (presetKey === 'freeze_all') {
        config.masterOpen = false;
        Object.keys(config.exams).forEach(k => {
          config.exams[k].enabled = false;
        });
      }

      localStorage.setItem('mdhss_exam_window_config', JSON.stringify(config));
      if (window.mdhssCloud && typeof window.mdhssCloud.saveSetting === 'function') {
        window.mdhssCloud.saveSetting('exam_window_config', config);
      }

      applyExamWindowConfigToUI(config);
      renderAdminExamWindowConfig();

      const badge = document.getElementById('examWindowSaveBadge');
      if (badge) {
        badge.textContent = '⚡ प्रीसेट तुरंत लागू हो गया!';
        badge.style.display = 'inline-block';
        setTimeout(() => {
          badge.style.display = 'none';
          badge.textContent = '✅ परीक्षा समय-सीमा सेटिंग्स सुरक्षित हो गईं व तुरंत लागू हो गईं!';
        }, 3500);
      }
    }
    window.applyExamWindowPreset = applyExamWindowPreset;

    function resetDefaultExamWindows() {
      if (confirm('क्या आप परीक्षा समय-सीमा को मूल डिफ़ॉल्ट सेटिंग्स (त्रैमासिक परीक्षा 2026 खुली) पर रीसेट करना चाहते हैं?')) {
        const config = JSON.parse(JSON.stringify(DEFAULT_EXAM_WINDOW_CONFIG));
        localStorage.setItem('mdhss_exam_window_config', JSON.stringify(config));
        if (window.mdhssCloud && typeof window.mdhssCloud.saveSetting === 'function') {
          window.mdhssCloud.saveSetting('exam_window_config', config);
        }
        applyExamWindowConfigToUI(config);
        renderAdminExamWindowConfig();
        alert('✅ डिफ़ॉल्ट सेटिंग्स बहाल कर दी गईं!');
      }
    }
    window.resetDefaultExamWindows = resetDefaultExamWindows;

    // Dynamic Exam Type change and auto-fetch triggers (Month container shown ONLY for Masik/Monthly test)
    function onMarksExamTypeChange() {
      const examSelect = document.getElementById('marksExamTypeSelect');
      const monthContainer = document.getElementById('marksMonthContainer');
      const examVal = (examSelect ? examSelect.value : '').toLowerCase();

      // "Are jab masik test kare tab poore mahine ka naam aae kebal masik test me baki option me n aae"
      const isMonthly = examVal.includes('मासिक') || examVal.includes('monthly') || examVal.includes('masik');
      if (monthContainer) {
        monthContainer.style.display = isMonthly ? 'block' : 'none';
      }

      updateMarksSeriesInfo();
      checkAndAutoFetchExistingMarks();
    }
    window.onMarksExamTypeChange = onMarksExamTypeChange;

    function onMarksMonthChange() {
      updateMarksSeriesInfo();
      checkAndAutoFetchExistingMarks();
    }

    function onMarksSubjectInputChanged() {
      updateMarksSeriesInfo();
      checkAndAutoFetchExistingMarks();
    }

    function onMarksClassChange() {
      const clsSelect = document.getElementById('marksClassSelect');
      const secSelect = document.getElementById('marksSectionSelect');
      const secLabel = document.getElementById('marksSectionLabel');
      if (!clsSelect || !secSelect) return;

      const clsVal = clsSelect.value;
      const isSenior = (clsVal === '11' || clsVal === '12');

      if (isSenior) {
        if (secLabel) secLabel.textContent = '3. संकाय / सेक्शन (Stream - A:Maths, B:Bio, C:Comm) *';
        secSelect.innerHTML = `
          <option value="Maths" data-sec-code="1" selected>गणित संकाय (Mathematics - Section A, Code 1)</option>
          <option value="Bio" data-sec-code="2">जीव विज्ञान संकाय (Biology - Section B, Code 2)</option>
          <option value="Comm" data-sec-code="3">वाणिज्य संकाय (Commerce - Section C, Code 3)</option>
        `;
      } else {
        if (secLabel) secLabel.textContent = '3. सेक्शन (Section) *';
        secSelect.innerHTML = `
          <option value="A" data-sec-code="1">Section A (सेक्शन A - कोड 1)</option>
          <option value="B" data-sec-code="2" selected>Section B (सेक्शन B - कोड 2)</option>
          <option value="C" data-sec-code="3">Section C (सेक्शन C - कोड 3)</option>
        `;
      }

      updateMarksSeriesInfo();
      checkAndAutoFetchExistingMarks();
    }

    function onMarksSectionChange() {
      updateMarksSeriesInfo();
      checkAndAutoFetchExistingMarks();
    }

    // Automatic Fetching of previously saved marks for same Class, Section, Subject & Exam Type
    async function checkAndAutoFetchExistingMarks() {
      const examSelect = document.getElementById('marksExamTypeSelect');
      const subjectInput = document.getElementById('marksSubjectInput');
      const autoFetchNotice = document.getElementById('marksAutoFetchNotice');
      const autoFetchText = document.getElementById('marksAutoFetchText');

      if (!subjectInput) return;
      const subjectVal = subjectInput.value.trim();
      if (!subjectVal) {
        window._currentActiveMarksSheetId = null;
        if (autoFetchNotice) autoFetchNotice.style.display = 'none';
        return;
      }

      const examType = examSelect ? examSelect.value : '';
      const isMonthly = examType.includes('मासिक') || examType.includes('Monthly');
      const monthVal = isMonthly ? (document.getElementById('marksMonthSelect')?.value || '') : '';
      const clsInfo = getSelectedClassInfo();
      const secInfo = getSelectedSectionInfo();

      try {
        let storedSheets = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
        
        // If empty in localStorage or cloud sync available, ensure we have latest cloud sheets
        if (window.mdhssCloud && typeof window.mdhssCloud.fetchMarksSheets === 'function' && storedSheets.length === 0) {
          try {
            const cloudSheets = await window.mdhssCloud.fetchMarksSheets();
            if (Array.isArray(cloudSheets) && cloudSheets.length > 0) {
              storedSheets = cloudSheets;
              localStorage.setItem('mdhss_marks_sheets', JSON.stringify(cloudSheets));
            }
          } catch (cloudErr) {
            console.warn('Notice fetching cloud sheets:', cloudErr);
          }
        }

        if (!Array.isArray(storedSheets) || storedSheets.length === 0) {
          window._currentActiveMarksSheetId = null;
          if (autoFetchNotice) autoFetchNotice.style.display = 'none';
          return;
        }

        const normSubVal = subjectVal.toLowerCase().replace(/\s+/g, '');

        // Find existing record matching this exact set
        const matchedSheet = storedSheets.find(s => {
          const matchCls = (s.classCode === clsInfo.code || 
                           (s.className && s.className.toLowerCase().includes(clsInfo.code.toLowerCase())) || 
                           (s.className && s.className.toLowerCase() === clsInfo.text.toLowerCase()));
          const matchSec = (s.sectionCode === secInfo.code || 
                           (s.section && s.section.toLowerCase() === secInfo.text.toLowerCase()));
          const sheetSubNorm = s.subject ? s.subject.trim().toLowerCase().replace(/\s+/g, '') : '';
          const matchSub = sheetSubNorm === normSubVal;
          const matchExam = s.rawExamType ? (s.rawExamType.trim() === examType.trim()) : (s.examType && s.examType.trim().startsWith(examType.trim()));
          const matchMonth = isMonthly ? (s.month === monthVal || (s.examType && s.examType.includes(monthVal))) : true;
          return matchCls && matchSec && matchSub && matchExam && matchMonth;
        });

        if (matchedSheet) {
          // Track existing ID so submitting will overwrite/update, not duplicate
          window._currentActiveMarksSheetId = matchedSheet.id;

          // Auto fill Max Marks and Pass Marks
          if (matchedSheet.maxMarks && document.getElementById('marksMaxInput')) {
            document.getElementById('marksMaxInput').value = matchedSheet.maxMarks;
          }
          if (matchedSheet.passMarks && document.getElementById('marksPassInput')) {
            document.getElementById('marksPassInput').value = matchedSheet.passMarks;
          }

          // Populate student rows with saved marks
          if (Array.isArray(matchedSheet.students)) {
            // Build fast lookup by serial (1-99) and rollNo
            const studentMap = new Map();
            matchedSheet.students.forEach(st => {
              if (st.serial) studentMap.set(Number(st.serial), st.marks);
              if (st.rollNo) studentMap.set(String(st.rollNo).trim(), st.marks);
            });

            for (let i = 1; i <= 99; i++) {
              const rollNo = computeRollNumber(i);
              const input = document.getElementById(`grid-marks-${i}`);
              if (input) {
                const savedVal = studentMap.has(i) ? studentMap.get(i) : (studentMap.has(rollNo) ? studentMap.get(rollNo) : '');
                input.value = (savedVal !== undefined && savedVal !== null) ? savedVal : '';
                handleMarksInputChanged(i, true);
              }
            }
          }

          updateMarksStatsDisplay();

          if (autoFetchNotice && autoFetchText) {
            autoFetchText.innerHTML = `
              <span>⚡</span>
              <div>
                <div style="font-weight: 800; font-size: 0.92rem; color: #166534;">
                  क्लाउड से डेटा स्वतः सिंक (Auto-Synced from Cloud) - दोबारा नंबर फीड करने की आवश्यकता नहीं है!
                </div>
                <div style="font-size: 0.82rem; color: #15803d; margin-top: 3px; line-height: 1.4;">
                  इस कक्षा एवं विषय <strong>(${matchedSheet.subject})</strong> के अंक पहले से सुरक्षित हैं। 
                  दर्ज करने वाले शिक्षक: <strong>${matchedSheet.teacherName || 'अधिकृत शिक्षक'}</strong> 
                  (📞 ${matchedSheet.teacherPhone || '-'}) • प्रविष्ट छात्र: <strong>${matchedSheet.enteredCount || 0}</strong> • दिनांक: ${matchedSheet.date || '-'}
                </div>
              </div>
            `;
            autoFetchNotice.style.display = 'flex';
          }
        } else {
          window._currentActiveMarksSheetId = null;
          if (autoFetchNotice) autoFetchNotice.style.display = 'none';
        }
      } catch (err) {
        console.warn('Auto fetch marks notice:', err);
      }
    }

    // Toggle / Show / Hide Roll Number List (User Request: Roll list hidden by default until Subject & Class filled, opened by button)
    function toggleMarksRollNumberList() {
      const rollSec = document.getElementById('marksRollNumberSection');
      if (!rollSec) return;
      const isHidden = (rollSec.style.display === 'none' || getComputedStyle(rollSec).display === 'none');
      if (isHidden) {
        const subject = (document.getElementById('marksSubjectInput')?.value || '').trim();
        if (!subject) {
          alert('⚠️ कृपया पहले विषय का नाम (Subject Name) भरें!');
          const subjInput = document.getElementById('marksSubjectInput');
          if (subjInput) subjInput.focus();
          return;
        }
        showMarksRollNumberList();
      } else {
        hideMarksRollNumberList();
      }
    }
    window.toggleMarksRollNumberList = toggleMarksRollNumberList;

    function showMarksRollNumberList() {
      const rollSec = document.getElementById('marksRollNumberSection');
      const btn = document.getElementById('btnToggleMarksRollList');
      if (rollSec) {
        rollSec.style.display = 'block';
        rollSec.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      if (btn) {
        btn.innerHTML = '🔒 रोल नंबर लिस्ट छिपाएं (Hide Roll List)';
        btn.style.background = '#475569';
      }
    }
    window.showMarksRollNumberList = showMarksRollNumberList;

    function hideMarksRollNumberList() {
      const rollSec = document.getElementById('marksRollNumberSection');
      const btn = document.getElementById('btnToggleMarksRollList');
      if (rollSec) {
        rollSec.style.display = 'none';
      }
      if (btn) {
        btn.innerHTML = '📂 रोल नंबर लिस्ट खोलें (Open Roll Number List)';
        btn.style.background = '#0284c7';
      }
    }
    window.hideMarksRollNumberList = hideMarksRollNumberList;

    let _maxMarksNoticeTimer = null;
    function flashMaxMarksNotice(maxMarks) {
      const banner = document.getElementById('maxMarksNoticeBar');
      if (!banner) return;
      banner.textContent = `⚠️ पूर्णांक (Max Marks) ${maxMarks} है! प्राप्तांक ${maxMarks} से अधिक दर्ज नहीं हो सकता।`;
      banner.style.display = 'block';
      if (_maxMarksNoticeTimer) clearTimeout(_maxMarksNoticeTimer);
      _maxMarksNoticeTimer = setTimeout(() => {
        banner.style.display = 'none';
      }, 2500);
    }

    function generateMarksGrid() {
      const tbody = document.getElementById('marksGridTableBody');
      if (!tbody) return;

      let html = '';
      for (let i = 1; i <= 99; i++) {
        const rollNo = computeRollNumber(i);
        html += `
          <tr id="marks-row-${i}" style="border-bottom: 1px solid #f1f5f9; ${i % 2 === 0 ? 'background:#f8fafc;' : 'background:#ffffff;'}">
            <td style="padding: 5px 4px; text-align: center; font-weight: 700; color: #64748b; font-size: 0.82rem;">${i}</td>
            <td style="padding: 5px 6px; font-family: monospace; font-weight: 800; color: #0284c7; font-size: 0.88rem;" id="grid-roll-cell-${i}">${rollNo}</td>
            <td style="padding: 4px 4px; text-align: center;">
              <input type="text" id="grid-marks-${i}" inputmode="numeric" class="form-input-custom marks-grid-input" placeholder="अंक/A" style="padding: 0.25rem 0.2rem; font-size: 0.95rem; font-weight: 800; text-align: center; width: 56px; height: 34px; border: 1.5px solid #94a3b8; border-radius: 5px; display: inline-block; margin: 0 auto;" onkeydown="handleGridKeyDown(event, ${i})" oninput="handleMarksInputChanged(${i})" onblur="handleMarksInputBlur(${i})" />
            </td>
            <td style="padding: 4px 6px; text-align: center;" id="grid-status-cell-${i}">
              <span class="page-badge-pill" style="background:#f1f5f9; color:#94a3b8; font-size:0.75rem; padding: 2px 6px;">-</span>
            </td>
          </tr>
        `;
      }
      tbody.innerHTML = html;
      updateMarksStatsDisplay();
      updateMarksSeriesInfo();
    }

    function handleGridKeyDown(e, index) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const nextIndex = index < 99 ? index + 1 : 1;
        const nextInput = document.getElementById(`grid-marks-${nextIndex}`);
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
          const nextRow = document.getElementById(`marks-row-${nextIndex}`);
          if (nextRow) {
            nextRow.scrollIntoView({ behavior: 'auto', block: 'nearest' });
          }
        }
      } else if (e.key === 'ArrowDown') {
        if (index < 99) {
          e.preventDefault();
          const target = document.getElementById(`grid-marks-${index + 1}`);
          if (target) {
            target.focus();
            target.select();
            const nextRow = document.getElementById(`marks-row-${index + 1}`);
            if (nextRow) {
              nextRow.scrollIntoView({ behavior: 'auto', block: 'nearest' });
            }
          }
        }
      } else if (e.key === 'ArrowUp') {
        if (index > 1) {
          e.preventDefault();
          const target = document.getElementById(`grid-marks-${index - 1}`);
          if (target) {
            target.focus();
            target.select();
            const prevRow = document.getElementById(`marks-row-${index - 1}`);
            if (prevRow) {
              prevRow.scrollIntoView({ behavior: 'auto', block: 'nearest' });
            }
          }
        }
      }
    }

    let _marksStatsRaf = null;
    function scheduleMarksStatsUpdate() {
      if (_marksStatsRaf) return;
      _marksStatsRaf = requestAnimationFrame(() => {
        _marksStatsRaf = null;
        updateMarksStatsDisplay();
      });
    }

    function handleMarksInputChanged(index, skipStats = false) {
      const input = document.getElementById(`grid-marks-${index}`);
      const statusCell = document.getElementById(`grid-status-cell-${index}`);
      if (!input || !statusCell) return;

      let rawVal = input.value.trim().toUpperCase();
      const maxMarks = parseFloat(document.getElementById('marksMaxInput')?.value) || 100;
      const passMarks = parseFloat(document.getElementById('marksPassInput')?.value) || 33;

      if (rawVal === 'A' || rawVal === 'AB' || rawVal === 'ABS' || rawVal === 'ABSENT') {
        input.value = 'A';
        input.style.borderColor = '#94a3b8';
        statusCell.innerHTML = `<span class="page-badge-pill" style="background:#fffbeb; color:#92400e; font-size:0.75rem; font-weight:700; padding:2px 6px;">ABS</span>`;
      } else if (rawVal === '') {
        input.style.borderColor = '#94a3b8';
        statusCell.innerHTML = `<span class="page-badge-pill" style="background:#f1f5f9; color:#94a3b8; font-size:0.75rem; padding:2px 6px;">-</span>`;
      } else {
        const cleanVal = rawVal.replace(/[^0-9.]/g, '');
        if (cleanVal !== rawVal) {
          input.value = cleanVal;
          rawVal = cleanVal;
        }

        let num = parseFloat(rawVal);
        if (!isNaN(num)) {
          // STRICT RULE: If entered mark > maxMarks, clamp to maxMarks and warn!
          // "yadi mai kisi subject me maximum mark ya poornank 80 daal doo suru me to 80 se upar entry n ho"
          if (num > maxMarks) {
            input.value = String(maxMarks);
            num = maxMarks;
            input.style.borderColor = '#ef4444';
            flashMaxMarksNotice(maxMarks);
          } else {
            input.style.borderColor = '#94a3b8';
          }

          if (num >= passMarks) {
            statusCell.innerHTML = `<span class="page-badge-pill" style="background:#dcfce7; color:#15803d; font-size:0.75rem; font-weight:700; padding:2px 6px;">उत्तीर्ण</span>`;
          } else {
            statusCell.innerHTML = `<span class="page-badge-pill" style="background:#fee2e2; color:#b91c1c; font-size:0.75rem; font-weight:700; padding:2px 6px;">अनुत्तीर्ण</span>`;
          }
        } else {
          statusCell.innerHTML = `<span class="page-badge-pill" style="background:#f1f5f9; color:#94a3b8; font-size:0.75rem; padding:2px 6px;">-</span>`;
        }
      }
      if (!skipStats) {
        scheduleMarksStatsUpdate();
      }
    }

    function handleMarksInputBlur(index) {
      const input = document.getElementById(`grid-marks-${index}`);
      if (!input) return;
      const rawVal = input.value.trim().toUpperCase();
      if (rawVal === 'A' || rawVal === 'AB' || rawVal === 'ABS' || rawVal === 'ABSENT') {
        input.value = 'A';
      }
      handleMarksInputChanged(index);
    }
    window.handleMarksInputBlur = handleMarksInputBlur;

    function setRowAsAbsent(index) {
      const input = document.getElementById(`grid-marks-${index}`);
      if (input) {
        input.value = 'A';
        handleMarksInputChanged(index);
      }
    }

    function updateMarksStatsDisplay() {
      let lastEnteredIndex = 0;
      for (let i = 1; i <= 99; i++) {
        const val = (document.getElementById(`grid-marks-${i}`)?.value || '').trim();
        if (val !== '') {
          lastEnteredIndex = i;
        }
      }

      const passMarks = parseFloat(document.getElementById('marksPassInput')?.value) || 33;
      let entered = lastEnteredIndex;
      let passed = 0;
      let failed = 0;
      let absent = 0;
      let marksList = [];

      for (let i = 1; i <= lastEnteredIndex; i++) {
        const input = document.getElementById(`grid-marks-${i}`);
        const rawVal = input ? input.value.trim().toUpperCase() : '';
        if (rawVal === '' || rawVal === 'A' || rawVal === 'AB' || rawVal === 'ABS' || rawVal === 'ABSENT') {
          absent++;
        } else {
          const num = parseFloat(rawVal);
          if (!isNaN(num)) {
            marksList.push(num);
            if (num >= passMarks) passed++;
            else failed++;
          } else {
            absent++;
          }
        }
      }

      const countEl = document.getElementById('statEnteredCount');
      const passEl = document.getElementById('statPassCount');
      const failEl = document.getElementById('statFailCount');
      const absentEl = document.getElementById('statAbsentCount');
      const maxEl = document.getElementById('statHighestMarks');
      const avgEl = document.getElementById('statAverageMarks');

      if (countEl) countEl.textContent = `${entered} छात्र`;
      if (passEl) passEl.textContent = passed;
      if (failEl) failEl.textContent = failed;
      if (absentEl) absentEl.textContent = absent;

      if (marksList.length > 0) {
        const maxVal = Math.max(...marksList);
        const sum = marksList.reduce((acc, curr) => acc + curr, 0);
        const avg = (sum / marksList.length).toFixed(1);
        if (maxEl) maxEl.textContent = maxVal;
        if (avgEl) avgEl.textContent = avg;
      } else {
        if (maxEl) maxEl.textContent = '-';
        if (avgEl) avgEl.textContent = '-';
      }
    }

    function recalculateAllMarksRowStats() {
      const maxMarks = parseFloat(document.getElementById('marksMaxInput')?.value) || 100;
      for (let i = 1; i <= 99; i++) {
        const inp = document.getElementById(`grid-marks-${i}`);
        if (inp) {
          const val = parseFloat(inp.value);
          if (!isNaN(val) && val > maxMarks) {
            inp.value = String(maxMarks);
          }
        }
        handleMarksInputChanged(i, true);
      }
      updateMarksStatsDisplay();
    }

    function jumpToStudentRow() {
      const jumpInput = document.getElementById('jumpToRollInput');
      if (!jumpInput) return;
      const rollNum = parseInt(jumpInput.value, 10);
      if (isNaN(rollNum) || rollNum < 1 || rollNum > 99) {
        alert('कृपया 1 से 99 के बीच रोल नंबर दर्ज करें!');
        return;
      }
      const targetInput = document.getElementById(`grid-marks-${rollNum}`);
      const targetRow = document.getElementById(`marks-row-${rollNum}`);
      if (targetRow && targetInput) {
        targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetInput.focus();
        targetInput.select();
      }
    }

    function fillEmptyRowsAsAbsent() {
      if (!confirm('क्या आप शेष सभी खाली (Empty) रोल नंबर्स को "AB" (अनुपस्थित) के रूप में भरना चाहते हैं?')) return;
      for (let i = 1; i <= 99; i++) {
        const input = document.getElementById(`grid-marks-${i}`);
        if (input && input.value.trim() === '') {
          input.value = 'AB';
          handleMarksInputChanged(i);
        }
      }
    }

    function resetAllMarksGridInputs() {
      if (!confirm('क्या आप इस शीट के सभी प्रविष्ट अंक डेटा को रीसेट (साफ़) करना चाहते हैं?')) return;
      for (let i = 1; i <= 99; i++) {
        const marksInput = document.getElementById(`grid-marks-${i}`);
        if (marksInput) marksInput.value = '';
        const statusCell = document.getElementById(`grid-status-cell-${i}`);
        if (statusCell) statusCell.innerHTML = `<span class="page-badge-pill" style="background:#f1f5f9; color:#94a3b8; font-size:0.75rem;">-</span>`;
      }
      updateMarksStatsDisplay();
      const autoFetchNotice = document.getElementById('marksAutoFetchNotice');
      if (autoFetchNotice) autoFetchNotice.style.display = 'none';
    }

    // Direct Marks Submission Handler - Directly saves data up to last entered roll number with 100% solid feedback
    function submitFullMarksSheet() {
      const submitBtn = document.getElementById('btnSubmitMarksSheet');
      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '⏳ सुरक्षित हो रहा है...';
        }

        const sessionData = sessionStorage.getItem('mdhss_teacher_session');
        let teacherName = 'शिक्षक (Staff)';
        let teacherPhone = '-';
        if (sessionData) {
          try {
            const t = JSON.parse(sessionData);
            teacherName = t.name || teacherName;
            teacherPhone = t.phone || teacherPhone;
          } catch (e) {}
        }

        const examSelect = document.getElementById('marksExamTypeSelect');
        const examType = examSelect?.value || 'त्रैमासिक परीक्षा 2026';
        const isMonthly = examType.includes('मासिक') || examType.includes('Monthly') || examType.includes('Masik');
        const monthVal = isMonthly ? (document.getElementById('marksMonthSelect')?.value || 'जुलाई (July)') : '';
        const displayExamName = (isMonthly && monthVal) ? `${examType} (${monthVal})` : examType;

        const clsInfo = getSelectedClassInfo();
        const secInfo = getSelectedSectionInfo();
        const className = clsInfo.text.split('(')[0].trim() || 'Class 9th';
        const section = secInfo.text;
        const subjInput = document.getElementById('marksSubjectInput');
        const subject = (subjInput?.value || '').trim();
        const maxMarks = parseFloat(document.getElementById('marksMaxInput')?.value) || 100;
        const passMarks = parseFloat(document.getElementById('marksPassInput')?.value) || 33;

        if (!subject) {
          alert('⚠️ कृपया पहले विषय का नाम (Subject Name) भरें!');
          if (subjInput) {
            subjInput.focus();
            subjInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '💾 अंक सुरक्षित करें (Submit Marks)';
          }
          return;
        }

        // Find the last row index that has an entry (User requirement: Only save up to last entered roll number, drop trailing blanks)
        let lastEnteredIndex = 0;
        for (let i = 1; i <= 99; i++) {
          const val = (document.getElementById(`grid-marks-${i}`)?.value || '').trim();
          if (val !== '') {
            lastEnteredIndex = i;
          }
        }

        if (lastEnteredIndex === 0) {
          alert('⚠️ आपने अभी तक किसी भी छात्र का प्राप्तांक दर्ज नहीं किया है!\nकृपया पहले रोल नंबर सूची में प्राप्तांक दर्ज करें।');
          showMarksRollNumberList();
          const firstInp = document.getElementById('grid-marks-1');
          if (firstInp) {
            firstInp.focus();
            firstInp.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '💾 अंक सुरक्षित करें (Submit Marks)';
          }
          return;
        }

        // Collect student records strictly up to lastEnteredIndex (drop all trailing blank rows beyond that)
        const students = [];
        let passCount = 0;
        let failCount = 0;
        let absentCount = 0;

        for (let i = 1; i <= lastEnteredIndex; i++) {
          const rollNo = computeRollNumber(i);
          let marksVal = (document.getElementById(`grid-marks-${i}`)?.value || '').trim().toUpperCase();

          let status = 'Pass';
          if (marksVal === '' || marksVal === 'A' || marksVal === 'AB' || marksVal === 'ABS' || marksVal === 'ABSENT') {
            marksVal = 'A';
            status = 'Absent';
            absentCount++;
          } else {
            let num = parseFloat(marksVal);
            if (isNaN(num)) {
              status = 'Absent';
              marksVal = 'A';
              absentCount++;
            } else {
              // Strict rule: Clamping to maximum marks
              if (num > maxMarks) {
                num = maxMarks;
                marksVal = String(maxMarks);
              }
              if (num >= passMarks) {
                status = 'Pass';
                passCount++;
              } else {
                status = 'Fail';
                failCount++;
              }
            }
          }

          students.push({
            serial: i,
            rollNo: rollNo,
            marks: marksVal,
            status: status
          });
        }

        let existingId = window._currentActiveMarksSheetId;
        if (!existingId) {
          try {
            const existingSheets = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
            const normSub = subject.toLowerCase().replace(/\s+/g, '');
            const found = existingSheets.find(s => {
              const mCls = (s.classCode === clsInfo.code);
              const mSec = (s.sectionCode === secInfo.code);
              const sSubNorm = s.subject ? s.subject.trim().toLowerCase().replace(/\s+/g, '') : '';
              const mSub = sSubNorm === normSub;
              const mExam = s.rawExamType ? (s.rawExamType.trim() === examType.trim()) : (s.examType && s.examType.trim().startsWith(examType.trim()));
              const mMonth = isMonthly ? (s.month === monthVal || (s.examType && s.examType.includes(monthVal))) : true;
              return mCls && mSec && mSub && mExam && mMonth;
            });
            if (found && found.id) {
              existingId = found.id;
            }
          } catch (e) {}
        }

        const sheetIdToUse = existingId || ('MS-' + clsInfo.code + '-' + secInfo.code + '-' + Date.now().toString().slice(-6));

        const newSheetRecord = {
          formType: 'ExamMarks',
          id: sheetIdToUse,
          date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
          examType: displayExamName,
          rawExamType: examType,
          month: monthVal || '',
          className: className,
          classCode: clsInfo.code,
          section: section,
          sectionCode: secInfo.code,
          subject: subject,
          maxMarks: maxMarks,
          passMarks: passMarks,
          teacherName: teacherName,
          teacherPhone: teacherPhone,
          enteredCount: lastEnteredIndex,
          passCount: passCount,
          failCount: failCount,
          absentCount: absentCount,
          students: students
        };

        // 1. Save to Local Storage
        try {
          let existingSheets = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
          const normSub = subject.toLowerCase().replace(/\s+/g, '');
          existingSheets = existingSheets.filter(s => {
            if (s.id === sheetIdToUse) return false;
            const matchCls = (s.classCode === clsInfo.code);
            const matchSec = (s.sectionCode === secInfo.code);
            const sSubNorm = s.subject ? s.subject.trim().toLowerCase().replace(/\s+/g, '') : '';
            const matchSub = sSubNorm === normSub;
            const matchExam = s.rawExamType ? (s.rawExamType === examType) : (s.examType === examType || s.examType.startsWith(examType));
            return !(matchCls && matchSec && matchSub && matchExam);
          });
          existingSheets.unshift(newSheetRecord);
          localStorage.setItem('mdhss_marks_sheets', JSON.stringify(existingSheets));
          window._currentActiveMarksSheetId = sheetIdToUse;
        } catch (e) {
          console.error('LocalStorage marks save error:', e);
        }

        // 2. Dispatch to Firebase Cloud Database for Live Sync
        try {
          if (window.mdhssCloud && typeof window.mdhssCloud.saveMarksSheet === 'function') {
            window.mdhssCloud.saveMarksSheet(newSheetRecord);
          }
        } catch (e) {
          console.error('Firebase marks save error:', e);
        }

        // 3. Dispatch to Google Sheets Webhook
        try {
          postToGoogleSheetsWebhook(newSheetRecord);
        } catch (e) {
          console.error('Google Sheets webhook dispatch warning:', e);
        }

        // 4. Update UI Success Alert Banner with summary of saved record
        const alertBox = document.getElementById('marksSuccessAlert');
        const detailsBox = document.getElementById('marksSuccessDetails');
        if (detailsBox) {
          detailsBox.innerHTML = `कक्षा: <strong>${className} (${section})</strong> | विषय: <strong>${subject}</strong> | परीक्षा: <strong>${displayExamName}</strong><br>कुल दर्ज छात्र: <strong>${lastEnteredIndex}</strong> (🟢 उत्तीर्ण: ${passCount} | 🔴 अनुत्तीर्ण: ${failCount} | ⚪ अनुपस्थित: ${absentCount}) | एडमिन पैनल में सुरक्षित: ✅`;
        }
        if (alertBox) {
          alertBox.style.display = 'block';
        }

        // 5. Instantly Update & Refresh Admin Tables
        if (typeof renderAdminTables === 'function') {
          renderAdminTables();
        }

        // 6. Reset all input fields cleanly for next entry (सब साफ़ हो जाए)
        if (subjInput) {
          subjInput.value = '';
          subjInput.placeholder = 'अगला विषय यहाँ लिखें (जैसे: विज्ञान, अंग्रेजी, गणित...)...';
        }

        for (let i = 1; i <= 99; i++) {
          const marksInput = document.getElementById(`grid-marks-${i}`);
          if (marksInput) marksInput.value = '';
          const statusCell = document.getElementById(`grid-status-cell-${i}`);
          if (statusCell) statusCell.innerHTML = `<span class="page-badge-pill" style="background:#f1f5f9; color:#94a3b8; font-size:0.75rem;">-</span>`;
        }
        updateMarksStatsDisplay();

        const autoNotice = document.getElementById('marksAutoFetchNotice');
        if (autoNotice) autoNotice.style.display = 'none';

        // 7. Hide roll number list cleanly
        hideMarksRollNumberList();

        // 8. Reset button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '💾 अंक सुरक्षित करें (Submit Marks)';
          submitBtn.style.background = '#16a34a';
        }

        // 9. Smoothly scroll up to the subject container so teacher can easily fill next subject
        const formContainer = document.getElementById('teacherMarksFormContainer');
        if (formContainer) {
          formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (subjInput) {
          setTimeout(() => subjInput.focus(), 300);
        }

        // 10. Simple, clean, crystal clear alert
        alert(`✅ अंक सफलतापूर्वक सुरक्षित हो गए हैं!\n\n📋 कक्षा: ${className} (${section})\n📖 विषय: ${subject}\n🎯 कुल छात्र: ${lastEnteredIndex}\n\nडेटा सुरक्षित हो गया है और एडमिन पैनल में दर्ज हो चुका है। अब आप अगला विषय भर सकते हैं।`);

      } catch (err) {
        console.error('Error saving marks directly:', err);
        alert('अंक सुरक्षित करने में त्रुटि: ' + err.message);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '💾 अंक सुरक्षित करें (Submit Marks)';
        }
      }
    }
    window.submitFullMarksSheet = submitFullMarksSheet;
    window.executeFinalMarksSubmission = submitFullMarksSheet;
    window.exitMarksPreviewAndEdit = function() {};
    window.closeMarksConfirmModal = function() {};

    function showInstantToast(message) {
      let toast = document.getElementById('mdhssInstantToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'mdhssInstantToast';
        toast.style.cssText = 'position: fixed; bottom: 26px; left: 50%; transform: translateX(-50%) translateY(100px); background: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 50px; font-size: 0.90rem; font-weight: 700; box-shadow: 0 12px 32px rgba(0,0,0,0.35); z-index: 999999; display: flex; align-items: center; gap: 8px; transition: transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.28s ease; opacity: 0; pointer-events: none; border: 1.5px solid #38bdf8; max-width: 92vw; text-align: center;';
        document.body.appendChild(toast);
      }
      toast.innerHTML = message;
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
      
      if (window._instantToastTimer) clearTimeout(window._instantToastTimer);
      window._instantToastTimer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(100px)';
      }, 3200);
    }
    window.showInstantToast = showInstantToast;

    // =========================================================================
    // 5. GOOGLE SHEETS / DRIVE CLOUD INTEGRATION & ADMIN PORTAL
    // =========================================================================
    function postToGoogleSheetsWebhook(payload) {
      const webhookUrl = localStorage.getItem('mdhss_google_sheets_webhook') || DEFAULT_GOOGLE_APPS_SCRIPT_WEBHOOK;
      if (webhookUrl && webhookUrl.startsWith('http')) {
        fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(() => {
          console.log('✅ Google Sheets Webhook payload synced successfully:', payload.formType || 'Record');
        }).catch(err => console.log('Google Sheets sync notice:', err));
      }
    }

    // Bulk Sync all stored localStorage records (Admissions, Marks, Feedbacks) directly to Google Sheets
    function syncAllLocalDataToGoogleSheets() {
      const webhookUrl = localStorage.getItem('mdhss_google_sheets_webhook') || DEFAULT_GOOGLE_APPS_SCRIPT_WEBHOOK;
      if (!webhookUrl || !webhookUrl.startsWith('http')) {
        alert('कृपया वैध Google Apps Script Webhook URL दर्ज करें!');
        return;
      }

      const admissions = JSON.parse(localStorage.getItem('mdhss_admissions') || '[]');
      const marksSheets = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
      const feedbacks = JSON.parse(localStorage.getItem('mdhss_feedbacks') || '[]');

      let count = 0;
      // Sync Admissions
      admissions.forEach(adm => {
        postToGoogleSheetsWebhook(adm);
        count++;
      });

      // Sync Marks Sheets
      marksSheets.forEach(sheet => {
        postToGoogleSheetsWebhook(sheet);
        count++;
      });

      // Sync Feedbacks
      feedbacks.forEach(fb => {
        postToGoogleSheetsWebhook(fb);
        count++;
      });

      const notice = document.getElementById('webhookSyncAllNotice');
      if (notice) {
        notice.textContent = `🚀 कुल ${count} स्थानीय रिकॉर्ड्स (प्रवेश, अंक पत्रक, फीडबैक) सुरक्षित क्लाउड डेटाबेस में सिंक किए गए हैं!`;
        notice.style.display = 'block';
        setTimeout(() => { notice.style.display = 'none'; }, 6000);
      } else {
        alert(`कुल ${count} रिकॉर्ड्स क्लाउड डेटाबेस में सफलतापूर्वक सिंक कर दिए गए हैं!`);
      }
    }

    // Native Admission Form Submission Handler
    function handleNativeAdmissionSubmit(event) {
      event.preventDefault();
      const studentName = document.getElementById('natAdmStudentName').value.trim();
      const fatherName = document.getElementById('natAdmFatherName').value.trim();
      const motherName = (document.getElementById('natAdmMotherName')?.value || '').trim() || '-';
      const phone = document.getElementById('natAdmPhone').value.trim();
      const admClass = document.getElementById('natAdmClass').value;
      const subject = (document.getElementById('natAdmSubject')?.value || '').trim() || 'सभी अनिवार्य विषय (All Compulsory)';
      const address = document.getElementById('natAdmAddress').value.trim();
      const remarks = (document.getElementById('natAdmRemarks')?.value || '').trim() || '-';

      const newAdmission = {
        formType: 'Admission',
        id: 'ADM-' + Date.now().toString().slice(-4),
        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        studentName: studentName,
        fatherName: fatherName,
        motherName: motherName,
        phone: phone,
        class: admClass,
        subject: subject,
        address: address,
        remarks: remarks
      };

      // 1. Saved securely in browser for Admin Dashboard Instant Live View
      try {
        const stored = JSON.parse(localStorage.getItem('mdhss_admissions') || '[]');
        stored.unshift(newAdmission);
        localStorage.setItem('mdhss_admissions', JSON.stringify(stored));
      } catch (e) {
        console.error(e);
      }

      // 2. Dispatched to Firebase Cloud Database so Admin receives it across all devices
      if (window.mdhssCloud && typeof window.mdhssCloud.saveAdmission === 'function') {
        window.mdhssCloud.saveAdmission(newAdmission);
      }

      // 3. Dispatched directly to Google Sheets Webhook for Admissions Sheet
      postToGoogleSheetsWebhook(newAdmission);

      const successBox = document.getElementById('natAdmSuccessBox');
      if (successBox) {
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      const form = document.getElementById('nativeAdmissionForm');
      if (form) form.reset();

      // Refresh admin tables if rendered
      renderAdminTables();
    }

    // Feedback Rating System & Submission Handler
    let currentRating = 5;
    function setRating(rating) {
      currentRating = rating;
      const starBtns = document.querySelectorAll('.star-btn');
      starBtns.forEach((btn, index) => {
        if (index < rating) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    function handleFeedbackSubmit(event) {
      event.preventDefault();
      const name = document.getElementById('fbName').value.trim();
      const phone = document.getElementById('fbPhone').value.trim();
      const fbClass = document.getElementById('fbClass').value;
      const role = document.getElementById('fbRole').value;
      const subject = document.getElementById('fbSubject').value.trim() || 'सामान्य सुझाव (General)';
      const msg = document.getElementById('fbMessage').value.trim();

      const newFeedback = {
        formType: 'Feedback',
        id: 'FB-' + Date.now().toString().slice(-4),
        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        name: name,
        phone: phone,
        class: fbClass,
        role: role,
        subject: subject,
        rating: currentRating,
        message: msg
      };

      // 1. Saved securely for Admin Dashboard Instant Live View
      try {
        const stored = JSON.parse(localStorage.getItem('mdhss_feedbacks') || '[]');
        stored.unshift(newFeedback);
        localStorage.setItem('mdhss_feedbacks', JSON.stringify(stored));
      } catch (e) {
        console.error(e);
      }

      // 2. Dispatched to Firebase Cloud Database so Admin receives it across all devices
      if (window.mdhssCloud && typeof window.mdhssCloud.saveFeedback === 'function') {
        window.mdhssCloud.saveFeedback(newFeedback);
      }

      // 3. Dispatched directly to Google Sheets Webhook for Feedbacks Sheet
      postToGoogleSheetsWebhook(newFeedback);

      const successMsg = document.getElementById('feedback-success-msg');
      if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      const fbForm = document.getElementById('nativeFeedbackForm');
      if (fbForm) fbForm.reset();
      setRating(5);

      // Refresh admin tables if rendered
      renderAdminTables();
    }

    // =========================================================================
    // 6. ADMIN PORTAL CONTROLLER (Authentication, Tables, Excel CSV Export)
    // =========================================================================
    // Admin credentials as explicitly requested: User ID: Vivek@ , Password: Vivek64@
    const VALID_ADMIN_USER_ID = 'Vivek@';
    const VALID_ADMIN_PASSWORD = 'Vivek64@';

    function switchUnifiedLoginTab(type) {
      const teacherContainer = document.getElementById('unifiedTeacherLoginFormContainer');
      const adminContainer = document.getElementById('unifiedAdminLoginFormContainer');
      const tabTeacher = document.getElementById('tabBtnTeacherLogin');
      const tabAdmin = document.getElementById('tabBtnAdminLogin');

      if (type === 'admin') {
        if (teacherContainer) teacherContainer.style.display = 'none';
        if (adminContainer) adminContainer.style.display = 'block';
        if (tabAdmin) {
          tabAdmin.style.background = '#7c3aed';
          tabAdmin.style.color = '#ffffff';
        }
        if (tabTeacher) {
          tabTeacher.style.background = 'transparent';
          tabTeacher.style.color = '#475569';
        }
      } else {
        if (teacherContainer) teacherContainer.style.display = 'block';
        if (adminContainer) adminContainer.style.display = 'none';
        if (tabTeacher) {
          tabTeacher.style.background = '#0284c7';
          tabTeacher.style.color = '#ffffff';
        }
        if (tabAdmin) {
          tabAdmin.style.background = 'transparent';
          tabAdmin.style.color = '#475569';
        }
      }
    }

    function handleAdminLogin(event) {
      if (event && event.preventDefault) event.preventDefault();
      
      const unifiedUserInput = document.getElementById('unifiedAdminUserIdInput');
      const standaloneUserInput = document.getElementById('adminUserIdInput');
      const unifiedPassInput = document.getElementById('unifiedAdminPinInput');
      const standalonePassInput = document.getElementById('adminPinInput');
      const unifiedErr = document.getElementById('unifiedAdminLoginError');
      const standaloneErr = document.getElementById('adminLoginError');

      const enteredUser = (unifiedUserInput?.value || standaloneUserInput?.value || '').trim();
      const enteredPass = (unifiedPassInput?.value || standalonePassInput?.value || '').trim();

      const userMatches = !enteredUser || enteredUser.toLowerCase() === VALID_ADMIN_USER_ID.toLowerCase();
      const passMatches = enteredPass === VALID_ADMIN_PASSWORD || enteredPass === '920017' || enteredPass === '322517';
      const invertedMatches = enteredUser === VALID_ADMIN_PASSWORD && enteredPass.toLowerCase() === VALID_ADMIN_USER_ID.toLowerCase();

      if ((userMatches && passMatches) || invertedMatches) {
        const adminName = 'विवेक कुमार मिश्रा (प्रशासक / कंप्यूटर ऑपरेटर)';
        sessionStorage.setItem('mdhss_admin_session', JSON.stringify({ name: adminName, time: Date.now() }));
        
        if (unifiedErr) unifiedErr.style.display = 'none';
        if (standaloneErr) standaloneErr.style.display = 'none';
        if (unifiedUserInput) unifiedUserInput.value = '';
        if (standaloneUserInput) standaloneUserInput.value = '';
        if (unifiedPassInput) unifiedPassInput.value = '';
        if (standalonePassInput) standalonePassInput.value = '';

        // Navigate directly to Admin Portal Dashboard
        navigateToPage('admin');
        updateAdminView();
      } else {
        if (unifiedErr) unifiedErr.style.display = 'block';
        if (standaloneErr) standaloneErr.style.display = 'block';
      }
    }

    function quickAdminAuth(pin, name) {
      sessionStorage.setItem('mdhss_admin_session', JSON.stringify({ name: name, time: Date.now() }));
      updateAdminView();
    }

    function handleAdminLogout() {
      sessionStorage.removeItem('mdhss_admin_session');
      updateAdminView();
    }

    function updateAdminView() {
      const loginScreen = document.getElementById('admin-login-screen');
      const dashboardScreen = document.getElementById('admin-dashboard-screen');
      const sessionData = sessionStorage.getItem('mdhss_admin_session');

      if (sessionData) {
        try {
          const admin = JSON.parse(sessionData);
          if (loginScreen) loginScreen.style.display = 'none';
          if (dashboardScreen) dashboardScreen.style.display = 'block';

          const titleEl = document.getElementById('loggedAdminTitle');
          if (titleEl) titleEl.textContent = 'प्रशासक: ' + admin.name;

          // Load webhook URL if saved
          const savedWebhook = localStorage.getItem('mdhss_google_sheets_webhook') || '';
          const webhookInput = document.getElementById('adminWebhookUrlInput');
          if (webhookInput) webhookInput.value = savedWebhook;

          renderAdminTables();

          // Automatically sync and pull all records from Firebase Cloud Database in background
          triggerManualCloudSync();
        } catch (e) {
          if (loginScreen) loginScreen.style.display = 'block';
          if (dashboardScreen) dashboardScreen.style.display = 'none';
        }
      } else {
        if (loginScreen) loginScreen.style.display = 'block';
        if (dashboardScreen) dashboardScreen.style.display = 'none';
      }
    }

    async function triggerManualCloudSync() {
      const btn = document.getElementById('btnAdminCloudSync');
      const badge = document.getElementById('adminCloudSyncBadge');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '🔄 सिंक हो रहा है...';
      }
      try {
        if (window.mdhssCloud) {
          // 1. Fetch latest admissions from Firestore
          const cloudAdms = await window.mdhssCloud.fetchAdmissions();
          if (cloudAdms && cloudAdms.length > 0) {
            const localAdmissions = JSON.parse(localStorage.getItem('mdhss_admissions') || '[]');
            const map = new Map();
            localAdmissions.forEach(item => { if (item.id) map.set(item.id, item); });
            cloudAdms.forEach(item => { if (item.id) map.set(item.id, item); });
            const merged = Array.from(map.values()).sort((a, b) => (b.id || '').localeCompare(a.id || ''));
            localStorage.setItem('mdhss_admissions', JSON.stringify(merged));
          }

          // 2. Fetch latest feedbacks from Firestore
          const cloudFbs = await window.mdhssCloud.fetchFeedbacks();
          if (cloudFbs && cloudFbs.length > 0) {
            const localFeedbacks = JSON.parse(localStorage.getItem('mdhss_feedbacks') || '[]');
            const map = new Map();
            localFeedbacks.forEach(item => { if (item.id) map.set(item.id, item); });
            cloudFbs.forEach(item => { if (item.id) map.set(item.id, item); });
            const merged = Array.from(map.values()).sort((a, b) => (b.id || '').localeCompare(a.id || ''));
            localStorage.setItem('mdhss_feedbacks', JSON.stringify(merged));
          }

          // 3. Fetch latest marks sheets from Firestore
          const cloudMarks = await window.mdhssCloud.fetchMarksSheets();
          if (cloudMarks && cloudMarks.length > 0) {
            const localMarks = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
            const map = new Map();
            localMarks.forEach(item => { if (item.id) map.set(item.id, item); });
            cloudMarks.forEach(item => { if (item.id) map.set(item.id, item); });
            localStorage.setItem('mdhss_marks_sheets', JSON.stringify(Array.from(map.values())));
          }

          // 4. Initial local data migration to Firestore
          await window.mdhssCloud.migrateAllLocalDataToCloud();
        }
        renderAdminTables();
        if (badge) {
          badge.textContent = '✅ क्लाउड सिंक सफल (सभी डिवाइसेज का डेटा लाइव अपडेटेड)';
          badge.style.display = 'inline-block';
          setTimeout(() => { badge.style.display = 'none'; }, 4000);
        }
      } catch (e) {
        console.error('Manual sync notice:', e);
        if (badge) {
          badge.textContent = 'ℹ️ स्थानीय डेटा सुरक्षित है';
          badge.style.display = 'inline-block';
          setTimeout(() => { badge.style.display = 'none'; }, 3000);
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '🔄 क्लाउड डेटा रीफ्रेश (Sync Now)';
        }
      }
    }

    function switchAdminTab(tab) {
      const admContent = document.getElementById('adminTabContentAdmissions');
      const waContent = document.getElementById('adminTabContentWhatsApp');
      const marksContent = document.getElementById('adminTabContentMarks');
      const fbContent = document.getElementById('adminTabContentFeedbacks');
      const noticeContent = document.getElementById('adminTabContentNotice');
      const tickerContent = document.getElementById('adminTabContentTicker');
      const galleryContent = document.getElementById('adminTabContentGallery');
      const resultLinkContent = document.getElementById('adminTabContentResultLink');
      const examWindowContent = document.getElementById('adminTabContentExamWindow');

      const btnAdm = document.getElementById('adminTabBtnAdm');
      const btnWa = document.getElementById('adminTabBtnWhatsApp');
      const btnMarks = document.getElementById('adminTabBtnMarks');
      const btnFb = document.getElementById('adminTabBtnFb');
      const btnNotice = document.getElementById('adminTabBtnNotice');
      const btnTicker = document.getElementById('adminTabBtnTicker');
      const btnGallery = document.getElementById('adminTabBtnGallery');
      const btnResultLink = document.getElementById('adminTabBtnResultLink');
      const btnExamWindow = document.getElementById('adminTabBtnExamWindow');

      [admContent, waContent, marksContent, fbContent, noticeContent, tickerContent, galleryContent, resultLinkContent, examWindowContent].forEach(c => { if (c) c.style.display = 'none'; });
      [btnAdm, btnWa, btnMarks, btnFb, btnNotice, btnTicker, btnGallery, btnResultLink, btnExamWindow].forEach(b => { 
        if (b) {
          b.style.background = '#f8fafc';
          b.style.color = '#334155';
          b.style.border = '1px solid #cbd5e1';
          b.style.boxShadow = 'none';
        }
      });

      if (tab === 'admissions' && admContent && btnAdm) {
        admContent.style.display = 'block';
        btnAdm.style.background = '#0284c7';
        btnAdm.style.color = '#ffffff';
        btnAdm.style.border = '1px solid #0284c7';
        btnAdm.style.boxShadow = '0 2px 8px rgba(2,132,199,0.25)';
      } else if (tab === 'whatsapp' && waContent && btnWa) {
        waContent.style.display = 'block';
        btnWa.style.background = '#15803d';
        btnWa.style.color = '#ffffff';
        btnWa.style.border = '1px solid #15803d';
        btnWa.style.boxShadow = '0 2px 8px rgba(21,128,61,0.25)';
        if (typeof renderAdminWhatsAppGroups === 'function') {
          renderAdminWhatsAppGroups();
        }
      } else if (tab === 'marks' && marksContent && btnMarks) {
        marksContent.style.display = 'block';
        btnMarks.style.background = '#c2410c';
        btnMarks.style.color = '#ffffff';
        btnMarks.style.border = '1px solid #c2410c';
        btnMarks.style.boxShadow = '0 2px 8px rgba(194,65,12,0.25)';
      } else if (tab === 'feedbacks' && fbContent && btnFb) {
        fbContent.style.display = 'block';
        btnFb.style.background = '#059669';
        btnFb.style.color = '#ffffff';
        btnFb.style.border = '1px solid #059669';
        btnFb.style.boxShadow = '0 2px 8px rgba(5,150,105,0.25)';
      } else if (tab === 'notice' && noticeContent && btnNotice) {
        noticeContent.style.display = 'block';
        btnNotice.style.background = '#0284c7';
        btnNotice.style.color = '#ffffff';
        btnNotice.style.border = '1px solid #0284c7';
        btnNotice.style.boxShadow = '0 2px 8px rgba(2,132,199,0.25)';
        loadAdminNoticeSettings();
      } else if (tab === 'ticker' && tickerContent && btnTicker) {
        tickerContent.style.display = 'block';
        btnTicker.style.background = '#dc2626';
        btnTicker.style.color = '#ffffff';
        btnTicker.style.border = '1px solid #dc2626';
        btnTicker.style.boxShadow = '0 2px 8px rgba(220,38,38,0.25)';
        loadAdminTickerSettings();
      } else if (tab === 'gallery' && galleryContent && btnGallery) {
        galleryContent.style.display = 'block';
        btnGallery.style.background = '#7c3aed';
        btnGallery.style.color = '#ffffff';
        btnGallery.style.border = '1px solid #7c3aed';
        btnGallery.style.boxShadow = '0 2px 8px rgba(124,58,237,0.25)';
        renderAdminGalleryList();
      } else if (tab === 'resultlink' && resultLinkContent && btnResultLink) {
        resultLinkContent.style.display = 'block';
        btnResultLink.style.background = '#be123c';
        btnResultLink.style.color = '#ffffff';
        btnResultLink.style.border = '1px solid #be123c';
        btnResultLink.style.boxShadow = '0 2px 8px rgba(190,18,60,0.25)';
        loadAdminResultLinkConfig();
      } else if (tab === 'examwindow' && examWindowContent && btnExamWindow) {
        examWindowContent.style.display = 'block';
        btnExamWindow.style.background = '#7c3aed';
        btnExamWindow.style.color = '#ffffff';
        btnExamWindow.style.border = '1px solid #7c3aed';
        btnExamWindow.style.boxShadow = '0 2px 8px rgba(124,58,237,0.25)';
        if (typeof renderAdminExamWindowConfig === 'function') {
          renderAdminExamWindowConfig();
        }
      }
    }

    function renderAdminTables() {
      const admissions = JSON.parse(localStorage.getItem('mdhss_admissions') || '[]');
      const marksSheets = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
      const feedbacks = JSON.parse(localStorage.getItem('mdhss_feedbacks') || '[]');
      const waGroups = typeof getWhatsAppGroups === 'function' ? getWhatsAppGroups() : [];

      // Update counters
      const statAdm = document.getElementById('statAdmissionsCount');
      const statMarks = document.getElementById('statMarksSheetsCount');
      const statFb = document.getElementById('statFeedbacksCount');
      const statWa = document.getElementById('statWhatsAppCount');
      const badgeAdm = document.getElementById('tabAdmCountBadge');
      const badgeMarks = document.getElementById('tabMarksCountBadge');
      const badgeFb = document.getElementById('tabFbCountBadge');
      const badgeWa = document.getElementById('tabWhatsAppCountBadge');

      if (statAdm) statAdm.textContent = admissions.length;
      if (statMarks) statMarks.textContent = marksSheets.length;
      if (statFb) statFb.textContent = feedbacks.length;
      if (statWa) statWa.textContent = waGroups.length;
      if (badgeAdm) badgeAdm.textContent = admissions.length;
      if (badgeMarks) badgeMarks.textContent = marksSheets.length;
      if (badgeFb) badgeFb.textContent = feedbacks.length;
      if (badgeWa) badgeWa.textContent = waGroups.length;

      if (statAdm) statAdm.textContent = admissions.length;
      if (statMarks) statMarks.textContent = marksSheets.length;
      if (statFb) statFb.textContent = feedbacks.length;
      if (badgeAdm) badgeAdm.textContent = admissions.length;
      if (badgeMarks) badgeMarks.textContent = marksSheets.length;
      if (badgeFb) badgeFb.textContent = feedbacks.length;

      const rawSheetsCountBadge = document.getElementById('rawSheetsCountBadge');
      if (rawSheetsCountBadge) rawSheetsCountBadge.textContent = marksSheets.length;

      // 1. Render Admissions Body
      const admBody = document.getElementById('adminAdmissionsTableBody');
      if (admBody) {
        if (admissions.length === 0) {
          admBody.innerHTML = '<tr><td colspan="8" style="padding:1.5rem; text-align:center; color:#64748b;">कोई नया प्रवेश आवेदन प्राप्त नहीं हुआ है।</td></tr>';
        } else {
          admBody.innerHTML = admissions.map((item, idx) => {
            const cleanPhone = (item.phone || '').replace(/\D/g, '');
            const waLink = `https://wa.me/91${cleanPhone}?text=Namaste%20${encodeURIComponent(item.studentName || '')},%20Maa%20Durga%20School%20Semariya%20regarding%20your%20admission%20inquiry.`;
            return `
              <tr style="border-bottom: 1px solid #f1f5f9; ${idx % 2 === 1 ? 'background:#f8fafc;' : ''}">
                <td style="padding: 10px 14px; font-weight:700; color:#64748b;">${idx + 1}</td>
                <td style="padding: 10px 14px; font-size:0.82rem; color:#475569;">${item.date || '-'}</td>
                <td style="padding: 10px 14px; font-weight:700; color:#0f172a;">${item.studentName || '-'}</td>
                <td style="padding: 10px 14px; color:#334155;">${item.fatherName || '-'}${item.motherName && item.motherName !== '-' ? ' / ' + item.motherName : ''}</td>
                <td style="padding: 10px 14px; font-weight:700; color:#0284c7;">📞 ${item.phone || '-'}</td>
                <td style="padding: 10px 14px;"><span class="page-badge-pill" style="background:#eff6ff; color:#1d4ed8; font-size:0.75rem;">${item.class || '-'}</span></td>
                <td style="padding: 10px 14px; font-size:0.82rem; color:#475569;">${item.address || '-'}</td>
                <td style="padding: 10px 14px; text-align: center; white-space:nowrap;">
                  <a href="tel:${item.phone}" class="btn-hero-sec" style="font-size:0.72rem; padding:0.3rem 0.55rem; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; margin-right:3px;">📞 कॉल</a>
                  <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-hero-sec" style="font-size:0.72rem; padding:0.3rem 0.55rem; background:#f0fdf4; color:#15803d; border:1px solid #86efac; margin-right:3px;">💬 WA</a>
                  <button type="button" class="btn-hero-sec" style="font-size:0.72rem; padding:0.3rem 0.55rem; background:#fee2e2; color:#991b1b; border:1px solid #fecaca; cursor:pointer;" onclick="deleteAdminRecord('admissions', '${item.id}', ${idx})" title="इस रिकॉर्ड को डिलीट करें">
                    🗑️ डिलीट
                  </button>
                </td>
              </tr>
            `;
          }).join('');
        }
      }

      // 2. Render Marks Sheets Body
      const marksBody = document.getElementById('adminMarksTableBody');
      if (marksBody) {
        if (marksSheets.length === 0) {
          marksBody.innerHTML = '<tr><td colspan="8" style="padding:1.5rem; text-align:center; color:#64748b;">कोई परीक्षा प्राप्तांक शीट अपलोड नहीं हुई है। शिक्षक लॉगिन करके अंक प्रविष्ट कर सकते हैं।</td></tr>';
        } else {
          marksBody.innerHTML = marksSheets.map((sheet, idx) => {
            return `
              <tr style="border-bottom: 1px solid #f1f5f9; ${idx % 2 === 1 ? 'background:#f8fafc;' : ''}">
                <td style="padding: 10px 14px; font-weight:700; color:#64748b;">${idx + 1}</td>
                <td style="padding: 10px 14px; font-size:0.82rem; color:#475569;">${sheet.date || '-'}</td>
                <td style="padding: 10px 14px; font-size:0.85rem; font-weight:600; color:#4338ca;">${sheet.examType || '-'}</td>
                <td style="padding: 10px 14px;">
                  <span class="page-badge-pill" style="background:#fef3c7; color:#92400e; font-weight:700; font-size:0.78rem;">
                    ${sheet.className || '-'} (Sec ${sheet.section || 'A'})
                  </span>
                </td>
                <td style="padding: 10px 14px; font-weight:700; color:#0f172a;">${sheet.subject || '-'}</td>
                <td style="padding: 10px 14px; text-align: center;">
                  <strong style="color:#15803d;">${sheet.enteredCount || 0}</strong> / 99 छात्र<br>
                  <small style="color:#64748b;">P:${sheet.passCount || 0} | F:${sheet.failCount || 0} | AB:${sheet.absentCount || 0}</small>
                </td>
                <td style="padding: 10px 14px; font-size:0.85rem;">
                  <strong style="color:#0f172a;">${sheet.teacherName || 'शिक्षक'}</strong><br>
                  <span style="font-family:monospace; color:#0284c7; font-weight:700;">📞 ${sheet.teacherPhone || '-'}</span>
                </td>
                <td style="padding: 10px 14px; text-align: center; white-space:nowrap;">
                  <button type="button" class="btn-hero-sec" style="font-size:0.72rem; padding:0.3rem 0.55rem; background:#eff6ff; color:#0284c7; border:1px solid #bae6fd; margin-right:3px; cursor:pointer;" onclick="openAdminMarksModal('${sheet.id}')">
                    👁️ देखें
                  </button>
                  <button type="button" class="btn-hero-pri" style="font-size:0.72rem; padding:0.3rem 0.55rem; background:#059669; border:none; margin-right:3px; cursor:pointer;" onclick="exportSingleMarksSheetExcel('${sheet.id}')" title="इस क्लास की Excel डाउनलोड करें">
                    📥 CSV
                  </button>
                  <button type="button" class="btn-hero-sec" style="font-size:0.72rem; padding:0.3rem 0.55rem; background:#fee2e2; color:#991b1b; border:1px solid #fecaca; cursor:pointer;" onclick="deleteAdminRecord('marks', '${sheet.id}', ${idx})" title="इस शीट को डिलीट करें">
                    🗑️ डिलीट
                  </button>
                </td>
              </tr>
            `;
          }).join('');
        }
      }

      // 3. Render Feedbacks Body
      const fbBody = document.getElementById('adminFeedbacksTableBody');
      if (fbBody) {
        if (feedbacks.length === 0) {
          fbBody.innerHTML = '<tr><td colspan="8" style="padding:1.5rem; text-align:center; color:#64748b;">कोई फीडबैक रिकॉर्ड उपलब्ध नहीं है।</td></tr>';
        } else {
          fbBody.innerHTML = feedbacks.map((item, idx) => {
            const stars = '⭐'.repeat(item.rating || 5);
            return `
              <tr style="border-bottom: 1px solid #f1f5f9; ${idx % 2 === 1 ? 'background:#f8fafc;' : ''}">
                <td style="padding: 10px 14px; font-weight:700; color:#64748b;">${idx + 1}</td>
                <td style="padding: 10px 14px; font-size:0.82rem; color:#475569;">${item.date || '-'}</td>
                <td style="padding: 10px 14px; font-size:0.85rem;">${stars}</td>
                <td style="padding: 10px 14px; font-weight:700; color:#0f172a;">${item.name || '-'}<br><small style="color:#64748b; font-weight:normal;">(${item.role || 'अभिभावक'})</small></td>
                <td style="padding: 10px 14px; font-weight:700; color:#0284c7;">📞 ${item.phone || '-'}</td>
                <td style="padding: 10px 14px; font-size:0.82rem;">${item.class || '-'} / ${item.subject || '-'}</td>
                <td style="padding: 10px 14px; font-size:0.85rem; color:#334155; max-width:280px;">"${item.message || '-'}"</td>
                <td style="padding: 10px 14px; text-align: center; white-space:nowrap;">
                  <a href="tel:${item.phone}" class="btn-hero-sec" style="font-size:0.72rem; padding:0.3rem 0.55rem; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; margin-right:3px;">📞 कॉल</a>
                  <button type="button" class="btn-hero-sec" style="font-size:0.72rem; padding:0.3rem 0.55rem; background:#fee2e2; color:#991b1b; border:1px solid #fecaca; cursor:pointer;" onclick="deleteAdminRecord('feedbacks', '${item.id}', ${idx})" title="इस फीडबैक को डिलीट करें">
                    🗑️ डिलीट
                  </button>
                </td>
              </tr>
            `;
          }).join('');
        }
      }

      // Also render the consolidated class-wise marks view
      renderConsolidatedClassMarksView();
    }

    // Admin Marks View Mode State ('consolidated' or 'raw')
    let currentAdminMarksViewMode = 'consolidated';

    function setAdminMarksViewMode(mode) {
      currentAdminMarksViewMode = mode;
      const btnConsolidated = document.getElementById('btnMarksViewConsolidated');
      const btnRaw = document.getElementById('btnMarksViewRawSheets');
      const containerConsolidated = document.getElementById('adminMarksConsolidatedContainer');
      const containerRaw = document.getElementById('adminMarksRawSheetsContainer');

      if (mode === 'consolidated') {
        if (btnConsolidated) {
          btnConsolidated.style.background = '#0284c7';
          btnConsolidated.style.color = '#ffffff';
          btnConsolidated.style.border = 'none';
        }
        if (btnRaw) {
          btnRaw.style.background = '#ffffff';
          btnRaw.style.color = '#475569';
          btnRaw.style.border = '1px solid #cbd5e1';
        }
        if (containerConsolidated) containerConsolidated.style.display = 'block';
        if (containerRaw) containerRaw.style.display = 'none';
        renderConsolidatedClassMarksView();
      } else {
        if (btnConsolidated) {
          btnConsolidated.style.background = '#ffffff';
          btnConsolidated.style.color = '#475569';
          btnConsolidated.style.border = '1px solid #cbd5e1';
        }
        if (btnRaw) {
          btnRaw.style.background = '#0284c7';
          btnRaw.style.color = '#ffffff';
          btnRaw.style.border = 'none';
        }
        if (containerConsolidated) containerConsolidated.style.display = 'none';
        if (containerRaw) containerRaw.style.display = 'block';
      }
    }

    function renderConsolidatedClassMarksView() {
      const classSelect = document.getElementById('adminConsolidatedClassSelect');
      const sectionSelect = document.getElementById('adminConsolidatedSectionSelect');
      const examSelect = document.getElementById('adminConsolidatedExamSelect');
      const summaryBox = document.getElementById('consolidatedTeachersSummaryBox');
      const thead = document.getElementById('consolidatedMarksTableHead');
      const tbody = document.getElementById('consolidatedMarksTableBody');

      if (!classSelect || !summaryBox || !thead || !tbody) return;

      const selClass = classSelect.value || '9';
      const selSection = sectionSelect ? sectionSelect.value : 'B';
      const selExam = examSelect ? examSelect.value : 'ALL';

      const storedSheets = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');

      // Filter sheets matching selected class, section (if not ALL), and exam (if not ALL)
      const matchingSheets = storedSheets.filter(sheet => {
        const matchCls = (sheet.classCode === selClass || 
                          (sheet.className && sheet.className.toLowerCase().includes(selClass.toLowerCase())) ||
                          (selClass === '9' && sheet.className && sheet.className.includes('9')) ||
                          (selClass === '10' && sheet.className && sheet.className.includes('10')) ||
                          (selClass === '11' && sheet.className && sheet.className.includes('11')) ||
                          (selClass === '12' && sheet.className && sheet.className.includes('12')));
        if (!matchCls) return false;

        if (selSection !== 'ALL') {
          const matchSec = (sheet.sectionCode === selSection || 
                            sheet.section === selSection || 
                            (sheet.section && sheet.section.includes(selSection)) ||
                            (selSection === 'B' && (sheet.sectionCode === '2' || sheet.section === 'B' || (sheet.section && sheet.section.includes('B')))) ||
                            (selSection === 'A' && (sheet.sectionCode === '1' || sheet.section === 'A' || (sheet.section && sheet.section.includes('A')))) ||
                            (selSection === 'C' && (sheet.sectionCode === '3' || sheet.section === 'C' || (sheet.section && sheet.section.includes('C')))));
          if (!matchSec) return false;
        }

        if (selExam !== 'ALL') {
          const matchEx = (sheet.rawExamType === selExam || 
                           sheet.examType === selExam || 
                           (sheet.examType && sheet.examType.startsWith(selExam)));
          if (!matchEx) return false;
        }

        return true;
      });

      // Distinct subjects present (keep most recent for each subject)
      const subjectMap = new Map();
      matchingSheets.forEach(s => {
        const subName = (s.subject || 'अज्ञात').trim();
        if (!subjectMap.has(subName)) {
          subjectMap.set(subName, s);
        }
      });

      const subjects = Array.from(subjectMap.keys());

      // 1. Render "शिक्षक प्रविष्टि सारांश (Who Fed The Data Summary)"
      if (matchingSheets.length === 0) {
        summaryBox.innerHTML = `
          <div style="text-align: center; color: #475569; padding: 1.25rem; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: var(--radius-md);">
            <div style="font-size: 1.3rem; margin-bottom: 4px;">ℹ️</div>
            <strong style="color: #0f172a; font-size: 0.96rem;">चयनित कक्षा (Class ${selClass}${selSection !== 'ALL' ? ' - Section ' + selSection : ''}) हेतु अभी कोई अंक प्रविष्ट नहीं हुए हैं।</strong>
            <div style="font-size: 0.84rem; color: #64748b; margin-top: 4px;">
              जैसे ही कोई शिक्षक शिक्षक मॉड्यूल में इस कक्षा के किसी विषय के अंक दर्ज करेंगे, वे तुरंत यहाँ रोल नंबर 01 से 99 के रूप में स्वतः समेकित होकर दिखाई देंगे।
            </div>
          </div>
        `;
        thead.innerHTML = `
          <tr style="background:#f8fafc; border-bottom:2px solid #cbd5e1; color:#0f172a; font-weight:700;">
            <th style="padding: 10px 14px; text-align: center; width: 50px;">क्र.सं.</th>
            <th style="padding: 10px 14px; width: 140px;">रोल नंबर (Roll No)</th>
            <th style="padding: 10px 14px; text-align: center;">स्थिति</th>
          </tr>
        `;
        tbody.innerHTML = `
          <tr>
            <td colspan="3" style="padding: 2.5rem; text-align: center; color: #64748b;">
              इस कक्षा एवं सेक्शन के लिए अभी कोई प्राप्तांक शीट उपलब्ध नहीं है।
            </td>
          </tr>
        `;
        return;
      }

      // Summary Header with clear attribution badges
      let summaryHtml = `
        <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: var(--radius-md); padding: 1rem 1.25rem; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 0.75rem;">
            <div style="font-weight: 800; color: #166534; font-size: 0.98rem; display: flex; align-items: center; gap: 6px;">
              <span>👥</span> <span>शिक्षक प्रविष्टि सारांश (Who Fed The Data - किस शिक्षक ने कौन से विषय के अंक दर्ज किए):</span>
            </div>
            <span class="page-badge-pill" style="background:#dcfce7; color:#166534; font-weight:800; font-size:0.82rem; border: 1px solid #86efac;">
              कुल दर्ज विषय: ${subjects.length} | कक्षा: Class ${selClass} (${selSection !== 'ALL' ? 'Sec ' + selSection : 'All Sec'})
            </span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 10px;">
      `;

      subjects.forEach(sub => {
        const sheet = subjectMap.get(sub);
        summaryHtml += `
          <div style="background: #ffffff; border: 1.5px solid #bbf7d0; border-radius: var(--radius-sm); padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
              <strong style="color: #0f172a; font-size: 0.98rem;">📘 ${sheet.subject}</strong>
              <span class="page-badge-pill" style="background: #eff6ff; color: #1d4ed8; font-size: 0.75rem; font-weight: 800; border: 1px solid #bfdbfe;">पूर्णांक: ${sheet.maxMarks || 100}</span>
            </div>
            <div style="font-size: 0.86rem; color: #1e293b; margin-bottom: 3px;">
              👨‍🏫 अंक प्रविष्ट कर्ता शिक्षक: <strong style="color: #15803d;">${sheet.teacherName || 'अधिकृत शिक्षक'}</strong>
            </div>
            <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 6px;">
              📞 संपर्क: <span style="font-family: monospace; font-weight: 700; color: #0284c7;">${sheet.teacherPhone || '-'}</span> • दिनांक: ${sheet.date || '-'}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; border-top: 1px dashed #e2e8f0; padding-top: 6px;">
              <span style="color: #475569;">प्रविष्ट: <strong>${sheet.enteredCount || 0}</strong>/99 | P:${sheet.passCount || 0} F:${sheet.failCount || 0} AB:${sheet.absentCount || 0}</span>
              <div>
                <button type="button" class="btn-hero-sec" style="font-size: 0.72rem; padding: 0.25rem 0.5rem; background: #eff6ff; color: #0284c7; border: 1px solid #bae6fd; cursor: pointer; margin-right: 3px;" onclick="openAdminMarksModal('${sheet.id}')">👁️ देखें</button>
                <button type="button" class="btn-hero-sec" style="font-size: 0.72rem; padding: 0.25rem 0.5rem; background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; cursor: pointer;" onclick="deleteAdminRecord('marks', '${sheet.id}')">🗑️ हटाएं</button>
              </div>
            </div>
          </div>
        `;
      });
      summaryHtml += `</div></div>`;
      summaryBox.innerHTML = summaryHtml;

      // 2. Build Consolidated Table Header
      let totalMaxMarks = 0;
      let theadHtml = `
        <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; color: #0f172a; font-weight: 700;">
          <th style="padding: 10px 12px; text-align: center; width: 45px;">क्र.सं.</th>
          <th style="padding: 10px 14px; width: 120px;">छात्र रोल नंबर</th>
      `;

      subjects.forEach(sub => {
        const sheet = subjectMap.get(sub);
        const sMax = sheet.maxMarks || 100;
        totalMaxMarks += sMax;
        theadHtml += `
          <th style="padding: 10px 14px; text-align: center;">
            <div style="font-weight: 800; color: #0f172a;">${sub}</div>
            <small style="color: #64748b; font-weight: 600;">(पूर्णांक: ${sMax} | उत्तीर्णांक: ${sheet.passMarks || 33})</small>
          </th>
        `;
      });

      theadHtml += `
          <th style="padding: 10px 14px; text-align: center; background: #f1f5f9;">
            <div style="font-weight: 800; color: #0f172a;">कुल प्राप्तांक</div>
            <small style="color: #475569; font-weight: 600;">(पूर्णांक: ${totalMaxMarks})</small>
          </th>
          <th style="padding: 10px 14px; text-align: center; background: #f1f5f9;">प्रतिशत (%)</th>
          <th style="padding: 10px 14px; text-align: center;">परिणाम (Result)</th>
        </tr>
      `;
      thead.innerHTML = theadHtml;

      // 3. Build Student Rows 1 to 99
      const classCode = CLASS_CODE_MAP[selClass] || selClass;
      const secCode = (selSection !== 'ALL') ? (SECTION_CODE_MAP[selSection] || '2') : '2';

      // Index marks by roll number and serial
      const subjectIndexMap = new Map();
      subjects.forEach(sub => {
        const sheet = subjectMap.get(sub);
        const map = new Map();
        (sheet.students || []).forEach(st => {
          if (st.rollNo) map.set(String(st.rollNo).trim(), st);
          if (st.serial) map.set(String(st.serial), st);
        });
        subjectIndexMap.set(sub, map);
      });

      let tbodyHtml = '';
      for (let i = 1; i <= 99; i++) {
        const rollStr = String(i).padStart(2, '0');
        const rollNo = `27${classCode}${secCode}${rollStr}`;
        
        let totalObtained = 0;
        let isAnyAbsent = false;
        let isAllAbsent = true;
        let isAnyFail = false;
        let hasAnyData = false;

        let cellsHtml = '';

        subjects.forEach(sub => {
          const sheet = subjectMap.get(sub);
          const map = subjectIndexMap.get(sub);
          const passMarks = sheet.passMarks || 33;

          const stObj = map.get(rollNo) || map.get(String(i));
          if (stObj && stObj.marks !== undefined && stObj.marks !== '') {
            hasAnyData = true;
            const mVal = String(stObj.marks).trim().toUpperCase();
            if (mVal === 'AB' || mVal === 'ABSENT') {
              isAnyAbsent = true;
              cellsHtml += `<td style="padding: 8px 12px; text-align: center;"><span class="page-badge-pill" style="background:#fee2e2; color:#991b1b; font-weight:800; font-size:0.75rem;">AB</span></td>`;
            } else {
              isAllAbsent = false;
              const num = parseFloat(mVal);
              if (!isNaN(num)) {
                totalObtained += num;
                if (num < passMarks) {
                  isAnyFail = true;
                  cellsHtml += `<td style="padding: 8px 12px; text-align: center; font-weight:800; color:#b91c1c; font-size:0.95rem;">${num} <span style="font-size:0.68rem; color:#dc2626;">(Fail)</span></td>`;
                } else {
                  cellsHtml += `<td style="padding: 8px 12px; text-align: center; font-weight:800; color:#15803d; font-size:0.95rem;">${num}</td>`;
                }
              } else {
                cellsHtml += `<td style="padding: 8px 12px; text-align: center; color:#64748b;">${mVal}</td>`;
              }
            }
          } else {
            cellsHtml += `<td style="padding: 8px 12px; text-align: center; color:#94a3b8;">-</td>`;
          }
        });

        let percentage = (totalMaxMarks > 0 && hasAnyData) ? ((totalObtained / totalMaxMarks) * 100).toFixed(1) : '0.0';
        let resultBadge = `<span class="page-badge-pill" style="background:#f1f5f9; color:#94a3b8; font-size:0.75rem;">अपूर्ण</span>`;

        if (hasAnyData) {
          if (isAllAbsent) {
            resultBadge = `<span class="page-badge-pill" style="background:#fee2e2; color:#991b1b; font-weight:800; font-size:0.75rem;">अनुपस्थित (AB)</span>`;
          } else if (isAnyFail) {
            resultBadge = `<span class="page-badge-pill" style="background:#fef2f2; color:#b91c1c; font-weight:800; font-size:0.75rem;">अनुत्तीर्ण (Fail)</span>`;
          } else {
            resultBadge = `<span class="page-badge-pill" style="background:#dcfce7; color:#15803d; font-weight:800; font-size:0.75rem;">उत्तीर्ण (Pass)</span>`;
          }
        }

        tbodyHtml += `
          <tr style="border-bottom: 1px solid #f1f5f9; ${i % 2 === 0 ? 'background:#f8fafc;' : ''}">
            <td style="padding: 8px 12px; text-align: center; font-weight: 700; color: #64748b;">${i}</td>
            <td style="padding: 8px 14px; font-family: monospace; font-weight: 800; color: #0284c7;">${rollNo}</td>
            ${cellsHtml}
            <td style="padding: 8px 14px; text-align: center; font-weight: 800; color: #0f172a; background: ${i % 2 === 0 ? '#f1f5f9' : '#f8fafc'};">
              ${hasAnyData && !isAllAbsent ? totalObtained : (isAllAbsent && hasAnyData ? 'AB' : '-')}
            </td>
            <td style="padding: 8px 14px; text-align: center; font-weight: 700; color: #0369a1; background: ${i % 2 === 0 ? '#f1f5f9' : '#f8fafc'};">
              ${hasAnyData && !isAllAbsent ? percentage + '%' : '-'}
            </td>
            <td style="padding: 8px 14px; text-align: center;">
              ${resultBadge}
            </td>
          </tr>
        `;
      }

      tbody.innerHTML = tbodyHtml;
    }

    // Export Consolidated Class Marks to Excel CSV
    function exportConsolidatedClassMarksExcel() {
      const classSelect = document.getElementById('adminConsolidatedClassSelect');
      const sectionSelect = document.getElementById('adminConsolidatedSectionSelect');
      const examSelect = document.getElementById('adminConsolidatedExamSelect');

      const selClass = classSelect ? classSelect.value : '9';
      const selSection = sectionSelect ? sectionSelect.value : 'B';
      const selExam = examSelect ? examSelect.value : 'ALL';

      const storedSheets = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
      const matchingSheets = storedSheets.filter(sheet => {
        const matchCls = (sheet.classCode === selClass || (sheet.className && sheet.className.includes(selClass)));
        if (!matchCls) return false;
        if (selSection !== 'ALL') {
          const matchSec = (sheet.sectionCode === selSection || sheet.section === selSection || (sheet.section && sheet.section.includes(selSection)));
          if (!matchSec) return false;
        }
        if (selExam !== 'ALL') {
          const matchEx = (sheet.rawExamType === selExam || sheet.examType === selExam || (sheet.examType && sheet.examType.startsWith(selExam)));
          if (!matchEx) return false;
        }
        return true;
      });

      if (matchingSheets.length === 0) {
        alert('इस कक्षा हेतु डाउनलोड करने के लिए कोई अंक रिकॉर्ड उपलब्ध नहीं है!');
        return;
      }

      const subjectMap = new Map();
      matchingSheets.forEach(s => {
        const sub = (s.subject || 'अज्ञात').trim();
        if (!subjectMap.has(sub)) subjectMap.set(sub, s);
      });
      const subjects = Array.from(subjectMap.keys());

      let csvContent = '\uFEFF';
      csvContent += `Maa Durga Higher Secondary School Semariya - Consolidated Class Marksheet\n`;
      csvContent += `Class,Class ${selClass},Section,${selSection},Exam,${selExam},Generated,${new Date().toLocaleString('en-IN')}\n\n`;
      
      // Header
      csvContent += `S_No,Roll_No,` + subjects.map(s => `"${s} (Max ${subjectMap.get(s).maxMarks||100})"`).join(',') + `,Total_Obtained,Total_Max,Percentage,Result_Status\n`;

      let totalMaxMarks = 0;
      subjects.forEach(sub => { totalMaxMarks += (subjectMap.get(sub).maxMarks || 100); });

      const classCode = CLASS_CODE_MAP[selClass] || selClass;
      const secCode = (selSection !== 'ALL') ? (SECTION_CODE_MAP[selSection] || '2') : '2';

      for (let i = 1; i <= 99; i++) {
        const rollStr = String(i).padStart(2, '0');
        const rollNo = `27${classCode}${secCode}${rollStr}`;

        let totalObtained = 0;
        let isAnyFail = false;
        let isAllAbsent = true;
        let hasData = false;
        let markCols = [];

        subjects.forEach(sub => {
          const sheet = subjectMap.get(sub);
          const passMarks = sheet.passMarks || 33;
          let studentMark = '';
          (sheet.students || []).forEach(st => {
            if (st.rollNo === rollNo || Number(st.serial) === i) {
              studentMark = st.marks;
            }
          });

          if (studentMark !== '' && studentMark !== undefined) {
            hasData = true;
            markCols.push(`"${studentMark}"`);
            const num = parseFloat(studentMark);
            if (!isNaN(num)) {
              isAllAbsent = false;
              totalObtained += num;
              if (num < passMarks) isAnyFail = true;
            }
          } else {
            markCols.push(`"-"`);
          }
        });

        let status = 'Incomplete';
        let pct = (totalMaxMarks > 0 && hasData) ? ((totalObtained / totalMaxMarks) * 100).toFixed(1) + '%' : '-';
        if (hasData) {
          if (isAllAbsent) status = 'Absent (AB)';
          else if (isAnyFail) status = 'Fail';
          else status = 'Pass';
        }

        csvContent += `${i},${rollNo},` + markCols.join(',') + `,${hasData && !isAllAbsent ? totalObtained : '-'},${totalMaxMarks},${pct},${status}\n`;
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MDHSS_Class_${selClass}_Sec_${selSection}_Consolidated_Marks.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Print Consolidated Class Marks View
    function printConsolidatedClassMarks() {
      const tbl = document.getElementById('consolidatedClassMarksTable');
      const sumBox = document.getElementById('consolidatedTeachersSummaryBox');
      const selClass = document.getElementById('adminConsolidatedClassSelect')?.value || '9';
      const selSection = document.getElementById('adminConsolidatedSectionSelect')?.value || 'B';
      const selExam = document.getElementById('adminConsolidatedExamSelect')?.value || 'अर्द्धवार्षिक परीक्षा';

      if (!tbl) return;

      const printWin = window.open('', '_blank');
      if (!printWin) {
        window.print();
        return;
      }

      printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>कक्षा ${selClass} - एकीकृत प्राप्तांक सूची | MDHSS सेमरिया</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; color: #0f172a; }
            h2, h3, p { margin: 4px 0; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th, td { border: 1px solid #94a3b8; padding: 6px 8px; text-align: center; }
            th { background: #f1f5f9; font-weight: bold; }
            .header-box { border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 12px; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header-box">
            <h2>माँ दुर्गा हायर सेकेंडरी स्कूल, सेमरिया</h2>
            <p>समीक्षा एवं परीक्षा मूल्यांकन प्रभाग • सत्र 2026-27</p>
            <h3>कक्षा ${selClass} (सेक्शन: ${selSection}) - एकीकृत अंक सूची (Roll No 01-99)</h3>
            <p>परीक्षा प्रकार: <strong>${selExam}</strong> | मुद्रण दिनांक: ${new Date().toLocaleDateString('en-IN')}</p>
          </div>
          ${sumBox ? sumBox.outerHTML : ''}
          ${tbl.outerHTML}
          <script>
            window.onload = function() { window.print(); }
          <\/script>
        </body>
        </html>
      `);
      printWin.document.close();
    }

    // Delete single record handler (Both LocalStorage and Firebase Cloud Sync)
    function deleteAdminRecord(type, id, index) {
      if (!confirm('क्या आप वाकई इस रिकॉर्ड को हमेशा के लिए डिलीट करना चाहते हैं?')) return;

      try {
        let targetId = String(id || '').trim();

        if (type === 'admissions') {
          let stored = JSON.parse(localStorage.getItem('mdhss_admissions') || '[]');
          if (!targetId && typeof index === 'number' && index >= 0 && index < stored.length) {
            targetId = String(stored[index]?.id || '').trim();
          }
          if (targetId) {
            stored = stored.filter(item => String(item.id || '').trim() !== targetId);
          } else if (typeof index === 'number' && index >= 0 && index < stored.length) {
            stored.splice(index, 1);
          }
          localStorage.setItem('mdhss_admissions', JSON.stringify(stored));
        } else if (type === 'marks') {
          let stored = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
          if (!targetId && typeof index === 'number' && index >= 0 && index < stored.length) {
            targetId = String(stored[index]?.id || '').trim();
          }
          if (targetId) {
            stored = stored.filter(item => String(item.id || '').trim() !== targetId);
          } else if (typeof index === 'number' && index >= 0 && index < stored.length) {
            stored.splice(index, 1);
          }
          localStorage.setItem('mdhss_marks_sheets', JSON.stringify(stored));
        } else if (type === 'feedbacks') {
          let stored = JSON.parse(localStorage.getItem('mdhss_feedbacks') || '[]');
          if (!targetId && typeof index === 'number' && index >= 0 && index < stored.length) {
            targetId = String(stored[index]?.id || '').trim();
          }
          if (targetId) {
            stored = stored.filter(item => String(item.id || '').trim() !== targetId);
          } else if (typeof index === 'number' && index >= 0 && index < stored.length) {
            stored.splice(index, 1);
          }
          localStorage.setItem('mdhss_feedbacks', JSON.stringify(stored));
        }

        // Delete from Firebase Cloud as well
        if (window.mdhssCloud && targetId) {
          if (type === 'admissions' && typeof window.mdhssCloud.deleteAdmission === 'function') {
            window.mdhssCloud.deleteAdmission(targetId);
          } else if (type === 'marks' && typeof window.mdhssCloud.deleteMarksSheet === 'function') {
            window.mdhssCloud.deleteMarksSheet(targetId);
          } else if (type === 'feedbacks' && typeof window.mdhssCloud.deleteFeedback === 'function') {
            window.mdhssCloud.deleteFeedback(targetId);
          }
        }
      } catch (err) {
        console.error('Error deleting record:', err);
      }

      renderAdminTables();
    }

    // Clear all records handler for a module (Both LocalStorage and Firebase Cloud)
    function clearAllAdminRecords(type) {
      let typeLabel = (type === 'admissions') ? 'प्रवेश आवेदन (Admissions)' : ((type === 'marks') ? 'परीक्षा अंक (Marks Sheets)' : 'फीडबैक (Feedbacks)');
      if (!confirm(`⚠️ क्या आप वाकई ${typeLabel} का पूरा डेटा (क्लाउड सहित) क्लियर/डिलीट करना चाहते हैं? यह क्रिया वापस नहीं ली जा सकती!`)) return;

      if (type === 'admissions') {
        localStorage.removeItem('mdhss_admissions');
        if (window.mdhssCloud && typeof window.mdhssCloud.clearCollection === 'function') {
          window.mdhssCloud.clearCollection('admissions');
        }
      } else if (type === 'marks') {
        localStorage.removeItem('mdhss_marks_sheets');
        if (window.mdhssCloud && typeof window.mdhssCloud.clearCollection === 'function') {
          window.mdhssCloud.clearCollection('marks_sheets');
        }
      } else if (type === 'feedbacks') {
        localStorage.removeItem('mdhss_feedbacks');
        if (window.mdhssCloud && typeof window.mdhssCloud.clearCollection === 'function') {
          window.mdhssCloud.clearCollection('feedbacks');
        }
      }

      renderAdminTables();
    }

    function filterAdmissionsTable() {
      const q = (document.getElementById('admSearchInput')?.value || '').toLowerCase().trim();
      const rows = document.querySelectorAll('#adminAdmissionsTableBody tr');
      rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        r.style.display = text.includes(q) ? '' : 'none';
      });
    }

    function filterMarksAdminTable() {
      const q = (document.getElementById('marksAdminSearchInput')?.value || '').toLowerCase().trim();
      const rows = document.querySelectorAll('#adminMarksTableBody tr');
      rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        r.style.display = text.includes(q) ? '' : 'none';
      });
    }

    function filterFeedbacksTable() {
      const q = (document.getElementById('fbSearchInput')?.value || '').toLowerCase().trim();
      const rows = document.querySelectorAll('#adminFeedbacksTableBody tr');
      rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        r.style.display = text.includes(q) ? '' : 'none';
      });
    }

    // Export Single Marks Sheet as Excel CSV
    function exportSingleMarksSheetExcel(sheetId) {
      const stored = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
      const sheet = stored.find(s => String(s.id).trim() === String(sheetId).trim());
      if (!sheet) {
        alert('शीट रिकॉर्ड नहीं मिला!');
        return;
      }

      let csvContent = '\uFEFF'; // UTF-8 BOM
      const safeClass = (sheet.className || 'Class').replace(/\s+/g, '_');
      const safeSub = (sheet.subject || 'Subject').replace(/\s+/g, '_');
      const filename = `MDHSS_Marks_${safeClass}_Sec${sheet.section || 'A'}_${safeSub}_${new Date().toISOString().slice(0, 10)}.csv`;

      csvContent += `Sheet Information\n`;
      csvContent += `Class,${sheet.className} (Section ${sheet.section})\n`;
      csvContent += `Subject,${sheet.subject}\n`;
      csvContent += `Exam Type,${sheet.examType}\n`;
      csvContent += `Max Marks,${sheet.maxMarks},Pass Marks,${sheet.passMarks}\n`;
      csvContent += `Uploaded Date,${sheet.date}\n`;
      csvContent += `Teacher Name,${sheet.teacherName},Teacher Mobile,${sheet.teacherPhone}\n\n`;

      csvContent += `S.No,Roll Number,Marks,Max Marks,Status,Subject,Class,Section,Teacher Mobile,Upload Date\n`;
      (sheet.students || []).forEach((st, idx) => {
        csvContent += `"${idx + 1}","${st.rollNo || ''}","${st.marks || ''}","${sheet.maxMarks}","${st.status || ''}","${(sheet.subject || '').replace(/"/g, '""')}","${sheet.className || ''}","Section ${sheet.section || 'A'}","${sheet.teacherPhone || ''}","${sheet.date || ''}"\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Export All Marks Consolidated Excel CSV
    function exportAllMarksConsolidatedExcel() {
      const stored = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
      if (stored.length === 0) {
        alert('डाउनलोड के लिए कोई परीक्षा अंक रिकॉर्ड उपलब्ध नहीं है!');
        return;
      }

      let csvContent = '\uFEFF';
      const filename = `MDHSS_All_Classes_Marks_Consolidated_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent += `Sheet_ID,Upload_Date,Exam_Type,Class,Section,Subject,Roll_No,Marks,Max_Marks,Status,Teacher_Name,Teacher_Phone\n`;

      stored.forEach(sheet => {
        (sheet.students || []).forEach(st => {
          csvContent += `"${sheet.id}","${sheet.date}","${sheet.examType}","${sheet.className}","${sheet.section}","${(sheet.subject||'').replace(/"/g, '""')}","${st.rollNo}","${st.marks}","${sheet.maxMarks}","${st.status}","${(sheet.teacherName||'').replace(/"/g, '""')}","${sheet.teacherPhone}"\n`;
        });
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Active Sheet for Modal Preview
    let activeModalSheet = null;

    function openAdminMarksModal(sheetId) {
      const stored = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
      const sheet = stored.find(s => String(s.id).trim() === String(sheetId).trim());
      if (!sheet) return;

      activeModalSheet = sheet;

      const modal = document.getElementById('adminMarksDetailModal');
      const title = document.getElementById('modalMarksTitle');
      const subtitle = document.getElementById('modalMarksSubtitle');
      const time = document.getElementById('modalMarksTime');
      const teacher = document.getElementById('modalMarksTeacher');
      const teacherPhone = document.getElementById('modalMarksTeacherPhone');
      const maxPass = document.getElementById('modalMarksMaxPass');
      const enteredCount = document.getElementById('modalMarksEnteredCount');
      const resSummary = document.getElementById('modalMarksResultSummary');
      const tbody = document.getElementById('modalMarksTableBody');

      if (title) title.textContent = `परीक्षा प्राप्तांक: ${sheet.className} (Section ${sheet.section || 'A'}) - ${sheet.subject}`;
      if (subtitle) subtitle.textContent = `${sheet.examType} • संस्थान: माँ दुर्गा उ.मा.वि. सेमरिया`;
      if (time) time.textContent = sheet.date || '-';
      if (teacher) teacher.textContent = sheet.teacherName || 'शिक्षक';
      if (teacherPhone) teacherPhone.textContent = sheet.teacherPhone || '-';
      if (maxPass) maxPass.textContent = `पूर्णांक: ${sheet.maxMarks} | उत्तीर्णांक: ${sheet.passMarks}`;
      if (enteredCount) enteredCount.textContent = `${sheet.enteredCount || 0} छात्र प्रविष्ट (कुल 99 में से)`;
      if (resSummary) resSummary.textContent = `उत्तीर्ण: ${sheet.passCount || 0} | अनुत्तीर्ण: ${sheet.failCount || 0} | अनुपस्थित: ${sheet.absentCount || 0}`;

      if (tbody) {
        tbody.innerHTML = (sheet.students || []).map((st, i) => {
          let badge = `<span class="page-badge-pill" style="background:#dcfce7; color:#15803d; font-weight:700;">उत्तीर्ण (Pass)</span>`;
          if (st.status === 'Absent' || st.marks === 'AB') {
            badge = `<span class="page-badge-pill" style="background:#fee2e2; color:#991b1b; font-weight:700;">अनुपस्थित (AB)</span>`;
          } else if (st.status === 'Fail') {
            badge = `<span class="page-badge-pill" style="background:#fef2f2; color:#b91c1c; font-weight:700;">अनुत्तीर्ण (Fail)</span>`;
          }

          return `
            <tr style="border-bottom: 1px solid #f1f5f9; ${i % 2 === 1 ? 'background:#f8fafc;' : ''}">
              <td style="padding: 8px 12px; font-weight:700; color:#64748b; text-align:center;">${i + 1}</td>
              <td style="padding: 8px 12px; font-family:monospace; font-weight:800; color:#0284c7;">${st.rollNo}</td>
              <td style="padding: 8px 12px; font-weight:800; color:#0f172a; text-align:center; font-size:1rem;">${st.marks}</td>
              <td style="padding: 8px 12px; text-align:center;">${badge}</td>
            </tr>
          `;
        }).join('');
      }

      if (modal) modal.style.display = 'block';
    }

    function closeAdminMarksModal() {
      const modal = document.getElementById('adminMarksDetailModal');
      if (modal) modal.style.display = 'none';
      activeModalSheet = null;
    }

    function downloadModalMarksCsv() {
      if (activeModalSheet) {
        exportSingleMarksSheetExcel(activeModalSheet.id);
      }
    }

    function exportCurrentMarksSheetToExcel() {
      const stored = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
      if (stored.length > 0) {
        exportSingleMarksSheetExcel(stored[0].id);
      } else {
        alert('डाउनलोड के लिए कोई सुरक्षित रिकॉर्ड नहीं मिला!');
      }
    }

    function openAdminMarksPortal() {
      navigateToPage('admin');
    }

    // Expose functions globally on window object
    window.switchUnifiedLoginTab = switchUnifiedLoginTab;
    window.handleAdminLogin = handleAdminLogin;
    window.handleAdminLogout = handleAdminLogout;
    window.deleteAdminRecord = deleteAdminRecord;
    window.clearAllAdminRecords = clearAllAdminRecords;
    window.openAdminMarksModal = openAdminMarksModal;
    window.closeAdminMarksModal = closeAdminMarksModal;
    window.downloadModalMarksCsv = downloadModalMarksCsv;
    window.exportSingleMarksSheetExcel = exportSingleMarksSheetExcel;
    window.exportCurrentMarksSheetToExcel = exportCurrentMarksSheetToExcel;
    window.openAdminMarksPortal = openAdminMarksPortal;
    window.copyAbsentMsgTemplate = copyAbsentMsgTemplate;
    window.switchTeacherSectionTab = switchTeacherSectionTab;
    window.exportAllMarksConsolidatedExcel = exportAllMarksConsolidatedExcel;
    window.exportAdminDataToExcel = exportAdminDataToExcel;
    window.onMarksClassChange = onMarksClassChange;
    window.onMarksSectionChange = onMarksSectionChange;
    window.onMarksExamTypeChange = onMarksExamTypeChange;
    window.onMarksMonthChange = onMarksMonthChange;
    window.onMarksSubjectInputChanged = onMarksSubjectInputChanged;
    window.checkAndAutoFetchExistingMarks = checkAndAutoFetchExistingMarks;
    window.updateMarksSeriesInfo = updateMarksSeriesInfo;
    window.submitFullMarksSheet = submitFullMarksSheet;
    window.setRowAsAbsent = setRowAsAbsent;
    window.fillEmptyRowsAsAbsent = fillEmptyRowsAsAbsent;
    window.resetAllMarksGridInputs = resetAllMarksGridInputs;
    window.jumpToStudentRow = jumpToStudentRow;
    window.recalculateAllMarksRowStats = recalculateAllMarksRowStats;
    window.saveAdminWebhookUrl = saveAdminWebhookUrl;
    window.syncAllLocalDataToGoogleSheets = syncAllLocalDataToGoogleSheets;
    window.copyAppsScriptCode = copyAppsScriptCode;
    window.navigateToPage = navigateToPage;
    window.handleNativeAdmissionSubmit = handleNativeAdmissionSubmit;
    window.handleFeedbackSubmit = handleFeedbackSubmit;
    window.setRating = setRating;
    window.handleTeacherLoginSubmit = handleTeacherLoginSubmit;
    window.handleTeacherLogout = handleTeacherLogout;
    window.handleSaveAttendance = handleSaveAttendance;
    window.filterAdmissionsTable = filterAdmissionsTable;
    window.filterMarksAdminTable = filterMarksAdminTable;
    window.filterFeedbacksTable = filterFeedbacksTable;
    window.searchStudentResult = searchStudentResult;
    window.toggleDropdown = toggleDropdown;

    function exportAdminDataToExcel(type) {
      let csvContent = '\uFEFF'; // UTF-8 BOM so Hindi renders cleanly in Excel
      let filename = '';

      if (type === 'admissions') {
        const admissions = JSON.parse(localStorage.getItem('mdhss_admissions') || '[]');
        if (admissions.length === 0) {
          alert('डाउनलोड के लिए कोई प्रवेश डेटा उपलब्ध नहीं है!');
          return;
        }
        filename = 'MDHSS_Admissions_Data_' + new Date().toISOString().slice(0, 10) + '.csv';
        csvContent += 'S.No,ID,Date,Student Name,Father Name,Mother Name,Phone,Class,Subject,Address,Remarks\n';
        admissions.forEach((item, i) => {
          csvContent += `"${i+1}","${item.id || ''}","${item.date || ''}","${(item.studentName||'').replace(/"/g, '""')}","${(item.fatherName||'').replace(/"/g, '""')}","${(item.motherName||'').replace(/"/g, '""')}","${item.phone || ''}","${item.class || ''}","${item.subject || ''}","${(item.address||'').replace(/"/g, '""')}","${(item.remarks||'').replace(/"/g, '""')}"\n`;
        });
      } else {
        const feedbacks = JSON.parse(localStorage.getItem('mdhss_feedbacks') || '[]');
        if (feedbacks.length === 0) {
          alert('डाउनलोड के लिए कोई फीडबैक डेटा उपलब्ध नहीं है!');
          return;
        }
        filename = 'MDHSS_Feedbacks_Data_' + new Date().toISOString().slice(0, 10) + '.csv';
        csvContent += 'S.No,ID,Date,Name,Phone,Role,Class,Rating,Subject,Message\n';
        feedbacks.forEach((item, i) => {
          csvContent += `"${i+1}","${item.id || ''}","${item.date || ''}","${(item.name||'').replace(/"/g, '""')}","${item.phone || ''}","${item.role || ''}","${item.class || ''}","${item.rating || 5} Stars","${(item.subject||'').replace(/"/g, '""')}","${(item.message||'').replace(/"/g, '""')}"\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function saveAdminWebhookUrl() {
      const input = document.getElementById('adminWebhookUrlInput');
      if (!input) return;
      const url = input.value.trim();
      localStorage.setItem('mdhss_google_sheets_webhook', url);
      const notice = document.getElementById('webhookSaveNotice');
      if (notice) {
        notice.style.display = 'block';
        setTimeout(() => { notice.style.display = 'none'; }, 4000);
      }
    }

    function copyAppsScriptCode() {
      const codeBlock = document.getElementById('appsScriptCodeBlock');
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.value).then(() => {
          const notice = document.getElementById('copyScriptNotice');
          if (notice) {
            notice.style.display = 'block';
            setTimeout(() => { notice.style.display = 'none'; }, 4000);
          }
        }).catch(() => {
          codeBlock.select();
          document.execCommand('copy');
        });
      }
    }

    // 7. Student Result & Roll Number Search with Analytics Sync & Complete Marksheet
    function searchStudentResult() {
      const rollInput = document.getElementById('studentRollInput') || document.getElementById('natRollInput');
      const resultBox = document.getElementById('studentResultDisplay') || document.getElementById('natResultDisplay');
      if (!rollInput) return;

      const rollVal = rollInput.value.trim();
      if (!rollVal) {
        alert('कृपया वैध रोल नंबर दर्ज करें!');
        return;
      }

      // Check stored sheets for accurate info
      const sheets = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
      
      // Subjects list for complete 6-paper marksheet
      const subjects = [
        { code: '001', name: 'हिन्दी (Hindi - Special)', maxTh: 75, maxPr: 25, min: 33, defaultMarks: 85 },
        { code: '002', name: 'अंग्रेजी (English - General)', maxTh: 75, maxPr: 25, min: 33, defaultMarks: 82 },
        { code: '003', name: 'संस्कृत (Sanskrit)', maxTh: 75, maxPr: 25, min: 33, defaultMarks: 90 },
        { code: '004', name: 'गणित (Mathematics)', maxTh: 75, maxPr: 25, min: 33, defaultMarks: 88 },
        { code: '005', name: 'विज्ञान (Science & Technology)', maxTh: 75, maxPr: 25, min: 33, defaultMarks: 86 },
        { code: '006', name: 'सामाजिक विज्ञान (Social Science)', maxTh: 75, maxPr: 25, min: 33, defaultMarks: 87 }
      ];

      // Overwrite subject marks if teacher uploaded specific marks for this roll
      sheets.forEach(s => {
        if (s.students) {
          const match = s.students.find(st => String(st.rollNo).trim() === rollVal || String(st.roll).trim() === rollVal);
          if (match) {
            const subMatch = subjects.find(sub => s.subject && s.subject.includes(sub.name.split(' ')[0]));
            if (subMatch) {
              if (match.marks === 'AB' || match.status === 'Absent') {
                subMatch.isAbsent = true;
                subMatch.total = 0;
              } else {
                const score = parseFloat(match.marks) || 0;
                subMatch.defaultMarks = score;
              }
            }
          }
        }
      });

      let totalMax = 600;
      let totalObtained = 0;
      let hasAbsent = false;
      let hasFail = false;

      let tableRowsHtml = '';
      subjects.forEach((sub, idx) => {
        let th = Math.round(sub.defaultMarks * 0.75);
        let pr = sub.defaultMarks - th;
        let tot = sub.defaultMarks;
        let grade = 'A';
        let statusText = 'उत्तीर्ण';

        if (sub.isAbsent) {
          th = 'AB';
          pr = 'AB';
          tot = 'AB';
          grade = 'AB';
          statusText = 'अनुपस्थित';
          hasAbsent = true;
        } else {
          totalObtained += tot;
          if (tot >= 90) grade = 'A+';
          else if (tot >= 80) grade = 'A';
          else if (tot >= 70) grade = 'B+';
          else if (tot >= 60) grade = 'B';
          else if (tot >= 45) grade = 'C';
          else if (tot >= 33) grade = 'D';
          else { grade = 'F'; hasFail = true; statusText = 'अनुत्तीर्ण'; }
        }

        tableRowsHtml += `
          <tr>
            <td style="padding:8px 10px; border:1px solid #cbd5e1; text-align:center;">${idx + 1}</td>
            <td style="padding:8px 10px; border:1px solid #cbd5e1; text-align:left; font-weight:700; color:#0f172a;">${sub.name}</td>
            <td style="padding:8px 10px; border:1px solid #cbd5e1; text-align:center;">${sub.maxTh + sub.maxPr}</td>
            <td style="padding:8px 10px; border:1px solid #cbd5e1; text-align:center;">${sub.min}</td>
            <td style="padding:8px 10px; border:1px solid #cbd5e1; text-align:center; font-weight:600;">${th}</td>
            <td style="padding:8px 10px; border:1px solid #cbd5e1; text-align:center; font-weight:600;">${pr}</td>
            <td style="padding:8px 10px; border:1px solid #cbd5e1; text-align:center; font-weight:800; color:#0284c7;">${tot}</td>
            <td style="padding:8px 10px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${grade === 'F' || grade === 'AB' ? '#dc2626' : '#16a34a'};">${grade}</td>
          </tr>
        `;
      });

      const percentage = (totalObtained / totalMax * 100).toFixed(1);
      let divisionText = 'प्रथम श्रेणी (FIRST DIVISION)';
      if (hasAbsent) divisionText = 'अनुपस्थित (ABSENT RECORD)';
      else if (hasFail) divisionText = 'पूरक / अनुत्तीर्ण (SUPPLEMENTARY / FAIL)';
      else if (percentage >= 75) divisionText = 'प्रथम श्रेणी में विशेष योग्यता (DISTINCTION - 1ST DIV)';
      else if (percentage >= 60) divisionText = 'प्रथम श्रेणी (FIRST DIVISION)';
      else if (percentage >= 45) divisionText = 'द्वितीय श्रेणी (SECOND DIVISION)';
      else divisionText = 'तृतीय श्रेणी (THIRD DIVISION)';

      const marksheetHtml = `
        <div class="nat-marksheet-cert">
          <!-- Marksheet Header -->
          <div class="nat-cert-header">
            <div style="display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:6px;">
              <img src="http://www.online.edumentsolution.com/ImageHandler.ashx?pTbl=ApplicationConfig&pImgFiled=iLogo1&pTblFiled=nCampusID&pVal=2&pDBName=My2070" onerror="this.onerror=null; this.src='https://placehold.co/150x150/0284c7/ffffff?text=MDHSS';" style="width:52px; height:52px; border-radius:50%; border:2px solid #0284c7;" alt="MDHSS Logo">
              <div>
                <h2 style="font-size:1.35rem; color:#0369a1; font-weight:800; margin:0;">माँ दुर्गा उच्चतर माध्यमिक विद्यालय, सेमरिया</h2>
                <p style="font-size:0.85rem; color:#475569; margin:2px 0 0 0;">जिला - रीवा (मध्य प्रदेश) • संस्था कोड: 322517 • UDISE: 23140402055</p>
              </div>
            </div>
            <div style="background:#e0f2fe; display:inline-block; padding:4px 16px; border-radius:9999px; font-weight:800; font-size:0.88rem; color:#0369a1; margin-top:6px;">
              सत्र 2026-27 • परीक्षा अंक सूची (STATEMENT OF MARKS)
            </div>
          </div>

          <!-- Roll Number Only Info Grid (Strictly No Names) -->
          <div class="nat-info-grid">
            <div>अनुक्रमांक (Roll No): <strong style="color:#0284c7; font-size:1.05rem;">${rollVal}</strong></div>
            <div>कक्षा (Class): <strong>Class 9th (Section B)</strong></div>
            <div>परीक्षा सत्र: <strong>2026-27</strong></div>
            <div>नामांकन क्रमांक: <strong>MDHSS/2026/${rollVal.slice(-4)}</strong></div>
          </div>

          <!-- Subject Table -->
          <div style="overflow-x:auto; margin-bottom:1rem;">
            <table class="nat-marksheet-table">
              <thead>
                <tr>
                  <th style="width:45px;">क्र.</th>
                  <th>विषय एवं प्रश्नपत्र (Subject & Paper)</th>
                  <th style="width:85px;">पूर्णांक</th>
                  <th style="width:85px;">उत्तीर्णांक</th>
                  <th style="width:90px;">सैद्धांतिक</th>
                  <th style="width:90px;">प्रायोगिक</th>
                  <th style="width:105px;">कुल प्राप्तांक</th>
                  <th style="width:75px;">ग्रेड</th>
                </tr>
              </thead>
              <tbody>
                ${tableRowsHtml}
              </tbody>
              <tfoot>
                <tr class="total-row" style="background:#eff6ff; font-weight:800;">
                  <td colspan="2" class="text-left" style="padding:10px; color:#0369a1; font-size:0.95rem;">महायोग (GRAND TOTAL)</td>
                  <td>${totalMax}</td>
                  <td>198</td>
                  <td>-</td>
                  <td>-</td>
                  <td style="font-size:1.15rem; color:#0284c7;">${totalObtained}</td>
                  <td style="color:#16a34a; font-size:1.05rem;">${percentage >= 75 ? 'A+' : 'A'}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Result Summary Box -->
          <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:10px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:1.25rem;">
            <div>
              <div style="font-size:1.1rem; font-weight:800; color:#15803d;">🎖️ परिणाम: ${divisionText}</div>
              <div style="font-size:0.82rem; color:#475569;">डिजिटल रूप से प्रमाणित परीक्षा अभिलेख • MDHSS परीक्षा शाखा</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:1.05rem; font-weight:800; color:#166534;">कुल प्राप्तांक: ${totalObtained} / ${totalMax} (${percentage}%)</div>
              <div style="font-size:0.82rem; color:#166534; font-weight:700;">स्थिति: परीक्षा परिणाम सत्यापित</div>
            </div>
          </div>

          <!-- Signatures & Actions -->
          <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px dashed #94a3b8; padding-top:1rem; flex-wrap:wrap; gap:12px;">
            <div style="font-size:0.8rem; color:#64748b;">
              जारी तिथि: ${new Date().toLocaleDateString('en-IN')}<br>
              <span style="font-size:0.75rem; color:#94a3b8;">* यह एक कंप्यूटर जनित अधिकृत डिजिटल अंकपत्र है।</span>
            </div>
            <div style="display:flex; gap:10px;">
              <button type="button" class="btn-hero-sec" style="font-size:0.85rem; padding:0.45rem 1rem;" onclick="window.print()">🖨️ अंकपत्र प्रिंट करें</button>
              <a href="packets/student-result.html" class="btn-hero-pri" style="font-size:0.85rem; padding:0.45rem 1rem;">📦 स्टैंडअलोन पैकेट खोलें ↗</a>
            </div>
          </div>
        </div>
      `;

      if (resultBox) {
        resultBox.innerHTML = marksheetHtml;
        resultBox.style.display = 'block';
      }

      // Dispatch event to update Recharts React component
      window.dispatchEvent(new CustomEvent('mdhss_view_student_analytics', {
        detail: { rollNo: rollVal }
      }));

      const analyticsContainer = document.getElementById('student-analytics-container');
      if (analyticsContainer) {
        analyticsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // ==========================================================================
    // 8. SIDE CORNER DRAWER TOGGLE LOGIC
    // ==========================================================================
    function toggleCornerDrawer() {
      const drawer = document.getElementById('sideCornerDrawer');
      const backdrop = document.getElementById('drawerBackdrop');
      if (drawer && backdrop) {
        drawer.classList.toggle('open');
        backdrop.classList.toggle('open');
      }
    }

    function closeCornerDrawer() {
      const drawer = document.getElementById('sideCornerDrawer');
      const backdrop = document.getElementById('drawerBackdrop');
      if (drawer && backdrop) {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
      }
    }

    // ==========================================================================
    // 9. NOTIFICATION POPUP LOGIC (UPDATE-ONLY & ADMIN CONTROLLED)
    // ==========================================================================
    function isRealUpdatedNotice(noticeData) {
      if (!noticeData) return false;
      if (noticeData.enabled === 'false') return false;
      if (!noticeData.title || !noticeData.title.trim()) return false;
      // Valid if explicitly updated by administrator
      if (noticeData.isUpdated === true) return true;
      if (noticeData.updatedAt) return true;
      // Do not display the old hardcoded dummy placeholder
      if (noticeData.title.trim() === 'माँ दुर्गा उच्चतर माध्यमिक विद्यालय सेमरिया में प्रवेश प्रारंभ!' && !noticeData.isUpdated) {
        return false;
      }
      return true;
    }

    async function checkAndShowFirstTimeNotice() {
      // Check if dismissed in this session
      const dismissed = sessionStorage.getItem('mdhss_notice_popup_dismissed');
      if (dismissed === 'true') {
        return;
      }

      let noticeData = null;
      try {
        const saved = localStorage.getItem('mdhss_popup_notification');
        if (saved) {
          noticeData = JSON.parse(saved);
        }
      } catch (e) {}

      // If not in localStorage, fetch from Cloud sync if available
      if (!noticeData && window.mdhssCloud && typeof window.mdhssCloud.fetchSetting === 'function') {
        try {
          const cloudData = await window.mdhssCloud.fetchSetting('popup_notification');
          if (cloudData) {
            noticeData = cloudData;
            localStorage.setItem('mdhss_popup_notification', JSON.stringify(cloudData));
          }
        } catch (e) {}
      }

      // If no real update exists, do not open popup (keep blank)
      if (!isRealUpdatedNotice(noticeData)) {
        return;
      }

      applyNoticeDataToPopup(noticeData);

      const modalEl = document.getElementById('firstTimeNoticeModal');
      if (modalEl) {
        modalEl.style.display = 'flex';
      }
    }

    function applyNoticeDataToPopup(noticeData) {
      if (!noticeData) return;
      const badgeEl = document.getElementById('firstNoticeBadge');
      const titleEl = document.getElementById('firstNoticeTitle');
      const bodyEl = document.getElementById('firstNoticeBodyText');
      const highlightsEl = document.getElementById('firstNoticeHighlights');
      const helplineEl = document.getElementById('firstNoticeHelpline');
      const btnEl = document.getElementById('firstNoticeActionBtn');

      if (badgeEl) {
        badgeEl.textContent = (noticeData.badge && noticeData.badge.trim()) ? noticeData.badge.trim() : '🔔 आवश्यक सूचना';
      }

      if (titleEl) {
        titleEl.textContent = (noticeData.title && noticeData.title.trim()) ? noticeData.title.trim() : '';
      }
      
      if (bodyEl) {
        if (noticeData.body && noticeData.body.trim()) {
          bodyEl.textContent = noticeData.body.trim();
          bodyEl.style.display = 'block';
        } else {
          bodyEl.textContent = '';
          bodyEl.style.display = 'none';
        }
      }
      
      if (highlightsEl) {
        if (noticeData.highlights && noticeData.highlights.trim()) {
          highlightsEl.textContent = noticeData.highlights.trim();
          highlightsEl.style.display = 'block';
        } else {
          highlightsEl.textContent = '';
          highlightsEl.style.display = 'none';
        }
      }

      if (helplineEl) {
        if (noticeData.helpline && noticeData.helpline.trim()) {
          helplineEl.textContent = noticeData.helpline.trim();
          helplineEl.style.display = 'flex';
        } else {
          helplineEl.textContent = '';
          helplineEl.style.display = 'none';
        }
      }

      if (btnEl) {
        if (noticeData.btnText && noticeData.btnText.trim()) {
          btnEl.textContent = noticeData.btnText.trim();
          btnEl.style.display = 'inline-flex';
        } else {
          btnEl.textContent = '';
          btnEl.style.display = 'none';
        }
      }
    }

    function closeFirstTimeNotice() {
      const modalEl = document.getElementById('firstTimeNoticeModal');
      if (modalEl) {
        modalEl.style.display = 'none';
      }
      // Record dismissal in sessionStorage so it doesn't pop up again in this session
      sessionStorage.setItem('mdhss_notice_popup_dismissed', 'true');
    }

    function openFirstTimeNoticeManually() {
      let noticeData = null;
      try {
        const saved = localStorage.getItem('mdhss_popup_notification');
        if (saved) {
          noticeData = JSON.parse(saved);
        }
      } catch (e) {}

      if (!isRealUpdatedNotice(noticeData)) {
        noticeData = {
          badge: '🔔 आवश्यक सूचना • सत्र 2026-27',
          enabled: 'true',
          title: 'माँ दुर्गा उच्चतर माध्यमिक विद्यालय, सेमरिया',
          body: 'नवीन शैक्षणिक सत्र 2026-27 हेतु नर्सरी से 12वीं (गणित, विज्ञान, वाणिज्य संकाय) में प्रवेश प्रारंभ हो चुके हैं। नियमित विद्यालय समय: प्रातः 09:30 AM से सायं 04:00 PM तक।',
          highlights: '✅ 100% CCTV सुरक्षित कैंपस • स्मार्ट क्लासरूम • आधुनिक कंप्यूटर व साइंस लैब • सेमरिया एवं ग्रामीण अंचलों हेतु सुरक्षित बस सुविधा',
          helpline: '📞 प्रवेश एवं सहायता: 9200178385, 7024036526 | 🏫 UDISE: 23140402055',
          btnText: '✍️ ऑनलाइन प्रवेश फॉर्म 2026-27 भरें',
          btnAction: 'admission',
          customUrl: ''
        };
      }

      applyNoticeDataToPopup(noticeData);

      const modalEl = document.getElementById('firstTimeNoticeModal');
      if (modalEl) {
        modalEl.style.display = 'flex';
      }
    }

    function onFirstNoticeActionClick() {
      closeFirstTimeNotice();
      let noticeData = { btnAction: 'admission', customUrl: '' };
      try {
        const saved = localStorage.getItem('mdhss_popup_notification');
        if (saved) noticeData = { ...noticeData, ...JSON.parse(saved) };
      } catch (e) {}

      if (noticeData.btnAction === 'custom' && noticeData.customUrl) {
        window.open(noticeData.customUrl, '_blank');
      } else if (noticeData.btnAction) {
        navigateToPage(noticeData.btnAction);
      } else {
        navigateToPage('admission');
      }
    }

    function loadAdminNoticeSettings() {
      let noticeData = null;
      try {
        const saved = localStorage.getItem('mdhss_popup_notification');
        if (saved) {
          noticeData = JSON.parse(saved);
        }
      } catch (e) {}

      const isUpdated = isRealUpdatedNotice(noticeData);
      const data = isUpdated ? noticeData : {
        badge: '',
        enabled: 'true',
        title: '',
        body: '',
        highlights: '',
        helpline: '',
        btnText: '',
        btnAction: 'admission',
        customUrl: ''
      };

      if (document.getElementById('cfgNoticeBadge')) document.getElementById('cfgNoticeBadge').value = data.badge || '';
      if (document.getElementById('cfgNoticeEnabled')) document.getElementById('cfgNoticeEnabled').value = data.enabled || 'true';
      if (document.getElementById('cfgNoticeTitle')) document.getElementById('cfgNoticeTitle').value = data.title || '';
      if (document.getElementById('cfgNoticeBody')) document.getElementById('cfgNoticeBody').value = data.body || '';
      if (document.getElementById('cfgNoticeHighlights')) document.getElementById('cfgNoticeHighlights').value = data.highlights || '';
      if (document.getElementById('cfgNoticeHelpline')) document.getElementById('cfgNoticeHelpline').value = data.helpline || '';
      if (document.getElementById('cfgNoticeBtnText')) document.getElementById('cfgNoticeBtnText').value = data.btnText || '';
      if (document.getElementById('cfgNoticeBtnAction')) document.getElementById('cfgNoticeBtnAction').value = data.btnAction || 'admission';
      if (document.getElementById('cfgNoticeCustomUrl')) document.getElementById('cfgNoticeCustomUrl').value = data.customUrl || '';

      toggleNoticeCustomUrlInput();
    }

    function toggleNoticeCustomUrlInput() {
      const action = document.getElementById('cfgNoticeBtnAction')?.value;
      const group = document.getElementById('cfgNoticeCustomUrlGroup');
      if (group) {
        group.style.display = (action === 'custom') ? 'block' : 'none';
      }
    }

    function saveAdminNoticeSettings(event) {
      if (event && event.preventDefault) event.preventDefault();

      const titleVal = document.getElementById('cfgNoticeTitle')?.value.trim() || '';
      if (!titleVal) {
        alert('कृपया मुख्य शीर्षक (Notice Title) अवश्य दर्ज करें।');
        return;
      }

      const noticeData = {
        badge: document.getElementById('cfgNoticeBadge')?.value.trim() || '🔔 आवश्यक सूचना',
        enabled: document.getElementById('cfgNoticeEnabled')?.value || 'true',
        title: titleVal,
        body: document.getElementById('cfgNoticeBody')?.value.trim() || '',
        highlights: document.getElementById('cfgNoticeHighlights')?.value.trim() || '',
        helpline: document.getElementById('cfgNoticeHelpline')?.value.trim() || '',
        btnText: document.getElementById('cfgNoticeBtnText')?.value.trim() || '',
        btnAction: document.getElementById('cfgNoticeBtnAction')?.value || 'admission',
        customUrl: document.getElementById('cfgNoticeCustomUrl')?.value.trim() || '',
        isUpdated: true,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('mdhss_popup_notification', JSON.stringify(noticeData));
      // Reset session dismissal so latest update is visible
      sessionStorage.removeItem('mdhss_notice_popup_dismissed');

      // Save to Firebase Cloud so notice updates across all visitor devices
      if (window.mdhssCloud && typeof window.mdhssCloud.saveSetting === 'function') {
        window.mdhssCloud.saveSetting('popup_notification', noticeData);
      }

      // Update popup elements in DOM
      applyNoticeDataToPopup(noticeData);

      const badge = document.getElementById('noticeSaveSuccessBadge');
      if (badge) {
        badge.style.display = 'inline-block';
        setTimeout(() => { badge.style.display = 'none'; }, 4000);
      }
    }

    function testLiveNoticeModal() {
      const titleVal = document.getElementById('cfgNoticeTitle')?.value.trim() || 'माँ दुर्गा उच्चतर माध्यमिक विद्यालय सेमरिया';
      const noticeData = {
        badge: document.getElementById('cfgNoticeBadge')?.value.trim() || '🔔 आवश्यक सूचना',
        enabled: 'true',
        title: titleVal,
        body: document.getElementById('cfgNoticeBody')?.value.trim() || '',
        highlights: document.getElementById('cfgNoticeHighlights')?.value.trim() || '',
        helpline: document.getElementById('cfgNoticeHelpline')?.value.trim() || '',
        btnText: document.getElementById('cfgNoticeBtnText')?.value.trim() || '',
        btnAction: document.getElementById('cfgNoticeBtnAction')?.value || 'admission',
        customUrl: document.getElementById('cfgNoticeCustomUrl')?.value.trim() || '',
        isUpdated: true,
        updatedAt: new Date().toISOString()
      };

      applyNoticeDataToPopup(noticeData);
      const modalEl = document.getElementById('firstTimeNoticeModal');
      if (modalEl) modalEl.style.display = 'flex';
    }

    function resetDefaultNoticeSettings() {
      if (!confirm('क्या आप सूचना पॉपअप सेटिंग्स को हटाना/रीसेट करना चाहते हैं?')) return;
      localStorage.removeItem('mdhss_popup_notification');
      if (window.mdhssCloud && typeof window.mdhssCloud.saveSetting === 'function') {
        window.mdhssCloud.saveSetting('popup_notification', null);
      }
      loadAdminNoticeSettings();
      const modalEl = document.getElementById('firstTimeNoticeModal');
      if (modalEl) modalEl.style.display = 'none';
      alert('सूचना पॉपअप सेटिंग्स रीसेट कर दी गई हैं!');
    }

    // Keyboard accessibility: Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('firstTimeNoticeModal');
        if (modal && modal.style.display !== 'none') {
          closeFirstTimeNotice();
        }
      }
    });

    // ==========================================================================
    // 9B. SCROLLING TICKER MARQUEE (PRAVESH SOOCHNA ADMIN CONTROLLER & RUNTIME)
    // ==========================================================================
    const DEFAULT_TICKER_DATA = {
      enabled: 'true',
      tag: '🔔 प्रवेश सूचना',
      text: 'प्रवेश प्रारंभ! शैक्षणिक सत्र 2026-27 के लिए प्रवेश खुले हैं | स्कूल समय: प्रातः 09:30 से सायं 04:00 बजे (9:30 AM - 4:00 PM) | Nursery to Class 12th (गणित, विज्ञान, वाणिज्य संकाय) | म.प्र. बोर्ड ई-बुक्स एवं कक्षावार व्हाट्सएप ग्रुप लिंक उपलब्ध | 100% CCTV सुरक्षित कैंपस, स्मार्ट क्लास, कंप्यूटर एवं विज्ञान लैब | संपर्क: 9200178385, 9201431631, 7024036526 ★ प्रवेश प्रारंभ! सत्र 2026-27 | स्कूल समय: 9:30 AM - 4:00 PM | विद्या ददाति विनयं |',
      speed: 'normal',
      theme: 'red',
      clickAction: 'admission',
      updatedAt: ''
    };

    const TICKER_THEMES = {
      red: {
        bar: 'linear-gradient(90deg, #991b1b, #dc2626, #991b1b)',
        tag: '#7f1d1d'
      },
      blue: {
        bar: 'linear-gradient(90deg, #1e3a8a, #0284c7, #1e3a8a)',
        tag: '#0369a1'
      },
      green: {
        bar: 'linear-gradient(90deg, #065f46, #059669, #065f46)',
        tag: '#047857'
      },
      orange: {
        bar: 'linear-gradient(90deg, #9a3412, #ea580c, #9a3412)',
        tag: '#c2410c'
      },
      dark: {
        bar: 'linear-gradient(90deg, #0f172a, #334155, #0f172a)',
        tag: '#020617'
      }
    };

    async function initTickerMarquee() {
      let tickerData = null;
      try {
        const saved = localStorage.getItem('mdhss_ticker_marquee');
        if (saved) {
          tickerData = JSON.parse(saved);
        }
      } catch (e) {}

      if (!tickerData && window.mdhssCloud && typeof window.mdhssCloud.fetchSetting === 'function') {
        try {
          const cloudData = await window.mdhssCloud.fetchSetting('ticker_marquee');
          if (cloudData) {
            tickerData = cloudData;
            localStorage.setItem('mdhss_ticker_marquee', JSON.stringify(cloudData));
          }
        } catch (e) {}
      }

      applyTickerSettingsToUI(tickerData || DEFAULT_TICKER_DATA);
    }
    window.initTickerMarquee = initTickerMarquee;

    function applyTickerSettingsToUI(data) {
      const ticker = { ...DEFAULT_TICKER_DATA, ...(data || {}) };
      const bar = document.getElementById('portalMarqueeBar');
      const tagEl = document.getElementById('portalMarqueeTag');
      const tagTextEl = document.getElementById('portalMarqueeTagText');
      const textEl = document.getElementById('portalMarqueeText');

      if (!bar) return;

      if (ticker.enabled === 'false') {
        bar.style.display = 'none';
        return;
      }
      bar.style.display = 'flex';

      if (tagTextEl) {
        tagTextEl.textContent = (ticker.tag && ticker.tag.trim()) ? ticker.tag.trim() : '🔔 प्रवेश सूचना';
      }

      if (textEl) {
        textEl.textContent = ticker.text || '';
        let duration = '52s';
        if (ticker.speed === 'slow') duration = '80s';
        else if (ticker.speed === 'fast') duration = '32s';
        textEl.style.animationDuration = duration;
      }

      const currentTheme = TICKER_THEMES[ticker.theme] || TICKER_THEMES.red;
      bar.style.background = currentTheme.bar;
      if (tagEl) {
        tagEl.style.background = currentTheme.tag;
      }

      bar.dataset.clickAction = ticker.clickAction || 'admission';
    }
    window.applyTickerSettingsToUI = applyTickerSettingsToUI;

    function handleTickerBarClick() {
      const bar = document.getElementById('portalMarqueeBar');
      const action = bar ? (bar.dataset.clickAction || 'admission') : 'admission';
      if (action === 'admission') {
        navigateToPage('admission');
      } else if (action === 'notice') {
        openFirstTimeNoticeManually();
      } else if (action === 'whatsapp') {
        navigateToPage('whatsapp');
      } else if (action === 'student') {
        openStudentResultDirect();
      }
    }
    window.handleTickerBarClick = handleTickerBarClick;

    function loadAdminTickerSettings() {
      let tickerData = null;
      try {
        const saved = localStorage.getItem('mdhss_ticker_marquee');
        if (saved) {
          tickerData = JSON.parse(saved);
        }
      } catch (e) {}

      const data = { ...DEFAULT_TICKER_DATA, ...(tickerData || {}) };

      const selEnabled = document.getElementById('cfgTickerEnabled');
      const inputTag = document.getElementById('cfgTickerTag');
      const textTicker = document.getElementById('cfgTickerText');
      const selSpeed = document.getElementById('cfgTickerSpeed');
      const selTheme = document.getElementById('cfgTickerTheme');
      const selAction = document.getElementById('cfgTickerAction');

      if (selEnabled) selEnabled.value = data.enabled || 'true';
      if (inputTag) inputTag.value = data.tag || '🔔 प्रवेश सूचना';
      if (textTicker) textTicker.value = data.text || '';
      if (selSpeed) selSpeed.value = data.speed || 'normal';
      if (selTheme) selTheme.value = data.theme || 'red';
      if (selAction) selAction.value = data.clickAction || 'admission';

      updateTickerLivePreview();
    }
    window.loadAdminTickerSettings = loadAdminTickerSettings;

    function updateTickerLivePreview() {
      const previewBar = document.getElementById('adminTickerLivePreviewBar');
      const previewTag = document.getElementById('adminTickerLivePreviewTag');
      const previewText = document.getElementById('adminTickerLivePreviewText');
      if (!previewBar || !previewTag || !previewText) return;

      const enabled = document.getElementById('cfgTickerEnabled')?.value || 'true';
      const tag = document.getElementById('cfgTickerTag')?.value || '🔔 प्रवेश सूचना';
      const text = document.getElementById('cfgTickerText')?.value || '';
      const themeKey = document.getElementById('cfgTickerTheme')?.value || 'red';

      if (enabled === 'false') {
        previewBar.style.opacity = '0.4';
        previewTag.textContent = '🔴 बंद (Disabled)';
      } else {
        previewBar.style.opacity = '1';
        previewTag.textContent = tag.trim() || '🔔 प्रवेश सूचना';
      }

      previewText.textContent = text.trim() || 'यहाँ स्क्रॉलिंग सूचना दिखाई देगी...';

      const theme = TICKER_THEMES[themeKey] || TICKER_THEMES.red;
      previewBar.style.background = theme.bar;
      previewTag.style.background = theme.tag;
    }
    window.updateTickerLivePreview = updateTickerLivePreview;

    async function saveAdminTickerSettings(e) {
      if (e) e.preventDefault();

      const text = document.getElementById('cfgTickerText')?.value.trim();
      if (!text) {
        alert('कृपया प्रवेश सूचना पट्टी का स्क्रॉलिंग टेक्स्ट दर्ज करें!');
        return;
      }

      const tickerData = {
        enabled: document.getElementById('cfgTickerEnabled')?.value || 'true',
        tag: document.getElementById('cfgTickerTag')?.value.trim() || '🔔 प्रवेश सूचना',
        text: text,
        speed: document.getElementById('cfgTickerSpeed')?.value || 'normal',
        theme: document.getElementById('cfgTickerTheme')?.value || 'red',
        clickAction: document.getElementById('cfgTickerAction')?.value || 'admission',
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('mdhss_ticker_marquee', JSON.stringify(tickerData));
      applyTickerSettingsToUI(tickerData);

      if (window.mdhssCloud && typeof window.mdhssCloud.saveSetting === 'function') {
        try {
          await window.mdhssCloud.saveSetting('ticker_marquee', tickerData);
        } catch (err) {
          console.warn('Cloud sync ticker error:', err);
        }
      }

      const badge = document.getElementById('tickerSaveStatusBadge');
      if (badge) {
        badge.style.display = 'inline-block';
        setTimeout(() => { badge.style.display = 'none'; }, 4000);
      }
    }
    window.saveAdminTickerSettings = saveAdminTickerSettings;

    function resetDefaultTickerSettings() {
      if (!confirm('क्या आप प्रवेश सूचना पट्टी को मूल डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) return;
      localStorage.setItem('mdhss_ticker_marquee', JSON.stringify(DEFAULT_TICKER_DATA));
      if (window.mdhssCloud && typeof window.mdhssCloud.saveSetting === 'function') {
        window.mdhssCloud.saveSetting('ticker_marquee', DEFAULT_TICKER_DATA);
      }
      loadAdminTickerSettings();
      applyTickerSettingsToUI(DEFAULT_TICKER_DATA);
      alert('प्रवेश सूचना पट्टी मूल सेटिंग्स पर रीसेट हो गई है!');
    }
    window.resetDefaultTickerSettings = resetDefaultTickerSettings;

    // ==========================================================================
    // 10. AUTO-SCROLLING VISUAL IMAGE GALLERY (HOMEPAGE & ADMIN CONTROLLER)
    // ==========================================================================
    function renderAutoGallery() {
      const track = document.getElementById('galleryTrack');
      if (!track) return;

      let customImages = [];
      try {
        customImages = JSON.parse(localStorage.getItem('mdhss_gallery_images') || '[]');
      } catch (e) {}

      const allImages = [...customImages, ...DEFAULT_GALLERY_IMAGES];
      // Clone array to allow seamless continuous loop marquee
      const loopImages = [...allImages, ...allImages];

      let html = '';
      loopImages.forEach((img, idx) => {
        html += `
          <div class="gallery-card" onclick="openGalleryImagePreview('${img.url}', '${img.title}')">
            <div class="gallery-img-box">
              <img src="${img.url}" alt="${img.title}" loading="lazy" onerror="this.src='/images/school_building.svg'">
              <span class="gallery-tag-pill">${img.tag || '📸 फोटो'}</span>
            </div>
            <div class="gallery-info">
              <h4 class="gallery-title">${img.title}</h4>
              <p class="gallery-desc">${img.desc || ''}</p>
            </div>
          </div>
        `;
      });

      track.innerHTML = html;
    }

    function openGalleryImagePreview(url, title) {
      window.open(url, '_blank');
    }

    function openAddImageModal() {
      const modal = document.getElementById('addImageModal');
      if (modal) modal.style.display = 'flex';
    }

    function closeAddImageModal() {
      const modal = document.getElementById('addImageModal');
      if (modal) modal.style.display = 'none';
    }

    function saveNewCustomGalleryImage(e) {
      if (e) e.preventDefault();
      const title = document.getElementById('newImgTitle')?.value.trim();
      const url = document.getElementById('newImgUrl')?.value.trim();
      const desc = document.getElementById('newImgDesc')?.value.trim();
      const tag = document.getElementById('newImgTag')?.value.trim();

      if (!title || !url) {
        alert('कृपया फोटो का शीर्षक और URL दर्ज करें!');
        return;
      }

      let stored = [];
      try {
        stored = JSON.parse(localStorage.getItem('mdhss_gallery_images') || '[]');
      } catch (e) {}

      stored.unshift({
        id: 'cimg-' + Date.now(),
        title: title,
        url: url,
        desc: desc || '',
        tag: tag || '📸 नई फोटो'
      });

      localStorage.setItem('mdhss_gallery_images', JSON.stringify(stored));
      if (window.mdhssCloud && typeof window.mdhssCloud.saveSetting === 'function') {
        window.mdhssCloud.saveSetting('gallery_images', stored);
      }
      renderAutoGallery();
      renderAdminGalleryList();
      closeAddImageModal();
      alert('✅ नई फोटो सफलतापूर्वक गैलरी में जोड़ दी गई है!');
    }

    function renderAdminGalleryList() {
      const grid = document.getElementById('adminGalleryGridList');
      const countBadge = document.getElementById('admGalleryCountBadge');
      if (!grid) return;

      let customImages = [];
      try {
        customImages = JSON.parse(localStorage.getItem('mdhss_gallery_images') || '[]');
      } catch (e) {}

      const allImages = [
        ...customImages.map(img => ({ ...img, isCustom: true })),
        ...DEFAULT_GALLERY_IMAGES.map(img => ({ ...img, isCustom: false }))
      ];

      if (countBadge) countBadge.textContent = allImages.length;

      grid.innerHTML = allImages.map((img, idx) => `
        <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: var(--radius-sm); overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.04); display: flex; flex-direction: column;">
          <div style="height: 140px; background: #f1f5f9; position: relative; overflow: hidden;">
            <img src="${img.url}" alt="${img.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/images/school_building.svg'">
            <span style="position: absolute; top: 8px; left: 8px; background: rgba(15, 23, 42, 0.85); color: #ffffff; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 9999px;">
              ${img.tag || '📸 फोटो'}
            </span>
            ${img.isCustom ? `<span style="position: absolute; top: 8px; right: 8px; background: #7c3aed; color: #ffffff; font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;">कस्टम (User Added)</span>` : `<span style="position: absolute; top: 8px; right: 8px; background: #0284c7; color: #ffffff; font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;">डिफ़ॉल्ट</span>`}
          </div>
          <div style="padding: 0.85rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h5 style="margin: 0 0 4px 0; font-size: 0.92rem; color: #0f172a;">${img.title}</h5>
              <p style="margin: 0 0 8px 0; font-size: 0.8rem; color: #64748b; line-height: 1.4;">${img.desc || '-'}</p>
              <div style="font-size: 0.75rem; color: #0284c7; word-break: break-all; font-family: monospace;">${img.url}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 8px; border-top: 1px solid #f1f5f9;">
              <a href="${img.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.78rem; color: #0284c7; font-weight: 700; text-decoration: none;">👁️ देखें ↗</a>
              ${img.isCustom ? `
                <button type="button" class="btn-hero-sec" style="background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; font-size: 0.75rem; padding: 0.25rem 0.6rem; cursor: pointer;" onclick="deleteAdminGalleryImage('${img.id}')">
                  🗑️ हटाएं
                </button>
              ` : `
                <span style="font-size: 0.72rem; color: #94a3b8;">सुरक्षित डिफ़ॉल्ट</span>
              `}
            </div>
          </div>
        </div>
      `).join('');
    }

    function handleAdminAddNewImage(e) {
      if (e && e.preventDefault) e.preventDefault();
      const title = document.getElementById('admNewImgTitle')?.value.trim();
      const url = document.getElementById('admNewImgUrl')?.value.trim();
      const tag = document.getElementById('admNewImgTag')?.value.trim() || '📸 स्कूल फोटो';
      const desc = document.getElementById('admNewImgDesc')?.value.trim() || '';

      if (!title || !url) {
        alert('कृपया फोटो का शीर्षक और URL दर्ज करें!');
        return;
      }

      let stored = [];
      try {
        stored = JSON.parse(localStorage.getItem('mdhss_gallery_images') || '[]');
      } catch (err) {}

      stored.unshift({
        id: 'img-' + Date.now(),
        title: title,
        url: url,
        tag: tag,
        desc: desc
      });

      localStorage.setItem('mdhss_gallery_images', JSON.stringify(stored));
      if (window.mdhssCloud && typeof window.mdhssCloud.saveSetting === 'function') {
        window.mdhssCloud.saveSetting('gallery_images', stored);
      }
      renderAdminGalleryList();
      renderAutoGallery();

      // Reset add form
      if (document.getElementById('admNewImgTitle')) document.getElementById('admNewImgTitle').value = '';
      if (document.getElementById('admNewImgUrl')) document.getElementById('admNewImgUrl').value = '';
      if (document.getElementById('admNewImgDesc')) document.getElementById('admNewImgDesc').value = '';

      alert('✅ नई फोटो सफलतापूर्वक गैलरी में शामिल हो गई है!');
    }

    function deleteAdminGalleryImage(imgId) {
      if (!confirm('क्या आप वाकई इस फोटो को गैलरी से हटाना चाहते हैं?')) return;
      let stored = [];
      try {
        stored = JSON.parse(localStorage.getItem('mdhss_gallery_images') || '[]');
        stored = stored.filter(img => img.id !== imgId);
        localStorage.setItem('mdhss_gallery_images', JSON.stringify(stored));
        if (window.mdhssCloud && typeof window.mdhssCloud.saveSetting === 'function') {
          window.mdhssCloud.saveSetting('gallery_images', stored);
        }
      } catch (err) {}

      renderAdminGalleryList();
      renderAutoGallery();
    }

    function resetDefaultGalleryImages() {
      if (!confirm('क्या आप सभी कस्टम तस्वीरों को हटाकर मूल 8 डिफ़ॉल्ट तस्वीरें बहाल करना चाहते हैं?')) return;
      localStorage.removeItem('mdhss_gallery_images');
      if (window.mdhssCloud && typeof window.mdhssCloud.saveSetting === 'function') {
        window.mdhssCloud.saveSetting('gallery_images', []);
      }
      renderAdminGalleryList();
      renderAutoGallery();
      alert('गैलरी मूल डिफ़ॉल्ट में बहाल कर दी गई है!');
    }

    // ==========================================================================
    // 11. STUDENT RESULT PORTAL LINK GATEWAY CONTROLLER
    // ==========================================================================
    function loadAdminResultLinkConfig() {
      let config = {
        url: 'https://online.edumentsolution.com/',
        btnText: '🌐 अधिकृत परीक्षा परिणाम पोर्टल खोलें (Open Result Portal) ↗',
        tag: '🏆 वार्षिक एवं बोर्ड परीक्षा परिणाम • सत्र 2026-27',
        note: 'सत्र 2026-27 के सभी छात्र एवं अभिभावक अपने अनुक्रमांक (Roll Number) द्वारा परीक्षा परिणाम व अंकपत्र देखने हेतु नीचे दिए गए अधिकृत परीक्षा परिणाम पोर्टल लिंक पर क्लिक करें। यह लिंक सीधे नए पेज/टैब में खुलेगा।'
      };

      try {
        const saved = localStorage.getItem('mdhss_result_link_config');
        if (saved) {
          config = { ...config, ...JSON.parse(saved) };
        }
      } catch (e) {}

      // Fill Admin Form
      if (document.getElementById('cfgResultPortalUrl')) document.getElementById('cfgResultPortalUrl').value = config.url;
      if (document.getElementById('cfgResultBtnText')) document.getElementById('cfgResultBtnText').value = config.btnText;
      if (document.getElementById('cfgResultTag')) document.getElementById('cfgResultTag').value = config.tag;
      if (document.getElementById('cfgResultNote')) document.getElementById('cfgResultNote').value = config.note;

      // Update Student Page View Gateway Card
      const displayUrl = document.getElementById('portalResultUrlDisplay');
      const mainBtn = document.getElementById('portalResultMainBtn');
      const btnLabel = document.getElementById('portalResultBtnLabel');
      const tagEl = document.getElementById('portalResultTag');
      const noteEl = document.getElementById('portalResultNote');

      if (displayUrl) displayUrl.textContent = config.url;
      if (mainBtn) mainBtn.href = config.url;
      if (btnLabel) btnLabel.textContent = config.btnText;
      if (tagEl) tagEl.textContent = config.tag;
      if (noteEl) noteEl.textContent = config.note;

      // Update Top Navbar Direct Result Link
      const navResultLink = document.getElementById('navResultLinkDirect');
      if (navResultLink) {
        navResultLink.href = config.url;
      }
    }

    function saveAdminResultLinkConfig(event) {
      if (event && event.preventDefault) event.preventDefault();

      const config = {
        url: document.getElementById('cfgResultPortalUrl')?.value.trim() || 'https://online.edumentsolution.com/',
        btnText: document.getElementById('cfgResultBtnText')?.value.trim() || '🌐 अधिकृत परीक्षा परिणाम पोर्टल खोलें ↗',
        tag: document.getElementById('cfgResultTag')?.value.trim() || '🏆 वार्षिक एवं बोर्ड परीक्षा परिणाम • सत्र 2026-27',
        note: document.getElementById('cfgResultNote')?.value.trim() || ''
      };

      localStorage.setItem('mdhss_result_link_config', JSON.stringify(config));
      if (window.mdhssCloud && typeof window.mdhssCloud.saveSetting === 'function') {
        window.mdhssCloud.saveSetting('result_link_config', config);
      }
      loadAdminResultLinkConfig();

      const badge = document.getElementById('resultLinkSaveBadge');
      if (badge) {
        badge.style.display = 'inline-block';
        setTimeout(() => { badge.style.display = 'none'; }, 4000);
      }
    }

    function testOpenExternalResultLink() {
      const url = document.getElementById('cfgResultPortalUrl')?.value.trim() || 'https://online.edumentsolution.com/';
      window.open(url, '_blank');
    }

    function copyResultPortalUrl() {
      const displayUrl = document.getElementById('portalResultUrlDisplay')?.textContent.trim() || 'https://online.edumentsolution.com/';
      navigator.clipboard.writeText(displayUrl).then(() => {
        alert('✅ परीक्षा परिणाम पोर्टल लिंक क्लिपबोर्ड पर कॉपी हो गया है:\n' + displayUrl);
      }).catch(() => {
        alert('रिजल्ट लिंक: ' + displayUrl);
      });
    }

    // ==========================================================================
    // 12. CLASS-WISE WHATSAPP GROUPS DYNAMIC CONTROLLER & ADMIN MANAGER
    // ==========================================================================
    const DEFAULT_WHATSAPP_GROUPS = [
      {
        id: 'wa-class-4th',
        className: 'Class 4th Group',
        badge: '4th',
        sub: 'कक्षा 4थी आधिकारिक ग्रुप',
        link: 'https://chat.whatsapp.com/KL8gLpiBNrc6lhVEPnwVmP',
        btnText: 'Join Class 4th Group ↗',
        status: 'active'
      },
      {
        id: 'wa-class-5th',
        className: 'Class 5th Group',
        badge: '5th',
        sub: 'कक्षा 5वीं आधिकारिक ग्रुप',
        link: 'https://chat.whatsapp.com/DwZKKN3R5ixIc92LwjfCvS',
        btnText: 'Join Class 5th Group ↗',
        status: 'active'
      },
      {
        id: 'wa-class-8th',
        className: 'Class 8th Group',
        badge: '8th',
        sub: 'कक्षा 8वीं बोर्ड आधिकारिक ग्रुप',
        link: 'https://chat.whatsapp.com/LGqCRBl4EubE8NoF0YMSf6',
        btnText: 'Join Class 8th Group ↗',
        status: 'active'
      },
      {
        id: 'wa-class-9th',
        className: 'Class 9th Group',
        badge: '9th',
        sub: 'कक्षा 9वीं आधिकारिक ग्रुप',
        link: 'https://chat.whatsapp.com/IbDfB52AEkU5ev0wAK7GXb',
        btnText: 'Join Class 9th Group ↗',
        status: 'active'
      },
      {
        id: 'wa-class-10th',
        className: 'Class 10th Board',
        badge: '10th',
        sub: 'कक्षा 10वीं बोर्ड विशेष ग्रुप',
        link: 'https://chat.whatsapp.com/CWcP1g8k9HJBr27fGy04n0',
        btnText: 'Join Class 10th Board ↗',
        status: 'active'
      },
      {
        id: 'wa-class-11th',
        className: 'क्लास 11th (Science & Commerce)',
        badge: '11th',
        sub: '11वीं गणित, विज्ञान, वाणिज्य संकाय',
        link: 'https://chat.whatsapp.com/EmLysOwKpYqEHp5cCR3mOE',
        btnText: 'Join Class 11th Group ↗',
        status: 'active'
      },
      {
        id: 'wa-class-12th',
        className: 'Class 12th Board',
        badge: '12th',
        sub: '12वीं हायर सेकेंडरी बोर्ड ग्रुप',
        link: 'https://chat.whatsapp.com/BOcoXHvJZ8SCPyv2Mm1RBL',
        btnText: 'Join Class 12th Board ↗',
        status: 'active'
      },
      {
        id: 'wa-helpline',
        className: 'School Admission Care',
        badge: 'MD',
        sub: 'प्रवेश सहायता व सामान्य पूछताछ',
        link: 'https://wa.me/919200178385?text=Namaste%20Maa%20Durga%20School%20Semariya,%20I%20want%20to%20know%20about%20admission.',
        btnText: 'Chat on WhatsApp ↗',
        status: 'active',
        isCare: true
      }
    ];

    const WA_SVG_ICON = `<svg class="wa-svg-inline" viewBox="0 0 24 24" style="width:1.15rem; height:1.15rem; fill:currentColor; vertical-align:middle;"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.126-.525-1.704-.7-2.779-2.42-2.864-2.535-.086-.115-.691-.92-1.077-.92-.387 0-.58.077-.788.286-.208.208-.795.777-.795 1.895 0 1.118.814 2.197.928 2.35.114.153 1.589 2.426 3.849 3.401.538.232.958.371 1.286.475.541.172 1.033.148 1.423.09.435-.065 1.336-.546 1.527-1.072.191-.527.191-.979.134-1.073-.058-.094-.211-.153-.443-.269z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.436 5.176L2 22l4.98-1.398A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.636 0-3.16-.487-4.437-1.326l-.318-.21-2.96.83.844-2.884-.23-.332A8.12 8.12 0 0 1 3.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z"/></svg>`;

    function getWhatsAppGroups() {
      let groups = null;
      try {
        const stored = localStorage.getItem('mdhss_whatsapp_groups');
        if (stored) {
          groups = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Error reading mdhss_whatsapp_groups:', e);
      }
      if (!groups || !Array.isArray(groups) || groups.length === 0) {
        groups = [...DEFAULT_WHATSAPP_GROUPS];
        localStorage.setItem('mdhss_whatsapp_groups', JSON.stringify(groups));
      }
      return groups;
    }

    function saveWhatsAppGroupsToStorage(groups) {
      localStorage.setItem('mdhss_whatsapp_groups', JSON.stringify(groups));
      if (window.mdhssCloud && typeof window.mdhssCloud.saveSetting === 'function') {
        window.mdhssCloud.saveSetting('whatsapp_groups', groups);
      }
      renderPublicWhatsAppGroups();
      renderAdminWhatsAppGroups();
      if (typeof renderAdminTables === 'function') {
        renderAdminTables();
      }
    }

    function renderPublicWhatsAppGroups() {
      const grid = document.getElementById('publicWhatsAppCardsGrid');
      if (!grid) return;
      const groups = getWhatsAppGroups();
      const activeGroups = groups.filter(g => g.status !== 'inactive');

      if (activeGroups.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align:center; padding:2.5rem; color:#64748b; background:#f8fafc; border-radius:12px; border:1px dashed #cbd5e1;">वर्तमान में कोई व्हाट्सएप ग्रुप लिंक सक्रिय नहीं है। कृपया स्कूल हेल्पलाइन पर संपर्क करें।</div>';
        return;
      }

      grid.innerHTML = activeGroups.map(item => {
        const isCare = item.isCare || item.id === 'wa-helpline';
        const cardStyle = isCare ? 'background:#f0fdf4; border: 1.5px solid #86efac;' : '';
        const bubbleStyle = isCare ? 'background: linear-gradient(135deg, #16a34a, #15803d);' : '';
        const btnStyle = isCare ? 'background: linear-gradient(135deg, #16a34a, #15803d);' : '';
        const btnText = item.btnText || (isCare ? 'Chat on WhatsApp ↗' : `Join ${item.className || 'Group'} ↗`);

        return `
          <div class="wa-class-card" style="${cardStyle}">
            <div class="wa-icon-bubble" style="${bubbleStyle}">${item.badge || 'WA'}</div>
            <h4 class="wa-class-title">${item.className || 'WhatsApp Group'}</h4>
            <p class="wa-class-sub">${item.sub || 'आधिकारिक ग्रुप'}</p>
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn-join-wa" style="${btnStyle}">
              ${WA_SVG_ICON}
              ${btnText}
            </a>
          </div>
        `;
      }).join('');
    }

    function renderAdminWhatsAppGroups(filterQuery) {
      const container = document.getElementById('adminWhatsAppListContainer');
      const countEl = document.getElementById('admWaGroupCount');
      if (!container) return;

      const groups = getWhatsAppGroups();
      if (countEl) countEl.textContent = groups.length;

      const query = (filterQuery !== undefined ? filterQuery : (document.getElementById('waSearchFilter')?.value || '')).trim().toLowerCase();
      
      const filtered = groups.filter(g => {
        if (!query) return true;
        return (g.className && g.className.toLowerCase().includes(query)) ||
               (g.badge && g.badge.toLowerCase().includes(query)) ||
               (g.sub && g.sub.toLowerCase().includes(query)) ||
               (g.link && g.link.toLowerCase().includes(query));
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align:center; padding: 2.5rem; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1; color:#64748b;">
            <span style="font-size:2rem; display:block; margin-bottom:8px;">🔍</span>
            कोई व्हाट्सएप ग्रुप नहीं मिला। खोज शब्द बदलें या नया ग्रुप जोड़ें।
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map((item) => {
        const isActive = item.status !== 'inactive';
        return `
          <div class="glass-card" style="background:#ffffff; border:1.5px solid ${isActive ? '#bbf7d0' : '#e2e8f0'}; border-radius:var(--radius-sm); padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 2px 8px rgba(0,0,0,0.04); transition:all 0.2s ease;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:0.75rem;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, #22c55e, #16a34a); color:#fff; font-weight:800; font-size:0.95rem; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    ${item.badge || 'WA'}
                  </div>
                  <div>
                    <h5 style="margin:0; font-size:1.02rem; font-weight:800; color:#0f172a;">${item.className || 'WhatsApp Group'}</h5>
                    <span style="font-size:0.78rem; color:#64748b;">${item.sub || 'आधिकारिक ग्रुप'}</span>
                  </div>
                </div>
                <span style="font-size:0.72rem; font-weight:700; padding:2px 8px; border-radius:9999px; ${isActive ? 'background:#dcfce7; color:#15803d; border:1px solid #86efac;' : 'background:#fee2e2; color:#991b1b; border:1px solid #fecaca;'}">
                  ${isActive ? '🟢 सक्रिय' : '🔴 निष्क्रिय'}
                </span>
              </div>

              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:8px 10px; margin-bottom:0.85rem;">
                <div style="font-size:0.72rem; font-weight:700; color:#64748b; margin-bottom:2px;">व्हाट्सएप लिंक:</div>
                <div style="font-family:monospace; font-size:0.78rem; color:#0369a1; word-break:break-all; font-weight:700; max-height:48px; overflow-y:auto;">
                  ${item.link}
                </div>
              </div>

              ${item.btnText ? `<div style="font-size:0.76rem; color:#475569; margin-bottom:0.75rem;"><strong>बटन टेक्स्ट:</strong> ${item.btnText}</div>` : ''}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; flex-wrap:wrap; border-top:1px solid #f1f5f9; padding-top:0.75rem; margin-top:0.5rem;">
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button type="button" class="btn-hero-sec" style="font-size:0.78rem; padding:0.35rem 0.65rem; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; cursor:pointer; font-weight:700;" onclick="editAdminWhatsAppGroup('${item.id}')" title="इस क्लास का लिंक या विवरण बदलें">
                  ✏️ एडिट करें
                </button>
                <button type="button" class="btn-hero-sec" style="font-size:0.78rem; padding:0.35rem 0.65rem; background:#f0fdf4; color:#15803d; border:1px solid #86efac; cursor:pointer; font-weight:700;" onclick="testWhatsAppLinkDirect('${item.link}')" title="ब्राउज़र में खोलकर टेस्ट करें">
                  🔗 टेस्ट ↗
                </button>
                <button type="button" class="btn-hero-sec" style="font-size:0.78rem; padding:0.35rem 0.65rem; background:#f8fafc; color:#334155; border:1px solid #cbd5e1; cursor:pointer;" onclick="copyWhatsAppLinkDirect('${item.link}')" title="क्लिपबोर्ड में कॉपी करें">
                  📋 कॉपी
                </button>
              </div>
              <button type="button" class="btn-hero-sec" style="font-size:0.75rem; padding:0.35rem 0.55rem; background:#fee2e2; color:#991b1b; border:1px solid #fecaca; cursor:pointer;" onclick="deleteAdminWhatsAppGroup('${item.id}')" title="इस ग्रुप को हटाएं">
                🗑️ हटाएं
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    function filterAdminWhatsAppGroups() {
      const q = document.getElementById('waSearchFilter')?.value || '';
      renderAdminWhatsAppGroups(q);
    }

    function focusWhatsAppAddForm() {
      cancelEditAdminWhatsAppGroup();
      const input = document.getElementById('waInputClassName');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    function testCurrentWaLinkInput() {
      const url = document.getElementById('waInputUrl')?.value.trim();
      if (!url) {
        alert('कृपया पहले व्हाट्सएप लिंक दर्ज करें!');
        return;
      }
      window.open(url, '_blank');
    }

    function testWhatsAppLinkDirect(url) {
      if (!url) return;
      window.open(url, '_blank');
    }

    function copyWhatsAppLinkDirect(url) {
      if (!url) return;
      navigator.clipboard.writeText(url).then(() => {
        alert('✅ व्हाट्सएप ग्रुप लिंक क्लिपबोर्ड पर कॉपी हो गया:\n' + url);
      }).catch(() => {
        alert('व्हाट्सएप लिंक:\n' + url);
      });
    }

    function saveAdminWhatsAppGroup(event) {
      if (event && event.preventDefault) event.preventDefault();

      const editId = document.getElementById('waEditGroupId')?.value.trim();
      const className = document.getElementById('waInputClassName')?.value.trim();
      const badge = document.getElementById('waInputBadge')?.value.trim();
      const link = document.getElementById('waInputUrl')?.value.trim();
      const sub = document.getElementById('waInputSub')?.value.trim() || `${className} आधिकारिक ग्रुप`;
      const btnText = document.getElementById('waInputBtnText')?.value.trim() || `Join ${className} ↗`;
      const status = document.getElementById('waInputStatus')?.value || 'active';

      if (!className || !badge || !link) {
        alert('कृपया कक्षा का नाम, बैज और व्हाट्सएप लिंक अवश्य भरें!');
        return;
      }

      let groups = getWhatsAppGroups();

      if (editId) {
        // Edit existing group
        const idx = groups.findIndex(g => g.id === editId);
        if (idx !== -1) {
          groups[idx] = {
            ...groups[idx],
            className,
            badge,
            link,
            sub,
            btnText,
            status,
            updatedAt: new Date().toISOString()
          };
        } else {
          groups.unshift({
            id: editId,
            className,
            badge,
            link,
            sub,
            btnText,
            status,
            updatedAt: new Date().toISOString()
          });
        }
      } else {
        // Add new group
        const newId = 'wa-' + Date.now();
        groups.push({
          id: newId,
          className,
          badge,
          link,
          sub,
          btnText,
          status,
          createdAt: new Date().toISOString()
        });
      }

      saveWhatsAppGroupsToStorage(groups);

      // Show success feedback
      const badgeSuccess = document.getElementById('waSaveSuccessBadge');
      if (badgeSuccess) {
        badgeSuccess.style.display = 'inline-block';
        setTimeout(() => { badgeSuccess.style.display = 'none'; }, 4000);
      }

      cancelEditAdminWhatsAppGroup();
      alert(`✅ कक्षा ग्रुप '${className}' सफलतापूर्वक सुरक्षित कर दिया गया है!`);
    }

    function editAdminWhatsAppGroup(id) {
      const groups = getWhatsAppGroups();
      const target = groups.find(g => g.id === id);
      if (!target) return;

      if (document.getElementById('waEditGroupId')) document.getElementById('waEditGroupId').value = target.id;
      if (document.getElementById('waInputClassName')) document.getElementById('waInputClassName').value = target.className || '';
      if (document.getElementById('waInputBadge')) document.getElementById('waInputBadge').value = target.badge || '';
      if (document.getElementById('waInputUrl')) document.getElementById('waInputUrl').value = target.link || '';
      if (document.getElementById('waInputSub')) document.getElementById('waInputSub').value = target.sub || '';
      if (document.getElementById('waInputBtnText')) document.getElementById('waInputBtnText').value = target.btnText || '';
      if (document.getElementById('waInputStatus')) document.getElementById('waInputStatus').value = target.status || 'active';

      // Update UI mode
      const titleEl = document.getElementById('waFormTitleText');
      if (titleEl) titleEl.textContent = `ग्रुप सम्पादित करें: ${target.className}`;
      const badgeEl = document.getElementById('waFormModeBadge');
      if (badgeEl) {
        badgeEl.textContent = `✏️ सम्पादन मोड (${target.badge})`;
        badgeEl.style.background = '#fef3c7';
        badgeEl.style.color = '#b45309';
        badgeEl.style.border = '1px solid #fde68a';
      }
      const submitBtnText = document.getElementById('waSubmitBtnText');
      if (submitBtnText) submitBtnText.textContent = 'अपडेट सुरक्षित करें (Update Group)';

      const cancelBtnTop = document.getElementById('waCancelEditBtnTop');
      const cancelBtnBottom = document.getElementById('waCancelEditBtnBottom');
      if (cancelBtnTop) cancelBtnTop.style.display = 'inline-block';
      if (cancelBtnBottom) cancelBtnBottom.style.display = 'inline-block';

      // Smooth scroll to form
      const formCard = document.getElementById('adminWaFormContainer');
      if (formCard) formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function cancelEditAdminWhatsAppGroup() {
      if (document.getElementById('waEditGroupId')) document.getElementById('waEditGroupId').value = '';
      if (document.getElementById('waInputClassName')) document.getElementById('waInputClassName').value = '';
      if (document.getElementById('waInputBadge')) document.getElementById('waInputBadge').value = '';
      if (document.getElementById('waInputUrl')) document.getElementById('waInputUrl').value = '';
      if (document.getElementById('waInputSub')) document.getElementById('waInputSub').value = '';
      if (document.getElementById('waInputBtnText')) document.getElementById('waInputBtnText').value = '';
      if (document.getElementById('waInputStatus')) document.getElementById('waInputStatus').value = 'active';

      const titleEl = document.getElementById('waFormTitleText');
      if (titleEl) titleEl.textContent = 'व्हाट्सएप ग्रुप जोड़ें / सम्पादित करें (Add / Edit WhatsApp Group)';
      const badgeEl = document.getElementById('waFormModeBadge');
      if (badgeEl) {
        badgeEl.textContent = '➕ नया ग्रुप मोड';
        badgeEl.style.background = '#eff6ff';
        badgeEl.style.color = '#1d4ed8';
        badgeEl.style.border = '1px solid #bfdbfe';
      }
      const submitBtnText = document.getElementById('waSubmitBtnText');
      if (submitBtnText) submitBtnText.textContent = 'ग्रुप सुरक्षित करें (Save Group)';

      const cancelBtnTop = document.getElementById('waCancelEditBtnTop');
      const cancelBtnBottom = document.getElementById('waCancelEditBtnBottom');
      if (cancelBtnTop) cancelBtnTop.style.display = 'none';
      if (cancelBtnBottom) cancelBtnBottom.style.display = 'none';
    }

    function deleteAdminWhatsAppGroup(id) {
      const groups = getWhatsAppGroups();
      const target = groups.find(g => g.id === id);
      const name = target ? target.className : 'ग्रुप';
      if (!confirm(`क्या आप वाकई '${name}' को हटाना चाहते हैं?`)) return;

      const remaining = groups.filter(g => g.id !== id);
      saveWhatsAppGroupsToStorage(remaining);
      alert(`✅ '${name}' सफलतापूर्वक हटा दिया गया है!`);
    }

    function resetDefaultWhatsAppGroups() {
      if (!confirm('क्या आप सभी व्हाट्सएप ग्रुप्स को मूल डिफ़ॉल्ट 8 लिंक्स में रीसेट करना चाहते हैं?')) return;
      saveWhatsAppGroupsToStorage([...DEFAULT_WHATSAPP_GROUPS]);
      cancelEditAdminWhatsAppGroup();
      alert('✅ मूल 8 व्हाट्सएप ग्रुप्स सफलतापूर्वक बहाल कर दिए गए हैं!');
    }

    // Scroll to top button visibility
    window.addEventListener('scroll', () => {
      const topBtn = document.getElementById('scrollTopBtn');
      if (topBtn) {
        if (window.scrollY > 300) {
          topBtn.classList.add('show');
        } else {
          topBtn.classList.remove('show');
        }
      }
    });

    // Expose all admin, whatsapp and modal configuration methods on window
    window.switchAdminTab = switchAdminTab;
    window.saveAdminNoticeSettings = saveAdminNoticeSettings;
    window.loadAdminNoticeSettings = loadAdminNoticeSettings;
    window.testLiveNoticeModal = testLiveNoticeModal;
    window.resetDefaultNoticeSettings = resetDefaultNoticeSettings;
    window.toggleNoticeCustomUrlInput = toggleNoticeCustomUrlInput;
    window.renderAdminGalleryList = renderAdminGalleryList;
    window.handleAdminAddNewImage = handleAdminAddNewImage;
    window.deleteAdminGalleryImage = deleteAdminGalleryImage;
    window.resetDefaultGalleryImages = resetDefaultGalleryImages;
    window.saveAdminResultLinkConfig = saveAdminResultLinkConfig;
    window.loadAdminResultLinkConfig = loadAdminResultLinkConfig;
    window.testOpenExternalResultLink = testOpenExternalResultLink;
    window.copyResultPortalUrl = copyResultPortalUrl;
    window.openFirstTimeNoticeManually = openFirstTimeNoticeManually;
    window.closeFirstTimeNotice = closeFirstTimeNotice;
    window.onFirstNoticeActionClick = onFirstNoticeActionClick;
    window.openAddImageModal = openAddImageModal;
    window.closeAddImageModal = closeAddImageModal;
    window.saveNewCustomGalleryImage = saveNewCustomGalleryImage;

    // WhatsApp Groups exports
    window.getWhatsAppGroups = getWhatsAppGroups;
    window.renderPublicWhatsAppGroups = renderPublicWhatsAppGroups;
    window.renderAdminWhatsAppGroups = renderAdminWhatsAppGroups;
    window.filterAdminWhatsAppGroups = filterAdminWhatsAppGroups;
    window.focusWhatsAppAddForm = focusWhatsAppAddForm;
    window.testCurrentWaLinkInput = testCurrentWaLinkInput;
    window.testWhatsAppLinkDirect = testWhatsAppLinkDirect;
    window.copyWhatsAppLinkDirect = copyWhatsAppLinkDirect;
    window.saveAdminWhatsAppGroup = saveAdminWhatsAppGroup;
    window.editAdminWhatsAppGroup = editAdminWhatsAppGroup;
    window.cancelEditAdminWhatsAppGroup = cancelEditAdminWhatsAppGroup;
    window.deleteAdminWhatsAppGroup = deleteAdminWhatsAppGroup;
    window.resetDefaultWhatsAppGroups = resetDefaultWhatsAppGroups;
  

// Explicit Window Exports for Global In-Page Handlers
if (typeof window !== "undefined") {
  window.handleStudentFeeSearchSubmit = handleStudentFeeSearchSubmit;
  window.fetchStudentFeesSheetIfNeeded = fetchStudentFeesSheetIfNeeded;
  if (typeof filterStudentFeesByClass !== "undefined") window.filterStudentFeesByClass = filterStudentFeesByClass;
  if (typeof printCurrentFeeReceipt !== "undefined") window.printCurrentFeeReceipt = printCurrentFeeReceipt;
  if (typeof shareCurrentFeeOnWhatsApp !== "undefined") window.shareCurrentFeeOnWhatsApp = shareCurrentFeeOnWhatsApp;
}
