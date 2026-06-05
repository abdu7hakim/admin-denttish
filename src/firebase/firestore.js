import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./config";

const COLLECTIONS = {
  doctors: "doctors",
  appointments: "appointments",
  users: "users",
  clinics: "clinics",
  categories: "categories",
  notifications: "notifications",
  settings: "settings"
};

export const addDocument = async (collectionName, data) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const getDocument = async (collectionName, id) => {
  const docSnap = await getDoc(doc(db, collectionName, id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const getDocuments = async (collectionName, filters = []) => {
  let q = collection(db, collectionName);
  if (filters.length > 0) {
    filters.forEach(f => {
      q = query(q, where(f.field, f.operator, f.value));
    });
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateDocument = async (collectionName, id, data) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteDocument = async (collectionName, id) => {
  await deleteDoc(doc(db, collectionName, id));
};

export { COLLECTIONS };
