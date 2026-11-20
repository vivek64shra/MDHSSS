import { useSyncExternalStore } from 'react';
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
  getDocFromServer,
  deleteDoc,
  onSnapshot,
  Firestore,
  setLogLevel,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import {
  AdmissionRecord,
  DEFAULT_RESULT_LINK_CONFIG,
  DEFAULT_WHATSAPP_GROUPS,
  FeedbackRecord,
  GalleryImageItem,
  PopupNoticeConfig,
  PortalStoreSnapshot,
  ResultLinkConfig,
  sortWhatsAppGroups,
  TickerMarqueeConfig,
  WhatsAppGroupItem,
} from './types/portal';
import { syncAllPublicDom } from './services/publicSyncBridge';

// Silence noisy SDK offline warnings while preserving our structured error logger
try {
  setLogLevel('silent');
} catch {
  // Ignore if restricted
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

/**
 * Recursively strips all `undefined` values from objects and arrays before writing to Firestore.
 * Prevents Firestore `Unsupported field value: undefined` crashes on setDoc(..., { merge: true }).
 */
export function stripUndefined<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }
  if (value instanceof Date) {
    return value;
  }
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => stripUndefined(item)) as unknown as T;
  }
  if (typeof value === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (val !== undefined) {
        cleaned[key] = stripUndefined(val);
      }
    }
    return cleaned as T;
  }
  return value;
}

// Initialize Firebase App & Database (using configured firestoreDatabaseId)
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

// ==========================================
// STRUCTURED FIRESTORE ERROR HANDLER
// ==========================================
export function isOfflineError(error: unknown): boolean {
  const errMsg = error instanceof Error ? error.message : String(error);
  return (
    errMsg.includes('Could not reach Cloud Firestore') ||
    errMsg.includes('offline mode') ||
    errMsg.includes('unavailable') ||
    errMsg.includes("Backend didn't respond") ||
    errMsg.includes('the client is offline') ||
    errMsg.includes('Failed to get document because the client is offline')
  );
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  options?: { rethrow?: boolean }
): FirestoreErrorInfo {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
  };

  if (isOfflineError(error)) {
    updateStore({ connectionStatus: 'offline' });
  } else {
    const serialized = JSON.stringify(errInfo);
    console.error('Firestore Error:', serialized);
    updateStore({ lastError: `${operationType.toUpperCase()} ${path || ''}: ${errMsg}` });
    if (options?.rethrow) {
      throw new Error(serialized);
    }
  }

  return errInfo;
}

// ==========================================
// LOCALSTORAGE OFFLINE FALLBACK CACHE HELPERS
// ==========================================
function readCache<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeCache(key: string, value: unknown): void {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Ignore storage quota errors
  }
}

function getDeletedIdSet(): Set<string> {
  return new Set(readCache<string[]>('mdhss_deleted_ids', []));
}

function addDeletedIdTrack(id: string): void {
  const set = getDeletedIdSet();
  set.add(id);
  writeCache('mdhss_deleted_ids', Array.from(set).slice(-500));
}

// ==========================================
// REACTIVE REAL-TIME STORE (onSnapshot + localStorage fallback)
// ==========================================
const initialAdmissions = readCache<AdmissionRecord[]>('mdhss_admissions', []);
const initialFeedbacks = readCache<FeedbackRecord[]>('mdhss_feedbacks', []);
const initialWhatsApp = sortWhatsAppGroups(
  readCache<WhatsAppGroupItem[]>('mdhss_whatsapp_groups', DEFAULT_WHATSAPP_GROUPS)
);
const initialGallery = readCache<GalleryImageItem[]>('mdhss_gallery_images', []);
const initialResultCfg: ResultLinkConfig = {
  ...DEFAULT_RESULT_LINK_CONFIG,
  ...readCache<Partial<ResultLinkConfig>>('mdhss_result_link_config', {}),
};

