import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

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
  operation: OperationType;
  path: string | null;
  authInfo: {
    userId: string | null;
    email: string | null;
    emailVerified: boolean | null;
    isAnonymous: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operation: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operation,
    path,
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    },
  };
  console.warn('Firestore Operation Notification:', JSON.stringify(errInfo));
  return errInfo;
}

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Explicitly bind the configured Firestore Database ID
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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
    await setDoc(docRef, { data, updatedAt: new Date().toISOString() }, { merge: true });
    console.log('✅ Setting saved to Firebase Cloud:', key);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `settings/${key}`);
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
// 4. EXAMINATION MARKS SHEETS
// ==========================================
export async function saveMarksSheetToCloud(sheet: any): Promise<boolean> {
  const id = sheet.id || `MS-${sheet.class || 'general'}-${sheet.examType || 'exam'}-${Date.now()}`;
  const docRef = doc(db, 'marks_sheets', id);
  try {
    await setDoc(docRef, { ...sheet, id, updatedAt: new Date().toISOString() }, { merge: true });
    console.log('✅ Marks sheet saved to Firebase Cloud:', id);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `marks_sheets/${id}`);
    return false;
  }
}

export async function fetchMarksSheetsFromCloud(): Promise<any[]> {
  try {
    const colRef = collection(db, 'marks_sheets');
    const snap = await getDocs(colRef);
    const list: any[] = [];
    snap.forEach((d) => {
      list.push(d.data());
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'marks_sheets');
    return [];
  }
}

export async function deleteMarksSheetFromCloud(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'marks_sheets', id));
    console.log('🗑️ Marks sheet deleted from Firebase Cloud:', id);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `marks_sheets/${id}`);
    return false;
  }
}

// ==========================================
// 5. REALTIME LISTENERS & TWO-WAY SYNC
// ==========================================
export function setupRealtimeCloudSync(onSyncComplete?: (status: { admissions: number; feedbacks: number }) => void) {
  // Realtime Admissions Listener
  try {
    onSnapshot(
      collection(db, 'admissions'),
      (snap) => {
        const cloudAdmissions: any[] = [];
        snap.forEach((d) => cloudAdmissions.push(d.data()));
        if (cloudAdmissions.length > 0) {
          // Merge with localStorage
          const localAdmissions = JSON.parse(localStorage.getItem('mdhss_admissions') || '[]');
          const mergedMap = new Map();
          // Local first, cloud overwrites with authoritative latest
          localAdmissions.forEach((item: any) => { if (item.id) mergedMap.set(item.id, item); });
          cloudAdmissions.forEach((item: any) => { if (item.id) mergedMap.set(item.id, item); });
          const merged = Array.from(mergedMap.values()).sort((a: any, b: any) => {
            return (b.id || '').localeCompare(a.id || '');
          });
          localStorage.setItem('mdhss_admissions', JSON.stringify(merged));

          // Trigger UI table re-render if function exists
          if (typeof (window as any).renderAdminTables === 'function') {
            (window as any).renderAdminTables();
          }
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
        const cloudFeedbacks: any[] = [];
        snap.forEach((d) => cloudFeedbacks.push(d.data()));
        if (cloudFeedbacks.length > 0) {
          const localFeedbacks = JSON.parse(localStorage.getItem('mdhss_feedbacks') || '[]');
          const mergedMap = new Map();
          localFeedbacks.forEach((item: any) => { if (item.id) mergedMap.set(item.id, item); });
          cloudFeedbacks.forEach((item: any) => { if (item.id) mergedMap.set(item.id, item); });
          const merged = Array.from(mergedMap.values()).sort((a: any, b: any) => {
            return (b.id || '').localeCompare(a.id || '');
          });
          localStorage.setItem('mdhss_feedbacks', JSON.stringify(merged));

          if (typeof (window as any).renderAdminTables === 'function') {
            (window as any).renderAdminTables();
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'feedbacks');
      }
    );
  } catch (err) {
    console.warn('Realtime feedbacks listener warning:', err);
  }

  // Realtime Notice Popup Listener
  try {
    onSnapshot(
      doc(db, 'settings', 'popup_notification'),
      (snap) => {
        if (snap.exists() && snap.data()?.data) {
          const noticeData = snap.data().data;
          localStorage.setItem('mdhss_popup_notification', JSON.stringify(noticeData));
          if (typeof (window as any).applyNoticeDataToPopup === 'function') {
            (window as any).applyNoticeDataToPopup(noticeData);
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

  // Realtime Marks Sheets Listener
  try {
    onSnapshot(
      collection(db, 'marks_sheets'),
      (snap) => {
        const cloudSheets: any[] = [];
        snap.forEach((d) => cloudSheets.push(d.data()));
        if (cloudSheets.length > 0) {
          const localSheets = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
          const mergedMap = new Map();
          localSheets.forEach((s: any) => { if (s.id) mergedMap.set(s.id, s); });
          cloudSheets.forEach((s: any) => { if (s.id) mergedMap.set(s.id, s); });
          const merged = Array.from(mergedMap.values());
          localStorage.setItem('mdhss_marks_sheets', JSON.stringify(merged));

          if (typeof (window as any).renderAdminTables === 'function') {
            (window as any).renderAdminTables();
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'marks_sheets');
      }
    );
  } catch (err) {
    console.warn('Realtime marks sheets listener warning:', err);
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
  saveMarksSheet: saveMarksSheetToCloud,
  fetchMarksSheets: fetchMarksSheetsFromCloud,
  deleteMarksSheet: deleteMarksSheetFromCloud,
  setupRealtimeSync: setupRealtimeCloudSync,
  // Helper to push all local data to cloud (Initial migration)
  migrateAllLocalDataToCloud: async () => {
    let admCount = 0;
    let fbCount = 0;
    let msCount = 0;
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
      const localMarks = JSON.parse(localStorage.getItem('mdhss_marks_sheets') || '[]');
      for (const ms of localMarks) {
        await saveMarksSheetToCloud(ms);
        msCount++;
      }
      const notice = JSON.parse(localStorage.getItem('mdhss_popup_notification') || 'null');
      if (notice) await saveSettingToCloud('popup_notification', notice);

      const resultCfg = JSON.parse(localStorage.getItem('mdhss_result_link_config') || 'null');
      if (resultCfg) await saveSettingToCloud('result_link_config', resultCfg);

      const gallery = JSON.parse(localStorage.getItem('mdhss_gallery_images') || 'null');
      if (gallery) await saveSettingToCloud('gallery_images', gallery);

      return { success: true, admissions: admCount, feedbacks: fbCount, marks: msCount };
    } catch (e) {
      console.error('Migration error:', e);
      return { success: false, error: String(e) };
    }
  },
};

(window as any).mdhssCloud = mdhssCloud;

export default mdhssCloud;
