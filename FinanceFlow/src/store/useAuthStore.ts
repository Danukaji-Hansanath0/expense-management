import { create } from "zustand";
import { User } from "firebase/auth";
import { subscribeToAuthChanges, signIn, signUp, signOut } from "../services/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,
  initialized: false,

  initialize: async () => {
    return new Promise((resolve) => {
      const unsubscribe = subscribeToAuthChanges((user) => {
        set({ user, loading: false, initialized: true, error: null });
        unsubscribe();
        resolve();
      });
    });
  },

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      await signIn(email, password);
      set({ loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || "Failed to sign in" 
      });
      throw error;
    }
  },

  register: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      await signUp(email, password);
      set({ loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || "Failed to create account" 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut();
      set({ user: null, error: null });
    } catch (error: any) {
      set({ error: error.message || "Failed to sign out" });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
