// src/lib/firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSrWMc4f3xXcAYTtouKpTC5WF7wgey6Uc",
  authDomain: "guia-local-3c2a0.firebaseapp.com",
  projectId: "guia-local-3c2a0",
  storageBucket: "guia-local-3c2a0.firebasestorage.app",
  messagingSenderId: "52734110726",
  appId: "1:52734110726:web:4b1f0a48e232914c5b6787"
};

// Inicializa o Firebase apenas se não houver um app já inicializado
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();