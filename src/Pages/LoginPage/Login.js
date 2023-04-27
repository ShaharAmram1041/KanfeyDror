import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, provider } from "../../firebase_setup/firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css";
export default function Login({ setIsAuth }) {
  let nevigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      nevigate("/");
    });
  };
  return (
    <div className="LoginPage">
      <p>Sign In With Google to Continue</p>
      <button className="login-with-google-btn" onClick={signInWithGoogle}>
        Sign In With Google
      </button>
    </div>
  );
}
