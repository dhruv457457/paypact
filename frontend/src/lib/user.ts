import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebase"; // Imports your existing db and auth instances
import bcrypt from "bcryptjs";

/**
 * Checks if the current authenticated user has a Security PIN set.
 * @returns {Promise<boolean>} - True if a PIN hash exists, false otherwise.
 */
export const checkPinExists = async (): Promise<boolean> => {
  if (!auth.currentUser) throw new Error("User not authenticated.");
  
  // We'll store user-specific data, like the PIN, in a "users" collection.
  const userRef = doc(db, "users", auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  
  return userDoc.exists() && !!userDoc.data().pinHash;
};

/**
 * Sets or updates the Security PIN for the current user.
 * Hashes the PIN before storing it.
 * @param {string} pin - The 4-digit PIN to set.
 */
export const setPin = async (pin: string): Promise<void> => {
  if (!auth.currentUser) throw new Error("User not authenticated.");
  if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
    throw new Error("PIN must be 4 digits.");
  }

  // Hash the PIN client-side so plain text never touches the database.
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pin, salt);

  const userRef = doc(db, "users", auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  
  if (userDoc.exists()) {
    await updateDoc(userRef, { pinHash: hash });
  } else {
    await setDoc(userRef, { 
      uid: auth.currentUser.uid,
      pinHash: hash,
      createdAt: new Date(),
    });
  }
};

/**
 * Verifies the entered PIN against the stored hash for the current user.
 * @param {string} pin - The 4-digit PIN to verify.
 * @returns {Promise<boolean>} - True if the PIN is correct, false otherwise.
 */
export const verifyPin = async (pin: string): Promise<boolean> => {
  if (!auth.currentUser) throw new Error("User not authenticated.");

  const userRef = doc(db, "users", auth.currentUser.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists() || !userDoc.data().pinHash) {
    // This case should ideally not be hit if we check for PIN existence first.
    throw new Error("No PIN has been set for this account.");
  }

  const storedHash = userDoc.data().pinHash;
  return await bcrypt.compare(pin, storedHash);
};