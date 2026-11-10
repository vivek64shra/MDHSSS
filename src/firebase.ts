import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  onSnapshot,
  Firestore,
  setLogLevel,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Silence non-fatal offline connection notices
try {
  setLogLevel('silent');
} catch {
  // Ignore in case setLogLevel is restricted
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db: Firestore = (() => {
  try {
    return initializeFirestore(
      app,
      {
        experimentalAutoDetectLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId
    );
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
})();

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const isOfflineNotice =
    errMsg.includes('Could not reach Cloud Firestore') ||
    errMsg.includes('offline mode') ||
    errMsg.includes('unavailable') ||
    errMsg.includes('Backend didn\'t respond') ||
    errMsg.includes('the client is offline');
  
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
  };
  
  if (isOfflineNotice) {
    // Handled quietly without UI disruption or console noise
  } else {
    console.warn('Firestore Operation Notification:', JSON.stringify(errInfo));
  }
  return errInfo;
}

// Resilient connection check
export async function testConnection(): Promise<boolean> {
  try {
    const { getDocFromServer } = await import('firebase/firestore');
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch {
    // Graceful offline fallback
    return false;
  }
}

// ==========================================
// 1. ADMISSION INQUIRIES
// ==========================================
export async function saveAdmissionToCloud(data: any): Promise<boolean> {
  const id = data.id || ('ADM-' + Date.now().toString().slice(-6));
  const docRef = doc(db, 'admissions', id);
  try {
    await setDoc(docRef, { ...data, id, updatedAt: new Date().toISOString() }, { merge: true });
    console.log('✅ Admission saved to Firebase Cloud:', id);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `admissions/${id}`);
    return false;
  }
}

export async function fetchAdmissionsFromCloud(): Promise<any[]> {
  try {
    const colRef = collection(db, 'admissions');
    const snap = await getDocs(colRef);
    const list: any[] = [];
    snap.forEach((d) => {
      list.push(d.data());
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'admissions');
    return [];
  }
}

export async function deleteAdmissionFromCloud(id: string): Promise<boolean> {
  try {
    addDeletedIdTrack(id);
    await deleteDoc(doc(db, 'admissions', id));
    console.log('🗑️ Admission deleted from Firebase Cloud:', id);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `admissions/${id}`);
    return false;
  }
}

// ==========================================
// 2. FEEDBACK SUBMISSIONS
// ==========================================
export async function saveFeedbackToCloud(data: any): Promise<boolean> {
  const id = data.id || ('FB-' + Date.now().toString().slice(-6));
  const docRef = doc(db, 'feedbacks', id);
  try {
    await setDoc(docRef, { ...data, id, updatedAt: new Date().toISOString() }, { merge: true });
    console.log('✅ Feedback saved to Firebase Cloud:', id);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `feedbacks/${id}`);
    return false;
  }
}

export async function fetchFeedbacksFromCloud(): Promise<any[]> {
  try {
    const colRef = collection(db, 'feedbacks');
    const snap = await getDocs(colRef);
    const list: any[] = [];
    snap.forEach((d) => {
      list.push(d.data());
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'feedbacks');
    return [];
  }
}

export async function deleteFeedbackFromCloud(id: string): Promise<boolean> {
  try {
    addDeletedIdTrack(id);
    await deleteDoc(doc(db, 'feedbacks', id));
    console.log('🗑️ Feedback deleted from Firebase Cloud:', id);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `feedbacks/${id}`);
    return false;
  }
}

// ==========================================
// 3. SETTINGS & CONFIGURATION (Notice, Result Link, Gallery, etc.)
// ==========================================
export async function saveSettingToCloud(key: string, data: any): Promise<boolean> {
  const docRef = doc(db, 'settings', key);
  try {
    if (data === null || data === undefined) {
      await deleteDoc(docRef);
      console.log('🗑️ Setting deleted from Firebase Cloud:', key);
      return true;
    }
    await setDoc(docRef, { data, updatedAt: new Date().toISOString() });
    console.log('✅ Setting saved to Firebase Cloud:', key);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `settings/${key}`);
    return false;
  }
}

