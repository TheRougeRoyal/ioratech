import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export { db };

export async function getDocById<T extends DocumentData>(collectionName: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as unknown as T) : null;
}

export async function getDocsByQuery<T extends DocumentData>(
  collectionName: string,
  constraints: ReturnType<typeof where>[] = [],
  orderByField?: string,
  limitCount?: number
): Promise<T[]> {
  let q = query(collection(db, collectionName), ...constraints);
  if (orderByField) {
    q = query(q, orderBy(orderByField, "desc"));
  }
  if (limitCount) {
    q = query(q, limit(limitCount));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as T));
}

export async function createDoc<T extends DocumentData>(collectionName: string, id: string, data: T) {
  await setDoc(doc(db, collectionName, id), {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
}

export async function updateDocById(collectionName: string, id: string, data: Partial<DocumentData>) {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updated_at: serverTimestamp(),
  });
}

export async function deleteDocById(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}
