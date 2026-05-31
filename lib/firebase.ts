// src/lib/firebase.ts
// Configurações de inicialização do Firebase para o projeto Guia Local
import { initializeApp, getApps } from "firebase/app";


import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSrWMc4f3xXcAYTtouKpTC5WF7wgey6Uc",
  authDomain: "guia-local-3c2a0.firebaseapp.com",
  projectId: "guia-local-3c2a0",
  storageBucket: "guia-local-3c2a0.firebasestorage.app",
  messagingSenderId: "52734110726",
  appId: "1:52734110726:web:4b1f0a48e232914c5b6787"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();