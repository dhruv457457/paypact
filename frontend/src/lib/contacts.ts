import { doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { db, auth } from "./firebase";

// Get a user's contact book
export async function getContacts(): Promise<Record<string, { name: string; email: string; publicKey: string }>> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("User not authenticated.");
  }
  const docRef = doc(db, "contacts", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().contacts || {};
  }
  return {};
}

// Add or update a contact for a user
export async function addContact(name: string, email: string, publicKey: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("User not authenticated.");
  }
  const docRef = doc(db, "contacts", uid);
  await setDoc(docRef, {
    wallet: auth.currentUser?.email || auth.currentUser?.uid,
    contacts: {
      [name]: { name, email, publicKey },
    },
  }, { merge: true });
}

// Delete a contact for a user
export async function deleteContact(name: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("User not authenticated.");
  }
  const docRef = doc(db, "contacts", uid);
  await updateDoc(docRef, {
    [`contacts.${name}`]: deleteField()
  });
}