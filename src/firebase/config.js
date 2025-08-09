// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHZhUMbphZstYTWx2TaFwWOt58F2lAIRI",
  authDomain: "littleton-books-85957.firebaseapp.com",
  projectId: "littleton-books-85957",
  storageBucket: "littleton-books-85957.firebasestorage.app",
  messagingSenderId: "338220011770",
  appId: "1:338220011770:web:724b98080fcc7cdddd7943"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