let storeState: PortalStoreSnapshot = {
  admissions: initialAdmissions,
  feedbacks: initialFeedbacks,
  // Notice & Ticker start null until Firebase verifies (prevents stale/dummy flash!)
  popupNotice: null,
  tickerMarquee: null,
  whatsappGroups: initialWhatsApp,
  galleryImages: initialGallery,
  resultLinkConfig: initialResultCfg,
  ready: {
    admissions: false,
    feedbacks: false,
    popupNotice: false,
    tickerMarquee: false,
    whatsappGroups: false,
    galleryImages: false,
    resultLinkConfig: false,
  },
  connectionStatus: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'checking',
  lastSyncAt: null,
  lastError: null,
};

const listeners = new Set<() => void>();

function emitStoreChange() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.warn('Store subscriber error:', e);
    }
  });
  if (typeof document !== 'undefined') {
    syncAllPublicDom(storeState);
  }
}

function updateStore(partial: Partial<PortalStoreSnapshot>) {
  storeState = {
    ...storeState,
    ...partial,
    ready: partial.ready ? { ...storeState.ready, ...partial.ready } : storeState.ready,
  };
  emitStoreChange();
}

export function getPortalSnapshot(): PortalStoreSnapshot {
  return storeState;
}

export function subscribePortalStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function usePortalStore(): PortalStoreSnapshot {
  return useSyncExternalStore(subscribePortalStore, getPortalSnapshot, getPortalSnapshot);
}

// ==========================================
// STARTUP CONNECTION VALIDATION
// ==========================================
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    updateStore({ connectionStatus: 'online', lastSyncAt: new Date().toISOString() });
    return true;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn('Firestore offline fallback active — using localStorage cache.');
      hydrateOfflineFallback();
      updateStore({ connectionStatus: 'offline' });
      return false;
    }
    // Non-offline error (e.g., missing test/connection doc) still means network reached Firestore
    updateStore({ connectionStatus: 'online' });
    return true;
  }
}

function hydrateOfflineFallback() {
  const cachedNotice = readCache<PopupNoticeConfig | null>('mdhss_popup_notification', null);
  const cachedTicker = readCache<TickerMarqueeConfig | null>('mdhss_ticker_marquee', null);
  const cachedWa = sortWhatsAppGroups(
    readCache<WhatsAppGroupItem[]>('mdhss_whatsapp_groups', DEFAULT_WHATSAPP_GROUPS)
  );
  updateStore({
    popupNotice: cachedNotice,
    tickerMarquee: cachedTicker,
    whatsappGroups: cachedWa,
    ready: {
      admissions: true,
      feedbacks: true,
      popupNotice: true,
      tickerMarquee: true,
      whatsappGroups: true,
      galleryImages: true,
      resultLinkConfig: true,
    },
  });
}

// ==========================================
// 1. ADMISSION INQUIRIES (stripUndefined + setDoc merge:true)
// ==========================================
export async function saveAdmissionToCloud(data: Partial<AdmissionRecord>): Promise<boolean> {
  const id = data.id || `ADM-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`;
  const payload = stripUndefined({
    ...data,
    id,
    formType: data.formType || 'Admission',
    date: data.date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    updatedAt: new Date().toISOString(),
  }) as AdmissionRecord;

  // Optimistic local cache update
  const nextList = [payload, ...storeState.admissions.filter((a) => a.id !== id)];
  writeCache('mdhss_admissions', nextList);
  updateStore({ admissions: nextList });

  const docRef = doc(db, 'admissions', id);
  try {
    await setDoc(docRef, stripUndefined(payload), { merge: true });
    updateStore({ connectionStatus: 'online', lastSyncAt: new Date().toISOString(), lastError: null });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `admissions/${id}`);
    return false;
  }
}

export async function fetchAdmissionsFromCloud(): Promise<AdmissionRecord[]> {
  try {
    const snap = await getDocs(collection(db, 'admissions'));
    const deletedSet = getDeletedIdSet();
    const list: AdmissionRecord[] = [];
    snap.forEach((d) => {
      const data = d.data() as AdmissionRecord;
      const id = data.id || d.id;
      if (!deletedSet.has(id)) {
        list.push({ ...data, id });
      }
    });
    list.sort((a, b) => (b.updatedAt || b.id || '').localeCompare(a.updatedAt || a.id || ''));
    writeCache('mdhss_admissions', list);
    updateStore({
      admissions: list,
      ready: { ...storeState.ready, admissions: true },
      connectionStatus: 'online',
      lastSyncAt: new Date().toISOString(),
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'admissions');
    return storeState.admissions;
  }
}

export async function deleteAdmissionFromCloud(id: string): Promise<boolean> {
  addDeletedIdTrack(id);
  const nextList = storeState.admissions.filter((a) => a.id !== id);
  writeCache('mdhss_admissions', nextList);
  updateStore({ admissions: nextList });

  try {
    await deleteDoc(doc(db, 'admissions', id));
    updateStore({ connectionStatus: 'online', lastSyncAt: new Date().toISOString(), lastError: null });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `admissions/${id}`);
    return false;
  }
}

