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

// const firebaseConfig = {
//   apiKey: "AIzaSyA3Y6uVprARqAgC_75QpO1PWV34kNJauSU",
//   authDomain: "kanfeidrorform.firebaseapp.com",
//   projectId: "kanfeidrorform",
//   storageBucket: "kanfeidrorform.appspot.com",
//   messagingSenderId: "492548575426",
//   appId: "1:492548575426:web:f6d672ceb0ed56b179eb5b",
//   measurementId: "G-N88DTM13ZF",
// };

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5UMEc4oDzz1x5ek52YIw4mriYFD_cCwo",
  authDomain: "kanfeidror-e774f.firebaseapp.com",
  projectId: "kanfeidror-e774f",
  storageBucket: "kanfeidror-e774f.appspot.com",
  messagingSenderId: "877775188940",
  appId: "1:877775188940:web:3c3343932b990c5f67a369",
  measurementId: "G-9M8891EH3C"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export default app
