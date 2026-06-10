import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, User as FirebaseUser } from 'firebase/auth';
import { 
  getFirestore, doc, getDocFromServer, collection, getDocs, getDoc, 
  setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  Book,
  Quote,
  TeamMember,
  TimelineEvent,
  ContactMessage,
  Member,
  Manuscript,
  PublishingPackage,
  PackageInquiry,
  Testimonial,
  PublishingPartner,
  AppSettings,
  UserProfile,
  GalleryItem
} from '../types';
import * as DEFAULTS from '../data/defaults';

// Enumerations for error throwing as required by Firebase Skill
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
  }
}

// Global safety error utility
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, activeAuth: any) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: activeAuth?.currentUser?.uid || null,
      email: activeAuth?.currentUser?.email || null,
      emailVerified: activeAuth?.currentUser?.emailVerified || null,
      isAnonymous: activeAuth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error recorded: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Configuration Check & Dynamic Initialization
let firebaseApp: any = null;
export let db: any = null;
export let auth: any = null;
export let isFirebaseEnabled = false;

try {
  if (firebaseConfig && firebaseConfig.apiKey) {
    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(firebaseApp);
    isFirebaseEnabled = true;

    // Validate connection is online as required in Firebase Skill Instructions
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('offline')) {
          console.warn("Firebase client is offline. Check your Firebase configuration.");
        }
      }
    };
    testConnection();
  }
} catch (e) {
  console.log('Firebase configuration not initialized, using persistent fallback storage engine.', e);
}

// --- LOCAL STORAGE ENGINE BACKDROP ---
// This guarantees we have a complete backend experience immediately
const LS_KEYS = {
  BOOKS: 'fatima_books',
  QUOTES: 'fatima_quotes',
  TEAM: 'fatima_team',
  TIMELINE: 'fatima_timeline',
  MESSAGES: 'fatima_messages',
  MEMBERS: 'fatima_members',
  MANUSCRIPTS: 'fatima_manuscripts',
  PACKAGES: 'fatima_packages',
  INQUIRIES: 'fatima_inquiries',
  TESTIMONIALS: 'fatima_testimonials',
  PARTNERS: 'fatima_partners',
  SETTINGS: 'fatima_settings',
  ADMIN_USER: 'fatima_admin_user',
  USERS: 'fatima_users',
  GALLERY: 'fatima_gallery'
};

function getLS<T>(key: string, defaultVal: T): T {
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(val) as T;
  } catch {
    return defaultVal;
  }
}

function setLS<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Initial Seeding for LocalStorage fallback
export const initializeLocalStorage = () => {
  getLS<Book[]>(LS_KEYS.BOOKS, DEFAULTS.DEFAULT_BOOKS);
  getLS<Quote[]>(LS_KEYS.QUOTES, DEFAULTS.DEFAULT_QUOTES);
  getLS<TeamMember[]>(LS_KEYS.TEAM, DEFAULTS.DEFAULT_TEAM);
  getLS<TimelineEvent[]>(LS_KEYS.TIMELINE, DEFAULTS.DEFAULT_TIMELINE);
  getLS<PublishingPackage[]>(LS_KEYS.PACKAGES, DEFAULTS.DEFAULT_PACKAGES);
  getLS<Testimonial[]>(LS_KEYS.TESTIMONIALS, DEFAULTS.DEFAULT_TESTIMONIALS);
  getLS<PublishingPartner[]>(LS_KEYS.PARTNERS, DEFAULTS.DEFAULT_PARTNERS);
  getLS<AppSettings>(LS_KEYS.SETTINGS, DEFAULTS.DEFAULT_SETTINGS);
  getLS<UserProfile[]>(LS_KEYS.USERS, DEFAULTS.DEFAULT_USERS);
  getLS<GalleryItem[]>(LS_KEYS.GALLERY, DEFAULTS.DEFAULT_GALLERY);
  getLS<any[]>('fatima_hero_slides', DEFAULTS.DEFAULT_HERO_SLIDES);
  getLS<ContactMessage[]>(LS_KEYS.MESSAGES, []);
  getLS<Member[]>(LS_KEYS.MEMBERS, []);
  getLS<Manuscript[]>(LS_KEYS.MANUSCRIPTS, []);
  getLS<PackageInquiry[]>(LS_KEYS.INQUIRIES, []);
};

initializeLocalStorage();

const collectionToLSKey = (collectionName: string): string => {
  const map: Record<string, string> = {
    books: 'fatima_books',
    quotes: 'fatima_quotes',
    teamMembers: 'fatima_team',
    timelineEvents: 'fatima_timeline',
    publishingPartners: 'fatima_partners',
    contactMessages: 'fatima_messages',
    members: 'fatima_members',
    manuscripts: 'fatima_manuscripts',
    publishingPackages: 'fatima_packages',
    packageInquiries: 'fatima_inquiries',
    testimonials: 'fatima_testimonials',
    settings: 'fatima_settings',
    users: 'fatima_users',
    gallery: 'fatima_gallery'
  };
  return map[collectionName] || `fatima_${collectionName}`;
};