// ==========================================
// 2. FEEDBACK SUBMISSIONS (stripUndefined + setDoc merge:true)
// ==========================================
export async function saveFeedbackToCloud(data: Partial<FeedbackRecord>): Promise<boolean> {
  const id = data.id || `FB-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`;
  const payload = stripUndefined({
    ...data,
    id,
    formType: data.formType || 'Feedback',
    date: data.date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    updatedAt: new Date().toISOString(),
  }) as FeedbackRecord;

  const nextList = [payload, ...storeState.feedbacks.filter((f) => f.id !== id)];
  writeCache('mdhss_feedbacks', nextList);
  updateStore({ feedbacks: nextList });

  const docRef = doc(db, 'feedbacks', id);
  try {
    await setDoc(docRef, stripUndefined(payload), { merge: true });
    updateStore({ connectionStatus: 'online', lastSyncAt: new Date().toISOString(), lastError: null });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `feedbacks/${id}`);
    return false;
  }
}

export async function fetchFeedbacksFromCloud(): Promise<FeedbackRecord[]> {
  try {
    const snap = await getDocs(collection(db, 'feedbacks'));
    const deletedSet = getDeletedIdSet();
    const list: FeedbackRecord[] = [];
    snap.forEach((d) => {
      const data = d.data() as FeedbackRecord;
      const id = data.id || d.id;
      if (!deletedSet.has(id)) {
        list.push({ ...data, id });
      }
    });
    list.sort((a, b) => (b.updatedAt || b.id || '').localeCompare(a.updatedAt || a.id || ''));
    writeCache('mdhss_feedbacks', list);
    updateStore({
      feedbacks: list,
      ready: { ...storeState.ready, feedbacks: true },
      connectionStatus: 'online',
      lastSyncAt: new Date().toISOString(),
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'feedbacks');
    return storeState.feedbacks;
  }
}

export async function deleteFeedbackFromCloud(id: string): Promise<boolean> {
  addDeletedIdTrack(id);
  const nextList = storeState.feedbacks.filter((f) => f.id !== id);
  writeCache('mdhss_feedbacks', nextList);
  updateStore({ feedbacks: nextList });

  try {
    await deleteDoc(doc(db, 'feedbacks', id));
    updateStore({ connectionStatus: 'online', lastSyncAt: new Date().toISOString(), lastError: null });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `feedbacks/${id}`);
    return false;
  }
}

// ==========================================
// 3. SETTINGS & ADMIN CONFIGURATIONS (stripUndefined + setDoc merge:true)
// ==========================================
export type SettingKey =
  | 'popup_notification'
  | 'ticker_marquee'
  | 'whatsapp_groups'
  | 'gallery_images'
  | 'result_link_config'
  | string;

function applyLocalSettingUpdate(key: SettingKey, data: any) {
  if (key === 'popup_notification') {
    writeCache('mdhss_popup_notification', data);
    updateStore({
      popupNotice: data || null,
      ready: { ...storeState.ready, popupNotice: true },
    });
  } else if (key === 'ticker_marquee') {
    writeCache('mdhss_ticker_marquee', data);
    updateStore({
      tickerMarquee: data || null,
      ready: { ...storeState.ready, tickerMarquee: true },
    });
  } else if (key === 'whatsapp_groups') {
    const sorted = Array.isArray(data) ? sortWhatsAppGroups(data) : [];
    writeCache('mdhss_whatsapp_groups', sorted);
    updateStore({
      whatsappGroups: sorted,
      ready: { ...storeState.ready, whatsappGroups: true },
    });
  } else if (key === 'gallery_images') {
    const imgs = Array.isArray(data) ? data : [];
    writeCache('mdhss_gallery_images', imgs);
    updateStore({
      galleryImages: imgs,
      ready: { ...storeState.ready, galleryImages: true },
    });
  } else if (key === 'result_link_config') {
    const cfg: ResultLinkConfig = {
      ...DEFAULT_RESULT_LINK_CONFIG,
      ...(data || {}),
    };
    writeCache('mdhss_result_link_config', cfg);
    updateStore({
      resultLinkConfig: cfg,
      ready: { ...storeState.ready, resultLinkConfig: true },
    });
  }
}

