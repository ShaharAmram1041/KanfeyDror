import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6PAMZPYexEkLLtdOZ30mZ0xmq7QXAWvI",
  authDomain: "kdrordb.firebaseapp.com",
  projectId: "kdrordb",
  storageBucket: "kdrordb.appspot.com",
  messagingSenderId: "926844980089",
  appId: "1:926844980089:web:9a84d2aab1b457d9c87da8",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