export async function deleteSettingFromCloud(key: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'settings', key);
    await deleteDoc(docRef);
    console.log('🗑️ Setting permanently deleted from Firebase Cloud:', key);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `settings/${key}`);
    return false;
  }
}

export async function fetchSettingFromCloud(key: string): Promise<any | null> {
  try {
    const docRef = doc(db, 'settings', key);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().data;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `settings/${key}`);
    return null;
  }
}

// ==========================================
// 4. FIREBASE STORAGE & DATABASE OVERVIEW EXPLORER
// ==========================================
export interface FirebaseCollectionInfo {
  count: number;
  items: any[];
  sizeBytes: number;
}

export interface FirebaseSettingDocInfo {
  exists: boolean;
  data: any;
  sizeBytes: number;
}

export interface FirebaseOverviewReport {
  connected: boolean;
  projectId: string;
  collections: {
    admissions: FirebaseCollectionInfo;
    feedbacks: FirebaseCollectionInfo;
  };
  settings: Record<string, FirebaseSettingDocInfo>;
  storageEstimateBytes: number;
  timestamp: string;
  error?: string;
}

export async function getFirebaseOverview(): Promise<FirebaseOverviewReport> {
  const report: FirebaseOverviewReport = {
    connected: true,
    projectId: firebaseConfig.projectId,
    collections: {
      admissions: { count: 0, items: [], sizeBytes: 0 },
      feedbacks: { count: 0, items: [], sizeBytes: 0 },
    },
    settings: {},
    storageEstimateBytes: 0,
    timestamp: new Date().toISOString()
  };

  try {
    // 1. Admissions collection
    const admSnap = await getDocs(collection(db, 'admissions'));
    const admissions: any[] = [];
    admSnap.forEach(d => admissions.push({ id: d.id, ...d.data() }));
    report.collections.admissions = {
      count: admissions.length,
      items: admissions,
      sizeBytes: new Blob([JSON.stringify(admissions)]).size || JSON.stringify(admissions).length
    };

    // 2. Feedbacks collection
    const fbSnap = await getDocs(collection(db, 'feedbacks'));
    const feedbacks: any[] = [];
    fbSnap.forEach(d => feedbacks.push({ id: d.id, ...d.data() }));
    report.collections.feedbacks = {
      count: feedbacks.length,
      items: feedbacks,
      sizeBytes: new Blob([JSON.stringify(feedbacks)]).size || JSON.stringify(feedbacks).length
    };

    // 3. Settings documents
    const settingKeys = [
      'popup_notification',
      'ticker_marquee',
      'whatsapp_groups',
      'gallery_images',
      'result_link_config'
    ];

    let settingsTotalBytes = 0;
    for (const key of settingKeys) {
      try {
        const snap = await getDoc(doc(db, 'settings', key));
        if (snap.exists()) {
          const val = snap.data();
          const bytes = new Blob([JSON.stringify(val)]).size || JSON.stringify(val).length;
          report.settings[key] = {
            exists: true,
            data: val,
            sizeBytes: bytes
          };
          settingsTotalBytes += bytes;
        } else {
          report.settings[key] = {
            exists: false,
            data: null,
            sizeBytes: 0
          };
        }
      } catch (e) {
        report.settings[key] = {
          exists: false,
          data: null,
          sizeBytes: 0
        };
      }
    }

    report.storageEstimateBytes = report.collections.admissions.sizeBytes +
      report.collections.feedbacks.sizeBytes +
      settingsTotalBytes;

    return report;
  } catch (error) {
    console.error('Error in getFirebaseOverview:', error);
    report.connected = false;
    report.error = String(error);
    return report;
  }
}

