// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDULo_RtqNvUR0JcqysvyXXJLQAzOgf-0A",
  authDomain: "littleton-books.firebaseapp.com",
  projectId: "littleton-books",
  storageBucket: "littleton-books.firebasestorage.ap",
  messagingSenderId: "955332241960",
  appId: "1:955332241960:web:dcf4fc3e05fa1deff6e31d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