export async function saveSettingToCloud(key: SettingKey, rawData: any): Promise<boolean> {
  const docRef = doc(db, 'settings', key);
  try {
    if (rawData === null || rawData === undefined) {
      applyLocalSettingUpdate(key, null);
      await deleteDoc(docRef);
      updateStore({ connectionStatus: 'online', lastSyncAt: new Date().toISOString(), lastError: null });
      return true;
    }

    const cleanedData = stripUndefined(
      key === 'whatsapp_groups' && Array.isArray(rawData) ? sortWhatsAppGroups(rawData) : rawData
    );
    applyLocalSettingUpdate(key, cleanedData);

    const payload = stripUndefined({
      data: cleanedData,
      updatedAt: new Date().toISOString(),
    });

    await setDoc(docRef, payload, { merge: true });
    updateStore({ connectionStatus: 'online', lastSyncAt: new Date().toISOString(), lastError: null });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `settings/${key}`);
    return false;
  }
}

export async function deleteSettingFromCloud(key: SettingKey): Promise<boolean> {
  applyLocalSettingUpdate(key, null);
  try {
    await deleteDoc(doc(db, 'settings', key));
    updateStore({ connectionStatus: 'online', lastSyncAt: new Date().toISOString(), lastError: null });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `settings/${key}`);
    return false;
  }
}

export async function fetchSettingFromCloud(key: SettingKey): Promise<any | null> {
  try {
    const snap = await getDoc(doc(db, 'settings', key));
    if (snap.exists()) {
      const val = snap.data()?.data ?? null;
      applyLocalSettingUpdate(key, val);
      return val;
    }
    applyLocalSettingUpdate(key, null);
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `settings/${key}`);
    // Offline fallback
    if (key === 'popup_notification') return readCache('mdhss_popup_notification', null);
    if (key === 'ticker_marquee') return readCache('mdhss_ticker_marquee', null);
    if (key === 'whatsapp_groups') return readCache('mdhss_whatsapp_groups', DEFAULT_WHATSAPP_GROUPS);
    if (key === 'gallery_images') return readCache('mdhss_gallery_images', []);
    if (key === 'result_link_config') return readCache('mdhss_result_link_config', DEFAULT_RESULT_LINK_CONFIG);
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
  databaseId: string;
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
    databaseId: firebaseConfig.firestoreDatabaseId,
    collections: {
      admissions: { count: 0, items: [], sizeBytes: 0 },
      feedbacks: { count: 0, items: [], sizeBytes: 0 },
    },
    settings: {},
    storageEstimateBytes: 0,
    timestamp: new Date().toISOString(),
  };

  try {
    const [admSnap, fbSnap] = await Promise.all([
      getDocs(collection(db, 'admissions')),
      getDocs(collection(db, 'feedbacks')),
    ]);

    const admissions: any[] = [];
    admSnap.forEach((d) => admissions.push({ id: d.id, ...d.data() }));
    const admBytes = new Blob([JSON.stringify(admissions)]).size;
    report.collections.admissions = { count: admissions.length, items: admissions, sizeBytes: admBytes };

    const feedbacks: any[] = [];
    fbSnap.forEach((d) => feedbacks.push({ id: d.id, ...d.data() }));
    const fbBytes = new Blob([JSON.stringify(feedbacks)]).size;
    report.collections.feedbacks = { count: feedbacks.length, items: feedbacks, sizeBytes: fbBytes };

    const settingKeys = [
      'popup_notification',
      'ticker_marquee',
      'whatsapp_groups',
      'gallery_images',
      'result_link_config',
    ];

    let settingsTotalBytes = 0;
    await Promise.all(
      settingKeys.map(async (key) => {
        try {
          const snap = await getDoc(doc(db, 'settings', key));
          if (snap.exists()) {
            const val = snap.data();
            const bytes = new Blob([JSON.stringify(val)]).size;
            report.settings[key] = { exists: true, data: val, sizeBytes: bytes };
            settingsTotalBytes += bytes;
          } else {
            report.settings[key] = { exists: false, data: null, sizeBytes: 0 };
          }
        } catch {
          report.settings[key] = { exists: false, data: null, sizeBytes: 0 };
        }
      })
    );

    report.storageEstimateBytes = admBytes + fbBytes + settingsTotalBytes;
    updateStore({ connectionStatus: 'online', lastSyncAt: report.timestamp });
    return report;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'overview');
    report.connected = false;
    report.error = error instanceof Error ? error.message : String(error);
    return report;
  }
}

