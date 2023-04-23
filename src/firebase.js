import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

//configuration object
const firebaseConfig = {
  apiKey: "AIzaSyA3Y6uVprARqAgC_75QpO1PWV34kNJauSU",
  authDomain: "kanfeidrorform.firebaseapp.com",
  projectId: "kanfeidrorform",
  storageBucket: "kanfeidrorform.appspot.com",
  messagingSenderId: "492548575426",
  appId: "1:492548575426:web:f6d672ceb0ed56b179eb5b",
  measurementId: "G-N88DTM13ZF",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { db, auth, storage, app };
