import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxGZbA-VI-XE-toLD2KJDPr-fmS0hIXfY",
  authDomain: "house-marketplace-app-9bc6a.firebaseapp.com",
  projectId: "house-marketplace-app-9bc6a",
  storageBucket: "house-marketplace-app-9bc6a.appspot.com",
  messagingSenderId: "7524241489",
  appId: "1:7524241489:web:ea93bb4faaea9589982870",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