export async function clearCollectionFromCloud(collectionName: 'admissions' | 'feedbacks'): Promise<boolean> {
  if (collectionName === 'admissions') {
    storeState.admissions.forEach((a) => addDeletedIdTrack(a.id));
    writeCache('mdhss_admissions', []);
    updateStore({ admissions: [] });
  } else {
    storeState.feedbacks.forEach((f) => addDeletedIdTrack(f.id));
    writeCache('mdhss_feedbacks', []);
    updateStore({ feedbacks: [] });
  }

  try {
    const snap = await getDocs(collection(db, collectionName));
    await Promise.all(
      snap.docs.map((d) => {
        addDeletedIdTrack(d.id);
        return deleteDoc(doc(db, collectionName, d.id));
      })
    );
    updateStore({ connectionStatus: 'online', lastSyncAt: new Date().toISOString(), lastError: null });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, collectionName);
    return false;
  }
}

export async function refreshAllFromCloud(): Promise<boolean> {
  try {
    await Promise.all([
      fetchAdmissionsFromCloud(),
      fetchFeedbacksFromCloud(),
      fetchSettingFromCloud('popup_notification'),
      fetchSettingFromCloud('ticker_marquee'),
      fetchSettingFromCloud('whatsapp_groups'),
      fetchSettingFromCloud('gallery_images'),
      fetchSettingFromCloud('result_link_config'),
    ]);
    updateStore({ connectionStatus: 'online', lastSyncAt: new Date().toISOString(), lastError: null });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'refreshAll');
    return false;
  }
}

// ==========================================
// 5. REAL-TIME LIVE LISTENERS (onSnapshot)
// ==========================================
let realtimeSyncStarted = false;
let activeUnsubscribers: Unsubscribe[] = [];

export function stopRealtimeCloudSync() {
  activeUnsubscribers.forEach((unsub) => {
    try {
      unsub();
    } catch {
      // ignore
    }
  });
  activeUnsubscribers = [];
  realtimeSyncStarted = false;
}

