// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-ce87b.firebaseapp.com",
  projectId: "real-estate-ce87b",
  storageBucket: "real-estate-ce87b.firebasestorage.app",
  messagingSenderId: "384221359469",
  appId: "1:384221359469:web:6b77d2d3831af01923be64"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
