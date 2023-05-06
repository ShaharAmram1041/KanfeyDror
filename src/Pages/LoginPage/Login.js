import "./Login.css";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../firebase_setup/firebase.js";
import { useState } from 'react';



function Login() {
  const auth = getAuth(app);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  // new account
  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => { 
      const user = userCredential.user;
      console.log(user);
      alert("created account successfully");
    })
    .catch((error) => {
      const errorCode = error.code;
      alert(errorCode)
    })
  }
  // existing account  
  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    const user = userCredential.user;
    console.log(user)
    alert("signed in successfully")
  })
  .catch((error) => {
    const errorCode = error.code;
    alert(errorCode)
  });

  }

  return (
    <div className="LoginPage">
       <input type={"email"} placeholder = "Enter Email" onChange={(e) => setEmail(e.target.value)} />
       <input type={"password"} placeholder = "Enter Password" onChange={(e) => setPassword(e.target.value)}/>

       <button onClick={signUp}> Create Account</button>
       <button onClick={signIn}> Sign in</button>
    </div>
    
    
  );
}
 
export default Login



// import { signInWithPopup } from "firebase/auth";
//  import React from "react";
// import { auth, provider } from "../../firebase_setup/firebase";
// import { useNavigate } from "react-router-dom";
// import "./Login.css";

// export default function Login({ setIsAuth }) {
//   let nevigate = useNavigate();

//   const signInWithGoogle = () => {
//     signInWithPopup(auth, provider).then((result) => {
//       localStorage.setItem("isAuth", true);
//       setIsAuth(true);
//       nevigate("/");
//     });
//   };
//   return (
//     <div className="LoginPage">
//       <p>Sign In With Google to Continue</p>
//       <button className="login-with-google-btn" onClick={signInWithGoogle}>
//         Sign In With Google
//       </button>
//     </div>
//   );
// }