let isSimulationMode = localStorage.getItem('fatima_simulation_enabled') === 'true';

export const setSimulationMode = (enabled: boolean) => {
  isSimulationMode = enabled;
  localStorage.setItem('fatima_simulation_enabled', enabled ? 'true' : 'false');
};

export const getSimulationMode = (): boolean => {
  return isSimulationMode;
};

export const isUserFirebaseAdmin = (): boolean => {
  if (!isFirebaseEnabled || !auth) return false;
  return auth.currentUser?.email === 'mohd.fahad98871@gmail.com';
};

const isRestrictedCollection = (collectionName: string): boolean => {
  return ['contactMessages', 'members', 'manuscripts', 'packageInquiries', 'users'].includes(collectionName);
};

// Generic Firestore Helpers with auto-fallback and auto-seeding
async function getCollection<T>(collectionName: string, defaultData: T[]): Promise<T[]> {
  const isAuthAdmin = isUserFirebaseAdmin();
  const isRestricted = isRestrictedCollection(collectionName);
  const isSimulatedOnly = isSimulationMode && !isAuthAdmin;

  if (isFirebaseEnabled && db && !isSimulatedOnly) {
    if (!isRestricted || isAuthAdmin) {
      try {
        const snap = await getDocs(collection(db, collectionName));
        const list: T[] = [];
        snap.forEach(d => list.push(d.data() as T));
        if (list.length === 0 && defaultData.length > 0) {
          // Auto-seed cloud database with default values
          for (const item of defaultData) {
            const id = (item as any).id;
            if (id) {
              await setDoc(doc(db, collectionName, id), item);
            }
          }
          return defaultData;
        }
        return list;
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, collectionName, auth);
      }
    }
  }
  return getLS<T[]>(collectionToLSKey(collectionName), defaultData);
}

const doesCollectionAllowPublicWrites = (collectionName: string): boolean => {
  return ['contactMessages', 'members', 'manuscripts', 'packageInquiries'].includes(collectionName);
};

async function saveDocument<T>(collectionName: string, id: string, docData: T): Promise<void> {
  const isAuthAdmin = isUserFirebaseAdmin();
  const canPublicWrite = doesCollectionAllowPublicWrites(collectionName);
  const isSimulatedOnly = isSimulationMode && !isAuthAdmin;

  if (isFirebaseEnabled && db && !isSimulatedOnly && (isAuthAdmin || canPublicWrite)) {
    try {
      await setDoc(doc(db, collectionName, id), docData);
      return;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `${collectionName}/${id}`, auth);
    }
  }
  const lsKey = collectionToLSKey(collectionName);
  const list = getLS<any[]>(lsKey, []);
  const idx = list.findIndex(item => item.id === id);
  if (idx > -1) {
    list[idx] = docData;
  } else {
    list.unshift(docData);
  }
  setLS(lsKey, list);
}

