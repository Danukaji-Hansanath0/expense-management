import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  initializeAuth, 
  Auth, 
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { 
  getFirestore, 
  Firestore, 
  enableIndexedDbPersistence,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, { 
    persistence: getReactNativePersistence(AsyncStorage) 
  });
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Enable offline persistence for Firestore
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("Firestore persistence failed: Multiple tabs open");
    } else if (err.code === "unimplemented") {
      console.warn("Firestore persistence not supported on this browser");
    }
  });
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

// Auth functions
export const signIn = async (email: string, password: string): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const signUp = async (email: string, password: string): Promise<User> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Firestore helpers
export const createUserProfile = async (uid: string, data: {
  name: string;
  baseCurrency: string;
  theme: "system" | "light" | "dark";
  createdAt: Timestamp;
}): Promise<void> => {
  await setDoc(doc(db, "users", uid), data);
};

export const getUserProfile = async (uid: string): Promise<any | null> => {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserProfile = async (uid: string, data: Partial<{
  name: string;
  baseCurrency: string;
  theme: "system" | "light" | "dark";
}>): Promise<void> => {
  await updateDoc(doc(db, "users", uid), data);
};

// Collection references
export const getAccountsRef = (uid: string) => collection(db, "users", uid, "accounts");
export const getTransactionsRef = (uid: string) => collection(db, "users", uid, "transactions");
export const getBudgetsRef = (uid: string) => collection(db, "users", uid, "budgets");
export const getCategoriesRef = (uid: string) => collection(db, "users", uid, "categories");
export const getEmailConnectionsRef = (uid: string) => 
  collection(db, "users", uid, "emailConnections");

// Export initialized instances
export { app, auth, db, storage };
export { Timestamp, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit, getDocs };