export function setupRealtimeCloudSync() {
  if (realtimeSyncStarted) return;
  realtimeSyncStarted = true;

  // Startup connection validation
  testConnection();

  // Monitor browser online/offline transitions
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      updateStore({ connectionStatus: 'checking' });
      testConnection();
      refreshAllFromCloud();
    });
    window.addEventListener('offline', () => {
      hydrateOfflineFallback();
      updateStore({ connectionStatus: 'offline' });
    });

    if (!navigator.onLine) {
      hydrateOfflineFallback();
      updateStore({ connectionStatus: 'offline' });
    }
  }

  // Fallback timeout in case network is slow so public WhatsApp cards never stay stuck loading
  setTimeout(() => {
    if (!storeState.ready.whatsappGroups) {
      updateStore({
        ready: { ...storeState.ready, whatsappGroups: true },
      });
    }
  }, 2000);

  // 1. Live Admissions Listener
  try {
    const unsubAdm = onSnapshot(
      collection(db, 'admissions'),
      (snap) => {
        const deletedSet = getDeletedIdSet();
        const cloudAdmissions: AdmissionRecord[] = [];
        snap.forEach((d) => {
          const data = d.data() as AdmissionRecord;
          const id = data?.id || d.id;
          if (data && !deletedSet.has(id)) {
            cloudAdmissions.push({ ...data, id });
          }
        });
        cloudAdmissions.sort((a, b) => (b.updatedAt || b.id || '').localeCompare(a.updatedAt || a.id || ''));
        writeCache('mdhss_admissions', cloudAdmissions);
        updateStore({
          admissions: cloudAdmissions,
          ready: { ...storeState.ready, admissions: true },
          connectionStatus: 'online',
          lastSyncAt: new Date().toISOString(),
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'admissions');
        updateStore({ ready: { ...storeState.ready, admissions: true } });
      }
    );
    activeUnsubscribers.push(unsubAdm);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'admissions');
  }

  // 2. Live Feedbacks Listener
  try {
    const unsubFb = onSnapshot(
      collection(db, 'feedbacks'),
      (snap) => {
        const deletedSet = getDeletedIdSet();
        const cloudFeedbacks: FeedbackRecord[] = [];
        snap.forEach((d) => {
          const data = d.data() as FeedbackRecord;
          const id = data?.id || d.id;
          if (data && !deletedSet.has(id)) {
            cloudFeedbacks.push({ ...data, id });
          }
        });
        cloudFeedbacks.sort((a, b) => (b.updatedAt || b.id || '').localeCompare(a.updatedAt || a.id || ''));
        writeCache('mdhss_feedbacks', cloudFeedbacks);
        updateStore({
          feedbacks: cloudFeedbacks,
          ready: { ...storeState.ready, feedbacks: true },
          connectionStatus: 'online',
          lastSyncAt: new Date().toISOString(),
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'feedbacks');
        updateStore({ ready: { ...storeState.ready, feedbacks: true } });
      }
    );
    activeUnsubscribers.push(unsubFb);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'feedbacks');
  }

  // 3. Live Popup Notification Listener (instant push to all mobile & desktop visitors)
  try {
    const unsubNotice = onSnapshot(
      doc(db, 'settings', 'popup_notification'),
      (snap) => {
        const noticeData = snap.exists() ? (snap.data()?.data as PopupNoticeConfig | undefined) : null;
        const valid = noticeData && typeof noticeData === 'object' && noticeData.title ? noticeData : null;
        writeCache('mdhss_popup_notification', valid);
        updateStore({
          popupNotice: valid,
          ready: { ...storeState.ready, popupNotice: true },
          connectionStatus: 'online',
          lastSyncAt: new Date().toISOString(),
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/popup_notification');
        const fallback = readCache<PopupNoticeConfig | null>('mdhss_popup_notification', null);
        updateStore({
          popupNotice: fallback,
          ready: { ...storeState.ready, popupNotice: true },
        });
      }
    );
    activeUnsubscribers.push(unsubNotice);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'settings/popup_notification');
  }

  // 4. Live Ticker Marquee Listener
  try {
    const unsubTicker = onSnapshot(
      doc(db, 'settings', 'ticker_marquee'),
      (snap) => {
        const tickerData = snap.exists() ? (snap.data()?.data as TickerMarqueeConfig | undefined) : null;
        const valid = tickerData && typeof tickerData === 'object' ? tickerData : null;
        writeCache('mdhss_ticker_marquee', valid);
        updateStore({
          tickerMarquee: valid,
          ready: { ...storeState.ready, tickerMarquee: true },
          connectionStatus: 'online',
          lastSyncAt: new Date().toISOString(),
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/ticker_marquee');
        const fallback = readCache<TickerMarqueeConfig | null>('mdhss_ticker_marquee', null);
        updateStore({
          tickerMarquee: fallback,
          ready: { ...storeState.ready, tickerMarquee: true },
        });
      }
    );
    activeUnsubscribers.push(unsubTicker);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'settings/ticker_marquee');
  }

  // 5. Live WhatsApp Groups Listener (strict class hierarchy sorting, never overwrites Firebase data!)
  try {
    const unsubWa = onSnapshot(
      doc(db, 'settings', 'whatsapp_groups'),
      (snap) => {
        (window as any)._waFirebaseChecked = true;
        if (snap.exists() && Array.isArray(snap.data()?.data)) {
          const sorted = sortWhatsAppGroups(snap.data().data as WhatsAppGroupItem[]);
          writeCache('mdhss_whatsapp_groups', sorted);
          updateStore({
            whatsappGroups: sorted,
            ready: { ...storeState.ready, whatsappGroups: true },
            connectionStatus: 'online',
            lastSyncAt: new Date().toISOString(),
          });
        } else if (!snap.exists()) {
          // Seed only if document does not exist in Firestore yet
          const seeded = sortWhatsAppGroups(DEFAULT_WHATSAPP_GROUPS);
          writeCache('mdhss_whatsapp_groups', seeded);
          updateStore({
            whatsappGroups: seeded,
            ready: { ...storeState.ready, whatsappGroups: true },
            connectionStatus: 'online',
          });
          saveSettingToCloud('whatsapp_groups', seeded).catch(() => {});
        } else {
          updateStore({ ready: { ...storeState.ready, whatsappGroups: true } });
        }
      },
      (error) => {
        (window as any)._waFirebaseChecked = true;
        handleFirestoreError(error, OperationType.GET, 'settings/whatsapp_groups');
        const fallback = sortWhatsAppGroups(
          readCache<WhatsAppGroupItem[]>('mdhss_whatsapp_groups', DEFAULT_WHATSAPP_GROUPS)
        );
        updateStore({
          whatsappGroups: fallback,
          ready: { ...storeState.ready, whatsappGroups: true },
        });
      }
    );
    activeUnsubscribers.push(unsubWa);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'settings/whatsapp_groups');
  }

  // 6. Live Gallery Images Listener
  try {
    const unsubGallery = onSnapshot(
      doc(db, 'settings', 'gallery_images'),
      (snap) => {
        const gallery =
          snap.exists() && Array.isArray(snap.data()?.data)
            ? (snap.data().data as GalleryImageItem[])
            : [];
        writeCache('mdhss_gallery_images', gallery);
        updateStore({
          galleryImages: gallery,
          ready: { ...storeState.ready, galleryImages: true },
          connectionStatus: 'online',
          lastSyncAt: new Date().toISOString(),
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/gallery_images');
        updateStore({ ready: { ...storeState.ready, galleryImages: true } });
      }
    );
    activeUnsubscribers.push(unsubGallery);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'settings/gallery_images');
  }

  // 7. Live Result Link Config Listener
  try {
    const unsubResult = onSnapshot(
      doc(db, 'settings', 'result_link_config'),
      (snap) => {
        const raw = snap.exists() ? (snap.data()?.data as Partial<ResultLinkConfig> | undefined) : null;
        const merged: ResultLinkConfig = {
          ...DEFAULT_RESULT_LINK_CONFIG,
          ...(raw || {}),
        };
        if (merged.url && merged.url.includes('online.edumentsolution.com')) {
          merged.url = DEFAULT_RESULT_LINK_CONFIG.url;
        }
        writeCache('mdhss_result_link_config', merged);
        updateStore({
          resultLinkConfig: merged,
          ready: { ...storeState.ready, resultLinkConfig: true },
          connectionStatus: 'online',
          lastSyncAt: new Date().toISOString(),
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/result_link_config');
        updateStore({ ready: { ...storeState.ready, resultLinkConfig: true } });
      }
    );
    activeUnsubscribers.push(unsubResult);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'settings/result_link_config');
  }
}

// Global Cloud Bridge for legacy public forms & page navigation hooks
const mdhssCloud = {
  isAvailable: true,
  projectId: firebaseConfig.projectId,
  databaseId: firebaseConfig.firestoreDatabaseId,
  stripUndefined,
  testConnection,
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
  refreshAllFromCloud,
  setupRealtimeSync: setupRealtimeCloudSync,
  getFirebaseOverview,
  getSnapshot: getPortalSnapshot,
  syncPublicDomNow: () => syncAllPublicDom(storeState),
};

if (typeof window !== 'undefined') {
  (window as any).mdhssCloud = mdhssCloud;
}

export default mdhssCloud;
