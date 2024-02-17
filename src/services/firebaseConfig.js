import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMTcVM8eRk1KXx4GiZUq2Vf48T8ckcIb0",
  authDomain: "projeto-repertorio-react.firebaseapp.com",
  projectId: "projeto-repertorio-react",
  storageBucket: "projeto-repertorio-react.appspot.com",
  messagingSenderId: "934704140866",
  appId: "1:934704140866:web:53f42886280d8d37a413db"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);