import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4j-o7aKr0D9ErWf3DsFLcdL8pNvj7Czs",
  authDomain: "studysync-55a19.firebaseapp.com",
  projectId: "studysync-55a19",
  storageBucket: "studysync-55a19.firebasestorage.app",
  messagingSenderId: "504609922127",
  appId: "1:504609922127:web:fab04fe864475560d09e3a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);