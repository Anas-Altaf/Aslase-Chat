'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  subscriptionStatus: string | null;
  subscriptionLoading: boolean;
  signUp: (email: string, password: string, displayName: string, phoneNumber?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  subscriptionStatus: null,
  subscriptionLoading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  resetPassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function verifyTokenWithBackend(token: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/verify-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) {
    throw new Error('Token verification failed');
  }
}

async function saveUserToMongoDB(
  uid: string,
  email: string,
  displayName: string,
  phoneNumber: string,
): Promise<void> {
  await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, email, displayName, phoneNumber }),
  });
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setSubscriptionStatus(null);
      setSubscriptionLoading(false);
      return;
    }
    setSubscriptionLoading(true);
    user.getIdToken().then((token) =>
      fetch(`${API_URL}/payments/subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => setSubscriptionStatus(data?.status ?? 'none'))
        .catch(() => setSubscriptionStatus('none'))
        .finally(() => setSubscriptionLoading(false)),
    );
  }, [user, loading]);

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    phoneNumber?: string,
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      displayName,
      email,
      phoneNumber: phoneNumber || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Sync to MongoDB — non-fatal; Firebase is the auth source of truth
    try {
      await saveUserToMongoDB(
        userCredential.user.uid,
        email,
        displayName,
        phoneNumber || '',
      );
    } catch {
      // Intentionally ignored: user exists in Firebase/Firestore
    }
  };

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    await verifyTokenWithBackend(token);
    // Upsert user in MongoDB — safe to ignore 409 (already exists)
    try {
      await saveUserToMongoDB(
        userCredential.user.uid,
        userCredential.user.email ?? email,
        userCredential.user.displayName ?? '',
        userCredential.user.phoneNumber ?? '',
      );
    } catch {
      // Non-fatal
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Upsert user in MongoDB — Google users may not have been synced yet
    try {
      await saveUserToMongoDB(
        result.user.uid,
        result.user.email ?? '',
        result.user.displayName ?? '',
        result.user.phoneNumber ?? '',
      );
    } catch {
      // Non-fatal
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) throw new Error('No user logged in');
    await updateProfile(auth.currentUser, data);
    setUser({ ...auth.currentUser });
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/sign-in`,
      handleCodeInApp: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, subscriptionStatus, subscriptionLoading, signUp, signIn, signInWithGoogle, logout, updateUserProfile, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