async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const isAuthAdmin = isUserFirebaseAdmin();
  const isSimulatedOnly = isSimulationMode && !isAuthAdmin;

  if (isFirebaseEnabled && db && !isSimulatedOnly && isAuthAdmin) {
    try {
      await deleteDoc(doc(db, collectionName, id));
      return;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${collectionName}/${id}`, auth);
    }
  }
  const lsKey = collectionToLSKey(collectionName);
  let list = getLS<any[]>(lsKey, []);
  list = list.filter(item => item.id !== id);
  setLS(lsKey, list);
}

export const StorageService = {
  // Books API
  getBooks: async (): Promise<Book[]> => {
    return getCollection<Book>('books', DEFAULTS.DEFAULT_BOOKS);
  },
  saveBook: async (book: Book): Promise<void> => {
    return saveDocument<Book>('books', book.id, book);
  },
  deleteBook: async (id: string): Promise<void> => {
    return deleteDocument('books', id);
  },

  // Quotes API
  getQuotes: async (): Promise<Quote[]> => {
    return getCollection<Quote>('quotes', DEFAULTS.DEFAULT_QUOTES);
  },
  saveQuote: async (quote: Quote): Promise<void> => {
    return saveDocument<Quote>('quotes', quote.id, quote);
  },
  deleteQuote: async (id: string): Promise<void> => {
    return deleteDocument('quotes', id);
  },

  // Team API
  getTeamMembers: async (): Promise<TeamMember[]> => {
    return getCollection<TeamMember>('teamMembers', DEFAULTS.DEFAULT_TEAM);
  },
  saveTeamMember: async (member: TeamMember): Promise<void> => {
    return saveDocument<TeamMember>('teamMembers', member.id, member);
  },
  deleteTeamMember: async (id: string): Promise<void> => {
    return deleteDocument('teamMembers', id);
  },

  // Timeline API
  getTimelineEvents: async (): Promise<TimelineEvent[]> => {
    const list = await getCollection<TimelineEvent>('timelineEvents', DEFAULTS.DEFAULT_TIMELINE);
    return list.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  },
  saveTimelineEvent: async (event: TimelineEvent): Promise<void> => {
    return saveDocument<TimelineEvent>('timelineEvents', event.id, event);
  },
  deleteTimelineEvent: async (id: string): Promise<void> => {
    return deleteDocument('timelineEvents', id);
  },

  // Partners API
  getPartners: async (): Promise<PublishingPartner[]> => {
    return getCollection<PublishingPartner>('publishingPartners', DEFAULTS.DEFAULT_PARTNERS);
  },
  savePartner: async (partner: PublishingPartner): Promise<void> => {
    return saveDocument<PublishingPartner>('publishingPartners', partner.id, partner);
  },

  // Settings API
  getSettings: async (): Promise<AppSettings> => {
    const isAuthAdmin = isUserFirebaseAdmin();
    const isSimulatedOnly = isSimulationMode && !isAuthAdmin;

    if (isFirebaseEnabled && db && !isSimulatedOnly && isAuthAdmin) {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists()) {
          return docSnap.data() as AppSettings;
        }
        return DEFAULTS.DEFAULT_SETTINGS;
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, 'settings/global', auth);
      }
    }
    return getLS<AppSettings>(collectionToLSKey('settings'), DEFAULTS.DEFAULT_SETTINGS);
  },
  saveSettings: async (settings: AppSettings): Promise<void> => {
    const isAuthAdmin = isUserFirebaseAdmin();
    const isSimulatedOnly = isSimulationMode && !isAuthAdmin;

    if (isFirebaseEnabled && db && !isSimulatedOnly && isAuthAdmin) {
      try {
        await setDoc(doc(db, 'settings', 'global'), settings);
        return;
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, 'settings/global', auth);
      }
    }
    setLS(collectionToLSKey('settings'), settings);
  },

  // Contact Messages API
  getContactMessages: async (): Promise<ContactMessage[]> => {
    const list = await getCollection<ContactMessage>('contactMessages', []);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  submitContactMessage: async (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isResolved'>): Promise<void> => {
    const newId = 'msg-' + Math.random().toString(36).substring(2, 9);
    const newMsg: ContactMessage = {
      ...msg,
      id: newId,
      isResolved: false,
      createdAt: new Date().toISOString()
    };
    return saveDocument<ContactMessage>('contactMessages', newId, newMsg);
  },
  updateContactMessageStatus: async (id: string, isResolved: boolean): Promise<void> => {
    const isAuthAdmin = isUserFirebaseAdmin();
    const isSimulatedOnly = isSimulationMode && !isAuthAdmin;

    if (isFirebaseEnabled && db && !isSimulatedOnly) {
      try {
        await updateDoc(doc(db, 'contactMessages', id), { isResolved });
        return;
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `contactMessages/${id}`, auth);
      }
    }
    const lsKey = collectionToLSKey('contactMessages');
    const list = getLS<ContactMessage[]>(lsKey, []);
    const idx = list.findIndex(m => m.id === id);
    if (idx > -1) {
      lsKey && (list[idx].isResolved = isResolved);
      setLS(lsKey, list);
    }
  },
  deleteContactMessage: async (id: string): Promise<void> => {
    return deleteDocument('contactMessages', id);
  },

  // Members registration API
  getMembers: async (): Promise<Member[]> => {
    const list = await getCollection<Member>('members', []);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  registerMember: async (member: Omit<Member, 'id' | 'createdAt'>): Promise<number> => {
    const newId = 'mem-' + Math.random().toString(36).substring(2, 9);
    const newMember: Member = {
      ...member,
      id: newId,
      createdAt: new Date().toISOString()
    };
    await saveDocument<Member>('members', newId, newMember);
    const list = await StorageService.getMembers();
    return list.length;
  },
  deleteMember: async (id: string): Promise<void> => {
    return deleteDocument('members', id);
  },

  // Manuscripts API
  getManuscripts: async (): Promise<Manuscript[]> => {
    const list = await getCollection<Manuscript>('manuscripts', []);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  submitManuscript: async (manuscript: Omit<Manuscript, 'id' | 'createdAt' | 'status'>): Promise<void> => {
    const newId = 'man-' + Math.random().toString(36).substring(2, 9);
    const newManuscript: Manuscript = {
      ...manuscript,
      id: newId,
      status: 'received',
      createdAt: new Date().toISOString()
    };
    return saveDocument<Manuscript>('manuscripts', newId, newManuscript);
  },
  updateManuscriptStatus: async (id: string, status: Manuscript['status'], internalNotes?: string): Promise<void> => {
    const isAuthAdmin = isUserFirebaseAdmin();
    const isSimulatedOnly = isSimulationMode && !isAuthAdmin;

    if (isFirebaseEnabled && db && !isSimulatedOnly) {
      try {
        const updateData: any = { status };
        if (internalNotes !== undefined) {
          updateData.internalNotes = internalNotes;
        }
        await updateDoc(doc(db, 'manuscripts', id), updateData);
        return;
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `manuscripts/${id}`, auth);
      }
    }
    const lsKey = collectionToLSKey('manuscripts');
    const list = getLS<Manuscript[]>(lsKey, []);
    const idx = list.findIndex(m => m.id === id);
    if (idx > -1) {
      list[idx].status = status;
      if (internalNotes !== undefined) {
        list[idx].internalNotes = internalNotes;
      }
      setLS(lsKey, list);
    }
  },
  deleteManuscript: async (id: string): Promise<void> => {
    return deleteDocument('manuscripts', id);
  },

  // Publishing Packages API
  getPackages: async (): Promise<PublishingPackage[]> => {
    return getCollection<PublishingPackage>('publishingPackages', DEFAULTS.DEFAULT_PACKAGES);
  },
  savePackage: async (pkg: PublishingPackage): Promise<void> => {
    return saveDocument<PublishingPackage>('publishingPackages', pkg.id, pkg);
  },
  deletePackage: async (id: string): Promise<void> => {
    return deleteDocument('publishingPackages', id);
  },

  // Testimonials API
  getTestimonials: async (): Promise<Testimonial[]> => {
    return getCollection<Testimonial>('testimonials', DEFAULTS.DEFAULT_TESTIMONIALS);
  },
  saveTestimonial: async (test: Testimonial): Promise<void> => {
    return saveDocument<Testimonial>('testimonials', test.id, test);
  },
  deleteTestimonial: async (id: string): Promise<void> => {
    return deleteDocument('testimonials', id);
  },

  // Package inquiries API
  getPackageInquiries: async (): Promise<PackageInquiry[]> => {
    const list = await getCollection<PackageInquiry>('packageInquiries', []);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  submitPackageInquiry: async (inq: Omit<PackageInquiry, 'id' | 'createdAt' | 'status'>): Promise<void> => {
    const newId = 'inq-' + Math.random().toString(36).substring(2, 9);
    const newInq: PackageInquiry = {
      ...inq,
      id: newId,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    return saveDocument<PackageInquiry>('packageInquiries', newId, newInq);
  },
  updateInquiryStatus: async (id: string, status: PackageInquiry['status']): Promise<void> => {
    const isAuthAdmin = isUserFirebaseAdmin();
    const isSimulatedOnly = isSimulationMode && !isAuthAdmin;

    if (isFirebaseEnabled && db && !isSimulatedOnly) {
      try {
        await updateDoc(doc(db, 'packageInquiries', id), { status });
        return;
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `packageInquiries/${id}`, auth);
      }
    }
    const lsKey = collectionToLSKey('packageInquiries');
    const list = getLS<PackageInquiry[]>(lsKey, []);
    const idx = list.findIndex(i => i.id === id);
    if (idx > -1) {
      list[idx].status = status;
      setLS(lsKey, list);
    }
  },
  deleteInquiry: async (id: string): Promise<void> => {
    return deleteDocument('packageInquiries', id);
  },

  // Hero Slides API
  getHeroSlides: async (): Promise<any[]> => {
    return getCollection<any>('heroSlides', DEFAULTS.DEFAULT_HERO_SLIDES);
  },
  saveHeroSlide: async (slide: any): Promise<void> => {
    return saveDocument<any>('heroSlides', slide.id, slide);
  },
  deleteHeroSlide: async (id: string): Promise<void> => {
    return deleteDocument('heroSlides', id);
  },

  // Users management API
  getUsers: async (): Promise<UserProfile[]> => {
    return getCollection<UserProfile>('users', DEFAULTS.DEFAULT_USERS);
  },
  saveUser: async (user: UserProfile): Promise<void> => {
    return saveDocument<UserProfile>('users', user.id, user);
  },
  deleteUser: async (id: string): Promise<void> => {
    return deleteDocument('users', id);
  },

  // Gallery API
  getGalleryItems: async (): Promise<GalleryItem[]> => {
    return getCollection<GalleryItem>('gallery', DEFAULTS.DEFAULT_GALLERY);
  },
  saveGalleryItem: async (item: GalleryItem): Promise<void> => {
    return saveDocument<GalleryItem>('gallery', item.id, item);
  },
  deleteGalleryItem: async (id: string): Promise<void> => {
    return deleteDocument('gallery', id);
  }
};
