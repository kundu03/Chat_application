import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCgcagUFWzsBtIl8yTiH5GVdhcoVdW9BmU",
  authDomain: "chat-application-db9db.firebaseapp.com",
  projectId: "chat-application-db9db",
  storageBucket: "chat-application-db9db.appspot.com",
  messagingSenderId: "214075336689",
  appId: "1:214075336689:web:00b0ab0fee9c02726e8650"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();