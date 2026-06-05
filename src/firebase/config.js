import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBg8-Rz71Am-5NlbmFSZwGfWMBwHZgcj0I",
  authDomain: "denttish-7839a.firebaseapp.com",
  projectId: "denttish-7839a",
  storageBucket: "denttish-7839a.firebasestorage.app",
  messagingSenderId: "874728417624",
  appId: "1:874728417624:web:9634035e45592ad126dd2d",
  measurementId: "G-2NDCQ0SYLC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage };
