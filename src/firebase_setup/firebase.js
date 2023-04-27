import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_apiKey,
//   authDomain: process.env.REACT_APP_authDomain,
//   projectId: process.env.REACT_APP_projectId,
//   storageBucket: process.env.REACT_APP_storageBucket,
//   messagingSenderId: process.env.REACT_APP_messagingSenderId,
//   appId: process.env.REACT_APP_appId,
//   measurementId: process.env.REACT_APP_measurementId,
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyCiSkVMBpBUqBOwMNcK-7YiFVzDfOfEjcw",
//   authDomain: "kanfeydrorver2.firebaseapp.com",
//   projectId: "kanfeydrorver2",
//   storageBucket: "kanfeydrorver2.appspot.com",
//   messagingSenderId: "629828671050",
//   appId: "1:629828671050:web:ce1aa6c5b0ae27b1ce38b3",
// };

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

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
