import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNBQ7jm98KUN2P_Nb-jLHLz0i42SkVN3s",
  authDomain: "project-management-syste-8eed5.firebaseapp.com",
  databaseURL: "https://project-management-syste-8eed5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "project-management-syste-8eed5",
  storageBucket: "project-management-syste-8eed5.firebasestorage.app",
  messagingSenderId: "93060568407",
  appId: "1:93060568407:web:e50cdac32f22d0e98fda12"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);