// Clear all records from a cloud collection
export async function clearCollectionFromCloud(collectionName: 'admissions' | 'feedbacks'): Promise<boolean> {
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    const deletePromises = snap.docs.map(d => {
      addDeletedIdTrack(d.id);
      return deleteDoc(doc(db, collectionName, d.id));
    });
    await Promise.all(deletePromises);
    console.log(`🗑️ All records cleared from Firebase Cloud collection: ${collectionName}`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, collectionName);
    return false;
  }
}

function getDeletedIdSet(): Set<string> {
  try {
    const arr = JSON.parse(localStorage.getItem('mdhss_deleted_ids') || '[]');
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function addDeletedIdTrack(id: string) {
  try {
    const set = getDeletedIdSet();
    set.add(id);
    localStorage.setItem('mdhss_deleted_ids', JSON.stringify(Array.from(set).slice(-500)));
  } catch (e) {
    console.warn('Track deleted id error:', e);
  }
}

// ==========================================
// 5. REALTIME LISTENERS & TWO-WAY SYNC
// ==========================================
let realtimeSyncStarted = false;

export function setupRealtimeCloudSync(onSyncComplete?: (status: { admissions: number; feedbacks: number }) => void) {
  if (realtimeSyncStarted) return;
  realtimeSyncStarted = true;

  // If browser is currently offline, wait until online to start realtime listeners
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const handleOnline = () => {
      window.removeEventListener('online', handleOnline);
      realtimeSyncStarted = false;
      setupRealtimeCloudSync(onSyncComplete);
    };
    window.addEventListener('online', handleOnline);
    return;
  }

  const deletedIds = getDeletedIdSet();

  // Realtime Admissions Listener
  try {
    onSnapshot(
      collection(db, 'admissions'),
      (snap) => {
        const deletedSet = getDeletedIdSet();
        const cloudAdmissions: any[] = [];
        snap.forEach((d) => {
          const data = d.data();
          if (data && data.id && !deletedSet.has(data.id)) {
            cloudAdmissions.push(data);
          }
        });
        cloudAdmissions.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
        localStorage.setItem('mdhss_admissions', JSON.stringify(cloudAdmissions));

        // Trigger UI table re-render if function exists
        if (typeof (window as any).renderAdminTables === 'function') {
          (window as any).renderAdminTables();
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'admissions');
      }
    );
  } catch (err) {
    console.warn('Realtime admissions listener warning:', err);
  }

  // Realtime Feedbacks Listener
  try {
    onSnapshot(
      collection(db, 'feedbacks'),
      (snap) => {
        const deletedSet = getDeletedIdSet();
        const cloudFeedbacks: any[] = [];
        snap.forEach((d) => {
          const data = d.data();
          if (data && data.id && !deletedSet.has(data.id)) {
            cloudFeedbacks.push(data);
          }
        });
        cloudFeedbacks.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
        localStorage.setItem('mdhss_feedbacks', JSON.stringify(cloudFeedbacks));

        if (typeof (window as any).renderAdminTables === 'function') {
          (window as any).renderAdminTables();
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'feedbacks');
      }
    );
  } catch (err) {
    console.warn('Realtime feedbacks listener warning:', err);
  }

  // Realtime Notice Popup Listener (Instant Push to all phones & devices)
  try {
    onSnapshot(
      doc(db, 'settings', 'popup_notification'),
      (snap) => {
        if (snap.exists()) {
          const noticeData = snap.data()?.data;
          if (noticeData && typeof noticeData === 'object' && noticeData.title) {
            try {
              localStorage.setItem('mdhss_popup_notification', JSON.stringify(noticeData));
            } catch (e) {}

            // Immediately notify portal runtime for instant display
            if (typeof (window as any).onRealtimeNoticeUpdate === 'function') {
              (window as any).onRealtimeNoticeUpdate(noticeData);
            } else if (typeof (window as any).applyNoticeDataToPopup === 'function') {
              (window as any).applyNoticeDataToPopup(noticeData);
            }
            if (typeof (window as any).updateAdminNoticeLiveStatus === 'function') {
              (window as any).updateAdminNoticeLiveStatus(noticeData);
            }
          } else {
            try { localStorage.removeItem('mdhss_popup_notification'); } catch (e) {}
            if (typeof (window as any).onRealtimeNoticeUpdate === 'function') {
              (window as any).onRealtimeNoticeUpdate(null);
            }
            if (typeof (window as any).updateAdminNoticeLiveStatus === 'function') {
              (window as any).updateAdminNoticeLiveStatus(null);
            }
          }
        } else {
          try { localStorage.removeItem('mdhss_popup_notification'); } catch (e) {}
          if (typeof (window as any).onRealtimeNoticeUpdate === 'function') {
            (window as any).onRealtimeNoticeUpdate(null);
          }
          if (typeof (window as any).updateAdminNoticeLiveStatus === 'function') {
            (window as any).updateAdminNoticeLiveStatus(null);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/popup_notification');
      }
    );
  } catch (err) {
    console.warn('Realtime notice listener warning:', err);
  }

  // Realtime Result Link Listener
  try {
    onSnapshot(
      doc(db, 'settings', 'result_link_config'),
      (snap) => {
        if (snap.exists() && snap.data()?.data) {
          const cfg = snap.data().data;
          localStorage.setItem('mdhss_result_link_config', JSON.stringify(cfg));
          if (typeof (window as any).applyResultLinkConfigToUI === 'function') {
            (window as any).applyResultLinkConfigToUI(cfg);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/result_link_config');
      }
    );
  } catch (err) {
    console.warn('Realtime result link listener warning:', err);
  }

  // Realtime Gallery Images Listener
  try {
    onSnapshot(
      doc(db, 'settings', 'gallery_images'),
      (snap) => {
        if (snap.exists() && snap.data()?.data && Array.isArray(snap.data().data)) {
          const gallery = snap.data().data;
          localStorage.setItem('mdhss_gallery_images', JSON.stringify(gallery));
          if (typeof (window as any).renderAutoGallery === 'function') {
            (window as any).renderAutoGallery();
          }
          if (typeof (window as any).renderAdminGalleryList === 'function') {
            (window as any).renderAdminGalleryList();
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/gallery_images');
      }
    );
  } catch (err) {
    console.warn('Realtime gallery listener warning:', err);
  }

  // Realtime Scrolling Ticker Marquee Listener
  try {
    onSnapshot(
      doc(db, 'settings', 'ticker_marquee'),
      (snap) => {
        if (snap.exists() && snap.data()?.data) {
          const tickerData = snap.data().data;
          try {
            localStorage.setItem('mdhss_ticker_marquee', JSON.stringify(tickerData));
          } catch (e) {}
          if (typeof (window as any).applyTickerSettingsToUI === 'function') {
            (window as any).applyTickerSettingsToUI(tickerData);
          }
          if (typeof (window as any).updateAdminTickerLiveStatus === 'function') {
            (window as any).updateAdminTickerLiveStatus(tickerData);
          }
        } else {
          try {
            localStorage.removeItem('mdhss_ticker_marquee');
          } catch (e) {}
          if (typeof (window as any).applyTickerSettingsToUI === 'function') {
            (window as any).applyTickerSettingsToUI(null);
          }
          if (typeof (window as any).updateAdminTickerLiveStatus === 'function') {
            (window as any).updateAdminTickerLiveStatus(null);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/ticker_marquee');
      }
    );
  } catch (err) {
    console.warn('Realtime ticker marquee listener warning:', err);
  }

  // Realtime WhatsApp Groups Listener
  try {
    onSnapshot(
      doc(db, 'settings', 'whatsapp_groups'),
      (snap) => {
        (window as any)._waFirebaseChecked = true;
        if (snap.exists() && snap.data()?.data && Array.isArray(snap.data().data)) {
          const waGroups = snap.data().data;
          localStorage.setItem('mdhss_whatsapp_groups', JSON.stringify(waGroups));
          localStorage.setItem('mdhss_wa_version', '2026_v3_links');
        } else if (!snap.exists()) {
          const seedGroups = (window as any).DEFAULT_WHATSAPP_GROUPS || [];
          if (seedGroups.length > 0) {
            saveSettingToCloud('whatsapp_groups', seedGroups).catch(() => {});
          }
        }
        if (typeof (window as any).renderPublicWhatsAppGroups === 'function') {
          (window as any).renderPublicWhatsAppGroups();
        }
        if (typeof (window as any).renderAdminWhatsAppGroups === 'function') {
          (window as any).renderAdminWhatsAppGroups();
        }
        if (typeof (window as any).renderAdminTables === 'function') {
          (window as any).renderAdminTables();
        }
      },
      (error) => {
        (window as any)._waFirebaseChecked = true;
        if (typeof (window as any).renderPublicWhatsAppGroups === 'function') {
          (window as any).renderPublicWhatsAppGroups();
        }
        handleFirestoreError(error, OperationType.GET, 'settings/whatsapp_groups');
      }
    );
  } catch (err) {
    console.warn('Realtime whatsapp groups listener warning:', err);
  }
}

// Global Cloud Object Expose for Native Portal Scripting
const mdhssCloud = {
  isAvailable: true,
  projectId: firebaseConfig.projectId,
  databaseId: firebaseConfig.firestoreDatabaseId,
  saveAdmission: saveAdmissionToCloud,
  fetchAdmissions: fetchAdmissionsFromCloud,
  deleteAdmission: deleteAdmissionFromCloud,
  saveFeedback: saveFeedbackToCloud,
  fetchFeedbacks: fetchFeedbacksFromCloud,
  deleteFeedback: deleteFeedbackFromCloud,
  saveSetting: saveSettingToCloud,
  fetchSetting: fetchSettingFromCloud,
  deleteSetting: deleteSettingFromCloud,
  clearCollection: clearCollectionFromCloud,
  setupRealtimeSync: setupRealtimeCloudSync,
  getFirebaseOverview: getFirebaseOverview,
  // Helper to push all local data to cloud (Initial migration)
  migrateAllLocalDataToCloud: async () => {
    let admCount = 0;
    let fbCount = 0;
    try {
      const localAdmissions = JSON.parse(localStorage.getItem('mdhss_admissions') || '[]');
      for (const adm of localAdmissions) {
        await saveAdmissionToCloud(adm);
        admCount++;
      }
      const localFeedbacks = JSON.parse(localStorage.getItem('mdhss_feedbacks') || '[]');
      for (const fb of localFeedbacks) {
        await saveFeedbackToCloud(fb);
        fbCount++;
      }
      const notice = JSON.parse(localStorage.getItem('mdhss_popup_notification') || 'null');
      if (notice) await saveSettingToCloud('popup_notification', notice);

      const resultCfg = JSON.parse(localStorage.getItem('mdhss_result_link_config') || 'null');
      if (resultCfg) await saveSettingToCloud('result_link_config', resultCfg);

      const gallery = JSON.parse(localStorage.getItem('mdhss_gallery_images') || 'null');
      if (gallery) await saveSettingToCloud('gallery_images', gallery);

      const ticker = JSON.parse(localStorage.getItem('mdhss_ticker_marquee') || 'null');
      if (ticker) await saveSettingToCloud('ticker_marquee', ticker);

      const waGroups = JSON.parse(localStorage.getItem('mdhss_whatsapp_groups') || 'null');
      if (waGroups && Array.isArray(waGroups)) await saveSettingToCloud('whatsapp_groups', waGroups);

      return { success: true, admissions: admCount, feedbacks: fbCount };
    } catch (e) {
      console.error('Migration error:', e);
      return { success: false, error: String(e) };
    }
  },
};

(window as any).mdhssCloud = mdhssCloud;

export default mdhssCloud;
