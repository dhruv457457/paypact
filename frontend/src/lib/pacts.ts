import {
  collection,
  addDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  setDoc,
  getDocs,
  where,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { buildSolanaPayURL } from "./solanapay";
import { Keypair } from "@solana/web3.js";

interface Participant {
  email?: string;
  wallet?: string;
  reference?: string; // base58 PublicKey string
  paid?: boolean;
  paidTx?: string;
  paidAt?: number;
}

interface Pact {
  name: string;
  amountPerPerson: number; // display units (e.g., 0.5 SOL or 50 USDC)
  receiverWallet: string; // receiver public key
  dueDate: string; // ISO
  createdBy?: string;
  participants: Participant[];
  splToken?: string; // NEW: Add this optional field for SPL token support
}

/**
 * Create a new pact document in Firestore
 * Also writes quick-lookup docs pay_refs/{reference} -> { pactId, index }
 * so the webhook can resolve a participant fast.
 */
export async function createPact(pact: Pact): Promise<string> {
  const pactRef = doc(collection(db, "pacts"));
  const pactId = pactRef.id;

  // Resolve email participants to wallet addresses
  const participantsWithWallets = await Promise.all(
    pact.participants.map(async (p) => {
      if (p.email) {
        // Query user_profiles collection to find wallet address by email
        const userProfileRef = collection(db, "user_profiles");
        const q = query(userProfileRef, where("email", "==", p.email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const userProfile = snapshot.docs[0].data();
          return { ...p, wallet: userProfile.wallet };
        }
      }
      return p;
    })
  );

  // FIX: Instead of filtering, map over all participants and add the necessary fields.
  // This ensures that participants without a pre-existing wallet from the lookup
  // are still included in the pact.
  const participantsWithRefs = participantsWithWallets.map((p) => ({
    ...p,
    reference: Keypair.generate().publicKey.toBase58(),
    paid: false,
  }));

  // NEW: flat array for querying by wallet later
  const participantWallets = participantsWithRefs
    .map((p) => p.wallet?.trim())
    .filter(Boolean) as string[];

  await setDoc(pactRef, {
    ...pact,
    participants: participantsWithRefs,
    participantWallets, // This is the crucial array for lookup
    createdAt: serverTimestamp(),
  });

  // index references for webhook
  for (let i = 0; i < participantsWithRefs.length; i++) {
    const refId = participantsWithRefs[i].reference!;
    await setDoc(doc(db, "pay_refs", refId), { pactId, index: i });
  }

  return pactId;
}

/**
 * Listen to a pact document in real-time
 */
export function listenPact(
  pactId: string,
  callback: (data: any) => void
): () => void {
  const docRef = doc(db, "pacts", pactId);
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}

/**
 * Get a pact once
 */
export async function getPact(pactId: string): Promise<any> {
  const docRef = doc(db, "pacts", pactId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Update participant payment status
 */
export async function markParticipantPaid(
  pactId: string,
  participantIndex: number,
  txSig?: string
) {
  const pact = await getPact(pactId);
  if (!pact) return;

  pact.participants[participantIndex].paid = true;
  if (txSig) {
    pact.participants[participantIndex].paidTx = txSig;
    pact.participants[participantIndex].paidAt = Date.now();
  }

  const docRef = doc(db, "pacts", pactId);
  await updateDoc(docRef, { participants: pact.participants });
}

/**
 * Generate Solana Pay URLs for each participant
 */
export function generatePaymentLinks(
  pact: any
): { label: string; url: string }[] {
  return (pact.participants || []).map((p: Participant, idx: number) => {
    const url = buildSolanaPayURL({
      receiver: pact.receiverWallet,
      amount: pact.amountPerPerson,
      reference: p.reference!,
      splToken: pact.splToken, // This is the new change
      label: pact.name,
      message: `Pact payment for ${p.email || p.wallet || `P${idx + 1}`}`,
    });

    return {
      label: p.email || p.wallet || `Participant ${idx + 1}`,
      url,
    };
  });
}
export async function listPactsByCreator(creatorWallet: string) {
  const col = collection(db, "pacts");
  const q = query(
    col,
    where("createdBy", "==", creatorWallet),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

// Build a deep link page for a single participant
export function buildParticipantPageLink(pactId: string, index: number) {
  return `/pay/${pactId}/${index}`;
}

export async function listPactsForWallet(wallet: string) {
  const col = collection(db, "pacts");
  const q = query(
    col,
    where("participantWallets", "array-contains", wallet),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

// Utility to find this wallet's participant index inside a pact
export function findParticipantIndexByWallet(
  pact: any,
  wallet: string
): number {
  return (pact.participants || []).findIndex(
    (p: any) => (p.wallet || "").trim() === wallet.trim()
  );
}