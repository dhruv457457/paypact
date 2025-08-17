// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Make it idempotent + truly wait for a user
let readyPromise = null;

export function ensureFirebaseAuth() {
  if (readyPromise) return readyPromise;

  readyPromise = new Promise((resolve, reject) => {
    const stop = onAuthStateChanged(auth, async (user) => {
      if (user) {
        stop();
        resolve();
        return;
      }
      try {
        await signInAnonymously(auth);
        // Wait for the next auth state that contains a user
      } catch (e) {
        stop();
        reject(e);
      }
    });
  });

  return readyPromise;
}

/**
 * Saves a mapping of a user's wallet and email to their Firebase user ID.
 * This is crucial for looking up a wallet from an email address.
 * This function should be called right after a user successfully logs in
 * with their Web3Auth wallet.
 * @param user The Firebase User object from onAuthStateChanged.
 * @param wallet The user's Solana wallet address.
 */
export async function saveUserWalletMapping(user, wallet) {
  if (!user || !wallet) {
    console.error("User or wallet is missing, cannot save mapping.");
    return;
  }

  // Use the Firebase user UID as the document ID for the user profile.
  // This makes it easy to find a user's profile based on their auth status.
  const userProfileRef = doc(db, "user_profiles", user.uid);
  try {
    await setDoc(userProfileRef, {
      wallet: wallet,
      email: user.email || null, // Firebase anonymous users won't have an email
    }, {
      merge: true
    });
    console.log("User wallet mapping saved successfully.");
  } catch (error) {
    console.error("Error saving user wallet mapping:", error);
  }
}