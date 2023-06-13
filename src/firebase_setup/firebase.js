import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5UMEc4oDzz1x5ek52YIw4mriYFD_cCwo",
  authDomain: "kanfeidror-e774f.firebaseapp.com",
  databaseURL: "https://kanfeidror-e774f-default-rtdb.firebaseio.com",
  projectId: "kanfeidror-e774f",
  storageBucket: "kanfeidror-e774f.appspot.com",
  messagingSenderId: "877775188940",
  appId: "1:877775188940:web:3c3343932b990c5f67a369",
  measurementId: "G-9M8891EH3C",
};

const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);//realtime
export const db = getFirestore(app);
export const auth = getAuth(app);
